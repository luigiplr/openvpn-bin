# openvpn-bin
Initialize a openvpn instance for mac, windows &amp; linux

Recommended https://github.com/luigiplr/node-openvpn is used as management console (designed to be chainable)

```
var openvpnbin = require('openvpn-bin');

var args = {
        host: '127.0.0.1',
        port: 1337,
        scriptSecurity: 2,
        config: 'config.ovpn',
        cwd: process.cwd(),
        up: '', //optional but must be used with down; should be only used for mac and linux
        down: '' //optional but must be used with up; should be only used for mac and linux
    };


openvpnbin.initialize('path-to-open-vpn-exsecutable', args)
  .then(function(){console.log('openvpn instance started'}))
  .catch(function(){console.log('something went wrong! -- check the logs.'}))
  ```
  
```openvpnbin.shutdown()``` coming soon.
