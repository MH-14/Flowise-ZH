import { INode, INodeData, INodeOutputsValue, INodeParams } from '../../../src/Interface'
import { FaissStore } from 'langchain/vectorstores/faiss'
import { Embeddings } from 'langchain/embeddings/base'
import { getBaseClasses } from '../../../src/utils'

class Faiss_Existing_VectorStores implements INode {
    label: string
    name: string
    description: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    inputs: INodeParams[]
    outputs: INodeOutputsValue[]

    constructor() {
        this.label = '加载存在的 Faiss 索引'
        this.name = 'faissExistingIndex'
        this.type = 'Faiss'
        this.icon = 'faiss.svg'
        this.category = 'Vector Stores'
        this.description = '从 Faiss 中加载现有的索引 (即: 文档已被插入或更新)'
        this.baseClasses = [this.type, 'VectorStoreRetriever', 'BaseRetriever']
        this.inputs = [
            {
                label: '嵌入向量',
                name: 'embeddings',
                type: 'Embeddings'
            },
            {
                label: '用于加载的 Base Path',
                name: 'basePath',
                description: '用于加载 faiss.index 文件的路径',
                placeholder: `C:\\Users\\User\\Desktop`,
                type: 'string'
            },
            {
                label: 'Top K',
                name: 'topK',
                description: 'Number of top results to fetch. Default to 4',
                placeholder: '4',
                type: 'number',
                additionalParams: true,
                optional: true
            }
        ]
        this.outputs = [
            {
                label: 'Faiss 检索器',
                name: 'retriever',
                baseClasses: this.baseClasses
            },
            {
                label: 'Faiss 向量存储',
                name: 'vectorStore',
                baseClasses: [this.type, ...getBaseClasses(FaissStore)]
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const embeddings = nodeData.inputs?.embeddings as Embeddings
        const basePath = nodeData.inputs?.basePath as string
        const output = nodeData.outputs?.output as string
        const topK = nodeData.inputs?.topK as string
        const k = topK ? parseFloat(topK) : 4

        const vectorStore = await FaissStore.load(basePath, embeddings)

        if (output === 'retriever') {
            const retriever = vectorStore.asRetriever(k)
            return retriever
        } else if (output === 'vectorStore') {
            ;(vectorStore as any).k = k
            return vectorStore
        }
        return vectorStore
    }
}

module.exports = { nodeClass: Faiss_Existing_VectorStores }
