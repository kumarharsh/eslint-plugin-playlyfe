/**
 * @fileoverview find keys in locale files which are not in code
 * @author Mayank Agarwal
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import rule from '../react-intl-no-undef-id';
import dedent from 'dedent-js';
import RuleTester from '../../utils/RuleTester';

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

const defaultOptions = {
  parser: 'babel-eslint',
  options: [{
    reactIntlFilePath: require.resolve('./data/react-intl.json'),
  }],
};

ruleTester.run('react-intl-no-undef-id', rule, {
  valid: [
    {
      code: `
        export default {
          'sample.string1': 'some default message',
        }
      `,
      ...defaultOptions,
    },
  ],

  invalid: [
    {
      code: dedent`
        export default {
          'some.random.id': 'some default message',
        }
      `,
      errors: [{
        message: "id 'some.random.id' not present in reactIntlJson",
        type: 'Literal',
        line: 2,
        column: 3,
      }],
      ...defaultOptions,
    },
  ],
});
