// 外部API（国立国会図書館サーチ・CiNii）とのやり取りで起きたことを原因ごとに分け、
// 利用者に「何が起きたか」と「次に何をすればよいか」を伝えるための部品

export const API_SERVICES = {
  ndl: '国立国会図書館サーチ',
  cinii: 'CiNii Research',
  ndla: '国立国会図書館の典拠データ（Web NDL Authorities）'
};

export class ApiError extends Error {
  // kind: 'rate-limited' | 'server' | 'forbidden' | 'rejected' | 'timeout' | 'offline' | 'network' | 'invalid-response'
  constructor(kind, { service, status = null, retryAfterSeconds = null } = {}) {
    super(`${service}: ${kind}${status ? ` (${status})` : ''}`);
    this.name = 'ApiError';
    this.kind = kind;
    this.service = service;
    this.status = status;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

// NDL・CiNii とも、普段は数秒で返る。これ以上待っても返らないときは、待たせ続けずに知らせる
const REQUEST_TIMEOUT_MS = 15000;
// アクセス集中（429）で待ち時間の指定がないときに、こちらから送るのを控える長さ。
// 制限中に送り続けると制限が長引くため、短すぎない時間にする
const DEFAULT_RATE_LIMIT_WAIT_SECONDS = 60;

const rateLimitedUntil = {};

const parseRetryAfterSeconds = (response) => {
  const value = response.headers.get('Retry-After');
  if (!value) return null;
  const seconds = Number(value);
  if (Number.isFinite(seconds)) return Math.max(1, Math.ceil(seconds));
  const date = Date.parse(value);
  return Number.isNaN(date) ? null : Math.max(1, Math.ceil((date - Date.now()) / 1000));
};

const classifyStatus = (status) => {
  if (status === 429) return 'rate-limited';
  if (status >= 500) return 'server';
  if (status === 403) return 'forbidden';
  return 'rejected';
};

/**
 * 外部APIに問い合わせ、うまくいかなかったときは原因の分かる ApiError を投げる。
 * acceptStatuses に含まれる状態（「見つからない」を表す 404 など）は、そのまま応答を返す
 */
export const fetchFromApi = async (url, service, { acceptStatuses = [] } = {}) => {
  const waitSeconds = Math.ceil(((rateLimitedUntil[service] || 0) - Date.now()) / 1000);
  if (waitSeconds > 0) throw new ApiError('rate-limited', { service, status: 429, retryAfterSeconds: waitSeconds });
  if (typeof navigator !== 'undefined' && navigator.onLine === false) throw new ApiError('offline', { service });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let response;
  try {
    response = await fetch(url, { signal: controller.signal });
  } catch (error) {
    if (error.name === 'AbortError') throw new ApiError('timeout', { service });
    // サーバーが拒否の応答にブラウザ向けの許可（CORS）を付けていないと、状態コードが読めず通信エラーとして届く
    throw new ApiError(navigator.onLine === false ? 'offline' : 'network', { service });
  } finally {
    clearTimeout(timer);
  }

  if (response.ok || acceptStatuses.includes(response.status)) return response;

  const kind = classifyStatus(response.status);
  if (kind === 'rate-limited') {
    const retryAfterSeconds = parseRetryAfterSeconds(response) || DEFAULT_RATE_LIMIT_WAIT_SECONDS;
    rateLimitedUntil[service] = Date.now() + retryAfterSeconds * 1000;
    throw new ApiError(kind, { service, status: response.status, retryAfterSeconds });
  }
  throw new ApiError(kind, { service, status: response.status });
};

// 応答を読み取れなかった（想定外の形式だった）ことを表す
export const invalidResponseError = (service) => new ApiError('invalid-response', { service });

// 検索結果の一部だけで先に進むときなど、本文の途中に添える短い理由
export const describeApiErrorReason = (error) => {
  const name = API_SERVICES[error?.service] || '外部のサービス';
  switch (error?.kind) {
    case 'rate-limited': return `${name}へのアクセスが集中しています`;
    case 'server': return `${name}が一時的に応答できない状態です`;
    case 'forbidden': return `${name}へのアクセスが拒否されました`;
    case 'rejected': return `${name}が受け付けませんでした（エラー番号 ${error.status}）`;
    case 'timeout': return `${name}から応答がありませんでした`;
    case 'offline': return 'インターネットに接続されていないようです';
    case 'network': return `${name}に接続できませんでした`;
    case 'invalid-response': return `${name}の応答を読み取れませんでした`;
    default: return '取得中に問題が起きました';
  }
};

const describeWait = (seconds) => (seconds >= 60 ? `${Math.ceil(seconds / 60)}分` : `${seconds}秒`);

// 画面に出す文。どの場合も「何が起きたか」のあとに「次にすること」を書く
export const describeApiError = (error) => {
  const name = API_SERVICES[error?.service] || '外部のサービス';
  const manualHint = 'それまでの間は、下の各項目を直接入力することもできます。';
  switch (error?.kind) {
    case 'rate-limited':
      return `${name}へのアクセスが集中しているため、一時的に検索できません。${describeWait(error.retryAfterSeconds || DEFAULT_RATE_LIMIT_WAIT_SECONDS)}ほど待ってから、もう一度お試しください。${manualHint}`;
    case 'server':
      return `${name}が一時的に応答できない状態です（メンテナンス中や障害の可能性があります）。しばらく時間をおいてから、もう一度お試しください。${manualHint}`;
    case 'forbidden':
      return `${name}へのアクセスが拒否されました。時間をおいても続く場合は、学校や職場などのネットワークで制限されている可能性があります。`;
    case 'rejected':
      return `${name}が検索を受け付けませんでした（エラー番号 ${error.status}）。入力した内容を確かめて、もう一度お試しください。`;
    case 'timeout':
      return `${name}から${REQUEST_TIMEOUT_MS / 1000}秒以上応答がありませんでした。通信状況を確かめて、もう一度お試しください。`;
    case 'offline':
      return 'インターネットに接続されていないようです。接続を確かめてから、もう一度お試しください。';
    case 'network':
      return `${name}に接続できませんでした。通信状況を確かめるか、アクセスが集中している可能性もあるため、少し時間をおいてからお試しください。`;
    case 'invalid-response':
      return `${name}から想定していない形式の応答が返ってきたため、読み取れませんでした。時間をおいてもう一度お試しください。続く場合は、下の各項目を直接入力してください。`;
    default:
      return '情報を取得できませんでした。通信状況を確かめて、もう一度お試しください。';
  }
};
