// アプリのソースは webpack 向けに拡張子を省いて import しているため、テストのときだけ「.js」を補って読めるようにする
import { register } from 'node:module';

register('./resolve-extensionless.mjs', import.meta.url);
