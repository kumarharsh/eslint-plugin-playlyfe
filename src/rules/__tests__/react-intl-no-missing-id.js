/**
 * @fileoverview find keys in locale files which are not in code
 * @author Mayank Agarwal
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import rule from '../react-intl-no-missing-id';
import dedent from 'dedent-js';
import RuleTester from '../../utils/RuleTester';

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: 'babel-eslint',
});

const defaultParams = {
  options: [{
    reactIntlFilePath: require.resolve('./data/react-intl.json'),
  }],
};

ruleTester.run('react-intl-no-missing-id', rule, {
  valid: [
    {
      code: `
        export default {
          'sample.string1': 'some default message',
          'sample.string2': 'some default message',
          'sample.string3': 'some default message',
        }
      `,
      ...defaultParams,
    },
  ],

  invalid: [
    {
      code: dedent`
        export default {
          'sample.string1': 'some translated string',
        }
      `,

      // fixed
      output: dedent`
        export default {

          'sample.string2': ' ',
          'sample.string3': ' ',

          'sample.string1': 'some translated string',
        }
      `,

      errors: [{
        message: '2 ids missing',
        line: 1,
        column: 16,
      }],

      ...defaultParams,
    },
  ],
});
