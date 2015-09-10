openvpn-bin
--------------

[![npm version](https://badge.fury.io/js/openvpn-bin.svg)](http://badge.fury.io/js/openvpn-bin)

Initialize a Open Vpn Instance on Mac, Windows & Linux

Installation
------------

``` 
npm install openvpn-bin --save
```

Documentation
-------------

* [Class: OpenVPNBin](#openvpnbin)
  * [Constructor([openvpnPath])](#openvpnbin_constructor)
  * [Constructor([vpnOpts])](#openvpnclient_constructor)
  * [.initialize()](#openvpnclient_initialize)
  * [.shutdown()](#openvpnclient_shutdown)
* [vpnclient.connect([openvpnPath],[vpnOpts])](#module_initialize)


<a name="openvpnclient_constructor"></a>
#### Constructor

Argument: **vpnOpts** Object passed to .initialize()

```
{
  host: '127.0.0.1', //management console host, defualts to 127.0.0.1 
  port: 1337, //set the port for the management console, recommended this is omited so openvpn-bin finds available port for you
  scriptSecurity: 2,  //defualts to 2
  config: 'config.ovpn', //path of openvpn config file, defualts to config.ovpn
  cwd: process.cwd(), //set the current working directory for openvpn, defualts to process.cwd()
  up: '', //optional, should be only used for mac and linux (for dns)
  down: '' //optional, should be only used for mac and linux (for dns)
}
```

Argument: **openvpnPath** String passed to .initialize() with absolute or relative path to openvpn executable

```
path.normalize('../bin/openvpn.exe')
```

<a name="openvpnclient_initialize"></a>
#### .initialize()

Returns Promice on sucsessfull startup of openvpn:

```
{
  port: spesifyed or auto found port,
  host: spesifyed or defualt 127.0.0.1
}
```

<a name="openvpnclient_disconnect"></a>
#### .shutdown()

It returns a Promise that is fulfilled when OpenVpn instance is terminated


<a name="module_initialize"></a>
### module.initialize([openvpnPath],[vpnOpts]) 

Initialize OpenVpn Instance using **[openvpnPath]** **[vpnOpts]** arguments



Support
-------

If you're having any problem, please [raise an issue](https://github.com/luigiplr/openvpn-bin/issues/new) on GitHub and I'll  be happy to help.

Contribute
----------

- Issue Tracker: [github.com/luigiplr/openvpn-bin/issues](https://github.com/luigiplr/openvpn-binn/issues)
- Source Code: [github.com/luigiplr/openvpn-bin](https://github.com/luigiplr/openvpn-bin)



License
-------

The project is licensed under the GPL-3.0 license.
