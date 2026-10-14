// テーマ定義
// 色はすべて Tailwind CSS v3 の標準カラーパレット（https://v3.tailwindcss.com/docs/customizing-colors）から選んでいる。
// 各色の後ろのコメントは、パレット上の色名（例: indigo-200）。
// 各色は CSS 変数（--color-<キー>、入れ子は --color-text-primary のように連結）として設定される。
//
// 色の役割（組み合わせを変える場合は scripts/check-theme-contrast.mjs も合わせて更新する）
//   primary / primaryHover     : 主要ボタン・ヘッダー帯の塗り（文字は text.onPrimary）
//   secondary / secondaryHover : 補助ボタン・ヘッダー帯の塗り（文字は text.primary）
//   accent / accentHover       : コピー・エクスポートなどのボタンの塗り（文字は text.onPrimary）
//   danger / dangerHover       : 削除ボタンの塗り（文字は text.onPrimary）
//   warning / warningHover     : データクリーンアップなど注意が必要な操作の塗り（文字は text.onPrimary）
//   background                 : ページ全体の背景
//   surface / surfaceHover     : カード・入力欄の背景、ホバー時や見出し行の背景
//   text.primary               : 見出し・ラベル・リンク、フォーカス枠
//   text.secondary / muted     : 補足情報 / 読み仮名・日付などの控えめな情報
//   text.onSurface             : 本文
//   text.onPrimary             : 塗りつぶしボタンの文字
//   text.danger                : エラーメッセージ・必須マーク
//   border.primary             : カードの区切り線（装飾）
//   border.secondary           : 入力欄の枠線（操作部品として見分けられる濃さが必要）
//   colorScheme（colors の外） : 'dark' にするとセレクトの選択肢などブラウザ標準の部品も暗くなる
//
// 明るいテーマは「背景 50 / ボタン 200〜300 / 文字 700〜900」の段階で揃えている。
// 新しいテーマを追加・変更したら、node scripts/check-theme-contrast.mjs で
// WCAG 2.1 AA（文字 4.5:1、入力欄の枠線 3:1）を満たしていることを確認する。

// 「基本」の系統に並ぶテーマ
const baseThemes = {
  light: {
    name: 'パープル',
    colors: {
      primary: '#C7D2FE', // indigo-200
      primaryHover: '#A5B4FC', // indigo-300
      secondary: '#E0E7FF', // indigo-100
      secondaryHover: '#C7D2FE', // indigo-200
      accent: '#DDD6FE', // violet-200
      accentHover: '#C4B5FD', // violet-300

      danger: '#FECACA', // red-200
      dangerHover: '#FCA5A5', // red-300
      warning: '#FDE68A', // amber-200
      warningHover: '#FCD34D', // amber-300

      background: '#EEF2FF', // indigo-50
      surface: '#FFFFFF', // white
      surfaceHover: '#EEF2FF', // indigo-50

      text: {
        primary: '#3730A3', // indigo-800
        secondary: '#4338CA', // indigo-700
        muted: '#4B5563', // gray-600
        onSurface: '#1F2937', // gray-800
        onPrimary: '#312E81', // indigo-900
        danger: '#B91C1C' // red-700
      },

      border: {
        primary: '#C7D2FE', // indigo-200
        secondary: '#6B7280', // gray-500
        accent: '#4338CA' // indigo-700
      },

      shadow: 'rgba(165, 180, 252, 0.3)',
      shadowLight: 'rgba(165, 180, 252, 0.12)'
    }
  },

  pink: {
    name: 'ピンク',
    colors: {
      primary: '#FBCFE8', // pink-200
      primaryHover: '#F9A8D4', // pink-300
      secondary: '#FCE7F3', // pink-100
      secondaryHover: '#FBCFE8', // pink-200
      accent: '#FECDD3', // rose-200
      accentHover: '#FDA4AF', // rose-300

      danger: '#FECACA', // red-200
      dangerHover: '#FCA5A5', // red-300
      warning: '#FDE68A', // amber-200
      warningHover: '#FCD34D', // amber-300

      background: '#FDF2F8', // pink-50
      surface: '#FFFFFF', // white
      surfaceHover: '#FDF2F8', // pink-50

      text: {
        primary: '#9D174D', // pink-800
        secondary: '#BE185D', // pink-700
        muted: '#4B5563', // gray-600
        onSurface: '#1F2937', // gray-800
        onPrimary: '#831843', // pink-900
        danger: '#B91C1C' // red-700
      },

      border: {
        primary: '#FBCFE8', // pink-200
        secondary: '#6B7280', // gray-500
        accent: '#BE185D' // pink-700
      },

      shadow: 'rgba(249, 168, 212, 0.3)',
      shadowLight: 'rgba(249, 168, 212, 0.12)'
    }
  },

  orange: {
    name: 'オレンジ',
    colors: {
      primary: '#FED7AA', // orange-200
      primaryHover: '#FDBA74', // orange-300
      secondary: '#FFEDD5', // orange-100
      secondaryHover: '#FED7AA', // orange-200
      // 注意ボタン（amber）と見分けられるよう、暖色テーマのコピー・出力ボタンは黄緑にする
      accent: '#D9F99D', // lime-200
      accentHover: '#BEF264', // lime-300

      danger: '#FECACA', // red-200
      dangerHover: '#FCA5A5', // red-300
      warning: '#FDE68A', // amber-200
      warningHover: '#FCD34D', // amber-300

      background: '#FFF7ED', // orange-50
      surface: '#FFFFFF', // white
      surfaceHover: '#FFF7ED', // orange-50

      text: {
        primary: '#7C2D12', // orange-900
        secondary: '#9A3412', // orange-800
        muted: '#4B5563', // gray-600
        onSurface: '#1F2937', // gray-800
        onPrimary: '#7C2D12', // orange-900
        danger: '#B91C1C' // red-700
      },

      border: {
        primary: '#FED7AA', // orange-200
        secondary: '#6B7280', // gray-500
        accent: '#9A3412' // orange-800
      },

      shadow: 'rgba(253, 186, 116, 0.3)',
      shadowLight: 'rgba(253, 186, 116, 0.12)'
    }
  },

  yellow: {
    name: 'イエロー',
    colors: {
      primary: '#FEF08A', // yellow-200
      primaryHover: '#FDE047', // yellow-300
      secondary: '#FEF9C3', // yellow-100
      secondaryHover: '#FEF08A', // yellow-200
      // 注意ボタン（amber）と見分けられるよう、暖色テーマのコピー・出力ボタンは黄緑にする
      accent: '#D9F99D', // lime-200
      accentHover: '#BEF264', // lime-300

      danger: '#FECACA', // red-200
      dangerHover: '#FCA5A5', // red-300
      warning: '#FDE68A', // amber-200
      warningHover: '#FCD34D', // amber-300

      background: '#FEFCE8', // yellow-50
      surface: '#FFFFFF', // white
      surfaceHover: '#FEFCE8', // yellow-50

      text: {
        primary: '#713F12', // yellow-900
        secondary: '#854D0E', // yellow-800
        muted: '#4B5563', // gray-600
        onSurface: '#1F2937', // gray-800
        onPrimary: '#713F12', // yellow-900
        danger: '#B91C1C' // red-700
      },

      border: {
        primary: '#FEF08A', // yellow-200
        secondary: '#6B7280', // gray-500
        accent: '#854D0E' // yellow-800
      },

      shadow: 'rgba(253, 224, 71, 0.3)',
      shadowLight: 'rgba(253, 224, 71, 0.12)'
    }
  },

  green: {
    name: 'グリーン',
    colors: {
      primary: '#A7F3D0', // emerald-200
      primaryHover: '#6EE7B7', // emerald-300
      secondary: '#D1FAE5', // emerald-100
      secondaryHover: '#A7F3D0', // emerald-200
      accent: '#99F6E4', // teal-200
      accentHover: '#5EEAD4', // teal-300

      danger: '#FECACA', // red-200
      dangerHover: '#FCA5A5', // red-300
      warning: '#FDE68A', // amber-200
      warningHover: '#FCD34D', // amber-300

      background: '#ECFDF5', // emerald-50
      surface: '#FFFFFF', // white
      surfaceHover: '#ECFDF5', // emerald-50

      text: {
        primary: '#065F46', // emerald-800
        secondary: '#047857', // emerald-700
        muted: '#4B5563', // gray-600
        onSurface: '#1F2937', // gray-800
        onPrimary: '#064E3B', // emerald-900
        danger: '#B91C1C' // red-700
      },

      border: {
        primary: '#A7F3D0', // emerald-200
        secondary: '#6B7280', // gray-500
        accent: '#047857' // emerald-700
      },

      shadow: 'rgba(110, 231, 183, 0.3)',
      shadowLight: 'rgba(110, 231, 183, 0.12)'
    }
  },

  blue: {
    name: 'ブルー',
    colors: {
      primary: '#BFDBFE', // blue-200
      primaryHover: '#93C5FD', // blue-300
      secondary: '#DBEAFE', // blue-100
      secondaryHover: '#BFDBFE', // blue-200
      accent: '#BAE6FD', // sky-200
      accentHover: '#7DD3FC', // sky-300

      danger: '#FECACA', // red-200
      dangerHover: '#FCA5A5', // red-300
      warning: '#FDE68A', // amber-200
      warningHover: '#FCD34D', // amber-300

      background: '#EFF6FF', // blue-50
      surface: '#FFFFFF', // white
      surfaceHover: '#EFF6FF', // blue-50

      text: {
        primary: '#1E40AF', // blue-800
        secondary: '#1D4ED8', // blue-700
        muted: '#4B5563', // gray-600
        onSurface: '#1F2937', // gray-800
        onPrimary: '#1E3A8A', // blue-900
        danger: '#B91C1C' // red-700
      },

      border: {
        primary: '#BFDBFE', // blue-200
        secondary: '#6B7280', // gray-500
        accent: '#1D4ED8' // blue-700
      },

      shadow: 'rgba(147, 197, 253, 0.3)',
      shadowLight: 'rgba(147, 197, 253, 0.12)'
    }
  },

  // Tailwind にブラウンの系統はないため、温かみのある灰色（stone）と、見出しに琥珀色（amber）を使う
  brown: {
    name: 'ブラウン',
    colors: {
      primary: '#D6D3D1', // stone-300
      primaryHover: '#A8A29E', // stone-400
      secondary: '#F5F5F4', // stone-100
      secondaryHover: '#E7E5E4', // stone-200
      // 注意ボタン（amber）と見分けられるよう、コピー・出力ボタンは橙にする
      accent: '#FED7AA', // orange-200
      accentHover: '#FDBA74', // orange-300

      danger: '#FECACA', // red-200
      dangerHover: '#FCA5A5', // red-300
      warning: '#FDE68A', // amber-200
      warningHover: '#FCD34D', // amber-300

      background: '#FAFAF9', // stone-50
      surface: '#FFFFFF', // white
      surfaceHover: '#FAFAF9', // stone-50

      text: {
        primary: '#78350F', // amber-900
        secondary: '#44403C', // stone-700
        muted: '#57534E', // stone-600
        onSurface: '#292524', // stone-800
        onPrimary: '#1C1917', // stone-900
        danger: '#B91C1C' // red-700
      },

      border: {
        primary: '#E7E5E4', // stone-200
        secondary: '#78716C', // stone-500
        accent: '#44403C' // stone-700
      },

      shadow: 'rgba(214, 211, 209, 0.3)',
      shadowLight: 'rgba(214, 211, 209, 0.12)'
    }
  },

  dark: {
    name: 'ダーク',
    colorScheme: 'dark',
    colors: {
      primary: '#1D4ED8', // blue-700
      primaryHover: '#1E40AF', // blue-800
      secondary: '#334155', // slate-700
      secondaryHover: '#475569', // slate-600
      accent: '#047857', // emerald-700
      accentHover: '#065F46', // emerald-800

      danger: '#B91C1C', // red-700
      dangerHover: '#991B1B', // red-800
      warning: '#B45309', // amber-700
      warningHover: '#92400E', // amber-800

      background: '#020617', // slate-950
      surface: '#0F172A', // slate-900
      surfaceHover: '#1E293B', // slate-800

      text: {
        primary: '#7DD3FC', // sky-300
        secondary: '#CBD5E1', // slate-300
        muted: '#94A3B8', // slate-400
        onSurface: '#F1F5F9', // slate-100
        onPrimary: '#FFFFFF', // white
        danger: '#FCA5A5' // red-300
      },

      border: {
        primary: '#334155', // slate-700
        secondary: '#94A3B8', // slate-400
        accent: '#7DD3FC' // sky-300
      },

      shadow: 'rgba(0, 0, 0, 0.4)',
      shadowLight: 'rgba(0, 0, 0, 0.2)'
    }
  }
};

// ---------------------------------------------------------------------------
// 色彩101®「4色の配色パターン」（https://shikisai101.com/color-scheme/colors/4/）の配色から作るテーマ
// 配色名は出典のまま。group はメインの色（ボタン・ヘッダー）の色味で分けた系統。
// 配色を追加するときは、1行足すだけでテーマと選択肢に反映される。
// ---------------------------------------------------------------------------

export const PALETTE_SOURCE = {
  name: '色彩101®「4色の配色パターン」',
  url: 'https://shikisai101.com/color-scheme/colors/4/'
};

const PALETTE_GROUPS = [
  { key: 'red', name: '赤・ピンク系' },
  { key: 'orange', name: 'オレンジ系' },
  { key: 'brown', name: '茶系' },
  { key: 'beige', name: 'ベージュ系' },
  { key: 'yellow', name: '黄色系' },
  { key: 'green', name: '緑系' },
  { key: 'cyan', name: '水色・青緑系' },
  { key: 'blue', name: '青系' },
  { key: 'purple', name: '紫系' },
  { key: 'gray', name: 'グレー系' }
];

const PALETTES = [
  // red
  { name: 'ビリヤード台と赤い球', group: 'red', colors: ['#384D3E', '#D6BF77', '#841E59', '#DBDCD6'] },
  { name: 'ゼラニウムの寄せ植え', group: 'red', colors: ['#C6C7CA', '#393B3B', '#F5379D', '#1A3F31'] },
  { name: 'お人形の家', group: 'red', colors: ['#E3B8CB', '#DB82A8', '#E2D9EC', '#FED4D8'] },
  { name: 'チョコレートといちご', group: 'red', colors: ['#502815', '#FB5692', '#FFF9F0', '#987762'] },
  { name: 'ガーネットの指輪', group: 'red', colors: ['#962141', '#48484A', '#1F1F27', '#F6F5F0'] },
  { name: 'ドレッサーの上の香水びん', group: 'red', colors: ['#DDADA3', '#FEDDE6', '#FFFFFF', '#EDC7BA'] },
  { name: 'チョコがけのさくらんぼ', group: 'red', colors: ['#FFE3E9', '#E1304C', '#794442', '#242424'] },
  { name: '桜の枝', group: 'red', colors: ['#FAFAF9', '#E8DBDC', '#D9BBBF', '#6D162C'] },
  { name: '雨の日の赤い傘', group: 'red', colors: ['#646766', '#BEBDB9', '#C73A47', '#F8D8B7'] },
  { name: 'スイートピーの花束', group: 'red', colors: ['#895283', '#F7A1C5', '#FFFFFF', '#FFC3C7'] },
  { name: 'バラの庭の夕暮れ', group: 'red', colors: ['#EE9DA0', '#C98C91', '#F4DFD8', '#2C374C'] },
  { name: '紺の傘と桜並木', group: 'red', colors: ['#FFD7D4', '#EA9395', '#A27066', '#242E41'] },
  { name: '紺のヨットと赤い旗', group: 'red', colors: ['#343450', '#F96A6A', '#E7EBF9', '#997268'] },
  { name: '赤いスポーツカー', group: 'red', colors: ['#F79F89', '#F76C6C', '#E12048', '#343434'] },
  { name: 'ミントとピーチのアイス', group: 'red', colors: ['#5AE7ED', '#85C3A1', '#FEECEC', '#FFEFDB'] },
  { name: '赤と黒の舞台', group: 'red', colors: ['#B72320', '#E7211E', '#222220', '#E5E2F3'] },
  { name: 'ピンクの椅子と丸いテーブル', group: 'red', colors: ['#DADADB', '#7C7C7E', '#B19695', '#7D4F50'] },
  { name: '深い青の花瓶と花びら', group: 'red', colors: ['#FFCBC8', '#D38D8B', '#FCECEB', '#333D54'] },
  { name: 'ビンテージのティーカップ', group: 'red', colors: ['#B3C3D5', '#FFE7B1', '#DDA164', '#F9CFCB'] },
  { name: '紺の帆布と赤い革', group: 'red', colors: ['#254770', '#F06653', '#B66247', '#FCFCFC'] },
  // orange
  { name: 'よろい戸のある塗り壁の家', group: 'orange', colors: ['#CFBDAF', '#BB5D31', '#AF8880', '#545A56'] },
  { name: '焼きたてのクロワッサン', group: 'orange', colors: ['#F4E4CB', '#EB9D77', '#FCF4EB', '#79503D'] },
  { name: '紺のソファとオレンジの毛布', group: 'orange', colors: ['#B8B8B5', '#041C3B', '#BA4706', '#937863'] },
  { name: '桃とキャラメル', group: 'orange', colors: ['#F8BD97', '#FFFFFF', '#AD8B66', '#DB8D7E'] },
  { name: '夕焼けから夜への空', group: 'orange', colors: ['#E67928', '#FFBB65', '#D7B190', '#242E41'] },
  { name: '山登りの道具', group: 'orange', colors: ['#FFFFDE', '#F0AC78', '#7A967C', '#02010C'] },
  { name: '夏のビーチのパラソル', group: 'orange', colors: ['#FEE43B', '#FECBD0', '#FFC79B', '#61C6C9'] },
  { name: 'マンゴーとパパイヤ', group: 'orange', colors: ['#F7CA79', '#FDC96C', '#F79443', '#AE6C62'] },
  { name: 'オレンジのテントと森', group: 'orange', colors: ['#D38027', '#666659', '#FAE3BE', '#F79443'] },
  { name: 'オレンジとレモンのタルト', group: 'orange', colors: ['#C3A980', '#A28A84', '#E8822A', '#ECDB71'] },
  { name: '素焼きの器の並ぶ棚', group: 'orange', colors: ['#F2D3B8', '#F3AB6C', '#D68A4E', '#FFF3D7'] },
  { name: 'あんずとぶどうのジャム', group: 'orange', colors: ['#EEE1CB', '#FEAB5B', '#8F7D99', '#FEECBE'] },
  { name: 'キャンプの焚き火', group: 'orange', colors: ['#CE685A', '#E1DCD6', '#5D5B5E', '#F9A753'] },
  { name: 'オレンジの木のある庭', group: 'orange', colors: ['#F0E1CA', '#FFAF5A', '#39772D', '#FFF3C1'] },
  { name: 'リースを掛けた木のドア', group: 'orange', colors: ['#869DB3', '#C6CED6', '#354057', '#C37F2D'] },
  { name: '石造りのパン屋', group: 'orange', colors: ['#FAE3BE', '#D7B190', '#F7CA79', '#7F7876'] },
  // brown
  { name: '黄色いソファの居間', group: 'brown', colors: ['#BB6558', '#B6968A', '#C7B772', '#94ADA7'] },
  { name: '革の椅子と木の机', group: 'brown', colors: ['#A0BEAF', '#50270C', '#9C522D', '#85664D'] },
  { name: '布張りのヘッドボード', group: 'brown', colors: ['#848381', '#ADA8A5', '#353432', '#A88569'] },
  { name: '青い布を掛けた和室', group: 'brown', colors: ['#BFB6AF', '#8E7B64', '#B38763', '#4F5B68'] },
  { name: '上下で塗り分けた2階建て', group: 'brown', colors: ['#D5DCE5', '#2A3745', '#2E2C33', '#A9784D'] },
  { name: '麻のラグを敷いた居間', group: 'brown', colors: ['#C9C8C5', '#8F8F8A', '#9C826B', '#825931'] },
  { name: '黒板のある木の教室', group: 'brown', colors: ['#F1E8CE', '#DACBB7', '#AE7A4C', '#5E7F55'] },
  { name: 'インクつぼとランプ', group: 'brown', colors: ['#181C2C', '#FACE82', '#9D8168', '#C7BCB6'] },
  { name: 'アーチのある食堂', group: 'brown', colors: ['#B6A58E', '#AA7B5F', '#AD8057', '#C2C5C4'] },
  { name: '和紙と色短冊', group: 'brown', colors: ['#D8D8D6', '#AE4054', '#A87749', '#7599A8'] },
  { name: '青い枕を並べたベッド', group: 'brown', colors: ['#C6C2C1', '#325978', '#5B6165', '#A28B75'] },
  { name: '緑のタイルのカウンター', group: 'brown', colors: ['#D7D2CC', '#163C33', '#B6936E', '#BFA487'] },
  { name: 'ピンクのソファと籐の椅子', group: 'brown', colors: ['#8AA792', '#D4949B', '#295254', '#A98862'] },
  { name: '紺の表紙の古い本', group: 'brown', colors: ['#FFF8D9', '#C3A887', '#434D65', '#F6F4EF'] },
  { name: 'つり下げ照明のある寝室', group: 'brown', colors: ['#44515E', '#CCCCCC', '#171A22', '#AC8541'] },
  { name: '山小屋の夜', group: 'brown', colors: ['#8F8E63', '#928F9A', '#1D2029', '#ECEAEC'] },
  // beige
  { name: '霧雨の朝', group: 'beige', colors: ['#B8CEE0', '#788389', '#A2A1A4', '#C5B5AF'] },
  { name: '黒い額縁の水彩画', group: 'beige', colors: ['#D9B8A9', '#CD9E8E', '#A0C4E6', '#222223'] },
  { name: '冬の曇りの湖', group: 'beige', colors: ['#BCD1E4', '#D1C1B8', '#6A5F5C', '#6B8092'] },
  { name: '真鍮の取っ手と内装の見本', group: 'beige', colors: ['#E1E1E1', '#CEC1B6', '#857162', '#C9C9C7'] },
  { name: 'アンティークの地球儀', group: 'beige', colors: ['#D8B594', '#C6A17B', '#FBECA3', '#5B4B4B'] },
  { name: '古い蓄音機の部屋', group: 'beige', colors: ['#E7BBB5', '#1B282A', '#DCBB9B', '#A55D4B'] },
  { name: '青い花瓶とドライフラワー', group: 'beige', colors: ['#DDDDEB', '#3F8DB3', '#E2B78A', '#753F65'] },
  { name: 'ドライローズのブーケ', group: 'beige', colors: ['#CF9E94', '#F7F6F2', '#9B5B4B', '#D3B797'] },
  { name: '貝殻を拾う浜', group: 'beige', colors: ['#B1D5DF', '#EDCFAC', '#FFE7CB', '#969697'] },
  { name: 'キャラメルラテとクッキー', group: 'beige', colors: ['#EDD6BC', '#EAD4C4', '#EDC89C', '#675850'] },
  { name: '色つきの木のブロック', group: 'beige', colors: ['#DAD1C6', '#CBB395', '#DCA088', '#A6CAC6'] },
  { name: '小石と月の夜', group: 'beige', colors: ['#EDDDC5', '#9999A1', '#F6F8C7', '#2E394E'] },
  { name: '翡翠の置き物', group: 'beige', colors: ['#FFFDE6', '#E7D9C0', '#00A388', '#71C6AA'] },
  // yellow
  { name: '紺のブレザーと金ボタン', group: 'yellow', colors: ['#C99D43', '#343F7B', '#212023', '#C0B3A7'] },
  { name: '晴れた日のピクニック', group: 'yellow', colors: ['#1256AD', '#FECD54', '#EEEDE9', '#0A7241'] },
  { name: 'かごを置いた玄関のベンチ', group: 'yellow', colors: ['#DEE1E6', '#D9BA6A', '#797F8B', '#8B6749'] },
  { name: 'レモンを置いたキッチン', group: 'yellow', colors: ['#D8D8D8', '#696D70', '#9A765A', '#C89C03'] },
  { name: '丸いラグの子ども部屋', group: 'yellow', colors: ['#F4F5FA', '#EDD784', '#B69C79', '#99A2AF'] },
  { name: 'リボンのかかった贈り物', group: 'yellow', colors: ['#BFCCE2', '#B6DFFF', '#ECA5B2', '#ECDB71'] },
  { name: '黄色い椅子のある食卓', group: 'yellow', colors: ['#DFDFDF', '#D5BF03', '#B9A593', '#B3B9C0'] },
  { name: '春の花壇', group: 'yellow', colors: ['#EB5E88', '#FFDFD2', '#EBB7A9', '#F1E785'] },
  // green
  { name: '青い鉢のオリーブ', group: 'green', colors: ['#C5D885', '#32476B', '#F4F5F0', '#D8E0D8'] },
  { name: '竹林の奥', group: 'green', colors: ['#D5DE69', '#9EB85D', '#60782C', '#191F11'] },
  { name: '夜の公園の街灯と芝生', group: 'green', colors: ['#A0CA5A', '#6A8655', '#F9F06F', '#242E41'] },
  { name: '木の幹と葉の重なり', group: 'green', colors: ['#34550C', '#1D3308', '#AFC078', '#64666D'] },
  { name: '紺の空と若葉の並木', group: 'green', colors: ['#CAE3BF', '#A6C486', '#6A8655', '#242E41'] },
  { name: '芝生とシロツメクサ', group: 'green', colors: ['#E9ECE3', '#B5DB93', '#90D582', '#6FA866'] },
  { name: '黄緑のシャツと紺', group: 'green', colors: ['#B7E8A3', '#9ECF8A', '#DCE1CF', '#334258'] },
  { name: 'ハーブティーと紺のカップ', group: 'green', colors: ['#CDE7CD', '#A9C2B0', '#F6F3CA', '#2F394F'] },
  { name: '三角の旗を飾った子ども部屋', group: 'green', colors: ['#D1D0CE', '#82B499', '#C0B2AA', '#9E7A58'] },
  { name: '観葉植物のある部屋', group: 'green', colors: ['#D9C5AD', '#048640', '#FCFCFA', '#171926'] },
  { name: 'ハロウィンのお菓子', group: 'green', colors: ['#BF7CC5', '#7CC7A1', '#FFEB64', '#C7782E'] },
  { name: '本の並ぶ書斎', group: 'green', colors: ['#BFA197', '#375C53', '#E0CBB1', '#21262C'] },
  // cyan
  { name: '嵐のあとの海', group: 'cyan', colors: ['#444B5B', '#7986A9', '#3BC0F7', '#48B2B0'] },
  { name: '夏の日の水遊び', group: 'cyan', colors: ['#FFFDE6', '#75CFE3', '#E6FFFF', '#ABDBE3'] },
  { name: 'ソーダとレモン', group: 'cyan', colors: ['#73E5F3', '#61CDDA', '#44B5C6', '#FEED8E'] },
  { name: '革のソファと青緑の壁', group: 'cyan', colors: ['#D0A681', '#01798F', '#E6E6E1', '#19181D'] },
  { name: '夕方のラグーン', group: 'cyan', colors: ['#13A8C4', '#2A7C8B', '#EFB999', '#97EDF1'] },
  { name: '冬の朝の空', group: 'cyan', colors: ['#96E9FB', '#A3AED2', '#E0ECF6', '#323B54'] },
  { name: 'ブーゲンビリアの坂道', group: 'cyan', colors: ['#00A5DC', '#C5DCEA', '#930E6E', '#E2CAA4'] },
  { name: '湖畔のボート', group: 'cyan', colors: ['#BFE5DA', '#69AA9A', '#7CC4DC', '#3D5375'] },
  { name: '青いタイルの浴室', group: 'cyan', colors: ['#D0F8ED', '#76B8D0', '#4E6285', '#75BCAA'] },
  { name: '浮き輪と水色の海', group: 'cyan', colors: ['#A4E0F9', '#69B7C9', '#2A3643', '#F8D8B7'] },
  { name: '青いスニーカーと黒い靴ひも', group: 'cyan', colors: ['#75ADE3', '#EFEBE8', '#2F2E2D', '#249EDB'] },
  { name: 'タンザナイトの原石', group: 'cyan', colors: ['#F9F8FF', '#C2E8FD', '#728CDE', '#5A689E'] },
  { name: '木のカヌーと青い海', group: 'cyan', colors: ['#32B3AF', '#2E8FC6', '#F5D9B1', '#702E1E'] },
  // blue
  { name: '岬の草原と海', group: 'blue', colors: ['#77AED9', '#2C6896', '#5DAD94', '#D7B190'] },
  { name: 'プールの飛び込み台', group: 'blue', colors: ['#2C6896', '#47AAB5', '#8DC7E0', '#77AED9'] },
  { name: '木の机の上の絵の具', group: 'blue', colors: ['#CDBFBB', '#D5D6B4', '#91B1CB', '#C86C35'] },
  { name: 'クジラの泳ぐ海', group: 'blue', colors: ['#A1C9EC', '#F0EFEB', '#5DAFBB', '#10424B'] },
  { name: '青い壁の会議室', group: 'blue', colors: ['#48688A', '#EFEEEB', '#69655F', '#0B0F14'] },
  { name: '紫と青の紫陽花', group: 'blue', colors: ['#C8A2E6', '#F3E7FF', '#6BA0E0', '#608FD5'] },
  { name: '紺のコートと白いマフラー', group: 'blue', colors: ['#C0D2E8', '#D6C8BF', '#3A4459', '#F4F2F0'] },
  { name: '紺と水色のデニム', group: 'blue', colors: ['#CCE6FF', '#78AAE9', '#4574B7', '#2D3B56'] },
  { name: 'プラム色のマフラー', group: 'blue', colors: ['#753F65', '#AAA8A9', '#7C8DA0', '#6681AB'] },
  { name: '紺のスーツの三つぞろえ', group: 'blue', colors: ['#7D9AD7', '#4D6085', '#D1CED7', '#242E41'] },
  { name: '凍った湖の氷', group: 'blue', colors: ['#9ABAFF', '#DFF1FB', '#F7FFFF', '#8797CE'] },
  { name: '夏の海辺のカフェ', group: 'blue', colors: ['#9FB7F1', '#D6C7A9', '#F2F0EF', '#64A5B2'] },
  { name: 'グレンチェックのスーツ', group: 'blue', colors: ['#53597E', '#474853', '#414143', '#DDBDA0'] },
  // purple
  { name: '夜明け前の湖', group: 'purple', colors: ['#A9A7DA', '#444367', '#C5B9D6', '#E6C4C9'] },
  { name: '月明かりの夜', group: 'purple', colors: ['#F0EEFB', '#ADB1C7', '#F8F4C9', '#323C53'] },
  { name: 'クレマチスの垣根', group: 'purple', colors: ['#FFD1FE', '#C894C6', '#9C5774', '#724558'] },
  // gray
  { name: '丸いラグを敷いたワンルーム', group: 'gray', colors: ['#E2E2E1', '#A48974', '#979D84', '#A19288'] },
  { name: '手編みの毛布を掛けたベッド', group: 'gray', colors: ['#B0BBAE', '#DCDDE3', '#525946', '#6D4A25'] },
  { name: '緑の板壁の2階建て', group: 'gray', colors: ['#A0ACA0', '#D2D7E1', '#66656B', '#8E5834'] }
];

// --- 配色の4色からテーマの色を作る ---
// 4色を明るさで並べ、いちばん明るい色→背景、いちばん暗い色→見出しの文字、中間の2色→ボタンに割り当てる。
// 文字はほぼ黒（PALETTE_INK）にし、黒い文字が読めないほど濃い色は、色味を保ったまま明るくする。

const PALETTE_INK = '#1F2937'; // gray-800：本文とボタンの文字
const PALETTE_SHARED_COLORS = {
  danger: '#FECACA', // red-200
  dangerHover: '#FCA5A5', // red-300
  warning: '#FDE68A', // amber-200
  warningHover: '#FCD34D', // amber-300
  muted: '#4B5563', // gray-600
  textDanger: '#B91C1C', // red-700
  inputBorder: '#6B7280' // gray-500
};
const TEXT_MIN_RATIO = 4.5;
const HEADING_MIN_RATIO = 7; // 見出しは白地で 7:1 以上にして、淡いボタンの上でも読めるようにする

const hexToRgb = (hex) => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));

const rgbToHex = (rgb) => '#' + rgb
  .map(v => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0'))
  .join('')
  .toUpperCase();

const hexToHsl = (hex) => {
  const [r, g, b] = hexToRgb(hex).map(v => v / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / 2;
  if (max === min) return [0, 0, lightness * 100];
  const delta = max - min;
  const saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  const hue = max === r ? (g - b) / delta + (g < b ? 6 : 0) : max === g ? (b - r) / delta + 2 : (r - g) / delta + 4;
  return [hue * 60, saturation * 100, lightness * 100];
};

const hslToHex = (hue, saturation, lightness) => {
  const s = saturation / 100;
  const l = lightness / 100;
  const k = n => (n + hue / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return rgbToHex([f(0), f(8), f(4)].map(x => x * 255));
};

// WCAG 2.1 の相対輝度とコントラスト比
const relativeLuminance = (hex) => {
  const [r, g, b] = hexToRgb(hex).map(v => v / 255)
    .map(channel => (channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrastRatio = (hexA, hexB) => {
  const [lighter, darker] = [relativeLuminance(hexA), relativeLuminance(hexB)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
};

const withLightness = (hex, lightness) => {
  const [hue, saturation] = hexToHsl(hex);
  return hslToHex(hue, saturation, Math.min(100, Math.max(0, lightness)));
};

// 色味（色相・彩度）は保ったまま明るさだけを少しずつ動かし、条件を満たす最も元に近い色を返す
const adjustLightness = (hex, meetsRequirement, direction) => {
  if (meetsRequirement(hex)) return hex;
  const [hue, saturation, lightness] = hexToHsl(hex);
  for (let step = 0.5; step <= 100; step += 0.5) {
    const candidate = hslToHex(hue, saturation, Math.min(100, Math.max(0, lightness + direction * step)));
    if (meetsRequirement(candidate)) return candidate;
  }
  return direction > 0 ? '#FFFFFF' : '#000000';
};

const hexToRgba = (hex, alpha) => `rgba(${hexToRgb(hex).join(', ')}, ${alpha})`;

const buildPaletteColors = (paletteColors) => {
  const [darkest, midDark, midLight, lightest] = [...paletteColors].sort((a, b) => relativeLuminance(a) - relativeLuminance(b));
  // 中間の2色のうち、彩度の高い方をメイン（追加ボタン・ヘッダー）、もう一方をサブ（コピー・出力ボタン）にする
  const [mainSource, subSource] = hexToHsl(midDark)[1] >= hexToHsl(midLight)[1] ? [midDark, midLight] : [midLight, midDark];

  const isReadableWithInk = (hex) => contrastRatio(hex, PALETTE_INK) >= TEXT_MIN_RATIO;
  const toHover = (hex) => adjustLightness(withLightness(hex, hexToHsl(hex)[2] - 7), isReadableWithInk, +1);
  const primary = adjustLightness(mainSource, isReadableWithInk, +1);
  const accent = adjustLightness(subSource, isReadableWithInk, +1);
  const secondary = withLightness(primary, 93);
  const secondaryHover = withLightness(primary, 87);

  // 背景は、いちばん明るい色をごく淡くして使う（すでに十分淡ければそのまま）
  const background = hexToHsl(lightest)[2] >= 95 ? lightest : withLightness(lightest, 96.5);

  const headingBackgrounds = ['#FFFFFF', background, secondary, secondaryHover];
  const textPrimary = adjustLightness(
    darkest,
    (hex) => contrastRatio(hex, '#FFFFFF') >= HEADING_MIN_RATIO && headingBackgrounds.every(bg => contrastRatio(hex, bg) >= TEXT_MIN_RATIO),
    -1
  );
  const textSecondary = adjustLightness(
    withLightness(textPrimary, hexToHsl(textPrimary)[2] + 8),
    (hex) => ['#FFFFFF', background].every(bg => contrastRatio(hex, bg) >= TEXT_MIN_RATIO),
    -1
  );

  return {
    primary,
    primaryHover: toHover(primary),
    secondary,
    secondaryHover,
    accent,
    accentHover: toHover(accent),

    danger: PALETTE_SHARED_COLORS.danger,
    dangerHover: PALETTE_SHARED_COLORS.dangerHover,
    warning: PALETTE_SHARED_COLORS.warning,
    warningHover: PALETTE_SHARED_COLORS.warningHover,

    background,
    surface: '#FFFFFF',
    surfaceHover: background,

    text: {
      primary: textPrimary,
      secondary: textSecondary,
      muted: PALETTE_SHARED_COLORS.muted,
      onSurface: PALETTE_INK,
      onPrimary: PALETTE_INK,
      danger: PALETTE_SHARED_COLORS.textDanger
    },

    border: {
      primary: secondaryHover,
      secondary: PALETTE_SHARED_COLORS.inputBorder,
      accent: textSecondary
    },

    shadow: hexToRgba(primary, 0.3),
    shadowLight: hexToRgba(primary, 0.12)
  };
};

// 保存しておくキーは、配色の4色から作る（並び順や名前を直しても、選んでいたテーマが変わらないように）
const paletteThemeKey = (palette) => `palette-${palette.colors.map(color => color.slice(1)).join('-')}`;

const paletteThemes = Object.fromEntries(PALETTES.map(palette => [
  paletteThemeKey(palette),
  { name: palette.name, sourceColors: palette.colors, colors: buildPaletteColors(palette.colors) }
]));

export const themes = { ...baseThemes, ...paletteThemes };

// テーマ選択の「系統 → 配色」の2段のドロップダウンに使う
export const THEME_GROUPS = [
  { key: 'basic', name: '基本', themeKeys: Object.keys(baseThemes) },
  ...PALETTE_GROUPS.map(group => ({
    key: group.key,
    name: group.name,
    themeKeys: PALETTES.filter(palette => palette.group === group.key).map(paletteThemeKey)
  }))
];

export const DEFAULT_THEME_KEY = 'light';

export const THEME_STORAGE_KEY = 'reference-app-theme';

// v2.1.0 以前のテーマ（27種類）を整理したため、保存済みの旧テーマは近い色のテーマに読み替える
export const LEGACY_THEME_KEYS = {
  lavender: 'light',
  grape: 'light',
  aurora: 'light',
  strawberryMilk: 'pink',
  candy: 'pink',
  sakura: 'pink',
  tulip: 'pink',
  wildrose: 'pink',
  sunset: 'orange',
  coral: 'orange',
  vanilla: 'yellow',
  dandelion: 'yellow',
  lemon: 'yellow',
  mint: 'green',
  lilyOfTheValley: 'green',
  forest: 'green',
  moss: 'green',
  nemophila: 'blue',
  ocean: 'blue',
  sky: 'blue',
  midnight: 'blue',
  milkTea: 'brown',
  cocoa: 'brown'
};
