/**
 * @fileoverview check dependencies in package.json are exact
 * * @author Mayank Agarwal
 */
//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = (context) => {
  // // any helper functions should go here or else delete this section
  function isExact(value) {
    // NOTE: regexp handles only cases where version starts with ^|~
    const regexp = /^[\^~]/;
    return !regexp.test(value);
  }

  function isPackageJSONFile(filePath) {
    if (filePath === '<input>') { return true; } // filePath is <input> in test
    return filePath.endsWith('package.json');
  }

  if (!isPackageJSONFile(context.getFilename())) {
    return {};
  }

  // //--------------------------------------------------------------------------
  // // Public
  // //--------------------------------------------------------------------------
  return {
    Property(node) {
      if (node.key.value !== 'dependencies') { return; }

      const dependencies = node.value.properties;
      dependencies.forEach((depsNode) => {
        if (!isExact(depsNode.value.value)) {
          context.report({
            node: depsNode.value,
            message: 'use-exact-dependency',
          });
        }
      });
    },
  };
};
