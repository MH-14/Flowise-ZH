import { INode, INodeData, INodeParams } from '../../../src/Interface'
import { getBaseClasses } from '../../../src/utils'
import { ReadFileTool } from 'langchain/tools'
import { NodeFileStore } from 'langchain/stores/file/node'

class ReadFile_Tools implements INode {
    label: string
    name: string
    description: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    inputs: INodeParams[]

    constructor() {
        this.label = '文件读取'
        this.name = 'readFile'
        this.type = 'ReadFile'
        this.icon = 'readfile.svg'
        this.category = 'Tools'
        this.description = '从磁盘中读取文件'
        this.baseClasses = [this.type, 'Tool', ...getBaseClasses(ReadFileTool)]
        this.inputs = [
            {
                label: '基础路径',
                name: 'basePath',
                placeholder: `C:\\Users\\User\\Desktop`,
                type: 'string',
                optional: true
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const basePath = nodeData.inputs?.basePath as string
        const store = basePath ? new NodeFileStore(basePath) : new NodeFileStore()
        return new ReadFileTool({ store })
    }
}

module.exports = { nodeClass: ReadFile_Tools }
