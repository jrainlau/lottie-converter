import { defineStore } from 'pinia'

export default defineStore('store', {
  state: () => ({
    size: 240,
    showBackground: true,
    readyToExport: false,
  }),
  actions: {
    changeSize(val) {
      this.size = val
    },
    changeBackground(val) {
      this.showBackground = val
    },
    updateReadyToExport(val) {
      this.readyToExport = val
    },
  }
})
