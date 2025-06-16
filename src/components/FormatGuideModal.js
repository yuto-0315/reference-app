import React from 'react';

const FormatGuideModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const examples = {
    book: {
      title: '図書',
      format: '著者名（発行年）『書名』出版社名.',
      example: '田中太郎（2023）『学術論文の書き方』学術出版社.'
    },
    journal: {
      title: '学術雑誌論文',
      format: '著者名（発行年）「論文タイトル」『雑誌名』巻号, pp.ページ数.',
      example: '佐藤花子（2023）「研究方法論の新展開」『学術研究』12(3), pp.45-60.'
    },
    website: {
      title: 'ウェブサイト',
      format: '著者名（発行年）「ページタイトル」サイト名, URL（アクセス日）.',
      example: '山田次郎（2023）「オンライン研究の動向」研究情報サイト, https://example.com/research（2023年6月17日アクセス）.'
    },
    thesis: {
      title: '学位論文',
      format: '著者名（発行年）『論文タイトル』学位種別論文, 大学名.',
      example: '鈴木一郎（2022）『現代社会における情報技術の影響』博士論文, 東京大学.'
    },
    report: {
      title: '報告書',
      format: '機関名（発行年）『報告書タイトル』.',
      example: '文部科学省（2023）『教育統計調査報告』.'
    },
    conference: {
      title: '学会発表',
      format: '著者名（発行年）「発表タイトル」学会名, 開催地.',
      example: '高橋三郎（2023）「AI技術の教育応用」情報処理学会全国大会, 東京.'
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content format-guide-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📖 参考文献の書き方ガイド</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="guide-intro">
            <p>各文献種別の正しい記載形式と例文をご紹介します。</p>
          </div>

          <div className="format-examples">
            {Object.entries(examples).map(([key, item]) => (
              <div key={key} className="format-item">
                <h3 className="format-title">{item.title}</h3>
                <div className="format-pattern">
                  <strong>形式：</strong> {item.format}
                </div>
                <div className="format-example">
                  <strong>例：</strong> {item.example}
                </div>
              </div>
            ))}
          </div>

          <div className="guide-notes">
            <h3>📝 注意事項</h3>
            <ul>
              <li>著者名は姓のみを記載し、複数著者の場合は「・」で区切ります</li>
              <li>発行年は西暦で記載します</li>
              <li>書名・雑誌名は『』、論文タイトル・ページタイトルは「」で囲みます</li>
              <li>ウェブサイトの場合は、アクセス日を必ず記載してください</li>
              <li>DOIやURLがある場合は、追加情報として記載することを推奨します</li>
            </ul>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormatGuideModal;
