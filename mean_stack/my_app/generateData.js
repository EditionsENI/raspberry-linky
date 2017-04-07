var libs = process.cwd() + '/libs/';

var config = require(libs + 'config');

var db = require(libs + 'db/mongoose');
var Measure = require(libs + 'models/measure');

var log = require(libs + 'log')(module);

var fs = require('fs');
var os = require('os');

var client__config_path = config.get("client:config_path");
var ifaces = os.networkInterfaces();

var mongoose__uri = config.get("mongoose:uri");

Object.keys(ifaces).forEach(function(ifname) {
    var alias = 0;

    ifaces[ifname].forEach(function(iface) {
        if ('IPv4' !== iface.family || iface.internal !== false) {
            // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
            return;
        }

        if (alias >= 1) {
            // this single interface has multiple ipv4 addresses
            console.log(ifname + ':' + alias, iface.address);
        } else {
            // this interface has only one ipv4 adress
            console.log(ifname, iface.address);
            var client__config_content = {
                //host: 'http://' + iface.address,
                host: 'http://82.253.30.78',
                port: config.get('port'),
                //full_path: 'http://' + iface.address + ':' + config.get('port')
                full_path: 'http://82.253.30.78' + ':' + config.get('port')
            };
            fs.writeFile(client__config_path, JSON.stringify(client__config_content), function(err) {
                if (err) {
                    log.error(err);
                }

                log.info("New config client created and saved - %s", client__config_path);
            });
        }
        ++alias;
    });
});

db.connection.on('connected', function() {
    log.info('Mongoose default connection open to ' + mongoose__uri);

    Measure.remove({}, function(err, measures) {
        if (err)
            log.error(err);
        else
            log.info('All measures removed');
        db.connection.close();
    });
});
