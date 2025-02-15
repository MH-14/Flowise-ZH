import { INode, INodeData, INodeParams } from '../../../src/Interface'
import { initializeAgentExecutorWithOptions, AgentExecutor } from 'langchain/agents'
import { getBaseClasses } from '../../../src/utils'
import { Tool } from 'langchain/tools'
import { BaseLanguageModel } from 'langchain/base_language'
import { flatten } from 'lodash'

class MRKLAgentChat_Agents implements INode {
    label: string
    name: string
    description: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    inputs: INodeParams[]

    constructor() {
        this.label = 'MRKL Agent for Chat Models'
        this.name = 'mrklAgentChat'
        this.type = 'AgentExecutor'
        this.category = 'Agents'
        this.icon = 'agent.svg'
        this.description = '该代理程序使用ReAct框架来决定采取什么行动, 优化后可与聊天模型一起使用'
        this.baseClasses = [this.type, ...getBaseClasses(AgentExecutor)]
        this.inputs = [
            {
                label: '允许使用的工具',
                name: 'tools',
                type: 'Tool',
                list: true
            },
            {
                label: '语言模型',
                name: 'model',
                type: 'BaseLanguageModel'
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const model = nodeData.inputs?.model as BaseLanguageModel
        let tools = nodeData.inputs?.tools as Tool[]
        tools = flatten(tools)
        const executor = await initializeAgentExecutorWithOptions(tools, model, {
            agentType: 'chat-zero-shot-react-description',
            verbose: process.env.DEBUG === 'true' ? true : false
        })
        return executor
    }

    async run(nodeData: INodeData, input: string): Promise<string> {
        const executor = nodeData.instance as AgentExecutor
        const result = await executor.call({ input })

        return result?.output
    }
}

module.exports = { nodeClass: MRKLAgentChat_Agents }
