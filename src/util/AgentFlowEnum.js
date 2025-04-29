export const AgentFlowNodeType = {
  Start: 'start',
  End: 'end',
  Output: 'scriptOutput',
  JumpOut: 'scriptJumpOut',
  ScriptLoopOutput: 'scriptLoopOutput',
  Model: 'model',
  Plugin: 'plugin',
  Function: 'function',
  Agent: 'agent',
  VariableSet: 'variableSet',
  VariableGroup: 'variableGroup',
  ConditionSet: 'conditionSet',
  ProgramTemplate: 'programTemplate',

  Condition: 'condition',
  ScriptInputCondition: 'scriptInputCondition',
  Interface: 'interface',
  Loop: 'loop',
  Parallel: 'parallel',
  NestedStart: 'nestedStart',
  Workflow: 'workflow',
  Scriptflow: 'scriptflow',
  Convergence: 'convergence',
  Knowledge: 'knowledge'
}

export const AgentFlowNodeTypeName = {
  [AgentFlowNodeType.Start]: '开始',
  [AgentFlowNodeType.End]: '结束',
  [AgentFlowNodeType.ScriptInputCondition]: '准入判断',
  [AgentFlowNodeType.ScriptLoopOutput]: '循环输出',
  [AgentFlowNodeType.Output]: '输出',
  [AgentFlowNodeType.JumpOut]: '跳出',
  [AgentFlowNodeType.Model]: '大模型',
  [AgentFlowNodeType.Plugin]: '插件',
  [AgentFlowNodeType.Function]: '函数',
  [AgentFlowNodeType.Agent]: '子Agent',
  [AgentFlowNodeType.VariableSet]: '变量赋值',
  [AgentFlowNodeType.VariableGroup]: '变量聚合',
  [AgentFlowNodeType.ConditionSet]: '条件赋值',
  [AgentFlowNodeType.ProgramTemplate]: '编程模板',
  [AgentFlowNodeType.Condition]: '条件判断',
  [AgentFlowNodeType.Interface]: '接口',
  [AgentFlowNodeType.Loop]: '循环',
  [AgentFlowNodeType.Parallel]: '并行',
  [AgentFlowNodeType.NestedStart]: '',
  [AgentFlowNodeType.Workflow]: '工作流',
  [AgentFlowNodeType.Scriptflow]: '剧本流',
  [AgentFlowNodeType.Convergence]: '分支汇合',
  [AgentFlowNodeType.Knowledge]: '知识库'
}

export const AgentFlowNodeTips = {
  [AgentFlowNodeType.End]: '定义流程的结束和输出的变量',
  [AgentFlowNodeType.ScriptLoopOutput]:
    '输出当前剧本段的执行结果，下一轮从本次运行的起始节点重新开始运行',
  [AgentFlowNodeType.Output]: '输出当前剧本段的执行结果，下一轮从该节点的下一个节点开始运行',
  [AgentFlowNodeType.JumpOut]:
    '跳出当前剧本，无执行结果输出，下一轮从本次运行的起始节点重新开始运行',
  [AgentFlowNodeType.ScriptInputCondition]: '判断当前多轮流程是否可进入',
  [AgentFlowNodeType.Model]: '调用大模型理解并生成文本',
  [AgentFlowNodeType.Plugin]: '调用平台集成的插件，拓展 Agent 的能力边界',
  [AgentFlowNodeType.Workflow]: '工作流通过可视化的方式实现复杂、稳定的业务流程编排',
  [AgentFlowNodeType.Scriptflow]: '剧本流通过可视化的方式实现剧本式的业务SOP流程编排',
  [AgentFlowNodeType.Function]: '定义 Python 函数并执行，实现自定义逻辑',
  [AgentFlowNodeType.Agent]: '引用其他 Agent 并执行，实现 Multi-Agent',
  [AgentFlowNodeType.Interface]: '通过 HTTP 协议发送服务器请求调用接口',
  [AgentFlowNodeType.VariableSet]: '为一个新变量引用赋值其他变量的数据，或直接赋值新数据',
  [AgentFlowNodeType.VariableGroup]: '将多个变量聚合为一个字典变量',
  [AgentFlowNodeType.ConditionSet]: '根据不同条件为变量进行赋值',
  [AgentFlowNodeType.ProgramTemplate]: '使用Agent开发的编程模式语法编写自定义逻辑',
  [AgentFlowNodeType.Condition]: '通过 IF/ELSE 的条件将流程拆成不同分支',
  [AgentFlowNodeType.Loop]: '对列表对象执行多次步骤直至输出所有结果',
  [AgentFlowNodeType.Parallel]:
    '配置多个并行流程，并行运行的子节点需要是非堵塞式的写法，否则存在事件循环堵塞影响整体并发性',
  [AgentFlowNodeType.Convergence]:
    '将多个条件分支的节点进行汇合，汇合后可基于该节点添加新的下游节点',
  [AgentFlowNodeType.Knowledge]: '调用平台知识库'
}

export const AgentFlowSourceHandleType = {
  Source: 'source',
  Target: 'target',
  SourceIf: 'source_if',
  SourceElse: 'source_else'
}

export const AgentFlowConditionMergeType = {
  Or: 'or',
  And: 'and'
}
