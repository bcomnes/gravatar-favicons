const gravatarUrl = require('gravatar-url')
const favicons = require('favicons')
const fetch = require('node-fetch')
const concatStream = require('concat-stream')
const pump = require('pump')
const mkdirp = require('mkdirp')
const path = require('path')
const BufferList = require('bl')
const fs = require('fs')
const fsp = require('fs/promises')
const fromString = require('from2-string')
const parallelLimit = require('run-parallel-limit')

module.exports = gravatarFavicons
function gravatarFavicons (config, logger = (log) => {}, cb) {
  config = Object.assign({}, config)
  const avatarUrl = gravatarUrl(config.email, { size: 500 })

  const concat = concatStream(gotPicture)
  fetch(avatarUrl).then(resposne => {
    pump(resposne.body, concat, err => { if (err) cb(err) })
  }).catch(err => cb(err))

  function gotPicture (imageBuf) {
    logger('got picture')
    favicons(imageBuf, config.faviconConfig, handleIcons)
  }

  function handleIcons (err, response) {
    if (err) return cb(err)
    // handling icons
    // console.log(response.images) // Array of { name: string, contents: <buffer> }
    // console.log(response.files) // Array of { name: string, contents: <string> }
    // console.log(response.html)
    logger('got icons, making dir and saving')
    fsp.mkdirp(path.join(config.dest), { recursive: true }).then(handleFiles).catch(err => cb(err))

    function handleFiles (made) {
      const bufferJobs = response.images.map(file => {
        return (cb) => {
          logger('writing ' + file.name)
          const b = new BufferList(file.contents)
          const w = fs.createWriteStream(path.join(config.dest, file.name))
          pump(b, w, cb)
        }
      })

      const fileJobs = response.files.map(file => {
        return (cb) => {
          logger('writing ' + file.name)
          const b = fromString(file.contents)
          const w = fs.createWriteStream(path.join(config.dest, file.name))
          pump(b, w, cb)
        }
      })

      const snippetJob = (cb) => {
        logger('writing snippets.html')
        const b = fromString(response.html.join('\n'))
        const w = fs.createWriteStream(path.join(config.dest, 'snippets.html'))
        pump(b, w, cb)
      }

      const jobs = [].concat(bufferJobs).concat(fileJobs)
      jobs.push(snippetJob)

      parallelLimit(jobs, 5, cb)
    }
  }
}
