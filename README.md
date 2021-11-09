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

Doing so will make your application hold, until your manually start it. (read on to lear more)

> For compatibility reasons, this behaviour will work as long as the value of `embedded` is truthy
> but we plan to remove it in a future version.  
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

The startup object will be merged into your `APP` configuration key, which is very useful, for 
instance, if you want to change the `rootElement` of your application and other context-sensitive
values.

Consider the following `config/environment.js` file:

```js
  let ENV = {
    APP: {
      rootElement: `#some-element`,
    },

    embedded: {
      config: {
        option1: 'value-1',
      },
    },
  };
```

And the application is started that way:

```js
<script>
  MyApp.start({ option2: 'value-2' });
</script>
```

This would result in:

```js
import APP_ENV_CONFIG from 'my-app/config/environment'

assert.deepEqual(
  APP_ENV_CONFIG,
  {
    APP: {
      option2: 'value-2',
      rootElement: `#some-element`,
    },

    embedded: {
      config: {
        option1: 'value-1',
      },
    },
  }
);
```


### About the test environment

In your tests suite, you will probably want to let your application start automatically without this
addon interfering.

To do that, make sure to disable the addon for the `test` environment:

```js
// file `config/environment.js`

if (environment === 'test') {
  ENV.embedded.delegateStart = false;
}
```


### TypeScript support

If your consuming application relies TypeScript, you can make you life a bit easier by using the
included types:

**File `/types/my-project/index.d.ts`**

```ts
import type BaseEmbeddedService from 'ember-cli-embedded/services/embedded';

declare global {

  type EmbeddedService = BaseEmbeddedService<{
    one: string;
    two?: string;
  }>;

}

export {};
```

**File `/app/components/my-component.ts`**

```ts
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class MyComponent extends Component {
  /**
   * To know why the modifier `declare` should be used when injecting a Service:
   * https://github.com/typed-ember/ember-cli-typescript/issues/1406#issuecomment-778660505
   */
  @service
  declare embedded: EmbeddedService;

  get one() { // Return type inferred: `string | undefined`
    return this.embedded.get('one');
  }

  get two() {
    // TypeScript returns an error as `twoo` is not a recognised key
    return this.embedded.get('twoo');
  }
}
```


## Contributing

See the [Contributing](./CONTRIBUTING.md) guide for details.

## Contributors

<!-- readme: contributors,ember-tomster/- -start -->
<table>
<tr>
    <td align="center">
        <a href="https://github.com/MrChocolatine">
            <img src="https://avatars.githubusercontent.com/u/47531779?v=4" width="100;" alt="MrChocolatine"/>
            <br />
            <sub><b>MrChocolatine</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/xcambar">
            <img src="https://avatars.githubusercontent.com/u/657654?v=4" width="100;" alt="xcambar"/>
            <br />
            <sub><b>xcambar</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/GreatWizard">
            <img src="https://avatars.githubusercontent.com/u/1322081?v=4" width="100;" alt="GreatWizard"/>
            <br />
            <sub><b>GreatWizard</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/yonmey">
            <img src="https://avatars.githubusercontent.com/u/3025706?v=4" width="100;" alt="yonmey"/>
            <br />
            <sub><b>yonmey</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/jacky-peopledoc">
            <img src="https://avatars.githubusercontent.com/u/45593806?v=4" width="100;" alt="jacky-peopledoc"/>
            <br />
            <sub><b>jacky-peopledoc</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/romgere">
            <img src="https://avatars.githubusercontent.com/u/13900970?v=4" width="100;" alt="romgere"/>
            <br />
            <sub><b>romgere</b></sub>
        </a>
    </td></tr>
<tr>
    <td align="center">
        <a href="https://github.com/cah-danmonroe">
            <img src="https://avatars.githubusercontent.com/u/11519684?v=4" width="100;" alt="cah-danmonroe"/>
            <br />
            <sub><b>cah-danmonroe</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/saintsebastian">
            <img src="https://avatars.githubusercontent.com/u/8288415?v=4" width="100;" alt="saintsebastian"/>
            <br />
            <sub><b>saintsebastian</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/ewjoachim">
            <img src="https://avatars.githubusercontent.com/u/1457576?v=4" width="100;" alt="ewjoachim"/>
            <br />
            <sub><b>ewjoachim</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/BlueCutOfficial">
            <img src="https://avatars.githubusercontent.com/u/22059380?v=4" width="100;" alt="BlueCutOfficial"/>
            <br />
            <sub><b>BlueCutOfficial</b></sub>
        </a>
    </td></tr>
</table>
<!-- readme: contributors,ember-tomster/- -end -->

## License

This project is licensed under the [MIT License](LICENSE.md).
