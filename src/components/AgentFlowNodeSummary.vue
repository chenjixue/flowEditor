<template>
  <div class="agent-flow-node-content__summaries">
    <!-- 嵌套节点的背景 -->
    <div v-if="isNestParent" class="agent-flow-node-content__nest-bg">
      <div
        class="agent-flow-node-content__nest-bg-fix agent-flow-node-content__nest-bg-fix__top"
      ></div>
      <div
        class="agent-flow-node-content__nest-bg-fix agent-flow-node-content__nest-bg-fix__left"
      ></div>
      <div
        class="agent-flow-node-content__nest-bg-fix agent-flow-node-content__nest-bg-fix__right"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const type = computed(() => props.data?.type)
const nodeDescription = computed(() => (props.data?.bizData?.description || '').trim())
const isNestParent = computed(() =>
  ['loop'].includes(props.data?.type)
)

const nodeDisplay = computed(() => {
  switch (type.value) {
    case AgentFlowNodeType.Start:
      return props.data?.bizData?.inputVariable
    case AgentFlowNodeType.End:
    case AgentFlowNodeType.Output:
    case AgentFlowNodeType.JumpOut:
    case AgentFlowNodeType.ScriptLoopOutput:
      return props.data?.bizData?.outputVariable
    case AgentFlowNodeType.Model:
      return props.data?.bizData
    case AgentFlowNodeType.Function:
    case AgentFlowNodeType.Agent:
    case AgentFlowNodeType.VariableSet:
    case AgentFlowNodeType.ConditionSet:
    case AgentFlowNodeType.ProgramTemplate:
      return null
    case AgentFlowNodeType.Condition:
    case AgentFlowNodeType.ScriptInputCondition:
      return props.data?.bizData
    default:
      return null
  }
})
</script>

<style lang="less" scoped>
.agent-flow-node-content__summaries {
  height: calc(100% - 24px) ;
  //width: 100%;
  min-height: 90px;
  flex: auto;
  color: #303133;
  margin: 0 -1px -1px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.agent-flow-node-content__nest-bg {
  min-height: 0;
  flex: auto;
  border: 7px solid #fff;
  border-radius: 14px;
  position: relative;

  .agent-flow-node-content__nest-bg-fix {
    position: absolute;
    background: #fff;
  }

  .agent-flow-node-content__nest-bg-fix__top {
    height: 7px;
    top: -7px;
    left: -7px;
    right: -7px;
  }

  .agent-flow-node-content__nest-bg-fix__left {
    width: 4px;
    height: 14px;
    left: -7px;
    top: -7px;
  }

  .agent-flow-node-content__nest-bg-fix__right {
    width: 4px;
    height: 14px;
    right: -7px;
    top: -7px;
  }
}
</style>
