# eslint-plugin-playlyfe

[![Travis](https://img.shields.io/travis/Mayank1791989/eslint-plugin-playlyfe.svg?style=flat-square)](https://travis-ci.org/Mayank1791989/eslint-plugin-playlyfe)
[![AppVeyor](https://img.shields.io/appveyor/ci/Mayank1791989/eslint-plugin-playlyfe.svg?style=flat-square)](https://ci.appveyor.com/project/Mayank1791989/eslint-plugin-playlyfe)
[![Codecov](https://img.shields.io/codecov/c/github/Mayank1791989/eslint-plugin-playlyfe.svg?style=flat-square)](https://codecov.io/gh/Mayank1791989/eslint-plugin-playlyfe)
[![npm](https://img.shields.io/npm/v/eslint-plugin-playlyfe.svg?style=flat-square)](https://www.npmjs.com/package/eslint-plugin-playlyfe)
[![npm](https://img.shields.io/npm/dt/eslint-plugin-playlyfe.svg?style=flat-square)](https://www.npmjs.com/package/eslint-plugin-playlyfe)
[![David](https://img.shields.io/david/mayank1791989/eslint-plugin-playlyfe.svg?style=flat-square)](https://david-dm.org/Mayank1791989/eslint-plugin-playlyfe)
[![David](https://img.shields.io/david/dev/Mayank1791989/eslint-plugin-playlyfe.svg?style=flat-square)](https://david-dm.org/Mayank1791989/eslint-plugin-playlyfe#info=devDependencies)

## Rules

The following rules are provided:

### react-intl

1. `react-intl-no-empty-translation`: find empty translations in the generated i18n file
2. `react-intl-no-missing-id`: find keys in code which are not in translated file [autofix available]
3. `react-intl-no-undef-id`: find keys in i18n files which are not in code.
4. `react-intl-no-untranslated-string`: find strings in source code which should translated, but are not.

### React
1. `react-style-no-numeric-string-value`: Rule to enforce https://github.com/facebook/react/issues/1357.

### Relay
1. `relay-no-missing-variable-in-props`: find relay variables which are not in props.

### Misc
1. `use-exact-dependency`: check dependencies in package.json are exact.
