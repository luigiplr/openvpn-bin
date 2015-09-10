var Promise = require('bluebird');
var _ = require('lodash');
var util = require('util');
var wincmd = Promise.promisifyAll(require('node-windows'));
var getPort = Promise.promisify(require('get-port'));
var fs = Promise.promisifyAll(require('fs'))
var argv = require('minimist')(process.argv.slice(2));


fs.existsAsync = function(path) {
    return fs.openAsync(path, "r").then(function(stats) {
        return true
    }).catch(function(stats) {
        return false
    })
}

if (argv.test) {
    var path = '%programfiles%/OpenVPN/bin/openvpn.exe',
        args = {
            host: '127.0.0.1',
            port: 1337,
            scriptSecurity: 2,
            config: 'config.ovpn',
            logpath: 'log.txt',
            cwd: process.cwd(),
            up: '',
            down: ''
        };
    initialize(path, args)
}

module.exports.initialize = function(path, args) {
    return initialize(path, args);
}
module.exports.shutdown = function() {

}

function initialize(path, args) {
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
                console.log(path, setargs)
                return new Promise(function(resolve, reject) {

                    switch (process.platform) {
                        case 'win32':
                            wincmd.elevate(path + ' ' + setargs).then(function(d) {
                                console.log(d)
                            });
                            break;
                        case 'darwin':
                            break;
                        case 'linux':
                            break;
                    }

                });
            })
            .then(resolve).catch(reject);
    });
}

function getSetArgs(args) {
    var newargs;
    args = _.defaults(args, {
        host: '127.0.0.1',
        port: 1337, //port should *always* be set at this point but we will defualt it anyway to 1337 just incase.
        scriptSecurity: 2,
        config: 'config.ovpn',
        logpath: 'log.txt',
        cwd: process.cwd(),
        up: '',
        down: ''
    });

    switch (process.platform) {
        case 'win32':
            return util.format(new Array('--management %s %s', '--config %s', '--script-security %d', '--management-query-passwords', '--management-hold').join(' '), args.host, args.port, args.config, args.scriptSecurity);
            break;
        case 'darwin':
            return util.format(new Array('--management %s %s', '--config %s', '--script-security %d', '--log %s', '--cd %s', '--up %s', '--down %s', '--daemon', '--management-query-passwords', '--management-hold').join(' '), args.host, args.port, args.config, args.scriptSecurity, args.logpath, args.cwd, args.up, args.down);
            break;
        case 'linux':
            return util.format(new Array('--management %s %d', '--config %s', '--script-security %d', '--daemon', '--management-query-passwords', '--management-hold', '--dev', 'tun0').join(' '), args.host, args.port, args.config, args.scriptSecurity);
            break;
    }

}