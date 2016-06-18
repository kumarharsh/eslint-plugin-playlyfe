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
  filename: 'i18n/en.js',
};

ruleTester.run('react-intl-no-missing-id', rule, {
  valid: [
    {
      code: `
        export default {
          'sample.string1': 'some default message',
          'sample.string2': 'some default message',
          'sample.string3': 'some default message',
          string4: 'some default message',
        }
      `,
      ...defaultParams,
    },

    // should only report errors in i18n file
    {
      code: dedent`
        export default {
          'key': 'value',
        }
      `,
      filename: 'randomJSFile.js',
    }
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
          'string4': ' ',

          'sample.string1': 'some translated string',
        }
      `,

      errors: [{
        message: '3 ids missing',
        line: 1,
        column: 16,
      }],

      ...defaultParams,
    },

    {
      code: dedent`
        export default {
          'sample.string1': 'some default message',
          'sample.string2': 'some default message',
          'sample.string3': 'some default message',
          string4: 'some default message',
          ['x' + 'y']: 'some default message',
        }
      `,
      ...defaultParams,
      errors: [{
        message: 'Unsupported keyType',
        line: 6,
        column: 4,
      }],
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
