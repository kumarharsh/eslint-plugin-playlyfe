/**
 * @fileoverview find keys in locale files which are not in code
 * @author Mayank Agarwal
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import rule from '../use-exact-dependency';
import dedent from 'dedent-js';
import RuleTester from '../../utils/RuleTester';

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

const baseConfig = {
  parser: 'babel-eslint',
  filename: 'package.json',
};

ruleTester.run('use-exact-dependency', rule, {
  valid: [
    {
      code: dedent`
        const json = {
          "dependencies": {
            "dependency1": "1.2.3"
          }
        };
      `,
      ...baseConfig,
    },
  ],

  invalid: [
    {
      code: dedent`
        const json = {
          "dependencies": {
            "dependency1": "^1.2.3",
            "dependency2": "~1.2.3",
            "dependency3": "1.2.3"
          }
        };
      `,
      errors: [{
        message: 'use-exact-dependency',
        type: 'Literal',
        line: 3,
        column: 20,
      }, {
        message: 'use-exact-dependency',
        type: 'Literal',
        line: 4,
        column: 20,
      }],
      ...baseConfig,
    },
  ],
});
