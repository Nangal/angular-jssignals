exports.config = {
  'browserName': 'safari',
  'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
  'build': process.env.TRAVIS_BUILD_NUMBER,
  'name': 'e2e tests',
  'version': '8',
  'platform': 'OS X 10.10',
  'selenium-version': '2.44.0'
};
