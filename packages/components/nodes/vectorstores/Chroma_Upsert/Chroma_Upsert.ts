import { INode, INodeData, INodeOutputsValue, INodeParams } from '../../../src/Interface'
import { Chroma } from 'langchain/vectorstores/chroma'
import { Embeddings } from 'langchain/embeddings/base'
import { Document } from 'langchain/document'
import { getBaseClasses } from '../../../src/utils'

class ChromaUpsert_VectorStores implements INode {
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
        this.label = '插入或更新 Chroma 文档'
        this.name = 'chromaUpsert'
        this.type = 'Chroma'
        this.icon = 'chroma.svg'
        this.category = 'Vector Stores'
        this.description = '将文档插入或更新到 Chroma 中'
        this.baseClasses = [this.type, 'VectorStoreRetriever', 'BaseRetriever']
        this.inputs = [
            {
                label: '文档',
                name: 'document',
                type: 'Document',
                list: true
            },
            {
                label: '嵌入向量',
                name: 'embeddings',
                type: 'Embeddings'
            },
            {
                label: 'Collection 名称',
                name: 'collectionName',
                type: 'string'
            },
            {
                label: 'Chroma 链接',
                name: 'chromaURL',
                type: 'string',
                optional: true
            }
        ]
        this.outputs = [
            {
                label: 'Chroma 检索器',
                name: 'retriever',
                baseClasses: this.baseClasses
            },
            {
                label: 'Chroma 向量存储',
                name: 'vectorStore',
                baseClasses: [this.type, ...getBaseClasses(Chroma)]
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const collectionName = nodeData.inputs?.collectionName as string
        const docs = nodeData.inputs?.document as Document[]
        const embeddings = nodeData.inputs?.embeddings as Embeddings
        const chromaURL = nodeData.inputs?.chromaURL as string
        const output = nodeData.outputs?.output as string

        const flattenDocs = docs && docs.length ? docs.flat() : []
        const finalDocs = []
        for (let i = 0; i < flattenDocs.length; i += 1) {
            finalDocs.push(new Document(flattenDocs[i]))
        }

        const obj: {
            collectionName: string
            url?: string
        } = { collectionName }
        if (chromaURL) obj.url = chromaURL

        const vectorStore = await Chroma.fromDocuments(finalDocs, embeddings, obj)

        if (output === 'retriever') {
            const retriever = vectorStore.asRetriever()
            return retriever
        } else if (output === 'vectorStore') {
            return vectorStore
        }
        return vectorStore
    }
}

module.exports = { nodeClass: ChromaUpsert_VectorStores }
