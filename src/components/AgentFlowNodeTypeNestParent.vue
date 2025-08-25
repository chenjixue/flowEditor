<template>
  <div class="agent-flow-node-type-nest-parent ">
    <AgentFlowNodeContent :id="id" :data="data" />

    <AgentFlowSourceHandle v-if="sourceHandle" :handle-id="sourceId" :node-id="id" handle-type="source"
      :position="Position.Right" />
    <AgentFlowSourceHandle v-if="targetHandle" :handle-id="targetId" :node-id="id" handle-type="target"
      :position="Position.Left" />
  </div>
</template>

<script setup>
import { Position } from '@vue-flow/core'
import '@vue-flow/node-resizer/dist/style.css'
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
const sourceId = computed(() => getSourceHandleId(props.id, AgentFlowSourceHandleType.Source))
const targetId = computed(() => getSourceHandleId(props.id, AgentFlowSourceHandleType.Target))
</script>

<style lang="less" scoped>
.agent-flow-node-type-nest-parent {
  height: 100%;
  width: 100%;

  ::v-deep .agent-flow-node-content {
    --add-width: 60px;
    --add-height: 60px;
    width: calc(100% + var(--add-width));
    height: calc(100% + var(--add-height));
    transform: translate(calc(-1 * var(--add-width) / 2), calc(-1 * var(--add-height) / 2));
  }

  ::v-deep .vue-flow__handle-right {
    right: -30px;
  }

  ::v-deep .vue-flow__handle-left {
    left: -30px;
  }
}
</style>
