# Ember-cli-embedded [![Travis build](https://api.travis-ci.org/xcambar/ember-cli-embedded.svg)](https://travis-ci.org/xcambar/ember-cli-embedded)

Makes it easier to embed your Ember application in another
(non-Ember) app.

This addon gives you more control over how and when your
Ember app will boot and also allows to add/override some
configuration, so that the Ember app can boot with some
context-dependent config.

We found it especially useful, for example, when migrating an existing app to Ember part by part.

# Usage

## Installation

```
ember install ember-cli-embedded
```

## Configuration

This plugin is opt-in; by default, it does nothing to your app unless
you configure it.

In your `config/environment.js`, add the following config:

```js
  embedded: {
    delegateStart: true,
    config: { // `config` is optional
      // Default values for the config passed at boot
    }
  }
```

> For compatibility reasons, as long as the value for `embedded` is truthy, your app will hold
until you start it. This behaviour will be removed in future versions.
Please stick to the config format above.

### Start your app

This addon relies on [ember-export-application-global](https://github.com/ember-cli/ember-export-application-global)
to expose a global variable. By default, it exposes your app under
its capitalized name, _eg._ `MyApp`. See its documentation for
more configuration information.

In your JS code, just execute `MyApp.start(/* optionalConfig */)` to resume
the boot of your application. As per the example, it takes an optional
configuration as its first argument.

Remeber: Your app __will not start__ unless you call the `MyApp.start(/* optionalConfig */)`
method.

## Access the config from your app

You can inject the `embedded` service to access the config:

```
EmberObject.extend({
  embedded: service(),

  logSomeConfigKey() {
    const value = this.get('embedded.myKey');
    console.log(value);
  }
});
```

Note: It is sometimes more convenient to access the data from the container directly:

```js
// Returns the raw config
let embeddedConfig = Ember.getOwner(this).lookup('config:embedded');
```

## Override your APP configuration

The passed configuration will be merged in your `APP` configuration key,
which is very useful, for instance, if you want to change the `rootElement`
of your application and other context-sensitive values.

## Testing in Ember 3.x

Make sure that, in your `config/environment.js`, you disable the addon for the
`test` environment, with the following:

```js
ENV.embedded.delegateStart = false;
```

# Development

Installation
------------------------------------------------------------------------------

* `git clone` this repository
* `npm install`
* `bower install`

### Linting

* `ember server`
* Visit your app at http://localhost:4200.

### Running tests

* `ember test`
* `ember test --server`

### Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).

License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
