const test = require('tape')
const gravatarFavicons = require('.')
const rimraf = require('rimraf')

test('can generate favicons', t => {
  const config = require('./example-config')
  rimraf.sync(config.dest)

  gravatarFavicons(config, console.log, (err, results) => {
    t.error(err, 'generate favicons without error')
    t.end()
  })
})
