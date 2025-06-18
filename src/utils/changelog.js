// アプリケーションの変更履歴
export const CHANGELOG = [
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
    version: '1.3.4',
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
