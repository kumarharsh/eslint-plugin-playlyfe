/**
 * @fileoverview find relay variables which are not in props
 * @author Mayank Agarwal
 */
//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
import Components from 'eslint-plugin-react/lib/util/Components';
import Traverser from 'eslint/lib/util/traverser';

module.exports = Components.detect((context, components, utils) => {
  // any helper functions should go here or else delete this section
  const sourceCode = context.getSourceCode();

  function storeJSXElementAttrs(node) {
    if (node.type !== 'JSXOpeningElement') { return; }

    const component = components.get(utils.getParentComponent());
    const jsxElements = (component && component.jsxElements) || [];

    // jsxElements
    jsxElements.push({
      name: sourceCode.getText(node.name),
      node,
    });

    components.set(node, { jsxElements });
  }

  function isRelayQL(node) {
    if (node.type !== 'TaggedTemplateExpression') { return false; }
    if (sourceCode.getText(node.tag) !== 'Relay.QL') { return false; }
    return true;
  }

  // relay createContainer callExpression node
  // createContainer(component, spec);
  function getComponentWiseVariablesMapping(relayCreateContainerNode) {
    if (relayCreateContainerNode.type !== 'CallExpression') { throw new Error('node should be of type CallExpression'); }

    const traverser = new Traverser();
    const variablesMapping = {};

    // find all Relay.QL fragments and find variables mapping
    traverser.traverse(relayCreateContainerNode, {
      enter(node) {
        if (!isRelayQL(node)) { return; }
        const relayQLTemplateStringNode = node;
        relayQLTemplateStringNode.quasi.expressions.forEach((expression) => {
          if (expression.type !== 'CallExpression') { return; } // there can be inline fragments
          // if not variables passed
          if (expression.arguments.length !== 2) { return; }

          // jsxElementName.getFragment('xyz', { var1, var2, var3 })
          const jsxElementName = sourceCode.getText(expression.callee.object); // return jsxElementName
          const variables = expression.arguments[1].properties.map((p) => p.key.name);
          variablesMapping[jsxElementName] = variables; // eslint-disable-line no-param-reassign
        });
      },
    });

    return variablesMapping;
  }

  // node @TODO extends above React Component.detect util
  // to add relay related methods
  function isRelayCreateContainer(node) {
    if (node.type !== 'CallExpression') { console.error('node should be of type CallExpression'); }
    const name = sourceCode.getText(node.callee);
    return name === 'Relay.createContainer' || name === 'createRelayContainer';
  }

  function getComponentName(node) {
    if (node.id) { // component is class component
      return node.id.name;
    }

    // pure function or React.createClass
    // const componentName = Component; // variable declaration
    let parent = node.parent;
    while (parent) {
      if (parent.type === 'VariableDeclarator') {
        return parent.id.name;
      }
      parent = parent.parent;
    }

    context.report({
      node,
      message: 'Could not able to find component name',
    });

    return '_cant_find_name';
  }

  const relayComponentsVariablesMapping = {};

  //--------------------------------------------------------------------------
  // Public
  //--------------------------------------------------------------------------
  return {

    JSXOpeningElement(node) {
      storeJSXElementAttrs(node);
    },

    CallExpression(node) {
      if (!isRelayCreateContainer(node)) { return; }

      const mapping = getComponentWiseVariablesMapping(node);
      const componentName = sourceCode.getText(node.arguments[0]);

      relayComponentsVariablesMapping[componentName] = mapping;
    },

    'Program:exit'() {
      const list = components.list();

      if (Object.keys(relayComponentsVariablesMapping).length === 0) { // no relay createContainer present in file
        return;
      }

      for (const component in list) {
        if (!list.hasOwnProperty(component)) { continue; }

        const jsxElements = list[component].jsxElements || [];
        const componentName = getComponentName(list[component].node);
        const variablesMapping = relayComponentsVariablesMapping[componentName];
        if (!variablesMapping) { continue; }

        jsxElements.forEach(({name, node}) => {
          const variables = variablesMapping[name];
          if (!variables) { return; }
          // jsx elements map
          const attrsMap = node.attributes.reduce((acc, attr) => {
            if (attr.type !== 'JSXAttribute') { return acc; } // ignore other like JSXSpreadAttribute
            acc[attr.name.name] = true; // eslint-disable-line no-param-reassign
            return acc;
          }, {});

          const missingVariableProps = variables.filter((variable) => !attrsMap[variable]);
          if (!(missingVariableProps && missingVariableProps.length === 0)) {
            context.report({
              node: node.name,
              message: `Missing relay variables in props [${missingVariableProps}]`,
            });
          }
        });
      }
    },
  };
});
