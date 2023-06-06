import { INode, INodeData, INodeParams } from '../../../src/Interface'
import { getBaseClasses } from '../../../src/utils'
import { desc, RequestParameters, RequestsGetTool } from './core'

class RequestsGet_Tools implements INode {
    label: string
    name: string
    description: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    inputs: INodeParams[]

    constructor() {
        this.label = 'GET 请求'
        this.name = 'requestsGet'
        this.type = 'RequestsGet'
        this.icon = 'requestsget.svg'
        this.category = 'Tools'
        this.description = '执行 HTTP GET 请求'
        this.baseClasses = [this.type, ...getBaseClasses(RequestsGetTool)]
        this.inputs = [
            {
                label: 'URL',
                name: 'url',
                type: 'string',
                description: '机器人将调用此确切的URL. 如果没有指定, 机器人将尝试从提供的AI插件中自行确定',
                additionalParams: true,
                optional: true
            },
            {
                label: '描述',
                name: 'description',
                type: 'string',
                rows: 4,
                default: desc,
                description: '这个提示告诉代理程序何时使用这个工具',
                additionalParams: true,
                optional: true
            },
            {
                label: 'Headers',
                name: 'headers',
                type: 'json',
                additionalParams: true,
                optional: true
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const headers = nodeData.inputs?.headers as string
        const url = nodeData.inputs?.url as string
        const description = nodeData.inputs?.description as string

        const obj: RequestParameters = {}
        if (url) obj.url = url
        if (description) obj.description = description
        if (headers) {
            const parsedHeaders = typeof headers === 'object' ? headers : JSON.parse(headers)
            obj.headers = parsedHeaders
        }

        return new RequestsGetTool(obj)
    }
}

module.exports = { nodeClass: RequestsGet_Tools }
