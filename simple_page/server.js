var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var SerialPort = require('serialport');

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
            datas_array.splice(index,1);
        datas_array.push(json_data);
        // console.log(datas_array);
    }
    io.of('/datas').emit('data.array', datas_array);
});

server.listen(3137, function() {
    console.log('Example app listening on port 3137!');
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});


var datas = io
    .of('/datas')
    .on('connection', function(socket) {
      console.log('new client');
    });
