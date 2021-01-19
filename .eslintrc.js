/* eslint-disable filenames/match-regex */
module.exports =  {
  parser:  '@typescript-eslint/parser',  // Specifies the ESLint parser
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },
  extends:  [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'prettier',
  ],
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true,
  },
  plugins: [
    'filenames',
  ],
  rules: {
    '@typescript-eslint/naming-convention': [
      'error',
      {
        'selector': 'interface',
        'format': ['PascalCase'],
        'custom': {
          'regex': '^I[A-Z]',
          'match': true,
        },
      },
    ],
    'import/prefer-default-export': 'off',
    'object-curly-spacing': ['warn', 'always'],
    'no-unused-vars': [
      'warn',
      {
        'vars': 'all',
        'args': 'none',
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        'vars': 'all',
        'args': 'none',
      },
    ],
    '@typescript-eslint/no-explicit-any': [
      'error',
      {
        'ignoreRestArgs': true,
      },
    ],
    'max-len': [
      'warn',
      {
        'code': 120,
        'ignoreStrings': true,
        'ignoreTemplateLiterals': true,
        'ignoreComments': true,
      },
    ],
    quotes: ['error', 'single'],
    semi: ['warn', 'always'],
    'comma-dangle': ['warn', 'always-multiline'],
    'no-undef': 'warn',
    'filenames/match-regex': [2, 
      [
        // '^([a-z][a-z0-9]*)(-[a-z0-9]+)*$',
        '^([a-z][a-z0-9]*)(-[a-z0-9]+|.spec+)*$',
      ],
      true,
    ],
  },
};