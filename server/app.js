import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import router from './router.js'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()
app.use(cors())
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

const __dirname = path.dirname(fileURLToPath(import.meta.url))
app.use('/', express.static(path.join(__dirname, '../docs')))
app.use('/download', express.static(path.join(__dirname, './temp')))

app.use('/api', router)

const PORT = process.env.PORT || 9000
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})
