// アプリケーションの変更履歴
export const CHANGELOG = [
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
