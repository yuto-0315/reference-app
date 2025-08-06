import React from 'react';

const FormatGuideModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const citationExamples = {
    basic: {
      title: '基本的な書式',
      format: '（著者の姓 発行年: 引用ページ数）',
      example: '(高橋　1996: 129)'
    },
    multiPage: {
      title: '複数ページの引用',
      format: '（著者の姓 発行年: 開始ページ-終了ページ）',
      example: '(伊藤　2002: 121-122)'
    },
    multipleAuthors: {
      title: '複数著者の場合',
      format: '3名以下：（著者1・著者2 発行年：ページ）、4名以上：（著者1ほか 発行年：ページ）',
      example: '(田中・佐藤　2020: 45) または (山田ほか　2021: 123)'
    },
    sameName: {
      title: '同姓の著者がいる場合',
      format: '（著者の姓名 発行年: 引用ページ数）',
      example: '(高橋美都　1996: 129)'
    },
    sameYear: {
      title: '同一著者・同年の複数文献',
      format: '（著者の姓 発行年a/b/c: 引用ページ数）',
      example: '(佐藤　2006b: 56)'
    },
    translation: {
      title: '翻訳書',
      format: '（原著者の片仮名姓 翻訳書の出版年(原書の出版年): 翻訳書の引用頁）',
      example: '(グラウト　1969(1960): 14)'
    },
    foreign: {
      title: '洋書の原文引用',
      format: '（著者名の原綴り 発行年: 引用ページ数）',
      example: '(Reimer　1978: 31)'
    }
  };

  const referenceExamples = {
    japaneseBook: {
      title: '日本語の単行本',
      format: '著者姓名『書名』発行所、出版年。',
      example: '橋本毅彦『「ものづくり」の科学史: 世界を変えた《標準革命》』講談社学術文庫、2013年。'
    },
    japaneseJournal: {
      title: '日本語の雑誌論文',
      format: '執筆者「論文名」[編集団体編]『雑誌名』巻(号)、出版年、掲載頁。',
      example: '今川恭子「音楽的発達をめぐる実験的研究と観察的研究の意義と課題」『音楽教育学』第27-3号、1997年、1〜14頁。'
    },
    japaneseChapter: {
      title: '日本語の単行本所収論文',
      format: '執筆者「論文名」、編者『書名』出版社、出版年、掲載頁。',
      example: '石井明「人民中国の光と影」、尾形勇・岸本美緒編『中国史』世界の歴史3、山川出版社、1998年、420〜479頁。'
    },
    organization: {
      title: '団体が出版している本',
      format: '執筆団体『書籍名』、出版年。',
      example: '文部科学省『小学校学習指導要領音楽解説編』、2017年。'
    },
    foreignBook: {
      title: '洋書の単行本',
      format: 'Familyname, Firstname. *Title*. Place: Publisher, Year.',
      example: 'Grout, Donald J. *A History of Western Music*. New York: W. W. Norton & Company, 1960.'
    },
    translation: {
      title: '翻訳書',
      format: '原著者の姓名、訳者名訳『書名』発行所、翻訳書の出版年。(原書の書誌情報)',
      example: 'グラウト、ドナルドJ.、服部幸三・戸口幸策訳『西洋音楽史(上)』、音楽之友社、1969年。(Grout, Donald J. *A History of Western Music*. New York: W. W. Norton & Company, 1960.)'
    },
    dictionary: {
      title: '辞事典の項目',
      format: '項目の執筆者名「項目名」『辞事典名』巻号、発行社、出版年、頁。',
      example: '渡辺護「オペラ」『音楽大事典』第1巻、平凡社、1981年、315~340頁。'
    },
    website: {
      title: 'インターネット上の資料',
      format: '著者もしくは団体名「ページの名称」URL (閲覧年月日)',
      example: '文部科学省webサイト 「学習指導要領『生きる力』」 https://www.mext.go.jp/a_menu/shotou/new-cs/index.htm (2020年2月11日閲覧)'
    },
    audiovisual: {
      title: '視聴覚資料',
      format: '作曲者、曲名、演奏者、レーベル名、資料種別、番号、録音年、発売年',
      example: '武満徹作曲《ノヴェンバー・ステップス》小澤征爾指揮、サイトウ・キネン・オーケストラ演奏、フイリップス: PHCP-160(CD)、トラック1、1989年録音・1991年発売。'
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content format-guide-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📖 引用・参考文献の書き方ガイド</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="guide-intro">
            <p>学術論文における正しい引用形式と参考文献の記載方法をご紹介します。</p>
          </div>

          <section className="citation-section">
            <h3>📝 1. 本文中の引用（割注）</h3>
            <div className="format-examples">
              {Object.entries(citationExamples).map(([key, item]) => (
                <div key={key} className="format-item">
                  <h4 className="format-title">{item.title}</h4>
                  <div className="format-pattern">
                    <strong>形式：</strong> {item.format}
                  </div>
                  <div className="format-example">
                    <strong>例：</strong> {item.example}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="citation-notes">
              <h4>📌 引用時のルール</h4>
              <ul>
                <li>著者の姓と発行年の間には全角スペースを入れる</li>
                <li>発行年と引用ページ数の間はコロン「:」を使用</li>
                <li>本文中の引用では範囲をハイフン「-」で表記</li>
                <li>数字表記：1桁は全角（１、２、３）、2桁以上は半角（12、123）</li>
              </ul>
            </div>
          </section>

          <section className="reference-section">
            <h3>📚 2. 参考文献一覧</h3>
            <div className="format-examples">
              {Object.entries(referenceExamples).map(([key, item]) => (
                <div key={key} className="format-item">
                  <h4 className="format-title">{item.title}</h4>
                  <div className="format-pattern">
                    <strong>形式：</strong> {item.format}
                  </div>
                  <div className="format-example">
                    <strong>例：</strong> {item.example}
                  </div>
                </div>
              ))}
            </div>

            <div className="reference-notes">
              <h4>📌 参考文献一覧のルール</h4>
              <ul>
                <li>著者の姓のアルファベット順または五十音順で配列</li>
                <li>2行目以降は1マス字下げ（インデント）</li>
                <li>複数著者：3名以下は全員記載、4名以上は筆頭著者＋「ほか」</li>
                <li>参考文献一覧ではページ範囲を波線「~」で表記</li>
                <li>著者名は「姓、名」の順で記載</li>
              </ul>
            </div>
          </section>
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
