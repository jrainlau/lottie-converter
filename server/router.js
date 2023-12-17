import express from 'express'
import path from 'path'
import fs from 'fs'
import { upload, convertLottie2Apng } from './lottie2apng.js'

// 定义路由
const router = express.Router();

router.get('/test', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json({ msg: 'hello world, it\'s xxxx server!' });
})

router.post('/upload', upload.single('lottieJson'), async (req, res) => {
  const convertRes = await convertLottie2Apng(req.file)
  
  res.status(200).json({
    msg: 'ok',
    convertRes
  })
})

export default router
