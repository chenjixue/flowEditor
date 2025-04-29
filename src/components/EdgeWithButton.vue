<script setup>
import {BaseEdge, EdgeLabelRenderer, getBezierPath, useVueFlow} from '@vue-flow/core'
import {computed, ref} from 'vue'
import AgentFlowFloatAddMenu from "@/components/AgentFlowFloatAddMenu.vue";
import {useOperation} from "@/util/createNode.js";

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
  },
})

let {createNode, createEdge, insertNodeAt} = useOperation()
let {addNodes, addEdges, onNodesInitialized, updateNodeInternals, removeEdges, findNode, nodes} = useVueFlow()
const path = computed(() => getBezierPath(props))
let open = ref(false)
let addNodeFromEdge = (type) => {
  open.value = false
  let parentNodeId = props.sourceNode.parentNode
  let sourceNodeId = props.sourceNode.id
  let targetNodeId = props.targetNode.id
  removeEdges([props.id])
  const newNode = createNode(type);
  // 处理嵌套节点
  if (parentNodeId) {
    newNode.parentNode = parentNodeId
    newNode.expandParent = true
    newNode.data.bizData.parentNode = parentNodeId
  }
  const newEdgeOne = createEdge(sourceNodeId, newNode.id)
  const newEdgeTwo = createEdge(newNode.id, targetNodeId)
  // debugger
  addNodes(newNode);
  addEdges([newEdgeOne, newEdgeTwo]);

  const {off} = onNodesInitialized(() => {

    updateNodeInternals([sourceNodeId, targetNodeId])
    insertNodeAt(newNode.id, targetNodeId)
    if (parentNodeId) {
      const parentNode = findNode(parentNodeId)
      // 更新所有子节点、父节点
      const childrenIds = nodes.value
          .filter((t) => t.parentNode === parentNodeId)
          .map((t) => t.id)
      updateNodeInternals([parentNodeId, ...childrenIds])
    }
    off()
  })
}
</script>

<script>
export default {
  inheritAttrs: false,
}
</script>

<template>
  <!-- You can use the `BaseEdge` component to create your own custom edge more easily -->
  <BaseEdge :id="id" :style="style" :path="path[0]"/>

  <!-- Use the `EdgeLabelRenderer` to escape the SVG world of edges and render your own custom label in a `<div>` ctx -->
  <EdgeLabelRenderer>
    <a-popover
        v-model:open="open"
        :arrow="false"
        :trigger="['click']"
        placement="rightTop"
        :overlay-inner-style="{
      padding: '8px'
    }"
    >
      <div
          :style="{
        pointerEvents: 'all',
         cursor: 'pointer',
        position: 'absolute',
        transform: `translate(-50%, -50%) translate(${path[1]}px,${path[2]}px)`,
      }"
          class="nodrag nopan"
      >
        <img
            src='/img/node-icon-add-next.svg'
            class="agent-flow-source-handle__add-icon"
        />
      </div>
      <template #content>
        <AgentFlowFloatAddMenu @click="addNodeFromEdge" :style="{position: 'static'}"></AgentFlowFloatAddMenu>
      </template>
    </a-popover>
  </EdgeLabelRenderer>
</template>
<style scoped>
.agent-flow-source-handle__add-icon {
  cursor: pointer;
}
</style>
