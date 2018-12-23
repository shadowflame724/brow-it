const { hooks } = require('@adonisjs/ignitor');
// Import the mix manifest file
const manifest = require('../public/mix-manifest');

hooks.after.providersBooted(() => {
  const View = use('View');

  // Creating the mix function in edge views
  View.global('mix', function (asset) {
    if (!manifest[`/${asset}`]) {
      return '404-asset-not-found';
    }

    return manifest[`/${asset}`];
  })
});