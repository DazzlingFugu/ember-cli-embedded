# Ember-cli-embedded [![Travis build](https://api.travis-ci.org/xcambar/ember-cli-embedded.svg)](https://travis-ci.org/xcambar/ember-cli-embedded)

Makes it easier to embed your Ember application in another
(non-Ember) app.

This is especially useful when migrating an existing app to Ember.
Replace your existing non-Ember code part by part with
your shiny Ember Components and offer your team a smooth migration
towards the evergreen fields of Ember.

# Usage

## Installation

```
ember install ember-cli-embedded
```

## Configuration

This plugin is opt-in; by default, it does nothing to your app unless
you ask for it.

In your `config/environment.js`, add the following config:

```js
  embedded: {
    delegateStart: true,
    config: { // `config` is optional
      //Add anything you want as default values
    }
  }
```

For compatibility reasons, as long as the value for `embedded` is truthy, your app will hold
until you start it. This behaviour will be removed in future versions.
Please stick to the config format above.

### Start your app

This addon relies on [ember-export-application-global](https://github.com/ember-cli/ember-export-application-global)
to expose a global variable. By default, it exposes your app under
its capitalized name, _eg._ `MyApp`. See its documentation for
more configuration information.

In your JS code, just execute `MyApp.start()` to resume
your application. It takes an optional configuration as its
first argument.

Your app __will not start__ unless you call the `MyApp.start(config)`
method.

## Pass config from your JS code

Your JS code will probably have some kind of state that you want your Ember
app to know about when it is started. You can pass such context with
this addon.

Both the config in `config/environment.js` and the config given to `start()`
are merged and stored in your container for later use.

You can find this configuration from your container as follows:

```js
const embeddedConfig = container.lookup('config:embedded');
```

## Override your APP configuration

The passed ocnfiguration will be merged in your `APP` configuration key,
which is very useful, for instance, if you want to change the `rootElement`
of your application and other context-sensitive values.

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
