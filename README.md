# ember-cli-embedded

[![CI](https://github.com/peopledoc/ember-cli-embedded/actions/workflows/ci.yml/badge.svg)](https://github.com/peopledoc/ember-cli-embedded/actions/workflows/ci.yml) [![Ember Observer Score](https://emberobserver.com/badges/ember-cli-embedded.svg)](https://emberobserver.com/addons/ember-cli-embedded)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


Makes it easier to embed your Ember application in another (non-Ember) app.

This addon gives you more control over how and when your Ember app will boot and also allows to 
add/override some configuration, so that the Ember app can boot with some context-dependent config.

We found it especially useful, for example, when migrating an existing app to Ember part by part.


## Compatibility

- Ember.js v3.20 or above
- Ember CLI v3.20 or above
- Node.js v12 or above


## Usage

### Installation

```
ember install ember-cli-embedded
```


### Configuration

This plugin is opt-in by default, it does nothing to your app unless you configure it.

In your `config/environment.js`, add the following config to the `ENV`:

```js
  modulePrefix: 'my-app' // name of your application
  exportApplicationGlobal: true, // exposes your application in production builds
  ...
  embedded: {
    delegateStart: true,
    config: { // `config` is optional
      // Default values for the config passed at boot
    }
  }
```

> For compatibility reasons, as long as the value for `embedded` is truthy, your app will hold until
> you start it. This behaviour will be removed in future versions.  
> Please stick to the config format above.


### Start your app

This addon relies on [ember-export-application-global](https://github.com/ember-cli/ember-export-application-global)
to expose a global variable. By default, it exposes your app under its capitalized name, 
_eg._ `MyApp`. See its documentation for more information.

In your JS code, just execute `MyApp.start(/* optionalConfig */)` to resume the boot of your 
application. As per the example, it takes an optional configuration as its first argument.

Remember:
Your app __will not start__ unless you call the `MyApp.start(/* optionalConfig */)` method.


### Access the config from your app

You can inject the `embedded` service to access the config:

```
EmberObject.extend({
  embedded: service(),

  logSomeConfigKey() {
    const value = this.get('embedded.myKey')
    console.log(value)
  }
})
```

Note: It is sometimes more convenient to access the data from the container directly:

```js
// Returns the raw config
let embeddedConfig = Ember.getOwner(this).lookup('config:embedded')
```


### Override your `APP` configuration

The passed configuration will be merged in your `APP` configuration key, which is very useful, for
instance, if you want to change the `rootElement` of your application and other context-sensitive
values.


### Testing in Ember 3.x

Make sure that, in your `config/environment.js`, you disable the addon for the `test` environment,
with the following:

```js
ENV.embedded.delegateStart = false
```


## Contributing

See the [Contributing](./CONTRIBUTING.md) guide for details.


## License

This project is licensed under the [MIT License](LICENSE.md).
