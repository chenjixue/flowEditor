<template>
  <VueFlow
      class="agent-flow"
      :nodes="initData.nodes"
      :edges="initData.edges"
      :default-viewport="defaultViewport"
      :min-zoom="minZoom"
      :max-zoom="maxZoom"
      ref="vueFlowRef"
      :connection-mode="ConnectionMode.Strict"
      @init="handleInit"
  >
    <!--    自定义边-->
    <template #edge-button="buttonEdgeProps">
      <EdgeWithButton
          :id="buttonEdgeProps.id"
          :source-x="buttonEdgeProps.sourceX"
          :source-y="buttonEdgeProps.sourceY"
          :target-x="buttonEdgeProps.targetX"
          :target-y="buttonEdgeProps.targetY"
          :source-position="buttonEdgeProps.sourcePosition"
          :target-position="buttonEdgeProps.targetPosition"
          :marker-end="buttonEdgeProps.markerEnd"
          :style="buttonEdgeProps.style"
          :source-node="buttonEdgeProps.sourceNode"
          :target-node="buttonEdgeProps.targetNode"
      />
    </template>
    <Background :gap="14" :style="{ background: backgroundColor }"/>
    <!--    节点处理-->
    <template #node-start="{ id, data }">
      <AgentFlowNodeTypeCommon :id="id" :data="data"/>
    </template>
    <template #node-end="{ id, data }">
      <AgentFlowNodeTypeCommon :id="id" :data="data"/>
    </template>
    <template #node-model="{ id, data }">
      <AgentFlowNodeTypeCommon :id="id" :data="data"/>
    </template>
    <template #node-loop="{ id, data }">
      <AgentFlowNodeTypeNestParent :id="id" :data="data"/>
    </template>
    <template #node-condition="{ id, data }">
      <AgentFlowNodeTypeCondition :id="id" :data="data" />
    </template>
    <template #node-nestedStart="{ id, data }">
      <AgentFlowNodeTypeNestStart :id="id" :data="data"/>
    </template>
  </VueFlow>
</template>

<script setup>
import {computed, nextTick, watch, ref} from "vue";
import "@vue-flow/core/dist/style.css";
import "@vue-flow/core/dist/theme-default.css";
import {VueFlow, useVueFlow, Panel, ConnectionMode} from "@vue-flow/core";
import {Background} from "@vue-flow/background";
import AgentFlowNodeTypeCommon from "./AgentFlowNodeTypeCommon.vue";
import AgentFlowNodeTypeCondition from "@/components/AgentFlowNodeTypeCondition.vue";
import AgentFlowNodeTypeNestParent from "@/components/AgentFlowNodeTypeNestParent.vue";
import AgentFlowNodeTypeNestStart from "@/components/AgentFlowNodeTypeNestStart.vue";
import {useOperation} from "@/util/createNode.js";
import EdgeWithButton from "@/components/EdgeWithButton.vue";

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  defaultViewport: {
    type: Object,
    required: true,
  },
  backgroundColor: {
    type: String,
    default: "#f5f5f5",
  },
  minZoom: {
    type: Number,
    default: 0.2,
  },
  maxZoom: {
    type: Number,
    default: 4,
  },
});
let initData = []
watch(props.data, () => {
  initData = props.data
}, {
  immediate: true,
})
const {
  nodes,
  onPaneClick,
  onConnect,
  edges,
  findNode,
  removeEdges,
  addEdges,
  updateNodeInternals
} = useVueFlow();

onPaneClick(e => {
  document.dispatchEvent(new MouseEvent('mousedown', {
    bubbles: true,
    cancelable: true
  }))
})
let {collectDescendantNodes} = useOperation();

onConnect((connectingEdge) => {
  // 如果已有相同连线则无需处理
  if (
      edges.value.find(
          (e) =>
              e.sourceHandle === connectingEdge.sourceHandle &&
              e.targetHandle === connectingEdge.targetHandle
      )
  ) {
    return
  }
  // 禁止形成循环
  if (connectingEdge.source === connectingEdge.target) {
    return
  }
  const targetDescendants = collectDescendantNodes(connectingEdge.target)
  if (targetDescendants.some((t) => t.id === connectingEdge.source)) {
    return
  }
  const targetId = connectingEdge.target
  const targetNode = findNode(targetId)
  const sourceId = connectingEdge.source
  const sourceNode = findNode(sourceId)
  const edgeId = parseInt(Math.random() * 1000) + '';
  // 添加连线
  const newEdge = {
    id: edgeId,
    type: "button",
    ...connectingEdge
  }
  const oldSourceEdges = edges.value.filter((e) => e.sourceHandle === connectingEdge.sourceHandle)
  const oldTargetEdges = edges.value.filter((e) => e.targetHandle === connectingEdge.targetHandle)

  const oldSourceTargets = oldSourceEdges.map((e) => e?.target)
  const oldTargetSources = oldTargetEdges.map((e) => e?.source)

  const collectRemovingEdges = []
  collectRemovingEdges.push(...oldSourceEdges)

  // 当target节点为分支合并，允许连接多个source节点
  // if (targetNode?.type !== "convergence") {
  //   collectRemovingEdges.push(...oldTargetEdges)
  // }
  const removingEdgeIds = [...collectRemovingEdges.map((e) => e?.id).filter(Boolean)]
  removeEdges(removingEdgeIds)
  addEdges([newEdge])
  nextTick(() => {
    const needUpdateNodes = [...new Set(
        [
          ...oldSourceTargets,
          ...oldTargetSources,
          connectingEdge.source,
          connectingEdge.target
        ].filter(Boolean)
    )]
    updateNodeInternals(needUpdateNodes)
  })
})
</script>

<style lang="less" scoped>
.agent-flow {
  --node-transition-duration: 0.3s;

  :deep(.vue-flow__node) {
    // 节点样式
    .agent-flow-node-content {
      transition-property: box-shadow;
      transition-duration: var(--node-transition-duration);
      transition-timing-function: ease-in-out;
    }

    &:hover .agent-flow-node-content,
    .agent-flow-node-content.agent-flow-node-content--selected {
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.16) !important;
    }
  }

  :deep(.vue-flow__edge) {
    pointer-events: all;
  }
}
</style>
