const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 公開版のページが読み込んでよい場所を、このアプリと書誌情報を取りに行く3つのサービスに限る。
// 読み込んだデータなどに紛れ込んだスクリプトが、外へ情報を送ったり別のスクリプトを読み込んだりできないようにする。
// （style-loader が <style> を差し込み、React が style 属性を使うため、スタイルだけはインラインを許す）
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "connect-src 'self' https://ndlsearch.ndl.go.jp https://cir.nii.ac.jp https://id.ndl.go.jp",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
].join('; ');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'build'),
      // 更新したときに、ブラウザに残った古いファイルが使われないよう、内容が変わると名前も変わるようにする
      filename: isProduction ? '[name].[contenthash:8].js' : '[name].js',
      chunkFilename: isProduction ? '[name].[contenthash:8].js' : '[name].js',
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
            },
          },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: 'asset/resource',
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
        // 開発サーバーは eval を使うため、制限は公開版にだけかける
        meta: isProduction
          ? { 'Content-Security-Policy': { 'http-equiv': 'Content-Security-Policy', content: CONTENT_SECURITY_POLICY } }
          : {},
      }),
    ],
    devServer: {
      static: path.join(__dirname, 'build'),
      port: 3000,
      open: true,
      hot: true,
    },
    resolve: {
      extensions: ['.js', '.jsx'],
    },
  };
};
