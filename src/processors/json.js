module.exports = {
  preprocess(text) {
    const json = `const json = ${text};\n`;
    return [json];
  },

  postprocess(messages) {
    const ignoreRuleIDs = {
      quotes: true,
      'comma-dangle': true,
      'quote-props': true,
      'no-unused-vars': true,
    };
    const errors = messages[0];
    const validErrors = errors.filter((error) => {
      return !ignoreRuleIDs[error.ruleId];
    });
    return validErrors;
  },
};
