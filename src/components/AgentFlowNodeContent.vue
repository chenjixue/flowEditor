<template>
  <div :class="['agent-flow-node-content', data.type === 'loop' && 'is-loop']">
    <div class="header">
      节点类型{{ data.bizData.type }}
    </div>
    <AgentFlowNodeSummary v-if="data.type === 'loop'" :data="data" />
    <div class="single-node-content" v-else></div>
    <div v-if="data.type === 'loop'" class="agent-flow-node-content__nest-parent__resizer">
      <NodeResizer :min-height="resizerDimensionsLimit.height" :min-width="resizerDimensionsLimit.width" />
    </div>
  </div>
</template>

<script setup>
import AgentFlowNodeSummary from "@/components/AgentFlowNodeSummary.vue";
import { NodeResizer } from '@vue-flow/node-resizer'
import { computed } from 'vue'
import { useVueFlow } from "@vue-flow/core";
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
});
const { nodes } = useVueFlow()
const resizerDimensionsLimit = computed(() => {

  if (!props.id || props.data.type !== 'loop') {
    return {
      width: 0,
      height: 0,
    }
  }
  let children = nodes.value.filter((t) => t.parentNode === props.id)
  const maxPosition = {
    x: 0,
    y: 0
  }
  children.forEach((t) => {
    const rightX = t.position.x + t.dimensions.width
    const bottomY = t.position.y + t.dimensions.height

    if (rightX > maxPosition.x) maxPosition.x = rightX
    if (bottomY > maxPosition.y) maxPosition.y = bottomY
  })
  return {
    width: Math.max(maxPosition.x, 190),
    height: Math.max(maxPosition.y, 120)
  }
})
</script>

<style lang="less" scoped>
.agent-flow-node-content {
  width: 100%;
  min-width: 180px;
  box-sizing: border-box;

  .header {
    background: #fff;
    width: 100%;
  }

  .single-node-content {
    background: #fff;
    min-height: 90px;
  }

  border: 2px solid #ffffff;
  border-radius: 16px;
  //display: flex;
  //justify-content: center;
  //align-items: start;
  //min-height: 100px;
  //background: #fff;
  // overflow: hidden;
  //position: relative;
}
</style>
