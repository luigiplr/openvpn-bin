var Promise = require('bluebird');
var util = require('util');
var runas = Promise.promisify(require('runas').runas);
var getPort = Promise.promisify(require('get-port').getPort);
var fs = Promise.promisifyAll(require('fs'));

fs.existsAsync = function(path) {
    return fs.openAsync(path, "r").then(function(stats) {
        return true
    }).catch(function(stats) {
        return false
    })
}

module.exports.initialize = function(path, args) {
    return new Promise(function(resolve, reject) {
        fs.existsAsync(args.config).then(function(exists) {
            if (!exists)
                console.info('OpenVpn Config file not found, defaulting to "config.ovpn"');
            if (!args.port) {
                getPort()
                    .then(function(e, p) {
                        if (e) {
                            reject('Error while finding port');
                            return;
                        }
                        args.port = p;
                        return initialize(path, args);
                    })
                    .then(resolve).catch(reject);
            } else {
                initialize(path, args).then(resolve).catch(reject);
            }
        });
    });
}
module.exports.shutdown = function() {

}

function initialize(path, args) {
    return new Promise(function(resolve, reject) {
        getSetArgs(args)
            .then(function(setargs) {
                return runas(path, newarsetargsgs, {
                    hide: true,
                    admin: true
                });
            })
            .then(resolve);
    });
}

function getSetArgs(path, args) {
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
            return = util.format(new Array('--management %s %s', '--config %s', '--script-security %d', '--management-query-passwords', '--management-hold').join(' '), args.host, args.port, args.scriptSecurity);
            break;
        case 'darwin':
            return = util.format(new Array('--management %s %s', '--config %s', '--script-security %d', '--log %s', '--cd %s', '--up %s', '--down %s', '--daemon', '--management-query-passwords', '--management-hold').join(' '), args.host, args.port, args.scriptSecurity, args.logpath, args.cwd, args.up, args.down);
            break;
        case 'linux':
            return = util.format(new Array('--management %s %d', '--config %s', '--script-security %d', '--daemon', '--management-query-passwords', '--management-hold', '--dev', 'tun0').join(' '), args.host, args.port, args.scriptSecurity);
            break;
    }

}