// アプリケーションの変更履歴
export const CHANGELOG = [
  {
    version: '2.4.0',
    date: '2026-10-14',
    changes: [
      {
        type: 'improvement',
        description: 'テーマ選択を、系統ごとに並んだ配色のカードから、使われる色（背景・ヘッダー・ボタン・見出し）を見比べながら選べる画面に変更'
      },
      {
        type: 'improvement',
        description: '画面の絵文字を、見た目のそろったアイコンに変更'
      },
      {
        type: 'improvement',
        description: 'デザインを整理：ヘッダーを単色にし、色付きのボタンを「追加・検索などの主な操作」と「コピー」だけにして、ほかは白地に枠線のボタンに変更（飾りの影・動き・下線も控えめに）'
      }
    ]
  },
  {
    version: '2.3.0',
    date: '2026-10-14',
    changes: [
      {
        type: 'feature',
        description: '色彩101®「4色の配色パターン」をもとにした117種類の配色テーマを追加し、「テーマの系統」（赤・ピンク系、緑系など）を選んでから、その中の配色を選べるように変更（どの配色も文字やボタンが読みやすい色の組み合わせ（WCAG AA）に調整しています）'
      },
      {
        type: 'fix',
        description: 'スマートフォンなど狭い画面で、バージョン表示の「変更履歴」などが文字の途中で改行される問題を修正'
      }
    ]
  },
  {
    version: '2.2.0',
    date: '2026-10-14',
    changes: [
      {
        type: 'improvement',
        description: 'テーマを8種類（パープル・ピンク・オレンジ・イエロー・グリーン・ブルー・ブラウン・ダーク）に整理し、Tailwind CSS のカラーパレットをもとに、すべての文字やボタンが読みやすい色の組み合わせ（WCAG AA）に変更（以前のテーマを選んでいた場合は近い色のテーマに切り替わります）'
      },
      {
        type: 'improvement',
        description: '追加・更新などのお知らせを画面上部に固定して表示し、エラーは閉じるまで表示し続けるように変更'
      },
      {
        type: 'improvement',
        description: '一覧の操作ボタンに「引用」「文献」「編集」「削除」の文字を追加し、使い方のヒントを折りたためるように変更'
      },
      {
        type: 'improvement',
        description: 'ISBN・論文の検索に失敗したときは、検索欄のすぐ下に理由と次にすることを表示するように変更'
      },
      {
        type: 'improvement',
        description: 'バーコードスキャンで書籍のISBNを読み取ったら、そのまま検索するように変更'
      },
      {
        type: 'improvement',
        description: 'キーボードだけでも、JSONインポート・入力ガイド・変更履歴・論文の検索結果を操作できるようにし、Escキーで各画面を閉じられるように変更'
      },
      {
        type: 'fix',
        description: '2つのタブで開いていると、片方で追加・編集した内容がもう片方の保存で消える問題を修正'
      },
      {
        type: 'fix',
        description: '書誌情報を「フォームに反映」すると、取得できなかった項目で入力済みの著者や巻号が消え、著者なしでも保存できてしまう問題を修正'
      },
      {
        type: 'fix',
        description: '編集中に文献の種類を変えると、前の種類の著者・ページなどがデータに残り、引用に混ざる問題を修正'
      },
      {
        type: 'fix',
        description: 'バーコードスキャンで「スキャンエラー」が出続ける問題、書籍の下段のバーコード（価格コード）を読み取ってしまう問題、種類を変えてもカメラが止まらない問題を修正'
      },
      {
        type: 'fix',
        description: '2025年6月以前に保存した翻訳書の訳者名が表示されない問題を修正'
      },
      {
        type: 'fix',
        description: 'IDのないJSONファイルをインポートできない問題を修正し、取り込まなかった件数をまとめて表示するように変更'
      },
      {
        type: 'fix',
        description: '全角で入力したページ・巻号の数字を半角にそろえてから書式を当てるように修正'
      },
      {
        type: 'fix',
        description: '長いURLや狭い画面でページが横にはみ出す問題、エクスポートしたファイル名の日付が午前0〜9時に前日になる問題を修正'
      },
      {
        type: 'fix',
        description: '選んでいた文献を削除すると引用欄に空の引用が残る問題、「種類で一括選択」を矢印キーで操作すると最初の種類しか選べない問題、空白だけの入力を必須項目の入力済みとして扱う問題を修正'
      }
    ]
  },
  {
    version: '2.1.0',
    date: '2026-10-01',
    changes: [
      {
        type: 'fix',
        description: '最後の1件を削除しても、再読み込みすると復活する問題を修正'
      },
      {
        type: 'fix',
        description: '編集をキャンセルしたフォームから、似た文献を複製して追加できない問題を修正'
      },
      {
        type: 'fix',
        description: '同じJSONファイルを再インポートすると文献が重複する問題を修正し、重複で追加できなかったときも入力内容が消えないように変更'
      },
      {
        type: 'fix',
        description: 'Webサイトの割注で、アルファベットが付かない場合に末尾へ空白が残る問題を修正'
      },
      {
        type: 'fix',
        description: '楽譜・視聴覚資料の割注で著者名と年が表示されない問題を修正（作曲者名・発売年を使用）'
      },
      {
        type: 'fix',
        description: 'CiNiiの論文詳細が取得できない問題、NDLの著者名に生没年が混ざる・同じ著者が二重に出る問題を修正'
      },
      {
        type: 'fix',
        description: 'ダークテーマで一部の見出しや文字が読めない問題を修正'
      },
      {
        type: 'fix',
        description: '国立国会図書館サーチの書影API提供終了（2026年3月31日）に伴い、一覧の書影列を削除'
      },
      {
        type: 'improvement',
        description: 'ISBN・論文タイトル欄でEnterキーを押すと検索するように変更'
      },
      {
        type: 'improvement',
        description: '文献の種類を変えても、書名・出版年など共通する項目の入力内容を引き継ぐように変更'
      },
      {
        type: 'improvement',
        description: 'NDLから著者の読み仮名を取り込み、一覧の検索で団体名・作曲者・原著者も探せるように改善'
      }
    ]
  },
  {
    version: '2.0.0',
    date: '2025-09-03',
    changes: [
      {
        type: 'feature',
        description: 'CiNii / NDL 連携: opensearch JSON の正規化と詳細 (.json) 取得によるメタデータ自動マッピングを追加'
      },
      {
        type: 'feature',
        description: 'MappingModal: 著者抽出の改善（dc:creator 優先、URL-only 除外）、著者選択・編集 UI、前からN文字分割機能を追加'
      },
      {
        type: 'improvement',
        description: 'DOI と NDL リンクを dc:identifier から抽出し、リンク欄は NDL を優先、DOI は別フィールドで保持・表示するように変更'
      },
      {
        type: 'improvement',
        description: '取得メタデータの安全なマージ処理を導入（空の値で既存値を上書きしない）およびデバッグログの追加'
      }
    ]
  },
  {
    version: '1.5.3',
    date: '2025-08-18',
    changes: [
      {
        type: 'feature',
        description: '色のテーマを追加'
      }
    ]
  },
   {
    version: '1.5.2',
    date: '2025-08-06',
    changes: [
      {
        type: 'improvement',
        description: '引用ボタンを押した時に不要な情報が聞かれる問題を改善'
      }
    ]
  },
      {
    version: '1.5.1',
    date: '2025-08-06',
    changes: [
      {
        type: 'fix',
        description: 'webページを参考文献として使用するときの書式を修正'
      }
    ]
  },
    {
    version: '1.5.0',
    date: '2025-08-06',
    changes: [
      {
        type: 'feature',
        description: 'webページを参考文献として使用するときの書式を追加'
      }
    ]
  },
  {
    version: '1.4.0',
    date: '2025-06-28',
    changes: [
      {
        type: 'feature',
        description: '同一著者・同一年の文献に対してa,b,cを自動付与する機能を実装'
      },
      {
        type: 'feature',
        description: '参考文献一覧と本文中の引用で同一著者・同一年の文献を適切に区別表示'
      },
      {
        type: 'improvement',
        description: 'アルファベットサフィックス（a,b,c）は文献の登録順（createdAtの古い順）で付与'
      },
      {
        type: 'improvement',
        description: '全ての文献種別（日本語書籍、英語書籍、論文、翻訳書、団体出版本など）でアルファベットサフィックスに対応'
      },
      {
        type: 'improvement',
        description: 'PreviewSection、ReferenceList、ReferenceTableの全てで統一されたa,b,c表示'
      }
    ]
  },
  {
    version: '1.3.5',
    date: '2025-06-18',
    changes: [
      {
        type: 'fix',
        description: '参考文献一覧の改行を一部削除し、空白行を削除して表示およびコピー時の見た目を改善'
      }
    ]
  },
  {
    version: '1.3.4.1',
    date: '2025-06-18',
    changes: [
      {
        type: 'fix',
        description: '本文中の引用注で複数著者の表記基準を修正：「3名未満」→「3名以下」、「3名以上」→「4名以上」'
      }
    ]
  },
  {
    version: '1.3.4',
    date: '2025-06-18',
    changes: [
      {
        type: 'fix',
        description: '翻訳書の参考文献一覧表「著者」列で原語表記の著者名を表示するように修正'
      },
      {
        type: 'fix',
        description: '翻訳書の参考文献一覧表「出版年」列で「原著出版年(翻訳書出版年)」形式を表示するように修正'
      },
      {
        type: 'improvement',
        description: '翻訳書の表示で学術的な標準形式により準拠した表記に改善'
      },
      {
        type: 'improvement',
        description: 'ReferenceTableとPreviewSectionの両方で翻訳書の統一された表示形式を適用'
      }
    ]
  },
  {
    version: '1.3.3',
    date: '2025-06-18',
    changes: [
      {
        type: 'fix',
        description: '本文中の引用注で複数著者の表記基準を修正：「3名まで」→「3名未満」、「4名以上」→「3名以上」'
      },
      {
        type: 'improvement',
        description: '複数著者の引用形式を正確に実装：3名未満は全員表記、3名以上は筆頭著者＋「ほか」'
      },
      {
        type: 'improvement',
        description: '参考文献書方.mdとFormatGuideModalの引用例に複数著者の具体例を追加'
      },
      {
        type: 'fix',
        description: 'formatters.jsの著者フォーマット処理を修正し、引用と参考文献一覧で統一された基準を適用'
      }
    ]
  },
  {
    version: '1.3.2',
    date: '2025-06-17',
    changes: [
      {
        type: 'fix',
        description: '翻訳書フォームで重複した入力欄が表示される問題を修正'
      },
      {
        type: 'improvement',
        description: '翻訳書の訳者入力を他の著者フィールドと同様に姓名・読み仮名で分離して入力する形式に変更'
      },
      {
        type: 'improvement',
        description: '翻訳書の訳者も複数人対応で、追加・削除ボタンによる管理が可能に'
      }
    ]
  },
  {
    version: '1.3.1',
    date: '2025-06-17',
    changes: [
      {
        type: 'fix',
        description: '翻訳書の原著者フィールドを日本語表記と原語表記に分離'
      },
      {
        type: 'fix',
        description: '翻訳書の訳者名を文字列形式に変更（複数訳者は「・」で区切り）'
      },
      {
        type: 'improvement',
        description: '翻訳書の参考文献表記で原著者を日本語と原語の両方で表示'
      },
      {
        type: 'improvement',
        description: '学術的な翻訳書の標準的な書式により準拠した形式に改善'
      }
    ]
  },
  {
    version: '1.3.0',
    date: '2025-06-17',
    changes: [
      {
        type: 'feature',
        description: '翻訳書で複数の原著者を設定できる機能を追加'
      },
      {
        type: 'feature',
        description: '翻訳書で複数の訳者を設定できる機能を追加'
      },
      {
        type: 'improvement',
        description: '翻訳書の著者・訳者フィールドを他の文献種別と同様の複数人対応形式に統一'
      },
      {
        type: 'improvement',
        description: '翻訳書の参考文献一覧表示で複数著者・訳者の適切な表記に対応'
      },
      {
        type: 'improvement',
        description: '既存の翻訳書データを新形式に自動変換する後方互換性機能を追加'
      }
    ]
  },
  {
    version: '1.2.2',
    date: '2025-06-17',
    changes: [
      {
        type: 'feature',
        description: 'スタイルを改善し、多様な配色を選択できるように変更'
      }
    ]
  },
  {
    version: '1.2.1',
    date: '2025-06-17',
    changes: [
      {
        type: 'fix',
        description: '団体出版本（教科書・指導要領など)を選択したときに、追加ボタンが押せなくなる問題を修正'
      }
    ]
  },
  {
    version: '1.2.0',
    date: '2025-06-17',
    changes: [
      {
        type: 'feature',
        description: '団体出版本（教科書・指導要領など）の文献種別を追加'
      },
      {
        type: 'feature',
        description: '団体出版本の書式：「執筆団体『書籍名』、出版年。」に対応'
      },
      {
        type: 'improvement',
        description: '団体出版本の引用形式で団体名を著者名として使用'
      },
      {
        type: 'improvement',
        description: '参考文献書方.mdに団体出版本の書き方を追記'
      }
    ]
  },
  {
    version: '1.1.0',
    date: '2025-06-17',
    changes: [
      {
        type: 'fix',
        description: '引用形式の修正：著者の姓と発行年の間に全角スペースを使用するように変更'
      },
      {
        type: 'fix',
        description: '引用形式の修正：年とページの間のコロン後の半角スペースを削除'
      },
      {
        type: 'feature',
        description: 'バージョン情報とアップデート履歴の表示機能を追加'
      },
      {
        type: 'improvement',
        description: 'ヘッダーデザインの改善とバージョンバッジの追加'
      }
    ]
  },
  {
    version: '1.0.0',
    date: '2025-06-16',
    changes: [
      {
        type: 'feature',
        description: '参考文献管理の基本機能を実装'
      },
      {
        type: 'feature',
        description: '12種類の文献種別に対応（日本語書籍、英語書籍、論文、翻訳書など）'
      },
      {
        type: 'feature',
        description: '本文中の引用（割注）形式の自動生成'
      },
      {
        type: 'feature',
        description: '参考文献一覧の自動生成とソート機能'
      },
      {
        type: 'feature',
        description: 'JSONファイルでのデータエクスポート・インポート機能'
      },
      {
        type: 'feature',
        description: 'ダークテーマ・ライトテーマの切り替え機能'
      },
      {
        type: 'feature',
        description: '参考文献の書き方ガイドの内蔵'
      }
    ]
  }
];

// 変更タイプのラベル
export const CHANGE_TYPE_LABELS = {
  feature: '新機能',
  fix: '修正',
  improvement: '改善',
  security: 'セキュリティ',
  breaking: '破壊的変更'
};

// 変更タイプのアイコン
export const CHANGE_TYPE_ICONS = {
  feature: '✨',
  fix: '🔧',
  improvement: '⚡',
  security: '🔒',
  breaking: '💥'
};
