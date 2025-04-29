<template>
  <AgentFlowNodeContent :id="id" :data="data" />

  <AgentFlowSourceHandle
    v-if="sourceHandle"
    :node-id="id"
    handle-type="source"
    :position="Position.Right"
  />
  <AgentFlowSourceHandle
    v-if="targetHandle"
    :node-id="id"
    handle-type="target"
    :position="Position.Left"
  />
</template>

<script setup>
import { Position } from '@vue-flow/core'
import '@vue-flow/node-resizer/dist/style.css'
import AgentFlowSourceHandle from './AgentFlowSourceHandle.vue'
import AgentFlowNodeContent from './AgentFlowNodeContent.vue'

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  data: {
    type: Object,
    required: true
  },
  sourceHandle: {
    type: Boolean,
    default: true
  },
  targetHandle: {
    type: Boolean,
    default: true
  }
})
</script>

<style lang="less" scoped></style>
