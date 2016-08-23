//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
import rule, { errorMessage } from '../react-style-no-numeric-string-value';
import dedent from 'dedent-js';
import RuleTester from '../../utils/RuleTester';

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: 'babel-eslint',
});

const error = (others = {}) => ({
  message: 'no-numeric-string-value',
  ...others,
});

ruleTester.run('react-style-no-numeric-string-value', rule, {
  valid: [
    {
      // dont report errors for non css property
      code: `
        const someObject = {
          test: '10',
        };
      `
    },

    {
      // dont report errors for non css property
      code: `
        const someObject = {
          width: '10px',
        };
      `
    },

    {
      // numbers are allowed
      code: `
        const someObject = {
          width: 10,
        };
      `
    },


    {
      // dont report errors for css property which supports unitless number
      code: `
        const someObject = {
          lineHeight: '10',
        };
      `
    }
  ],

  invalid: [
    {
      code: `
        const style = {
          width: '10',
        };
      `,
      output: `
        const style = {
          width: '10px',
        };
      `,
      errors: [{
        message: errorMessage({ property: 'width', rawValue: "'10'", fixedRawValue: "'10px'" }),
        line: 3,
        column: 18,
      }],
    },

    {
      // zero replace with numeric zero
      code: `
        const style = {
          width: '0',
        };
      `,
      output: `
        const style = {
          width: 0,
        };
      `,
      errors: [{
        message: errorMessage({ property: 'width', rawValue: "'0'", fixedRawValue: '0' }),
        line: 3,
        column: 18,
      }],
    },

    {
      code: `
        const jsx = (
          <StyleProvider style={{ width: '100%', height: '250' }} />
        );
      `,
      output: `
        const jsx = (
          <StyleProvider style={{ width: '100%', height: '250px' }} />
        );
      `,
      errors: [{
        message: errorMessage({ property: 'height', rawValue: "'250'", fixedRawValue: "'250px'" }),
        line: 3,
        column: 58,
      }],
    }
  ],
});
