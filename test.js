var openvpnbin = require('./lib/openvpn-bin.js');
var argv = require('minimist')(process.argv.slice(2));
var path = require('path');


if (argv.init) {
    var openvpnpath = path.normalize('../bin/openvpn.exe'), //path of openvpn exsecutable
        args = {
            host: '127.0.0.1',
            port: 1337,
            scriptSecurity: 2,
            config: 'config.ovpn'
        };
    openvpnbin.initialize(openvpnpath, args);
}

if (argv.shutdown) {
    var openvpnpath = path.normalize('bin/openvpn.exe'),
        args = {
            host: '127.0.0.1',
            port: 1337,
            scriptSecurity: 2,
            config: 'config.ovpn'
        };
    openvpnbin.initialize(openvpnpath, args);
}