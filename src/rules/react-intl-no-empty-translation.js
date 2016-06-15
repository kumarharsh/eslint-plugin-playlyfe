/**
 * @fileoverview find empty translation in file
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

  //--------------------------------------------------------------------------
  // Public
  //--------------------------------------------------------------------------
  return {
    Property(node) {
      const value = node.value.value;
      if (!value.trim()) {
        context.report({
          node: node.value,
          message: 'missing translation',
        });
      }
    },
  };
};
