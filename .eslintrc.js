module.exports = {
  extends: ['@ridi', 'prettier', 'eslint:recommended', 'plugin:react/recommended'],
  parser: '@typescript-eslint/parser',
  globals: {
    window: true,
  },
  env: {
    browser: true,
    jest: true,
  },
  plugins: ['@typescript-eslint', 'import', 'simple-import-sort', 'prettier', 'babel', 'react', 'emotion'],
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: ['./src'],
      },
      webpack: {
        config: './webpack.config.js',
      },
    },
  },
  rules: {
    // reset @ridi
    'arrow-parens': ['error', 'as-needed'],
    'arrow-body-style': ['error', 'as-needed'],
    camelcase: 'off',
    'class-methods-use-this': 'error',
    curly: ['error', 'multi-line', 'consistent'],
    'max-len': ['error', { code: 140 }],
    'no-bitwise': [
      'error',
      {
        allow: ['~'],
      },
    ],
    'no-case-declarations': 'off',
    'no-constant-condition': 'error',
    'no-console': [
      'warn',
      {
        allow: ['error'],
      },
    ],
    'no-param-reassign': [
      'error',
      {
        props: false,
      },
    ],
    'no-plusplus': 'error',
    'no-underscore-dangle': 'off',
    'no-unused-expressions': [
      'error',
      {
        allowShortCircuit: true,
        allowTernary: true,
      },
    ],
    'no-unused-vars': ['error'],
    'nonblock-statement-body-position': [
      'error',
      'below',
      {
        overrides: {
          if: 'beside',
        },
      },
    ],

    // import
    'simple-import-sort/sort': 'error',
    'sort-imports': 'off',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true,
      },
    ],
    'import/prefer-default-export': 'off',

    // babel
    'babel/camelcase': [
      'error',
      {
        properties: 'never',
        ignoreDestructuring: false,
      },
    ],
    'babel/no-invalid-this': 'error',

    // emotion
    'emotion/import-from-emotion': 'error',
    'emotion/no-vanilla': 'error',
    'emotion/styled-import': 'error',

    // jsx-a11y
    'jsx-a11y/anchor-is-valid': 'off',
    'jsx-a11y/mouse-events-have-key-events': 'off',
    'jsx-a11y/no-autofocus': 'off',

    // prettier
    'prettier/prettier': 'error',

    // react
    'react/jsx-filename-extension': [
      'warn',
      {
        extensions: ['.tsx', '.jsx'],
      },
    ],
    'react/jsx-one-expression-per-line': 'off',
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
  },
  overrides: [
    {
      files: 'src/**/*.{js,jsx,ts,tsx}',
      rules: {
        'simple-import-sort/sort': 'off',
        'import/order': [
          'error',
          {
            'newlines-between': 'always',
            groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']],
          },
        ],
      },
    },
  ],
};
