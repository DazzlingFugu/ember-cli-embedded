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
    name: "exposedEmberAppName",
    config: {
      //Add anything you want as default values
    }
  }
```

As long as the value for `embedded` is truthy, your app will hold
until you start it.

### Start your app

Your app now exposes the `window.exposedEmberAppName` variable which
points to your actual Ember application.

Your app __will not start__ unless you call the `start(config)`
method on your application to resume.

In your JS code, just execute `exposedEmberAppName.start()` to resume
your application.

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

# Development

## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
