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

export const themes = {
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
