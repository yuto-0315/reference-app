// テーマ定義
// 新しいテーマを追加する場合は、以下の構造に従ってthemesオブジェクトに追加してください。
// 全ての色は統一された構造を保つ必要があります。
// CSS変数として自動的に設定されるため、追加後はすぐに使用可能になります。

export const themes = {
  light: {
    name: 'パープル',
    colors: {
      primary: '#A2AADB',
      primaryHover: '#898AC4',
      secondary: '#C0C9EE',
      secondaryHover: '#A2AADB',
      accent: '#898AC4',
      accentHover: '#7A7BB8',
      danger: '#E6A3A3',
      dangerHover: '#D48989',

      background: '#FFF2E0',
      surface: '#FFFFFF',
      surfaceHover: '#F8F9FA',

      text: {
        primary: '#898AC4',
        secondary: '#A2AADB',
        muted: '#C0C9EE',
        onSurface: '#333333'
      },

      border: {
        primary: '#C0C9EE',
        secondary: '#A2AADB',
        accent: '#898AC4'
      },

      shadow: 'rgba(162, 170, 219, 0.3)',
      shadowLight: 'rgba(162, 170, 219, 0.1)',
    }
  },

  dark: {
    name: 'ダーク',
    colors: {
      primary: '#007ACC',
      primaryHover: '#1177DD',
      secondary: '#3C3C3C',
      secondaryHover: '#4D4D4D',
      accent: '#0E639C',
      accentHover: '#1177DD',
      danger: '#F44747',
      dangerHover: '#FF5555',

      background: '#1E1E1E',
      surface: '#252526',
      surfaceHover: '#2D2D30',

      text: {
        primary: '#CCCCCC',
        secondary: '#C6C6C6',
        muted: '#858585',
        onSurface: '#FFFFFF'
      },

      border: {
        primary: '#3C3C3C',
        secondary: '#007ACC',
        accent: '#0E639C'
      },

      shadow: 'rgba(0, 0, 0, 0.4)',
      shadowLight: 'rgba(0, 0, 0, 0.2)',
    }
  },

  // 追加テーマの例：ピンク系パステル
  pink: {
    name: 'ピンク',
    colors: {
      primary: '#E6A3C4',
      primaryHover: '#D98BB0',
      secondary: '#F2C5E0',
      secondaryHover: '#E6A3C4',
      accent: '#C98BB0',
      accentHover: '#B8739C',
      danger: '#E6A3A3',
      dangerHover: '#D48989',

      background: '#FFF5F9',
      surface: '#FFFFFF',
      surfaceHover: '#F8F9FA',

      text: {
        primary: '#C98BB0',
        secondary: '#E6A3C4',
        muted: '#F2C5E0',
        onSurface: '#333333'
      },

      border: {
        primary: '#F2C5E0',
        secondary: '#E6A3C4',
        accent: '#C98BB0'
      },

      shadow: 'rgba(230, 163, 196, 0.3)',
      shadowLight: 'rgba(230, 163, 196, 0.1)',
    }
  },

  // 追加テーマの例：グリーン系パステル
  green: {
    name: 'グリーン',
    colors: {
      primary: '#A3E6C4',
      primaryHover: '#8BD9B0',
      secondary: '#C5F2E0',
      secondaryHover: '#A3E6C4',
      accent: '#8BC9B0',
      accentHover: '#73B89C',
      danger: '#E6A3A3',
      dangerHover: '#D48989',

      background: '#F5FFF9',
      surface: '#FFFFFF',
      surfaceHover: '#F8F9FA',

      text: {
        primary: '#71a38f',
        secondary: '#99c7b0',
        muted: '#C5F2E0',
        onSurface: '#333333'
      },

      border: {
        primary: '#C5F2E0',
        secondary: '#A3E6C4',
        accent: '#8BC9B0'
      },

      shadow: 'rgba(163, 230, 196, 0.3)',
      shadowLight: 'rgba(163, 230, 196, 0.1)',
    }
  },
  mint: {
    name: 'ミント',
    colors: {
      primary: '#A3E6E0',
      primaryHover: '#8BD9D2',
      secondary: '#C5F2EF',
      secondaryHover: '#A3E6E0',
      accent: '#89CCC5',
      accentHover: '#73B8B0',
      danger: '#E6A3A3',
      dangerHover: '#D48989',

      background: '#F0FFFC',
      surface: '#FFFFFF',
      surfaceHover: '#F8F9FA',

      text: {
        primary: '#73B8B0',
        secondary: '#A3E6E0',
        muted: '#C5F2EF',
        onSurface: '#333333'
      },

      border: {
        primary: '#C5F2EF',
        secondary: '#A3E6E0',
        accent: '#89CCC5'
      },

      shadow: 'rgba(163, 230, 224, 0.3)',
      shadowLight: 'rgba(163, 230, 224, 0.1)',
    }
  },
  strawberryMilk: {
    name: 'いちごミルク',
    colors: {
      primary: '#F5A3B8',
      primaryHover: '#EC8FA8',
      secondary: '#FFD1DC',
      secondaryHover: '#F5A3B8',
      accent: '#EC8FA8',
      accentHover: '#DB7B95',
      danger: '#E6A3A3',
      dangerHover: '#D48989',

      background: '#FFF0F4',
      surface: '#FFFFFF',
      surfaceHover: '#F8F9FA',

      text: {
        primary: '#DB7B95',
        secondary: '#F5A3B8',
        muted: '#FFD1DC',
        onSurface: '#333333'
      },

      border: {
        primary: '#FFD1DC',
        secondary: '#F5A3B8',
        accent: '#EC8FA8'
      },

      shadow: 'rgba(245, 163, 184, 0.3)',
      shadowLight: 'rgba(245, 163, 184, 0.1)',
    }
  },
  candy: {
    name: 'キャンディ',
    colors: {
      primary: '#FBC4F4',
      primaryHover: '#F1AEE9',
      secondary: '#C4FBED',
      secondaryHover: '#AEEDE0',
      accent: '#F9A3DD',
      accentHover: '#E189C4',
      danger: '#E6A3A3',
      dangerHover: '#D48989',

      background: '#FFF7FB',
      surface: '#FFFFFF',
      surfaceHover: '#F8F9FA',

      text: {
        primary: '#D878BB',
        secondary: '#F9A3DD',
        muted: '#FBC4F4',
        onSurface: '#333333'
      },

      border: {
        primary: '#FBC4F4',
        secondary: '#F9A3DD',
        accent: '#E189C4'
      },

      shadow: 'rgba(249, 163, 221, 0.3)',
      shadowLight: 'rgba(249, 163, 221, 0.1)',
    }
  },
  vanilla: {
    name: 'バニラ',
    colors: {
      primary: '#F3E5AB',
      primaryHover: '#E5D99C',
      secondary: '#FFF5CC',
      secondaryHover: '#F3E5AB',
      accent: '#E6D8A3',
      accentHover: '#D4C68F',
      danger: '#E6A3A3',
      dangerHover: '#D48989',

      background: '#FFFCF0',
      surface: '#FFFFFF',
      surfaceHover: '#F8F9FA',

      text: {
        primary: '#C2B37A',
        secondary: '#E6D8A3',
        muted: '#FFF5CC',
        onSurface: '#333333'
      },

      border: {
        primary: '#FFF5CC',
        secondary: '#F3E5AB',
        accent: '#E6D8A3'
      },

      shadow: 'rgba(243, 229, 171, 0.3)',
      shadowLight: 'rgba(243, 229, 171, 0.1)',
    }
  },
  milkTea: {
    name: 'ミルクティー',
    colors: {
      primary: '#D3BFA6',
      primaryHover: '#C2AD94',
      secondary: '#EBDDCB',
      secondaryHover: '#D3BFA6',
      accent: '#BFA188',
      accentHover: '#A88C74',
      danger: '#E6A3A3',
      dangerHover: '#D48989',

      background: '#FDF9F4',
      surface: '#FFFFFF',
      surfaceHover: '#F8F9FA',

      text: {
        primary: '#A88C74',
        secondary: '#D3BFA6',
        muted: '#EBDDCB',
        onSurface: '#333333'
      },

      border: {
        primary: '#EBDDCB',
        secondary: '#D3BFA6',
        accent: '#BFA188'
      },

      shadow: 'rgba(211, 191, 166, 0.3)',
      shadowLight: 'rgba(211, 191, 166, 0.1)',
    }
  },
  sakura: {
    name: 'さくら',
    colors: {
      primary: '#FADCE5',
      primaryHover: '#F2C6D6',
      secondary: '#FFEFF5',
      secondaryHover: '#FADCE5',
      accent: '#EBA9C3',
      accentHover: '#D892B0',
      danger: '#E6A3A3',
      dangerHover: '#D48989',

      background: '#FFF8FB',
      surface: '#FFFFFF',
      surfaceHover: '#F8F9FA',

      text: {
        primary: '#c47899',
        secondary: '#ba97a1',
        muted: '#e3c8d2',
        onSurface: '#333333'
      },

      border: {
        primary: '#FFEFF5',
        secondary: '#FADCE5',
        accent: '#EBA9C3'
      },

      shadow: 'rgba(250, 220, 229, 0.3)',
      shadowLight: 'rgba(250, 220, 229, 0.1)',
    }
  }, dandelion: {
    name: 'たんぽぽ',
    colors: {
      primary: '#F9E29C',
      primaryHover: '#F2D67A',
      secondary: '#FFF4C1',
      secondaryHover: '#F9E29C',
      accent: '#E6C86B',
      accentHover: '#D4B757',
      danger: '#E6A3A3',
      dangerHover: '#D48989',

      background: '#FFFCF3',
      surface: '#FFFFFF',
      surfaceHover: '#F8F9FA',

      text: {
        primary: '#B89A4E',
        secondary: '#E6C86B',
        muted: '#FFF4C1',
        onSurface: '#333333'
      },

      border: {
        primary: '#FFF4C1',
        secondary: '#F9E29C',
        accent: '#E6C86B'
      },

      shadow: 'rgba(249, 226, 156, 0.3)',
      shadowLight: 'rgba(249, 226, 156, 0.1)',
    }
  }, tulip: {
    name: 'チューリップ',
    colors: {
      primary: '#F7A3A3',
      primaryHover: '#E98989',
      secondary: '#FFD4D4',
      secondaryHover: '#F7A3A3',
      accent: '#D47474',
      accentHover: '#C26363',
      danger: '#E6A3A3',
      dangerHover: '#D48989',

      background: '#FFF6F6',
      surface: '#FFFFFF',
      surfaceHover: '#F8F9FA',

      text: {
        primary: '#D47474',
        secondary: '#F7A3A3',
        muted: '#FFD4D4',
        onSurface: '#333333'
      },

      border: {
        primary: '#FFD4D4',
        secondary: '#F7A3A3',
        accent: '#D47474'
      },

      shadow: 'rgba(247, 163, 163, 0.3)',
      shadowLight: 'rgba(247, 163, 163, 0.1)',
    }
  },
  lavender: {
    name: 'ラベンダー',
    colors: {
      primary: '#CDA4DE',
      primaryHover: '#B48CCF',
      secondary: '#EBDDF2',
      secondaryHover: '#CDA4DE',
      accent: '#A27EBE',
      accentHover: '#8E6EAA',
      danger: '#E6A3A3',
      dangerHover: '#D48989',

      background: '#FBF7FD',
      surface: '#FFFFFF',
      surfaceHover: '#F8F9FA',

      text: {
        primary: '#8E6EAA',
        secondary: '#CDA4DE',
        muted: '#EBDDF2',
        onSurface: '#333333'
      },

      border: {
        primary: '#EBDDF2',
        secondary: '#CDA4DE',
        accent: '#A27EBE'
      },

      shadow: 'rgba(205, 164, 222, 0.3)',
      shadowLight: 'rgba(205, 164, 222, 0.1)',
    }
  },
  lilyOfTheValley: {
    name: 'すずらん',
    colors: {
      primary: '#CFEAD9',
      primaryHover: '#B6DCC5',
      secondary: '#EAF7EF',
      secondaryHover: '#CFEAD9',
      accent: '#9FCBB0',
      accentHover: '#8AB99D',
      danger: '#E6A3A3',
      dangerHover: '#D48989',

      background: '#F9FFFB',
      surface: '#FFFFFF',
      surfaceHover: '#F8F9FA',

      text: {
        primary: '#8AB99D',
        secondary: '#CFEAD9',
        muted: '#EAF7EF',
        onSurface: '#333333'
      },

      border: {
        primary: '#EAF7EF',
        secondary: '#CFEAD9',
        accent: '#9FCBB0'
      },

      shadow: 'rgba(207, 234, 217, 0.3)',
      shadowLight: 'rgba(207, 234, 217, 0.1)',
    }
  },
  nemophila: {
    name: 'ネモフィラ',
    colors: {
      primary: '#A3C9E6',           // ネモフィラの明るいブルー
      primaryHover: '#8BB8DB',
      secondary: '#D0E7F9',         // 空のような透明感ある水色
      secondaryHover: '#A3C9E6',
      accent: '#6FA8DC',            // やや鮮やかなアクセントブルー
      accentHover: '#5C97C9',
      danger: '#E6A3A3',
      dangerHover: '#D48989',

      background: '#F4FBFF',        // 優しい空色背景
      surface: '#FFFFFF',
      surfaceHover: '#F0F4F8',

      text: {
        primary: '#5C97C9',         // 落ち着いたブルー
        secondary: '#A3C9E6',
        muted: '#D0E7F9',
        onSurface: '#333333'
      },

      border: {
        primary: '#D0E7F9',
        secondary: '#A3C9E6',
        accent: '#6FA8DC'
      },

      shadow: 'rgba(163, 201, 230, 0.3)',
      shadowLight: 'rgba(163, 201, 230, 0.1)',
    }
  },
  wildrose: {
    name: 'ワイルドローズ',
    colors: {
      primary: '#DA6C6C',           // 鮮やかでややくすんだ赤
      primaryHover: '#CD5656',      // 深みのある赤
      secondary: '#EAEBD0',         // 優しいアイボリー
      secondaryHover: '#DA6C6C',    // 少し主張のある赤に変化
      accent: '#AF3E3E',            // アクセントに濃い赤茶
      accentHover: '#993333',       // さらに強調した深赤
      danger: '#CD5656',
      dangerHover: '#AF3E3E',

      background: '#FFF9F5',        // ややピンクがかった白背景
      surface: '#FFFFFF',
      surfaceHover: '#F8F9FA',

      text: {
        primary: '#AF3E3E',         // 強い赤茶で見やすく
        secondary: '#DA6C6C',
        muted: '#EAEBD0',
        onSurface: '#333333'
      },

      border: {
        primary: '#EAEBD0',
        secondary: '#DA6C6C',
        accent: '#AF3E3E'
      },

      shadow: 'rgba(218, 108, 108, 0.3)',
      shadowLight: 'rgba(218, 108, 108, 0.1)',
    }
  },
  ocean: {
    name: 'オーシャン',
    colors: {
      primary: '#48A6A7',            // ターコイズブルー
      primaryHover: '#2F8F90',       // 深めのターコイズ
      secondary: '#9ACBD0',          // 優しい水色
      secondaryHover: '#48A6A7',
      accent: '#006A71',             // 深海のような濃い青緑
      accentHover: '#00535A',
      danger: '#DA6C6C',
      dangerHover: '#CD5656',

      background: '#F2EFE7',         // 砂浜のようなベージュ
      surface: '#FFFFFF',
      surfaceHover: '#F0F4F4',

      text: {
        primary: '#006A71',
        secondary: '#48A6A7',
        muted: '#9ACBD0',
        onSurface: '#333333'
      },

      border: {
        primary: '#9ACBD0',
        secondary: '#48A6A7',
        accent: '#006A71'
      },

      shadow: 'rgba(72, 166, 167, 0.3)',
      shadowLight: 'rgba(72, 166, 167, 0.1)',
    }
  }
};

export const THEME_STORAGE_KEY = 'reference-app-theme';

/*
新しいテーマの追加方法:

1. themes オブジェクトに新しいテーマを追加
   - key: テーマの識別子（英数字、例：'ocean', 'sunset'）
   - name: 表示名（日本語可、例：'オーシャン'）
   
2. colors オブジェクト内で必要な色を定義
   必須色：
   - primary, primaryHover: メインカラー
   - secondary, secondaryHover: セカンダリカラー
   - accent, accentHover: アクセントカラー
   - danger, dangerHover: 危険・削除系
   - background: アプリ背景色
   - surface, surfaceHover: カード・フォーム背景色
   - text.primary, text.secondary, text.muted, text.onSurface: テキスト色
   - border.primary, border.secondary, border.accent: ボーダー色
   - shadow, shadowLight: 影の色

3. 例：
   themes.ocean = {
     name: 'オーシャン',
     colors: {
       primary: '#3B82F6',
       primaryHover: '#2563EB',
       // ... 他の色を定義
     }
   };

追加後は自動的にテーマ選択に表示され、すぐに使用可能になります。
*/
