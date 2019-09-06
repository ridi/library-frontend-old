module.exports = {
  extends: ['@ridi', 'prettier'],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2017,
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
    },
  },
  globals: {
    window: true,
  },
  env: {
    browser: true,
    jest: true,
  },
  plugins: ['import', 'prettier', 'react'],
  settings: {
    'import/resolver': {
      webpack: {
        config: 'webpack.common.js',
      },
    },
  },
  rules: {
    // prettier
    'prettier/prettier': 'error',

    // reset @ridi
    'class-methods-use-this': 'error',
    'no-constant-condition': 'error',
    'no-plusplus': 'error',

    // account-team rules
    'max-len': ['error', { code: 140 }],

    // store rules
    'no-unused-expressions': [
      'error',
      {
        allowShortCircuit: true,
        allowTernary: true,
      },
    ],
    'no-unused-vars': ['error'],
    'no-param-reassign': [
      'error',
      {
        props: false,
      },
    ],
    'no-bitwise': [
      'error',
      {
        allow: ['~'],
      },
    ],
    'no-console': [
      'warn',
      {
        allow: ['error'],
      },
    ],
    'arrow-parens': ['error', 'as-needed'],
    'arrow-body-style': ['error', 'as-needed'],
    curly: ['error', 'multi-line', 'consistent'],
    'nonblock-statement-body-position': [
      'error',
      'below',
      {
        overrides: {
          if: 'beside',
        },
      },
    ],

    // account team rules
    'import/prefer-default-export': 'off',
    'no-underscore-dangle': 'off',
    'no-case-declarations': 'off',

    // jsx
    'react/no-unknown-property': [
      'warn',
      {
        ignore: ['class'],
      },
    ],
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': [
      'warn',
      {
        extensions: ['.js', '.jsx'],
      },
    ],
    'react/jsx-one-expression-per-line': 'allow',
    'jsx-a11y/anchor-is-valid': 'off',
    'jsx-a11y/mouse-events-have-key-events': 'off',
    'jsx-a11y/no-autofocus': 'off',
  },
};
