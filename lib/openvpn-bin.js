var Promise = require('bluebird');
var _ = require('lodash');
var util = require('util');
var path = require('path');
var getPort = Promise.promisify(require('get-port'));
var fs = Promise.promisifyAll(require('fs'));

try {
    var wincmd = require('node-windows');
} catch (e) {
    wincmd = null;
}
try {
    var macsudo = Promise.promisifyAll(require('sudo-prompt'));
} catch (e) {
    macsudo = null;
}


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
            wincmd.list(function(svc) {
                resolve(svc);
            });
        })
            .then(function(svc) {
                return _.pluck(_.filter(svc, {
                    ImageName: 'openvpn.exe'
                }), 'PID');
            })
            .then(function(pids) {
                return pids.forEach(function(pid) {
                    wincmd.kill(pid, function() {
                        console.log('Killed:', pid);
                    });
                });
            }).then(resolve).catch(reject)
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
                console.log(openvpnpath, setargs)
                return new Promise(function(resolve, reject) {
                    switch (process.platform) {
                        case 'win32':
                            wincmd.elevate(openvpnpath + ' ' + setargs);
                            resolve();
                            break;
                        case 'darwin':
                            macsudo.exec(openvpnpath + ' ' + setargs).then(resolve);
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
            return util.format(new Array('--management %s %d', '--config %s', '--script-security %d', '--management-query-passwords', '--management-hold').join(' '), args.host, args.port, args.config, args.scriptSecurity);
            break;
        case 'darwin':
            return util.format(new Array('--management %s %d', '--config %s', '--script-security %d', '--log %s', '--cd %s', '--up %s', '--down %s', '--daemon', '--management-query-passwords', '--management-hold').join(' '), args.host, args.port, args.config, args.scriptSecurity, args.logpath, args.cwd, args.up, args.down);
            break;
        case 'linux':
            return util.format(new Array('--management %s %d', '--config %s', '--script-security %d', '--up %s', '--down %s', '--daemon', '--management-query-passwords', '--management-hold', '--dev', 'tun0').join(' '), args.host, args.port, args.config, args.scriptSecurity, args.up, args.down);
            break;
    }

}