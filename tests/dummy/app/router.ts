import EmberRouter from '@ember/routing/router'
import config from 'dummy/config/environment'

export default class Router extends EmberRouter {
  override location = config.locationType
  override rootURL = config.rootURL
}

Router.map(function () {
  // Add route declarations here
})
