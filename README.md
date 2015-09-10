# openvpn-bin
Initialize a openvpn instance for mac, windows &amp; linux

```var openvpnbin = require('openvpn-bin');

var args = {
        host: '127.0.0.1',
        port: 1337, //port should *always* be set at this point but we will defualt it anyway to 1337 just incase.
        scriptSecurity: 2,
        config: 'config.ovpn',
        logpath: 'log.txt',
        cwd: process.cwd(),
        up: '',
        down: ''
    };


openvpnbin.initialize('path-to-open-vpn-exsecutable', args)
  .then(function(){console.log('openvpn instance started'}))
  .catch(function(){console.log('something went wrong! -- check the logs.'}))```
