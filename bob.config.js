// Live bob config (takes precedence over the package.json field).
// tests/stories are dev-only: excluded from lib and from the published tarball.
module.exports = {
  source: 'src',
  output: 'lib',
  exclude: '**/{__tests__,__fixtures__,__mocks__,tests,stories}/**',
  targets: ['module', 'commonjs', ['typescript', { project: 'tsconfig.build.json' }]],
};
