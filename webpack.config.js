const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.ts', // Entry point updated to TypeScript file
  output: {
    path: path.resolve(__dirname, 'www'),
    filename: 'bundle.js',
    publicPath: '',
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/, // Include TypeScript files
        exclude: /node_modules/,
        use: 'ts-loader', // Use ts-loader for TypeScript
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: { browsers: ['last 2 versions'] } }],
              '@babel/preset-react', // No need to specify runtime for React 17+
            ],
          },
        },
      },
      {
        test: /\.css$/, // Include CSS files
        use: [
          'style-loader', // Inject styles into the DOM
          'css-loader',   // Resolve CSS imports
          'postcss-loader' // Process CSS with PostCSS (includes Tailwind)
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/, // Handling image files
        type: 'asset/resource', // Use Webpack's asset module to handle images
        generator: {
          filename: 'assets/images/[name][ext][query]',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'], // Add .ts and .tsx extensions
    alias: {
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      React: 'react',
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      filename: 'index.html',
      inject: 'body',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'platforms/browser/www/cordova.js',
          to: 'cordova.js',
        },
        {
          from: 'platforms/browser/www/cordova_plugins.js',
          to: 'cordova_plugins.js',
        },
        {
          from: 'plugins',
          to: 'plugins',
        },
      ],
    }),
  ],
};
