<template>
  <div
    class="agent-flow-icon"
    :class="[
      [
        AgentFlowNodeType.Scriptflow,
        AgentFlowNodeType.Output,
        AgentFlowNodeType.ScriptLoopOutput,
        AgentFlowNodeType.JumpOut,
        AgentFlowNodeType.ScriptInputCondition,
        AgentFlowNodeType.Knowledge,
        AgentFlowNodeType.Parallel,
        AgentFlowNodeType.Loop,
        AgentFlowNodeType.ConditionSet,
        AgentFlowNodeType.ProgramTemplate
      ].includes(type) && 'agent-flow-icon--full-img',
      type === AgentFlowNodeType.Agent && 'agent-flow-icon__agent',
      type === AgentFlowNodeType.Function && 'agent-flow-icon__function',
      type === AgentFlowNodeType.Plugin && 'agent-flow-icon__plugin',
      type === AgentFlowNodeType.Workflow && 'agent-flow-icon__workflow',
      type === AgentFlowNodeType.Scriptflow && 'agent-flow-icon__scriptflow'
    ]"
    :style="{
      background: iconBg || 'none'
    }"
  >
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { AgentFlowNodeType } from '../util/AgentFlowEnum.js'

const props = defineProps({
  type: {
    type: String,
    default: ''
  }
})

const iconList = {
  [AgentFlowNodeType.Start]: '/assets/images/agentDev/agent-icon-start.svg',
  [AgentFlowNodeType.Loop]: '/assets/images/agentDev/agent-icon-loop.svg',
}

const imgSrc = computed(() => {
  if (!props.type) {
    return ''
  }

  return iconList[props.type] || ''
})


</script>

<style lang="less" scoped>
.agent-flow-icon {
  --tw-shadow: 0px 2px 4px -2px rgba(16, 24, 40, 0.06), 0px 4px 8px -2px rgba(16, 24, 40, 0.1);

  width: 28px;
  height: 28px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow:
    0 0 #0000,
    0 0 #0000,
    var(--tw-shadow);

  display: flex;
  justify-content: center;
  align-items: center;

  > img {
    width: 14px;
    height: 14px;
  }

  &.agent-flow-icon--full-img {
    > img {
      width: 100%;
      height: 100%;
    }
  }

  &.agent-flow-icon__workflow {
    > img {
      width: 16px;
      height: 16px;
    }
  }

  &.agent-flow-icon__plugin,
  &.agent-flow-icon__scriptflow {
    > img {
      width: 18px;
      height: 18px;
    }
  }

  &.agent-flow-icon__function {
    > img {
      width: 22px;
      height: 22px;
    }
  }

  &.agent-flow-icon__agent {
    > img {
      width: 24px;
      height: 24px;
    }
  }
}
</style>
