var SerialPort = require('serialport');



/**
 * Read serial port
 */
var dict = {};
dict['TARIFKWHBASE'] = 0.14490;
var canAdd = 0;
var serialPort = new SerialPort('/dev/ttyUSB0', {
    baudRate: 1200,
    dataBits: 7,
    stopBits: 1,
    parity: 'even',
    //parser: SerialPort.parsers.raw
    parser: SerialPort.parsers.readline('\n')
});


serialPort.on('data', function(data) {
    console.log(data);
    var content = data.split(' ');
    if (content[0] == 'ADCO')
        canAdd = 1;
    if (canAdd) {
        var key = content[0];
        dict[key] = content[1];
    }
    console.log(dict);
});


