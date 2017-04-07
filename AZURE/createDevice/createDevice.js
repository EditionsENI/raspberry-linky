'use strict';

var iothub = require('azure-iothub');

var connectionString = 'HostName=IoTHubENI.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=N7IUeUGk7az2qgo3FP7afyUZTYC4VzyKwb7f/NOcvx8=';

 var registry = iothub.Registry.fromConnectionString(connectionString);


 var device = new iothub.Device(null);
 device.deviceId = 'Linky_Device';
 registry.create(device, function(err, deviceInfo, res) {
   if (err) {
     registry.get(device.deviceId, printDeviceInfo);
   }
   if (deviceInfo) {
     printDeviceInfo(err, deviceInfo, res)
   }
 });

 function printDeviceInfo(err, deviceInfo, res) {
   if (deviceInfo) {
     console.log('Device ID: ' + deviceInfo.deviceId);
     console.log('Device key: ' + deviceInfo.authentication.symmetricKey.primaryKey);
   }
 }
