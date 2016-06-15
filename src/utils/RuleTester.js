import { RuleTester } from 'eslint';

// HACK to fix --watch mocha
// issue: when mocha watching file
// it will clean require.cache for test files only
// eslint RuleTester is external file
// and in each watch run new describe and it
// are passed but RuleTester is using previous test run
// descibe and it
RuleTester.describe = describe;
RuleTester.it = it;

export default RuleTester;
