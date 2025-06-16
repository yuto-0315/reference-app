// テーマ定義
// 新しいテーマを追加する場合は、以下の構造に従ってthemesオブジェクトに追加してください。
// 全ての色は統一された構造を保つ必要があります。
// CSS変数として自動的に設定されるため、追加後はすぐに使用可能になります。

export const themes = {
  light: {
    name: 'パープルモード',
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
    name: 'ダークモード',
    colors: {
      primary: '#6B73A8',
      primaryHover: '#7A82B6',
      secondary: '#4A5578',
      secondaryHover: '#5A6588',
      accent: '#8B8EC7',
      accentHover: '#9B9ED7',
      danger: '#C67878',
      dangerHover: '#D68888',
      
      background: '#1A1B2E',
      surface: '#16213E',
      surfaceHover: '#0F3460',
      
      text: {
        primary: '#E8EAFF',
        secondary: '#C0C9EE',
        muted: '#8B92C7',
        onSurface: '#FFFFFF'
      },
      
      border: {
        primary: '#4A5578',
        secondary: '#6B73A8',
        accent: '#8B8EC7'
      },
      
      shadow: 'rgba(0, 0, 0, 0.4)',
      shadowLight: 'rgba(0, 0, 0, 0.2)',
    }
  },
  
  // 追加テーマの例：ピンク系パステル
  pink: {
    name: 'ピンクモード',
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
    name: 'グリーンモード',
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
        primary: '#8BC9B0',
        secondary: '#A3E6C4',
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
  }
};

export const THEME_STORAGE_KEY = 'reference-app-theme';

/*
新しいテーマの追加方法:

1. themes オブジェクトに新しいテーマを追加
   - key: テーマの識別子（英数字、例：'ocean', 'sunset'）
   - name: 表示名（日本語可、例：'オーシャンモード'）
   
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
     name: 'オーシャンモード',
     colors: {
       primary: '#3B82F6',
       primaryHover: '#2563EB',
       // ... 他の色を定義
     }
   };

追加後は自動的にテーマ選択に表示され、すぐに使用可能になります。
*/
