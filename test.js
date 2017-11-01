var openvpnbin = require('./lib/openvpn-bin.js');
var argv = require('minimist')(process.argv.slice(2));
var path = require('path');

if (argv.init) {
    var openvpnpath = path.normalize(getOpenVPNPath()), //path of openvpn exsecutable
        args = {
            host: '127.0.0.1',
            port: 1337,
            scriptSecurity: 2,
            config: 'config.ovpn'
        };
    console.log(openvpnbin.initialize(openvpnpath, args));
}

if (argv.shutdown) {
    var openvpnpath = path.normalize(getOpenVPNPath()),
        args = {
            host: '127.0.0.1',
            port: 1337,
            scriptSecurity: 2,
            config: 'config.ovpn'
        };
    openvpnbin.initialize(openvpnpath, args);
}

function getOpenVPNPath() {
    switch (process.platform) {
        case 'win32':
            return '../bin/openvpn.exe'
            break;
        case 'darwin':
            return '/usr/local/opt/openvpn/sbin/openvpn';
        case 'linux':
            return '/usr/local/opt/openvpn/sbin/openvpn';
            break;
    }    
}