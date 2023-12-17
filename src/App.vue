<template>
  <main>
    <LottieArea />
  </main>
  <aside>
    <Sidebar />
  </aside>
</template>

<script setup>
import LottieArea from './components/LottieArea.vue'
import Sidebar from './components/Sidebar.vue'
</script>

<style lang="less">
main,
aside {
  height: 100%;
}

main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
aside {
  width: 360px;
  background-color: #fff;
  border-left: 1px solid var(--divider_color);
}
</style>