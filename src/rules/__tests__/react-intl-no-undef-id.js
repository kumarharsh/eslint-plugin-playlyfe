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

    {
      code: dedent`
        export default {
          'some.random.id': 'some default message',
        }
      `,
      ...defaultOptions,
      filename: 'not_intl_file.js',
    },
  ],

  invalid: [
    {
      code: dedent`
        export default {
          some_random_id: 'some default message',
        }
      `,
      errors: [{
        message: "id 'some_random_id' not present in reactIntlJson",
        line: 2,
        column: 3,
      }],
      ...defaultOptions,
    },

    // invalid key
    {
      code: dedent`
        export default {
          ["some" + "random"]: 'some default message',
        }
      `,
      errors: [{
        message: "Unsupported keyType",
        line: 2,
        column: 4,
      }],
      ...defaultOptions,
    },

    // error if react intl file path missing
    {
      code: dedent`
        export default {
          'some.random.id': 'some default message',
        }
      `,
      errors: [{
        message: 'Missing reactIntlFilePath option.',
      }],
      parser: 'babel-eslint',
    },

    // throw error if invalid file path
    {
      code: dedent`
        export default {
          'some.random.id': 'some default message',
        }
      `,
      errors: [{
        line: 1, column: 1,
      }],
      parser: 'babel-eslint',
      options: [{
        reactIntlFilePath: 'some_missing_file_path.json',
      }]
    }
  ],
});
