module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/airbnb',
    '@vue/typescript/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-plusplus': 'off',
    quotes: 'off',
    'import/prefer-default-export': 'off',
    'vue/multi-word-component-names': 'off',
    'no-restricted-syntax': 'off',
    'vuejs-accessibility/click-events-have-key-events': 'off',
    'vuejs-accessibility/form-control-has-label': 'off',
    'no-param-reassign': 'off',
    'prefer-template': 'off',
    'vuejs-accessibility/media-has-caption': 'off',
    'vuejs-accessibility/label-has-for': 'off',
    'no-trailing-spaces': 'off',
    indent: 'off',
    'no-useless-constructor': 'off',
    'no-underscore-dangle': 'off',
  },
};
