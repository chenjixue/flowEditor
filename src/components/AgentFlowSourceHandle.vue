<template>
  <a-popover
      v-model:open="open"
      :arrow="false"
      :trigger="['click']"
      placement="rightTop"
      :overlay-inner-style="{
      padding: '8px'
    }"
  >
    <Handle
        :id="handleId"
        :type="handleType"
        :position="position"
        class="agent-flow-source-handle"
        :class="handleClassName"
        :style="style"
    >
      <div
          ref="handleSizeRef"
          class="agent-flow-source-handle__add-icon-wrap"
      >
        <img
            v-if="showAddButton"
            src='/img/node-icon-add-next.svg'
            class="agent-flow-source-handle__add-icon"
        />
      </div>
      <div
          class="agent-flow-source-handle__connect-end"
          :class="`agent-flow-source-handle__connect-end--${position}`"
          :style="{
          backgroundColor:'#b1b1b7'
        }"
      ></div>
    </Handle>
    <template #content>
      <AgentFlowFloatAddMenu @click="addNode" :style="{position: 'static'}"></AgentFlowFloatAddMenu>
    </template>
  </a-popover>
</template>

<script setup>
import {computed, inject, ref, onBeforeUnmount, watch, getCurrentInstance} from 'vue'
import {useNode, Handle, useVueFlow} from '@vue-flow/core'
import AgentFlowFloatAddMenu from "@/components/AgentFlowFloatAddMenu.vue";
import {getSourceHandleId, useOperation} from "@/util/createNode.js";
import {AgentFlowSourceHandleType} from "@/util/AgentFlowEnum.js";

const {proxy: instance} = getCurrentInstance()

const props = defineProps({
  /** nodeId */
  nodeId: {
    type: String,
    default: ''
  },
  handleType: {
    type: String,
    default: ''
  },
  position: {
    type: String,
    default: 'right'
  },
  showAddButton: {
    type: Boolean,
    default: true
  },
  style: {
    type: [Object, String],
    default: ''
  }
})
const node = useNode(props.nodeId)
const handleId = computed(() => {
      if (props.handleType === 'target') {
        return getSourceHandleId(props.nodeId, AgentFlowSourceHandleType.Target)
      }
      if (props.handleType === 'source') {
        return getSourceHandleId(props.nodeId, AgentFlowSourceHandleType.Source)
      }
    }
)
const isConnected = computed(() => {
  return Boolean(
      node?.connectedEdges?.value?.some(
          (t) => t.sourceHandle === handleId.value || t.targetHandle === handleId.value
      )
  )
})

const handleClassName = computed(() => {
  const cls = []
  cls.push(`agent-flow-source-handle--${props.position}`)
  if (isConnected.value) {
    cls.push('agent-flow-source-handle--connected')

    return cls
  }
  if (!isConnected.value) {
    cls.push('agent-flow-source-handle--not-connected')
  }
  return cls
})
let {handleClick} = useOperation()
const open = ref(false)
const addNode = (type) => {
  open.value = false
  if (props.handleType === "source") {
    handleClick(type, props.nodeId, null)
  }
  if (props.handleType === "target") {
    handleClick(type, null, props.nodeId)
  }
}
</script>

<style lang="less">
.agent-flow-source-handle {
  --handle-width: 32px;

  width: var(--handle-width);
  height: 16px;
  top: 28px;
  border-width: 0;
  background: transparent;
  opacity: 0;
}

.agent-flow-source-handle__connect-end {
  display: none;
  position: absolute;
  z-index: 1;
  width: calc(var(--handle-width) / 2 - 2px);
  height: 1px;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  pointer-events: none;

  &.agent-flow-source-handle__connect-end--left {
    right: unset;
    left: 0;
  }
}

/**
1. 已连接：展示连接样式
2. 未连接，正在连接，且鼠标未悬浮：展示连接样式
*/
.agent-flow-source-handle--connected,
.agent-flow-source-handle--connecting:not(.agent-flow-source-handle--not-connected:hover),
.agent-flow-source-handle--not-connected.vue-flow__handle-connecting {
  opacity: 1;
  width: var(--handle-width) !important;
  height: 16px;

  .agent-flow-source-handle__connect-end {
    display: block;
  }

  &.agent-flow-source-handle--left {
    &::after {
      position: absolute;
      content: '';
      background: #3a77f0;
      width: 2px;
      height: 8px;
      top: 4px;
      right: calc(var(--handle-width) / 2);
    }
  }

  &.agent-flow-source-handle--right {
    &::after {
      position: absolute;
      content: '';
      background: #3a77f0;
      width: 2px;
      height: 8px;
      top: 4px;
      left: calc(var(--handle-width) / 2);
    }
  }

  .agent-flow-source-handle__add-icon-wrap {
    opacity: 0;
  }
}

/**
未连接，悬浮、聚焦：展示按钮
*/
.vue-flow__node:hover .agent-flow-source-handle--not-connected,
.agent-flow-source-handle--focus.agent-flow-source-handle--not-connected,
.agent-flow-source-handle--not-connected.agent-flow-source-handle--open {
  width: var(--handle-width);
  opacity: 1;

  &:hover {
    .agent-flow-source-handle__add-icon-wrap {
      transform: scale(1.3);
    }
  }
}

.agent-flow-source-handle__add-icon-wrap {
  pointer-events: none;
  position: absolute;
  top: 0;
  left: calc((var(--handle-width) - 16px) / 2);
  width: 16px;
  height: 16px;

  background: #3a77f0;
  border-radius: 50%;

  transition: transform 0.2s ease-in-out;
  transform-origin: center;

  img {
    vertical-align: top;
  }
}

.agent-flow-source-handle--waiting-connect {
  .agent-flow-source-handle__add-icon-wrap {
    opacity: 0;
    transform: scale(1) !important;
  }
}

.agent-flow-source-handle__add-icon {
  pointer-events: none;
}
</style>
