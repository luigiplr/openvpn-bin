var Promise = require('bluebird');
var _ = require('lodash');
var util = require('util');
var path = require('path');
var runas = require('runas');
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
                console.log(openvpnpath, setargs);
                return runas(openvpnpath, setargs, {
                    admin: true,
                    hide: false,
                    catchOutput: true
                });
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
            return util.format(new Array('--management %s %d', '--config %s', '--script-security %d', '--management-query-passwords', '--management-hold', '--register-dns').join(' '), args.host, args.port, args.config, args.scriptSecurity);
            break;
        case 'darwin':
            var arg = util.format(new Array('--management %s %d', '--config %s', '--script-security %d', '--cd %s', '--daemon', '--management-query-passwords', '--management-hold').join(' '), args.host, args.port, args.config, args.scriptSecurity);
            if (args.up && args.down)
                return util.format(new Array(arg, '--up %s', '--down %s').join(' '), args.up, args.down);
            else
                return arg;
            break;
        case 'linux':
            var arg = util.format(new Array('--management %s %d', '--config %s', '--script-security %d', '--daemon', '--management-query-passwords', '--management-hold', '--dev', 'tun0').join(' '), args.host, args.port, args.config, args.scriptSecurity);
            if (args.up && args.down)
                return util.format(new Array(arg, '--up %s', '--down %s').join(' '), args.up, args.down);
            else
                return arg;
            break;
    }

}