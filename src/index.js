module.exports = {
  rules: {
    'react-intl-no-undef-id': require('./rules/react-intl-no-undef-id'),
    'react-intl-no-missing-id': require('./rules/react-intl-no-missing-id'),
    'react-intl-no-empty-translation': require('./rules/react-intl-no-empty-translation'),
    'react-intl-no-untranslated-string': require('./rules/react-intl-no-untranslated-string'),

    'react-style-no-numeric-string-value': require('./rules/react-style-no-numeric-string-value'),

    'use-exact-dependency': require('./rules/use-exact-dependency'),

    'relay-no-missing-variable-in-props': require('./rules/relay-no-missing-variable-in-props'),
  },

  // add your processors here
  processors: {
    '.json': require('./processors/json'),
  },
};
