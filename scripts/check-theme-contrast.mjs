// テーマの配色が WCAG 2.1 AA のコントラスト基準を満たしているかを確かめる
// 使い方: node scripts/check-theme-contrast.mjs
// テーマを追加・変更したら実行し、すべて「OK」になることを確認する
import { readFileSync } from 'node:fs';

// themes.js は ES Modules 形式で、package.json に "type": "module" がないため、
// Node のバージョンに左右されないよう、ソースを読み込んで data URL から import する
const themesSource = readFileSync(new URL('../src/utils/themes.js', import.meta.url), 'utf8');
const { themes } = await import(`data:text/javascript,${encodeURIComponent(themesSource)}`);

const TEXT_MIN_RATIO = 4.5; // 通常サイズの文字（WCAG 1.4.3）
const UI_MIN_RATIO = 3; // 入力欄の枠線など、操作部品の見分けに必要な線（WCAG 1.4.11）

// [前景の色, 重なる背景の色, 必要な比, 画面での使われ方]
// CSS でその組み合わせが実際に使われている箇所に合わせて定義している
const COLOR_PAIRS = [
  ['text.onSurface', ['background', 'surface', 'surfaceHover', 'secondary', 'secondaryHover', 'primary'], TEXT_MIN_RATIO, '本文・ヘッダーの文字'],
  ['text.primary', ['background', 'surface', 'surfaceHover', 'secondary', 'secondaryHover'], TEXT_MIN_RATIO, '見出し・ラベル・サブボタンの文字、フォーカス枠'],
  ['text.secondary', ['background', 'surface', 'surfaceHover'], TEXT_MIN_RATIO, '補足の文字'],
  ['text.muted', ['background', 'surface', 'surfaceHover'], TEXT_MIN_RATIO, '読み仮名・日付などの控えめな文字'],
  ['text.danger', ['background', 'surface', 'surfaceHover'], TEXT_MIN_RATIO, 'エラー・必須マーク'],
  ['text.onPrimary', ['primary', 'primaryHover', 'accent', 'accentHover', 'danger', 'dangerHover', 'warning', 'warningHover'], TEXT_MIN_RATIO, '塗りつぶしボタンの文字'],
  ['border.secondary', ['surface', 'surfaceHover'], UI_MIN_RATIO, '入力欄の枠線'],
];

const REQUIRED_TOKENS = [
  'primary', 'primaryHover', 'secondary', 'secondaryHover', 'accent', 'accentHover',
  'danger', 'dangerHover', 'warning', 'warningHover', 'background', 'surface', 'surfaceHover',
  'text.primary', 'text.secondary', 'text.muted', 'text.onSurface', 'text.onPrimary', 'text.danger',
  'border.primary', 'border.secondary', 'border.accent', 'shadow', 'shadowLight',
];

const getToken = (colors, path) => path.split('.').reduce((value, key) => value?.[key], colors);

// WCAG 2.1 の相対輝度
const relativeLuminance = (hex) => {
  const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map(channel => (channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrastRatio = (hexA, hexB) => {
  const [lighter, darker] = [relativeLuminance(hexA), relativeLuminance(hexB)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
};

const isHexColor = (value) => /^#[0-9a-fA-F]{6}$/.test(value);

let failureCount = 0;
for (const [themeKey, theme] of Object.entries(themes)) {
  const failures = [];

  REQUIRED_TOKENS.filter(token => getToken(theme.colors, token) === undefined)
    .forEach(token => failures.push(`  未定義: ${token}`));

  for (const [foreground, backgrounds, minRatio, usage] of COLOR_PAIRS) {
    for (const background of backgrounds) {
      const fgColor = getToken(theme.colors, foreground);
      const bgColor = getToken(theme.colors, background);
      if (!isHexColor(fgColor) || !isHexColor(bgColor)) {
        failures.push(`  ${foreground} / ${background}: 6桁の16進数で指定してください`);
        continue;
      }
      const ratio = contrastRatio(fgColor, bgColor);
      if (ratio < minRatio) {
        failures.push(`  ${foreground} ${fgColor} / ${background} ${bgColor}: ${ratio.toFixed(2)} < ${minRatio}（${usage}）`);
      }
    }
  }

  failureCount += failures.length;
  console.log(`${failures.length === 0 ? 'OK ' : 'NG '} ${themeKey}（${theme.name}）`);
  failures.forEach(line => console.log(line));
}

if (failureCount > 0) {
  console.log(`\n基準を満たさない組み合わせが ${failureCount} 件あります`);
  process.exit(1);
}
console.log('\nすべてのテーマが基準を満たしています');
