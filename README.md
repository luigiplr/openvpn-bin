# openvpn-bin
Initialize a openvpn instance for mac, windows &amp; linux

```
var openvpnbin = require('openvpn-bin');

var args = {
        host: '127.0.0.1',
        port: 1337,
        scriptSecurity: 2,
        config: 'config.ovpn',
        logpath: 'log.txt',
        cwd: process.cwd(),
        up: '',
        down: ''
    };


openvpnbin.initialize('path-to-open-vpn-exsecutable', args)
  .then(function(){console.log('openvpn instance started'}))
  .catch(function(){console.log('something went wrong! -- check the logs.'}))
  ```
  
```openvpnbin.shutdown()``` coming soon.
