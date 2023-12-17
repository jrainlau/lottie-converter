<template>
  <div class="lottie-area">
    <div v-if="!jsonUrl" class="upload" @dragover.prevent @drop="handleDrop">
      Drag lottie json file here
    </div>

    <div class="preview" :style="lottieSizeStyle" v-if="jsonUrl" @dragover.prevent @drop="handleDrop">
      <lottie-player
        ref="lottiePlayer"
        class="renderer"
        autoplay
        loop
        controls
        :background="backgroundColor"
        mode="normal"
        renderer="svg"
        :src="jsonUrl"
      ></lottie-player>
    </div>
  </div>
</template>

<script>
import { toRaw } from 'vue'
import { mapState, mapActions } from 'pinia'
import useStore from '../store'
import eventBus from '../eventBus'

export default {
  data() {
    return {
      jsonUrl: '',
      filename: '',
      file: null,
    }
  },
  computed: {
    ...mapState(useStore, ['showBackground', 'size']),
    backgroundColor() {
      return this.showBackground ? '#fff' : 'transparent'
    },
    lottieSizeStyle() {
      return {
        width: `${this.size * 2}px`,
        height: `${this.size * 2 + 35}px`,
      }
    }
  },
  mounted() {
    eventBus.on('export-png', (percentage) => {
      this.exportFrame(percentage)
    })
    eventBus.on('export-apng', () => {
      this.exportApng(toRaw(this.file))
    })
  },
  methods: {
    ...mapActions(useStore, ['updateReadyToExport']),
    async handleDrop(event) {
      event.preventDefault()

      this.jsonUrl = ''
      this.filename = ''
      this.file = null

      await this.$nextTick()

      const file = event.dataTransfer.files[0]
      this.file = file
      this.filename = file.name.replace('.json', '')

      const reader = new FileReader()
      reader.onload = () => {
        const url = URL.createObjectURL(file)
        this.jsonUrl = url
        this.updateReadyToExport(true)
      }
      reader.readAsText(file)
    },
    async exportFrame(percentage) {
      const { lottiePlayer } = this.$refs
      if (percentage !== 'current') {
        lottiePlayer.seek(percentage === 'first' ? 0 : '100%')
      }
      const svgData = lottiePlayer.snapshot(false)
      const image = new Image()
      image.src = URL.createObjectURL(new Blob([svgData], { type: 'image/svg+xml' }))
      image.width = this.size
      image.height = this.size
      image.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        const ctx = canvas.getContext('2d')
        ctx.imageSmoothingEnabled = false
        ctx.drawImage(image, 0, 0, image.width, image.height)
        const dataURL = canvas.toDataURL('image/png', 1.0)

        const link = document.createElement('a')
        link.download = `${this.filename}.png`
        link.href = dataURL
        link.click()
      }
    },
    exportApng(file) {
      const data = new FormData()
      data.append('lottieJson', file)
      const isDev = import.meta.env.DEV
      const domain = isDev ? 'http://localhost:9000' : ''
      
      fetch(`${domain}/api/upload`, {
        method: 'POST',
        body: data
      }).then(res => res.json())
        .then(res => {
          const { convertRes } = res
          if (convertRes.code !== 0) {
            console.log(res)
            return
          }
          const blob = new Blob([new Uint8Array(convertRes.data.data)], { type: 'image/png' })
          const url = URL.createObjectURL(blob)
          const anchorElement = document.createElement('a')
          anchorElement.href = url
          anchorElement.download = `${this.filename}.png`
          anchorElement.click()
          anchorElement.remove()
          URL.revokeObjectURL(url)
        })
        .catch(e => e)
    }
  }
}
</script>

<style lang="less" scoped>
.lottie-area {
  width: 600px;
  height: 600px;
  display: flex;
  justify-content: center;
  align-items: center;
  .upload {
    width: 100%;
    height: 100%;
    background: #fff;
    border-radius: 15px;
    border: 15px dashed var(--brand_color);
    box-sizing: border-box;
    color: var(--brand_color);
    font-size: 3em;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .preview {
    position: relative;
    border-radius: 15px;
    &::after {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: calc(100% - 35px);
      border-radius: 15px;
      border: 15px dashed var(--brand_color);
      box-sizing: border-box;
    }
  }
}
</style>