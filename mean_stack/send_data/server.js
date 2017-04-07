var app = require('express')();
var server = require('http').Server(app);
var SerialPort = require('serialport');
var socket = require('socket.io-client')('http://localhost:3137/datas');


/**
 * Read serial port
 */
var dict = {};
var datas_array = [];

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
    //console.log(data);
    var content = data.split(' ');
    if (content[0] == 'ADCO')
        canAdd = 1;
    if (canAdd) {
        var key = content[0];
        dict[key] = content[1];
        json_data = {'label' : content[0], 'value': content[1]};
        var index = datas_array.map(function(d) { return d['label']; }).indexOf(content[0]);
        if(index > -1)
            datas_array[index] = json_data;
        else
            datas_array.push(json_data);
    }
    socket.emit('data.array', datas_array);
});


server.listen(3080, function() {
    console.log('Example app listening on port 3080!');
});
