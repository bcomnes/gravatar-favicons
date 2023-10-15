import gravatarUrl from 'gravatar-url'
import favicons from 'favicons'
import { request } from 'undici' // Import the undici request method
import concatStream from 'concat-stream'
import pump from 'pump'
import path from 'path'
import BufferList from 'bl'
import fs from 'fs'
import fsp from 'fs/promises'
import fromString from 'from2-string'
import pAll from 'p-all'

export default async function gravatarFavicons (config, logger = (log) => {}) {
  config = Object.assign({}, config)
  const avatarUrl = gravatarUrl(config.email, { size: 1024 })

  const imageBuf = await fetchPicture(avatarUrl)
  logger('got picture')

  const response = await favicons(imageBuf, config.faviconConfig)
  logger('got icons, making dir and saving')

  await fsp.mkdir(path.join(config.dest), { recursive: true })
  await handleFiles(response, config, logger)
}

async function fetchPicture (avatarUrl) {
  const { body } = await request(avatarUrl) // Use undici's request method
  return new Promise((resolve, reject) => {
    const concat = concatStream(resolve)
    pump(body, concat, (err) => {
      if (err) reject(err)
    })
  })
}

function handleFiles (response, config, logger) {
  const bufferJobs = response.images.map(file => () => writeBuffer(file, config.dest, logger))
  const fileJobs = response.files.map(file => () => writeFile(file, config.dest, logger))
  const snippetJob = () => writeSnippet(response.html, config.dest, logger)
  const jobs = [...bufferJobs, ...fileJobs, snippetJob]
  return pAll(jobs, 5)
}

function writeBuffer (file, dest, logger) {
  return new Promise((resolve, reject) => {
    logger('writing ' + file.name)
    const b = new BufferList(file.contents)
    const w = fs.createWriteStream(path.join(dest, file.name))
    pump(b, w, (err) => {
      if (err) reject(err)
      else resolve()
    })
  })
}

function writeFile (file, dest, logger) {
  return new Promise((resolve, reject) => {
    logger('writing ' + file.name)
    const b = fromString(file.contents)
    const w = fs.createWriteStream(path.join(dest, file.name))
    pump(b, w, (err) => {
      if (err) reject(err)
      else resolve()
    })
  })
}

function writeSnippet (html, dest, logger) {
  return new Promise((resolve, reject) => {
    logger('writing snippets.html')
    const b = fromString(html.join('\n'))
    const w = fs.createWriteStream(path.join(dest, 'snippets.html'))
    pump(b, w, (err) => {
      if (err) reject(err)
      else resolve()
    })
  })
}

export function gravatarFaviconsCallback (config, logger, cb) {
  gravatarFavicons(config, logger)
    .then(() => cb(null))
    .catch(err => cb(err))
}
