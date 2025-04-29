<template>
  <div class="agent-flow-add-menu">
    <a-tooltip v-if="copiedMenuItem?.type" placement="right">
      <template #title
        >将复制的{{ AgentFlowNodeTypeName[copiedMenuItem.type] }}节点添加到此处</template
      >

      <div class="node-type-item" @click="handlePaste()">
        <AgentFlowNodeIcon :type="copiedMenuItem.type" />

        <span>粘贴{{ AgentFlowNodeTypeName[copiedMenuItem.type] }}节点</span>
      </div>
    </a-tooltip>

    <a-tooltip v-for="type in noGroupTypes" :key="type" placement="right">
      <template #title>{{ tips[type] }}</template>

      <div class="node-type-item" @click="handleClick(type)">
        <AgentFlowNodeIcon :type="type" />

        <span>{{ AgentFlowNodeTypeName[type] }}</span>
      </div>
    </a-tooltip>

    <div v-if="groupCycleTypes.length" class="node-type-title">多轮</div>

    <a-tooltip v-for="type in groupCycleTypes" :key="type" placement="right">
      <template #title>{{ tips[type] }}</template>

      <div class="node-type-item" @click="handleClick(type)">
        <AgentFlowNodeIcon :type="type" />

        <span>{{ AgentFlowNodeTypeName[type] }}</span>
      </div>
    </a-tooltip>

    <div v-if="groupComponentTypes.length" class="node-type-title">工具</div>

    <a-tooltip v-for="type in groupComponentTypes" :key="type" placement="right">
      <template #title>{{ tips[type] }}</template>

      <div class="node-type-item" @click="handleClick(type)">
        <AgentFlowNodeIcon :type="type" />

        <span>{{ AgentFlowNodeTypeName[type] }}</span>
      </div>
    </a-tooltip>

    <div v-if="groupTransformTypes.length" class="node-type-title">转换</div>

    <a-tooltip v-for="type in groupTransformTypes" :key="type" placement="right">
      <template #title>{{ tips[type] }}</template>

      <div class="node-type-item" @click="handleClick(type)">
        <AgentFlowNodeIcon :type="type" />

        <span>{{ AgentFlowNodeTypeName[type] }}</span>
      </div>
    </a-tooltip>

    <div v-if="groupLogicalTypes.length" class="node-type-title">逻辑</div>

    <a-tooltip v-for="type in groupLogicalTypes" :key="type" placement="right">
      <template #title>{{ tips[type] }}</template>

      <div class="node-type-item" @click="handleClick(type)">
        <AgentFlowNodeIcon :type="type" />

        <span>{{ AgentFlowNodeTypeName[type] }}</span>
      </div>
    </a-tooltip>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue'
import { cloneDeep } from 'lodash-es'
import {
  AgentFlowNodeType,
  AgentFlowNodeTypeName,
  AgentFlowNodeTips as tips
} from './AgentFlowEnum.js'
import AgentFlowNodeIcon from './AgentFlowNodeIcon.vue'

const emit = defineEmits(['add', 'paste'])

const globalDisabledNodeTypes = inject('agent-flow-disabled-node-types', { value: [] })

const props = defineProps({
  disabledNodeTypes: {
    type: Array,
    default: () => []
  }
})

const allDisabledTypes = computed(() => {
  return [...(globalDisabledNodeTypes?.value || []), ...props.disabledNodeTypes]
})

const copiedNode = inject('agent-flow-copied-node')

const copiedMenuItem = computed(() => {
  const nodeData = copiedNode.value?.appendNodes?.[0]

  if (!nodeData) return null

  const copiedType = nodeData.type

  if (allDisabledTypes.value.includes(copiedType)) {
    return null
  }

  return nodeData
})

const noGroupTypes = computed(() => {
  const list = [AgentFlowNodeType.End]

  return list.filter((t) => !allDisabledTypes.value.includes(t))
})

const groupCycleTypes = computed(() =>
  [
    AgentFlowNodeType.ScriptInputCondition,
    AgentFlowNodeType.JumpOut,
    AgentFlowNodeType.ScriptLoopOutput,
    AgentFlowNodeType.Output
  ].filter((t) => !allDisabledTypes.value.includes(t))
)

const groupComponentTypes = computed(() =>
  [
    AgentFlowNodeType.Model,
    AgentFlowNodeType.Plugin,
    AgentFlowNodeType.Workflow,
    AgentFlowNodeType.Scriptflow,
    AgentFlowNodeType.Agent,
    AgentFlowNodeType.Knowledge,
    AgentFlowNodeType.Function
  ].filter((t) => !allDisabledTypes.value.includes(t))
)

const groupTransformTypes = computed(() =>
  [
    AgentFlowNodeType.VariableSet,
    AgentFlowNodeType.VariableGroup,
    AgentFlowNodeType.ConditionSet,
    AgentFlowNodeType.ProgramTemplate
  ].filter((t) => !allDisabledTypes.value.includes(t))
)

const groupLogicalTypes = computed(() =>
  [
    AgentFlowNodeType.Condition,
    AgentFlowNodeType.Convergence,
    AgentFlowNodeType.Loop,
    AgentFlowNodeType.Parallel
  ].filter((t) => !allDisabledTypes.value.includes(t))
)

const handleClick = (type) => {
  emit('add', type)
}

const handlePaste = () => {
  emit('add', cloneDeep(copiedNode.value))
}
</script>

<style lang="less" scoped>
.agent-flow-add-menu {
  .node-type-item {
    padding: 0 12px;
    width: 200px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    cursor: pointer;

    &:hover {
      background-color: rgba(48, 49, 51, 0.06);
    }

    :deep(.agent-flow-icon) {
      width: 18px;
      height: 18px;
      border-radius: 6px;
      margin-right: 8px;

      &.agent-flow-icon__convergence {
        > img {
          transform: scale(0.85);
        }
      }

      &.agent-flow-icon__loop {
        > img {
          transform: scale(1.1);
        }
      }
    }
  }

  .node-type-title {
    color: rgb(107, 114, 128);
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
    margin: 3px 12px;
  }
}
</style>
