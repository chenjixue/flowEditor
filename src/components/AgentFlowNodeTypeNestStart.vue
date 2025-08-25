<template>
  <div class="agent-flow-node__nest-start  nodrag nopan">
    <div class="agent-start">
    </div>
    <div class="agent-add" v-if="!hasChildNode">
      <div class="line"></div>
      <a-popover trigger="click" v-model:open="open" :arrow="false" :trigger="['click']" placement="rightTop">
        <button>
          <span>添加节点</span>
        </button>
        <template #content>
          <AgentFlowFloatAddMenu @click="addNode" :style="{ position: 'static' }"
            :disabled-node-types="calcDisabledNodeTypes"></AgentFlowFloatAddMenu>
        </template>
      </a-popover>
    </div>
    <AgentFlowSourceHandle :node-id="id" :handle-id="sourceId" :show-add-button="false" handle-type="source"
      :position="Position.Right" :style="{ top: '10px', pointerEvents: !hasChildNode ? 'none' : undefined }" />
  </div>

</template>

<script setup>
import { computed, inject, ref } from 'vue'
import { Position, useNode, useVueFlow } from '@vue-flow/core'
import AgentFlowSourceHandle from './AgentFlowSourceHandle.vue'
import AgentFlowFloatAddMenu from "@/components/AgentFlowFloatAddMenu.vue";
import { getSourceHandleId, useOperation } from "@/util/createNode.js";
import { useMenu } from "@/util/createNode.js";
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
const sourceId = computed(() => getSourceHandleId(props.id, "source"))
const open = ref(false);
const nestStartNode = useNode(props.id)
const parentNodeId = nestStartNode?.node?.parentNode
const { nodes } = useVueFlow()
const hasChildNode = computed(() => {
  if (!parentNodeId) {
    return []
  }
  const nestNodes = (nodes.value || []).filter((t) => t.parentNode === parentNodeId)
  const hasSomeNestNodes = nestNodes.length >= 2
  return hasSomeNestNodes
})
let { calcDisabledNodeTypes } = useMenu(props.id)
let { handleClick } = useOperation()
const addNode = (type) => {
  open.value = false
  handleClick(type, props.id)
}
</script>

<style lang="less" scoped>
.static-positon {
  position: static;
}

.agent-flow-node__nest-start {
  //background-color: red;
  position: relative;


  .agent-start {
    width: 20px;
    height: 20px;
    border-radius: 10px;
    //background: #00f;
    background-color: red;
  }

  .agent-add {
    position: absolute;
    width: 200px;
    display: flex;
    align-items: center;
    top: -1px;
    left: 20px;

    .line {
      height: 2px;
      width: 50px;
      background: #606266;
    }
  }

  .line {
    height: 1px;
  }
}
</style>
