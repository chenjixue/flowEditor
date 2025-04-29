<template>
  <AgentFlowNodeContent :id="id" :data="data"/>

  <AgentFlowSourceHandle
      :node-id="id"
      handle-type="source"
      :position="Position.Right"
  />

  <AgentFlowSourceHandle
      :node-id="id"
      handle-type="target"
      :position="Position.Left"
  />
</template>

<script setup>
import {Position} from '@vue-flow/core'
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
})
</script>
