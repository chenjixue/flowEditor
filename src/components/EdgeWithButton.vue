<script setup>
import { BaseEdge, EdgeLabelRenderer, getBezierPath, useVueFlow } from '@vue-flow/core'
import { computed, ref } from 'vue'
import AgentFlowFloatAddMenu from "@/components/AgentFlowFloatAddMenu.vue";
import { useOperation, useMenu } from "@/util/createNode.js";
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  sourceX: {
    type: Number,
    required: true,
  },
  sourceY: {
    type: Number,
    required: true,
  },
  targetX: {
    type: Number,
    required: true,
  },
  targetY: {
    type: Number,
    required: true,
  },
  sourcePosition: {
    type: String,
    required: true,
  },
  targetPosition: {
    type: String,
    required: true,
  },
  markerEnd: {
    type: String,
    required: false,
  },
  style: {
    type: Object,
    required: false,
  },
  targetNode: {
    type: Object,
    required: false,
  },
  sourceNode: {
    type: Object,
    required: false,
  }
})
let { calcDisabledNodeTypes } = useMenu(props.sourceNode.id || props.targetNode.id)
let { createNode, createEdge, insertNodeAt, handleClick } = useOperation()
let { addNodes, addEdges, onNodesInitialized, updateNodeInternals, removeEdges, findNode, nodes, edges } = useVueFlow()
const path = computed(() => getBezierPath(props))
let open = ref(false)
const edgeData = edges.value.find(e => e.id === props.id) || {}


const sourceHandle = edgeData.sourceHandle
const targetHandle = edgeData.targetHandle
let getHandleType = (handleId) => {
  if (!handleId) {
    return undefined
  }
  const parts = handleId.split('_')
  return parts.length > 1 ? parts.slice(1).join('_') : undefined
}
// 解析 handleType
const sourceHandleType = getHandleType(sourceHandle)
const targetHandleType = getHandleType(targetHandle)
let addNodeFromEdge = (type) => {
  open.value = false
  let sourceNodeId = props.sourceNode.id
  let targetNodeId = props.targetNode.id
  removeEdges([props.id])
  handleClick(type, sourceNodeId, targetNodeId, sourceHandleType, targetHandleType)
}
</script>

<script>
export default {
  inheritAttrs: false,
};
</script>

<template>
  <!-- You can use the `BaseEdge` component to create your own custom edge more easily -->
  <BaseEdge :id="id" :style="style" :path="path[0]" />

  <!-- Use the `EdgeLabelRenderer` to escape the SVG world of edges and render your own custom label in a `<div>` ctx -->
  <EdgeLabelRenderer>
    <a-popover v-model:open="open" :arrow="false" :trigger="['click']" placement="rightTop" :overlay-inner-style="{
      padding: '8px',
    }">
      <div :style="{
        pointerEvents: 'all',
        cursor: 'pointer',
        position: 'absolute',
        transform: `translate(-50%, -50%) translate(${path[1]}px,${path[2]}px)`,
      }" class="nodrag nopan">
        <img src="/img/node-icon-add-next.svg" class="agent-flow-source-handle__add-icon" />
      </div>
      <template #content>
        <AgentFlowFloatAddMenu @click="addNodeFromEdge" :disabled-node-types="calcDisabledNodeTypes"
          :style="{ position: 'static' }"></AgentFlowFloatAddMenu>
      </template>
    </a-popover>
  </EdgeLabelRenderer>
</template>
<style scoped>
.agent-flow-source-handle__add-icon {
  cursor: pointer;
}
</style>
