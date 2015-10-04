Package.describe({
  name: 'zorostang:bluetooth-beacons',
  summary: 'reactive bluetooth beacon monitoring and ranging',
  version: '0.1.0',
  git: 'https://github.com/zorostang/meteor-bluetooth-beacons',
});

Cordova.depends({
  // is this the best package to use?
  'com.unarin.cordova.beacon': '3.3.0',
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.1');
  // what is the difference between web.browser and client?
  // this package is cordova only for now
  api.use(['reactive-var', 'underscore'], ['web.cordova']);
  api.addFiles(['location_manager.js'], ['web.cordova']);
  // should i export just one global?
  api.export(['LocationManager', 'Delegate'], ['web.cordova']);
});


