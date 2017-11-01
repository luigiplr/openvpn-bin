var Promise = require('bluebird');
var _ = require('lodash');
var path = require('path');
var child_process = require('child_process');
var getPort = Promise.promisify(require('get-port'));
var fs = Promise.promisifyAll(require('fs'));

fs.existsAsync = function(path) {
    return fs.openAsync(path, "r").then(function(stats) {
        return true
    }).catch(function(stats) {
        return false
    })
}

module.exports.initialize = function(openvpnpath, args) {
    return initialize(openvpnpath, args);
}
module.exports.shutdown = function() {
    return shutdown();
}

function shutdown() {
    return new Promise(function(resolve, reject) {
        new Promise(function(resolve, reject) {

        })
    });
}

function initialize(openvpnpath, args) {
    return new Promise(function(resolve, reject) {
        fs.existsAsync(args.config)
            .then(function(exists) {
                if (!exists)
                    return console.info('OpenVpn Config file not found, defaulting to "config.ovpn"');
            })
            .then(function() {
                if (!args.port) {
                    return new Promise(function(resolve, reject) {
                        getPort()
                            .then(function(port) {
                                args.port = port;
                                resolve(args);
                            }).catch(reject)
                    });
                } else {
                    return args;
                }
            })
            .then(getSetArgs)
            .then(function(setargs) {
                return child_process.execFileSync(openvpnpath,setargs);
            })
            .then(function() {
                resolve({
                    port: args.port,
                    host: args.host
                });
            }).catch(reject);
    });
}

function getSetArgs(args) {
    var newargs;
    args = _.defaults(args, {
        host: '127.0.0.1',
        port: 1337, //port should *always* be set at this point but we will defualt it anyway to 1337 just incase.
        scriptSecurity: 2,
        config: 'config.ovpn',
        cwd: process.cwd(),
        up: false,
        down: false
    });

    switch (process.platform) {
        case 'win32':
            return [
                '--management', args.host, args.port,
                '--config', args.config,
                '--script-security', args.scriptSecurity,
                '--management-query-passwords',
                '--management-hold',
                '--register-dns'
            ];
            break;
        case 'darwin':
            var arg = [
                '--management', args.host, args.port,
                '--config', args.config,
                '--script-security', args.scriptSecurity,
                '--management-query-passwords',
                '--management-hold',
                '--daemon'
            ];
            if (args.up)
                arg.push('--up', args.up);
            if (args.down)
                arg.push('--down', args.down);
            return arg;
        case 'linux':
            var arg = [
                '--management', args.host, args.port,
                '--config', args.config,
                '--script-security', args.scriptSecurity,
                '--cd', args.cwd,
                '--management-query-passwords',
                '--management-hold',
                '--daemon',
                '--dev',
                'tun0'
            ];
            if (args.up)
                arg.push('--up', args.up);
            if (args.down)
                arg.push('--down', args.down);
            return arg;
            break;
    }

}