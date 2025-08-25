<template>
  <AgentFlowNodeContent :id="id" :data="data" />

  <!-- 左侧输入 -->
  <AgentFlowSourceHandle :node-id="id" :handle-id="targetId" handle-type="target" :position="Position.Left" />

  <!-- 右侧两个输出：if / else -->
  <AgentFlowSourceHandle :node-id="id" :handle-id="sourceIdIf" handle-type="source_if" :position="Position.Right"
    :style="{ top: '18px' }" />
  <AgentFlowSourceHandle :node-id="id" :handle-id="sourceIdElse" handle-type="source_else" :position="Position.Right"
    :style="{ top: '50px' }" />
</template>

<script setup>
import { Position } from '@vue-flow/core'
import AgentFlowSourceHandle from './AgentFlowSourceHandle.vue'
import AgentFlowNodeContent from './AgentFlowNodeContent.vue'
import { getSourceHandleId } from "@/util/createNode.js";
import { AgentFlowSourceHandleType } from "@/util/AgentFlowEnum.js";
import { computed } from "vue";
const props = defineProps({
  id: {
    type: String,
    required: true
  },
  data: {
    type: Object,
    required: true
  }
})
const sourceIdIf = computed(() => getSourceHandleId(props.id, AgentFlowSourceHandleType.SourceIf))
const sourceIdElse = computed(() =>
  getSourceHandleId(props.id, AgentFlowSourceHandleType.SourceElse)
)
const targetId = computed(() => getSourceHandleId(props.id, AgentFlowSourceHandleType.Target))
</script>
