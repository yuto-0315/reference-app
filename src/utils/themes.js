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
  },
    sunset: {
    name: 'サンセット',
    colors: {
      primary: '#FF9966',
      primaryHover: '#FF7F4D',
      secondary: '#FFD1A9',
      secondaryHover: '#FF9966',
      accent: '#CC5A2F',
      accentHover: '#B34726',
      danger: '#E57373',
      dangerHover: '#D32F2F',

      background: '#FFF5F0',
      surface: '#FFFFFF',
      surfaceHover: '#F8F9FA',

      text: {
        primary: '#B34726',
        secondary: '#FF9966',
        muted: '#FFD1A9',
        onSurface: '#333333'
      },

      border: {
        primary: '#FFD1A9',
        secondary: '#FF9966',
        accent: '#CC5A2F'
      },

      shadow: 'rgba(255, 153, 102, 0.3)',
      shadowLight: 'rgba(255, 153, 102, 0.1)',
    }
  },

  forest: {
    name: 'フォレスト',
    colors: {
      primary: '#4CAF50',
      primaryHover: '#43A047',
      secondary: '#A5D6A7',
      secondaryHover: '#81C784',
      accent: '#2E7D32',
      accentHover: '#1B5E20',
      danger: '#E57373',
      dangerHover: '#D32F2F',

      background: '#F1F8F6',
      surface: '#FFFFFF',
      surfaceHover: '#F8F9FA',

      text: {
        primary: '#2E7D32',
        secondary: '#4CAF50',
        muted: '#A5D6A7',
        onSurface: '#333333'
      },

      border: {
        primary: '#A5D6A7',
        secondary: '#81C784',
        accent: '#2E7D32'
      },

      shadow: 'rgba(76, 175, 80, 0.3)',
      shadowLight: 'rgba(76, 175, 80, 0.1)',
    }
  },

  midnight: {
    name: 'ミッドナイト',
    colors: {
      primary: '#37474F',
      primaryHover: '#263238',
      secondary: '#90A4AE',
      secondaryHover: '#607D8B',
      accent: '#455A64',
      accentHover: '#37474F',
      danger: '#EF5350',
      dangerHover: '#C62828',

      background: '#ECEFF1',
      surface: '#FFFFFF',
      surfaceHover: '#F5F5F5',

      text: {
        primary: '#263238',
        secondary: '#455A64',
        muted: '#90A4AE',
        onSurface: '#333333'
      },

      border: {
        primary: '#B0BEC5',
        secondary: '#90A4AE',
        accent: '#455A64'
      },

      shadow: 'rgba(55, 71, 79, 0.3)',
      shadowLight: 'rgba(55, 71, 79, 0.1)',
    }
  },

  coral: {
    name: 'コーラル',
    colors: {
      primary: '#FF6F61',
      primaryHover: '#E85C50',
      secondary: '#FFD5D0',
      secondaryHover: '#FF6F61',
      accent: '#D94F3C',
      accentHover: '#C13C2E',
      danger: '#E57373',
      dangerHover: '#D32F2F',

      background: '#FFF6F5',
      surface: '#FFFFFF',
      surfaceHover: '#F8F9FA',

      text: {
        primary: '#C13C2E',
        secondary: '#FF6F61',
        muted: '#FFD5D0',
        onSurface: '#333333'
      },

      border: {
        primary: '#FFD5D0',
        secondary: '#FF6F61',
        accent: '#D94F3C'
      },

      shadow: 'rgba(255, 111, 97, 0.3)',
      shadowLight: 'rgba(255, 111, 97, 0.1)',
    }
  },

  grape: {
    name: 'グレープ',
    colors: {
      primary: '#8E44AD',
      primaryHover: '#732D91',
      secondary: '#D7BDE2',
      secondaryHover: '#A569BD',
      accent: '#6C3483',
      accentHover: '#512E5F',
      danger: '#E57373',
      dangerHover: '#D32F2F',

      background: '#F9F3FB',
      surface: '#FFFFFF',
      surfaceHover: '#F8F9FA',

      text: {
        primary: '#6C3483',
        secondary: '#8E44AD',
        muted: '#D7BDE2',
        onSurface: '#333333'
      },

      border: {
        primary: '#D7BDE2',
        secondary: '#A569BD',
        accent: '#6C3483'
      },

      shadow: 'rgba(142, 68, 173, 0.3)',
      shadowLight: 'rgba(142, 68, 173, 0.1)',
    }
  },

  lemon: {
    name: 'レモン',
    colors: {
      primary: '#FFEB3B',
      primaryHover: '#FDD835',
      secondary: '#FFF9C4',
      secondaryHover: '#FFEB3B',
      accent: '#FBC02D',
      accentHover: '#F57F17',
      danger: '#E57373',
      dangerHover: '#D32F2F',

      background: '#FFFEF0',
      surface: '#FFFFFF',
      surfaceHover: '#F8F9FA',

      text: {
        primary: '#F57F17',
        secondary: '#FFEB3B',
        muted: '#FFF9C4',
        onSurface: '#333333'
      },

      border: {
        primary: '#FFF9C4',
        secondary: '#FFEB3B',
        accent: '#FBC02D'
      },

      shadow: 'rgba(255, 235, 59, 0.3)',
      shadowLight: 'rgba(255, 235, 59, 0.1)',
    }
  },

  sky: {
    name: 'スカイ',
    colors: {
      primary: '#03A9F4',
      primaryHover: '#0288D1',
      secondary: '#B3E5FC',
      secondaryHover: '#81D4FA',
      accent: '#0277BD',
      accentHover: '#01579B',
      danger: '#E57373',
      dangerHover: '#D32F2F',

      background: '#F0FBFF',
      surface: '#FFFFFF',
      surfaceHover: '#F8F9FA',

      text: {
        primary: '#0277BD',
        secondary: '#03A9F4',
        muted: '#B3E5FC',
        onSurface: '#333333'
      },

      border: {
        primary: '#B3E5FC',
        secondary: '#81D4FA',
        accent: '#0277BD'
      },

      shadow: 'rgba(3, 169, 244, 0.3)',
      shadowLight: 'rgba(3, 169, 244, 0.1)',
    }
  },

  cocoa: {
    name: 'ココア',
    colors: {
      primary: '#6D4C41',
      primaryHover: '#5D4037',
      secondary: '#D7CCC8',
      secondaryHover: '#BCAAA4',
      accent: '#4E342E',
      accentHover: '#3E2723',
      danger: '#E57373',
      dangerHover: '#D32F2F',

      background: '#F8F6F4',
      surface: '#FFFFFF',
      surfaceHover: '#F8F9FA',

      text: {
        primary: '#3E2723',
        secondary: '#6D4C41',
        muted: '#D7CCC8',
        onSurface: '#333333'
      },

      border: {
        primary: '#D7CCC8',
        secondary: '#BCAAA4',
        accent: '#4E342E'
      },

      shadow: 'rgba(109, 76, 65, 0.3)',
      shadowLight: 'rgba(109, 76, 65, 0.1)',
    }
  },

  moss: {
    name: 'モス',
    colors: {
      primary: '#8C9A6D',
      primaryHover: '#7A875C',
      secondary: '#DCE1C5',
      secondaryHover: '#BFC7A5',
      accent: '#6B7751',
      accentHover: '#55613E',
      danger: '#E57373',
      dangerHover: '#D32F2F',

      background: '#FAFBF7',
      surface: '#FFFFFF',
      surfaceHover: '#F8F9FA',

      text: {
        primary: '#55613E',
        secondary: '#8C9A6D',
        muted: '#DCE1C5',
        onSurface: '#333333'
      },

      border: {
        primary: '#DCE1C5',
        secondary: '#BFC7A5',
        accent: '#6B7751'
      },

      shadow: 'rgba(140, 154, 109, 0.3)',
      shadowLight: 'rgba(140, 154, 109, 0.1)',
    }
  },

  aurora: {
    name: 'オーロラ',
    colors: {
      primary: '#7E57C2',
      primaryHover: '#673AB7',
      secondary: '#B39DDB',
      secondaryHover: '#9575CD',
      accent: '#4A148C',
      accentHover: '#311B92',
      danger: '#E57373',
      dangerHover: '#D32F2F',

      background: '#F7F5FF',
      surface: '#FFFFFF',
      surfaceHover: '#F8F9FA',

      text: {
        primary: '#4A148C',
        secondary: '#7E57C2',
        muted: '#B39DDB',
        onSurface: '#333333'
      },

      border: {
        primary: '#B39DDB',
        secondary: '#9575CD',
        accent: '#4A148C'
      },

      shadow: 'rgba(126, 87, 194, 0.3)',
      shadowLight: 'rgba(126, 87, 194, 0.1)',
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
