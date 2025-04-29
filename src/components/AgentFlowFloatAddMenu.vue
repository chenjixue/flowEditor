<template>
  <div class="add-menu">
    <div class="menu-item" @click="handerClick(type)" v-for="type in nodes" :key="type">{{ type }}节点</div>
  </div>
</template>
<script setup>
const emit = defineEmits(['click'])
let nodes = ['start', 'model', 'end','loop']

let handerClick = (type) => {
  emit("click", type)
}

</script>
<style lang="less" scoped>
.add-menu {
  width: 100px;
  position: fixed;
  top: 50%;
  transform: translateY("-50%");
  left: 0;
  background: #ffffff;
  .menu-item{
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #ddd;
  }
}
</style>