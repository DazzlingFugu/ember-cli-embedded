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

```console
ember install ember-cli-embedded
```


### Configuration

This plugin is opt-in by default, it does nothing to your app unless you configure it.

In your `config/environment.js`, add the following config to the `ENV`:

```js
  let ENV = {
    ...
    embedded: {
      delegateStart: true,
      config: { // optional
        // Default values for the config passed at boot
      },
    },
    ...
  };
```

> For compatibility reasons, as long as the value for `embedded` is truthy, your app will hold until
> you start it. This behaviour will be removed in future versions.  
> Please stick to the config format above.


### Start your app

This addon relies on [ember-export-application-global](https://github.com/ember-cli/ember-export-application-global)
to get your application globally exposed. See its documentation for more information.

In your JS code, just execute `MyApp.start(/* optionalConfig */)` to resume the boot of your 
application. As per the example, it takes an optional configuration as its first argument.

Remember:
Your app __will not start__ unless you call the `MyApp.start(/* optionalConfig */)` method.


### Access the config from your application

#### Via the Service `embedded`

Consider the following `config/environment.js` file:

```js
  let ENV = {
    ...
    embedded: {
      config: {
        option1: 'value-1',
      },
    },
    ...
  };
```

And the application is started that way:

```js
<script>
  MyApp.start({ option2: 'value-2' });
</script>
```

Then in your Services, Components, Controllers...

```js
class MyService extends Service {
  @service embedded;

  @action
  logSomeConfigKey() {
    // Will log 'value-1'
    console.log(this.embedded.option1);
  }
}
```


#### Via the container itself

Sometimes it can be more convenient to access the data directly from the container.

Following the previous example:

```js
import { getOwner } from '@ember/application';

...

// Returns the raw config
let embeddedConfig = getOwner(this).lookup('config:embedded');

// Will log 'value-2'
console.log(embeddedConfig.option2);
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
