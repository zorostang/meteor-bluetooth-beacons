// can Delegate itself be a ReactiveVar? or do we need every
// desired property to be a ReactiveVar, like below
LocationManager = {};
Delegate = {};

let didStartMonitoringForRegion = new ReactiveVar(null);
let didChangeAuthorizationStatus = new ReactiveVar(null);
let didDetermineStateForRegion = new ReactiveVar(null);
let didRangeBeaconsInRegion = new ReactiveVar(null);
let didExitRegion = new ReactiveVar(null);
let didEnterRegion = new ReactiveVar(null);

// TODO: iBeacon only allows a device to monitor up to 20 regions at a time
// if more regions need to be monitored, then location updates need to be used
// to determine which region to pop off monitoring and which region to push in

// TODO: add additional android only methods from the plugin

// example add use case. regionmoniring has been started. 
if (Meteor.isCordova) {
  // all cordova code needs to go in meteor.startup...not sure why?
  Meteor.startup(function() {
    // locationManager class is the central point for configuring the delivery 
    // of location and beacon related events.
    let lm = cordova.plugins.locationManager;

    // the Delegate receives location and beacon ranging/monitoring updates
    // this guy is where we can meteorize things.
    let delegate = new cordova.plugins.locationManager.Delegate();

    // i need to get a better understanding of what these result
    // objects look like.
    delegate.didStartMonitoringForRegion = function(result) {
      didStartMonitoringForRegion.set(JSON.stringify(result));
    };
    delegate.didExitRegion = function(result) {
      didExitRegion.set(JSON.stringify(result));
    };
    delegate.didEnterRegion = function(result) {
      didEnterRegion.set(JSON.stringify(result));
    };
    delegate.didChangeAuthorizationStatus = function(result) {
      didChangeAuthorizationStatus.set(JSON.stringify(result));
    };
    delegate.didDetermineStateForRegion = function(result) {
      didDetermineStateForRegion.set(JSON.stringify(result));
    };
    delegate.didRangeBeaconsInRegion = function(result) {
      didRangeBeaconsInRegion.set(JSON.stringify(result));
    };

    lm.setDelegate(delegate);

    _.extend(LocationManager, {
      requestWhenInUseAuthorization: function() {
        lm.requestWhenInUseAuthorization();
      },
      requestAlwaysAuthorization: function() {
        lm.requestAlwaysAuthorization();
      },
      getAuthorizationStatus: function() {
        lm.getAuthorizationStatus()
          .then(function(result) {
            return JSON.stringify(result);
          }, function(err) {
            return JSON.stringify(err);
          });
      },
      createBeacon: function(identifier, uuid, minor, major) {
        // throws an error if the parameters are not valid
        let beaconRegion = new lm.BeaconRegion(identifier, uuid, major, minor);
        return beaconRegion;
      },
      startMonitoringForRegion: function(beaconRegion) {
        lm.startMonitoringForRegion(beaconRegion)
          .fail(console.error('error: startMonitoringForRegion failed'))
          .done();
      },
    });

    _.extend(Delegate, {
      didStartMonitoringForRegion: function() {
        return didStartMonitoringForRegion.get();
      },
      didChangeAuthorizationStatus: function() {
        return didChangeAuthorizationStatus.get();
      },
      didDetermineStateForRegion: function() {
        return didDetermineStateForRegion.get();
      },
      didRangeBeaconsInRegion: function() {
        return didRangeBeaconsInRegion.get();
      },  
      didExitRegion: function() {
        return didExitRegion.get();
      },
      didEnterRegion: function() {
        return didEnterRegion.get();
      },
    });
  });
}


