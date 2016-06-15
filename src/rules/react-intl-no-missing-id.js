/**
 * @fileoverview find keys in code which are not in translated file [fixable rule]
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

  const presentIds = {};
  const sourceCode = context.getSourceCode();

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
    ObjectExpression(node) {
      node.properties.forEach((propertyNode) => {
        const keyText = getKeyText(propertyNode.key);
        if (keyText) {
          presentIds[getKeyText(propertyNode.key)] = true;
        }
      });

      const missingIds = Object.keys(reactIntlJson).filter((id) => !presentIds[id]);

      if (missingIds.length > 0) {
        context.report({
          node,
          message: `${missingIds.length} ids missing`,
          fix(fixer) {
            const n = '\n'; // newLine
            const t = '  '; // tabSpace
            const missingIdsString = (
              missingIds
                .map((id) => {
                  return `${t}'${id}': ' ',`;
                })
                .join(n)
            );

            const startBracketToken = sourceCode.getTokenByRangeStart(node.range[0]);
            return fixer.insertTextAfter(startBracketToken, `${n}${n}${missingIdsString}${n}`);
          },
        });
      }
    },
  };
};
