import React from 'react';

const UpdateGuideModal = ({ isOpen, onClose, apiExamples }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content update-guide-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>アップデートのお知らせと使い方</h2>
                    <button className="btn btn-close" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    <h3>📃概要</h3>
                    <p>
                        外部の書誌データ（CiNii / 国立国会図書館）から取得したデータを元に、
                        タイトルや著者、雑誌情報、DOI、NDLリンク等を自動で入力できるようになりました。
                    </p>

                    <h3>🎯主なポイント</h3>
                    <ul>
                        <li><strong>国立国会図書館との連携</strong>により、ISBNからの自動入力が可能になりました。</li>
                        <li><strong>CiNiiとの連携</strong>により、論文情報の自動入力が可能になりました。</li>
                        <li><strong>NDL リンクを優先</strong>して「リンク」フィールドにセットします。NDL のレコードが無ければ該当レコードのURLを使用します。</li>
                        <li><strong>DOI は別フィールド</strong>で保持され、モーダル上で DOI へのリンク（doi.org）を表示します。</li>
                        <li><strong>著者の分割</strong>は姓・名・読みを編集可能で、日本語名に対しては前から N 文字で分割する補助入力があります。ある程度は自動で認識されますが、日本人の姓名は難解なため、手動での調整が必要になる場合があります。</li>
                    </ul>
                    <h3>⚠️注意事項</h3>
                    <ul>
                        <li>
                            <strong>団体出版本</strong>などの特殊な書誌データには<span style={{ color: 'red', fontWeight: 'bold' , textDecoration: 'underline' }}>現在未対応</span>です（今後対応予定）。
                        </li>
                    </ul>

                    <h3>💡使い方のヒント</h3>
                    <ol>
                        <li>キーワード(論文)または ISBN(書籍) を入力して検索します。</li>
                        <li>検索結果から該当レコードを選択すると、詳細を取得してモーダルが開きます。</li>
                        <li>モーダル内で著者を選択・分割・編集し、必要に応じてフィールドを調整して「フォームに反映」してください。</li>
                    </ol>

                    <hr />

                    <h3>トラブルシューティング</h3>
                    <ul>
                        <li>そんなもんあるわけない。</li>
                    </ul>

                    <h3>備考</h3>
                    <p>外部 API の応答は形が多様なため、特殊なケースがあればデータを教えていただければ抽出ルールを強化します。</p>

                </div>

                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>閉じる</button>
                </div>
            </div>
        </div>
    );
};

export default UpdateGuideModal;
