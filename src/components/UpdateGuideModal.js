import React from 'react';
import { CHANGELOG, CHANGE_TYPE_LABELS } from '../utils/changelog';
import useDialog from '../hooks/useDialog';
import { X } from 'lucide-react';

const UpdateGuideModal = ({ isOpen, onClose }) => {
    const dialogRef = useDialog(isOpen, onClose);

    if (!isOpen) return null;

    // バージョンが上がると自動で開くため、まず最新版で何が変わったかを示す
    const latestRelease = CHANGELOG[0];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div ref={dialogRef} className="modal-content update-guide-modal" role="dialog" aria-modal="true" aria-labelledby="update-guide-title" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 id="update-guide-title">アップデートのお知らせと使い方</h2>
                    <button type="button" className="modal-close" onClick={onClose} aria-label="閉じる"><X size={20} /></button>
                </div>

                <div className="modal-body">
                    <h3>v{latestRelease.version} の変更点</h3>
                    <ul className="changelog-changes">
                        {latestRelease.changes.map((change, index) => (
                            <li key={index}>{CHANGE_TYPE_LABELS[change.type]}：{change.description}</li>
                        ))}
                    </ul>

                    {/* 更新のたびに毎回読む内容ではないため、変更点だけを先に見せ、使い方は開いたときだけ出す */}
                    <details className="update-guide-more">
                        <summary>ISBN・論文検索（外部データ連携）の使い方</summary>
                        <h3>外部データ連携について</h3>
                        <p>
                            外部の書誌データ（CiNii / 国立国会図書館）から取得したデータを元に、
                            タイトルや著者、雑誌情報、DOI、NDLリンク等を自動で入力できるようになりました。
                        </p>

                        <h3>主なポイント</h3>
                        <ul>
                            <li><strong>国立国会図書館との連携</strong>により、ISBNからの自動入力が可能になりました。</li>
                            <li><strong>CiNiiとの連携</strong>により、論文情報の自動入力が可能になりました。</li>
                            <li><strong>NDL リンクを優先</strong>して「リンク」フィールドにセットします。NDL のレコードが無ければ該当レコードのURLを使用します。</li>
                            <li><strong>DOI は別フィールド</strong>で保持され、モーダル上で DOI へのリンク（doi.org）を表示します。</li>
                            <li><strong>著者の分割</strong>は姓・名・読みを編集可能で、日本語名に対しては前から N 文字で分割する補助入力があります。ある程度は自動で認識されますが、日本人の姓名は難解なため、手動での調整が必要になる場合があります。</li>
                        </ul>
                        <h3>注意事項</h3>
                        <ul>
                            <li>
                                <strong>団体出版本</strong>でISBNから取り込むと、著者（「文部科学省 編」の文部科学省など）を執筆団体に入れます。著者がない本は出版社を入れるので、違う場合は直してください。
                            </li>
                        </ul>

                        <h3>使い方のヒント</h3>
                        <ol>
                            <li>キーワード(論文)または ISBN(書籍) を入力して検索します。</li>
                            <li>検索結果から該当レコードを選択すると、詳細を取得してモーダルが開きます。</li>
                            <li>モーダル内で著者を選択・分割・編集し、必要に応じてフィールドを調整して「フォームに反映」してください。</li>
                        </ol>

                        <hr />

                        <h3>うまくいかないとき</h3>
                        <ul>
                            <li>「アクセスが集中しています」と出たら、表示された時間だけ待ってからもう一度お試しください。その間も各項目は直接入力できます。</li>
                            <li>本が見つからないときは、ISBNの数字（10桁または13桁）を確かめてください。古い本や非売品は登録されていないことがあります。</li>
                            <li>著者の姓と名の分かれ目がずれたときは、確認画面の「前から○文字を姓に分ける」で直せます。</li>
                        </ul>

                        <h3>備考</h3>
                        <p>外部 API の応答は形が多様なため、特殊なケースがあればデータを教えていただければ抽出ルールを強化します。</p>
                    </details>

                </div>

                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>閉じる</button>
                </div>
            </div>
        </div>
    );
};

export default UpdateGuideModal;
