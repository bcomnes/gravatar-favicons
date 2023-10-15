import test from 'node:test'
import assert from 'node:assert'
import gravatarFaviconsAsync from './index.js'
import { promises as fs } from 'node:fs'
import exampleConfig from './example-config.js'

test('can generate favicons', async () => {
  const config = exampleConfig

  // Remove the directory recursively
  try {
    await fs.rm(config.dest, { recursive: true, force: true })
  } catch (error) {
    // Handle case where directory doesn't exist or other FS-related errors
    console.warn(`Could not remove directory: ${error.message}`)
  }

  try {
    await gravatarFaviconsAsync(config, console.log)
    assert.ok(true, 'generate favicons without error')
  } catch (err) {
    assert.fail(`Test failed: ${err.message}`)
  }
})
