module.exports = {
  extends: ['@ridi', 'prettier', 'eslint:recommended', 'plugin:react/recommended'],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2017,
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true,
    },
  },
  globals: {
    window: true,
  },
  env: {
    browser: true,
    jest: true,
  },
  plugins: ['import', 'prettier', 'babel', 'react', 'emotion'],
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: ['./src'],
      },
      webpack: {
        config: './webpack.common.js',
      },
    },
  },
  rules: {
    // prettier
    'prettier/prettier': 'error',

    // reset @ridi
    camelcase: 'off',
    'class-methods-use-this': 'error',
    'no-constant-condition': 'error',
    'no-plusplus': 'error',
    'babel/camelcase': [
      'error',
      {
        properties: 'never',
        ignoreDestructuring: false,
      },
    ],
    'babel/no-invalid-this': 'error',

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
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true,
      },
    ],
    'no-underscore-dangle': 'off',
    'no-case-declarations': 'off',

    // emotion
    'emotion/jsx-import': 'error',
    'emotion/no-vanilla': 'error',
    'emotion/import-from-emotion': 'error',
    'emotion/styled-import': 'error',

    // jsx
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
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
    'react/jsx-one-expression-per-line': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'jsx-a11y/mouse-events-have-key-events': 'off',
    'jsx-a11y/no-autofocus': 'off',
  },
};
