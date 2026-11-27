// 読み込んだJSONなどに「javascript:」のようなURLが入っていても、リンクとして実行されないようにする。
// http と https のURLだけをリンクにし、それ以外は null を返す（リンクにしない）
export const toSafeHref = (value) => {
  if (!value) return null;
  try {
    const url = new URL(String(value).trim());
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null;
  } catch (error) {
    return null;
  }
};

// DOI（「10.」で始まる識別子）を doi.org のリンクにする。「https://doi.org/10...」の形で入っていても受け付ける
export const toDoiHref = (doi) => {
  const identifier = String(doi || '').trim().replace(/^https?:\/\/(dx\.)?doi\.org\//i, '');
  return /^10\.\S+$/.test(identifier) ? `https://doi.org/${encodeURI(identifier)}` : null;
};
