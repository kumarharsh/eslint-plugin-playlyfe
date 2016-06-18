/**
 * @fileoverview find keys in i18n files which are not in code
 * @author Mayank Agarwal
 */
//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
import isLocaleFile from '../utils/isLocaleFile';

module.exports = (context) => {
  //--------------------------------------------------------------------------
  // Helpers
  //--------------------------------------------------------------------------
  if (!isLocaleFile(context.getFilename())) {
    return {};
  }

  const { reactIntlFilePath } = context.options[0] || {};
  let reactIntlJson;
  const fileStartLoc = {line: 1, column: 0};

  if (!reactIntlFilePath) { // report if reactIntl missing
    context.report({loc: fileStartLoc, message: 'Missing reactIntlFilePath option.'});
    return {};
  }

  try {
    reactIntlJson = require(reactIntlFilePath); // maybe file path wrong
  } catch (error) {
    context.report({loc: fileStartLoc, message: error.message});
    return {};
  }

  function getKeyText(keyNode) {
    if (keyNode.type === 'Literal') { // key of form { "a": 5, 'b': 5 }
      return keyNode.value;
    }

    if (keyNode.type === 'Identifier') { // key of form key eg { a: 5 }
      return keyNode.name;
    }

    context.report({
      node: keyNode,
      message: 'Unsupported keyType',
    });

    return null;
  }

  //--------------------------------------------------------------------------
  // Public
  //--------------------------------------------------------------------------
  return {
    Property(node) {
      const id = getKeyText(node.key);
      if (id && !reactIntlJson[id]) {
        context.report({
          node: node.key,
          message: `id '${id}' not present in reactIntlJson`,
        });
      }
    },
  };
};
