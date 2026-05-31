const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      const postcssLoader = {
        loader: require.resolve('postcss-loader'),
        options: {
          postcssOptions: {
            ident: 'postcss',
            plugins: [
              require('@tailwindcss/postcss'),
              require('postcss-flexbugs-fixes'),
              [
                require('postcss-preset-env'),
                {
                  autoprefixer: { flexbox: 'no-2009' },
                  stage: 3,
                },
              ],
            ],
          },
          sourceMap: false,
        },
      };

      const oneOfRules = webpackConfig.module.rules.find((r) => r.oneOf);
      if (oneOfRules) {
        oneOfRules.oneOf.forEach((rule) => {
          if (rule.use && Array.isArray(rule.use)) {
            const idx = rule.use.findIndex(
              (u) => u.loader && u.loader.includes('postcss-loader')
            );
            if (idx !== -1) {
              rule.use[idx] = postcssLoader;
            }
          }
        });
      }

      return webpackConfig;
    },
  },
};
