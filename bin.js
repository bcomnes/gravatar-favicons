#!/usr/bin/env node
import cliOpts from 'cliclopts'
import path from 'path'
import fs from 'fs/promises' // Use promises version of fs
import minimist from 'minimist'
import gravatarFavicon from './index.js'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const data = await fs.readFile(path.resolve(dirname, './package.json'), 'utf-8')
const { version } = JSON.parse(data)

const allowedOptions = [
  {
    name: 'email',
    abbr: 'e',
    help: 'email address to generate favicons for (override\'s config email)'
  },
  {
    name: 'dest',
    abbr: 'd',
    help: 'destination path to write artifacts too'
  },
  {
    name: 'config',
    abbr: 'c',
    help: 'path to config file to use'
  },
  {
    name: 'help',
    abbr: 'h',
    help: 'show help',
    boolean: true
  },
  {
    name: 'version',
    abbr: 'v',
    help: 'print the version of the program'
  }
]

const opts = cliOpts(allowedOptions)
const argv = minimist(process.argv.slice(2), opts.options())

if (argv.help || (!argv.email && !argv.dest && !argv.config)) {
  console.log('Usage: gravatar-favicons [options]')
  opts.print()
  process.exit()
}

if (argv.version) {
  console.log(version)
  process.exit()
}

const config = {}

if (argv.config) {
  const configPath = path.resolve(process.cwd(), argv.config)
  const configImport = await import(configPath)
  Object.assign(config, configImport.default)
  if (config.dest) {
    // allow relative path resolution from configPath
    config.dest = path.resolve(path.dirname(configPath), config.dest)
  }
}

if (argv.email) {
  Object.assign(config, { email: argv.email })
}

if (argv.dest) {
  // allow path override from command line
  Object.assign(config, { dest: path.resolve(process.cwd(), argv.dest) })
}

if (!config.email) {
  console.error('Missing required field: email')
  process.exit(1)
}

if (!config.dest) {
  console.error('Missing required field: dest')
  process.exit(1)
}

gravatarFavicon(config, console.log, (err, results) => {
  if (err) throw err

  console.log('All done!')
})
