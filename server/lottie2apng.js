import fs from 'fs-extra'
import renderLottie from 'puppeteer-lottie'
import path from 'path'
import apng from 'node-apng'
import multer from 'multer'
import { pipeline } from 'stream'
import { promisify } from 'util'
import { __dirname } from './utils.js'

const pipelinePromise = promisify(pipeline)
const tempDir = path.resolve(__dirname, `./temp`)

export const upload = multer()

export async function saveFileToTemp(file) {
  try {
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir)
    }
    await pipelinePromise(file.stream, fs.createWriteStream(path.resolve(tempDir, file.originalName)))
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

export async function convertLottie2Apng(file) {
  try {
    await saveFileToTemp(file)
    const lottieJsonPath = path.resolve(tempDir, file.originalName)
    const filename = file.originalName.replace('.json', '')
    const outputPath = path.join(tempDir, 'frame-%d.png')
    const lottieData = await renderLottie({
      path: lottieJsonPath,
      output: outputPath,
      height: 320,
      width: 320,
    })

    let framenames = []

    for (let i = 1; i <= lottieData.numFrames; i++) {
      framenames.push(path.join(tempDir, `frame-${i}.png`))
    }

    const images = framenames.map(path => fs.readFileSync(path))

    const output = apng(images, index => ({
      numerator: lottieData.duration,
      denominator: lottieData.numFrames
    }))

    fs.removeSync(tempDir)
    return {
      code: 0,
      data: output
    }
  } catch(e) {
    console.log(e)
    return {
      code: -1,
      error: e
    }
  }
}
