<template>
  <div class="agent_editor">
    <!--    工作流主体组件-->
    <AgentFlow :data="data">
    </AgentFlow>
    <!--    左侧节点选择菜单-->
    <AgentFlowFloatAddMenu @click="handleClick "></AgentFlowFloatAddMenu>
  </div>
</template>
<script setup>
import {ref, watch} from 'vue'
import AgentFlow from './components/AgentFlow.vue'
import {useVueFlow, SelectionMode} from '@vue-flow/core'
import AgentFlowFloatAddMenu from "@/components/AgentFlowFloatAddMenu.vue";
import mockData from '@/mock/test.json'
import {useOperation} from "@/util/createNode.js";

let data = ref(mockData)
let {handleClick} = useOperation()
</script>
<style scoped>
.agent_editor {
  height: 100vh;
  width: 100vw;
}

</style>
<style>
.vue-flow__edge-labels {
  z-index: 1001;
}
</style>
