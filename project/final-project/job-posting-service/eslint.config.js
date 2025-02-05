import flatConfig from '@sap-cloud-sdk/eslint-config/flat-config.js';

export default [
  ...flatConfig,
  {
    rules: {
      'import/namespace': 'off',
      'import/no-internal-modules': 'off',
      'jsdoc/require-jsdoc': 'off'
    }
  }
];
