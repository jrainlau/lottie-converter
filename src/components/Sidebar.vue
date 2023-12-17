<template>
  <el-form class="sidebar" label-position="top">
    <el-form-item label="Show background" label-position="right">
      <el-checkbox v-model="showBackground"></el-checkbox>
    </el-form-item>
    <el-form-item label="Square size setting">
      <el-input-number v-model="size" :controls="false" :max="240"></el-input-number>
      <span class="size"> x {{ size }}</span>
    </el-form-item>
    
    <div class="divider"></div>

    <el-form-item label="">
      <el-button type="primary" :disabled="!readyToExport" @click="exportFrame('first')">export FIRST frame</el-button>
    </el-form-item>
    <el-form-item label="">
      <el-button type="primary" :disabled="!readyToExport" @click="exportFrame('current')">export CURRENT frame</el-button>
    </el-form-item>
    <el-form-item label="">
      <el-button type="primary" :disabled="!readyToExport" @click="exportApng">export APNG</el-button>
    </el-form-item>

    <div class="link">
      More function could be found in <a href="https://lottiefiles.com/" target="_blank">lottiefiles.com</a>
    </div>
  </el-form>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import eventBus from '../eventBus'
import useStore from '../store'

export default {
  setup() {
    const store = useStore()
    return {
      defaultValues: {
        ...store.$state
      }
    }
  },
  data() {
    return {
      showBackground: this.defaultValues.showBackground,
      size: this.defaultValues.size,
    }
  },
  computed: {
    ...mapState(useStore, ['readyToExport']),
  },
  mounted() {
    eventBus.on('lottie-loaded', () => {
      this.allowExport = true
    })
  },
  watch: {
    showBackground(val) {
      this.changeBackground(val)
    },
    size(val) {
      this.changeSize(val)
    }
  },
  methods: {
    ...mapActions(useStore, ['changeBackground', 'changeSize']),
    exportFrame(percentage) {
      eventBus.emit('export-png', percentage)
    },
    exportApng() {
      eventBus.emit('export-apng')
    },
  },
}
</script>

<style lang="less" scoped>
.sidebar {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 30px;

  .size {
    color: rgb(149, 147, 147);
    margin-left: 15px;
  }
  .divider {
    width: 100%;
    height: 1px;
    background-color: var(--divider_color);
    margin: 30px 0;
  }

  .link {
    margin-top: 30px;
    color: #777575;
    font-size: 12px;
    a {
      color: var(--brand_color);
    }
  }
}
</style>