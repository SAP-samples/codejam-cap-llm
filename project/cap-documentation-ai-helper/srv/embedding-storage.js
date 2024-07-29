const cds = require('@sap/cds')
const { uuid } = cds.utils
const { INSERT, DELETE } = cds.ql
const { PDFLoader } = require('langchain/document_loaders/fs/pdf')
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter')
const path = require('path')
const filePath = 'db/data/CAP_Documentation_V8.pdf'
  
// Helper method to convert embeddings to buffer for insertion
let array2VectorBuffer = (data) => {
  const sizeFloat = 4
  const sizeDimensions = 4
  const bufferSize = data.length * sizeFloat + sizeDimensions

  const buffer = Buffer.allocUnsafe(bufferSize)
  // write size into buffer
  buffer.writeUInt32LE(data.length, 0)
  data.forEach((value, index) => {
    buffer.writeFloatLE(value, index * sizeFloat + sizeDimensions);
  })
  return buffer
}

async function loadPDF(fromPath) {
      const loader = new PDFLoader(fromPath)
      const document = await loader.load()
      return document
}

async function chunk(pdf) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 0,
    separators: ["."]
  })
    
  const textChunks = await splitter.splitDocuments(pdf)
  console.log(`Documents split into ${textChunks.length} chunks.`)
  return textChunks
}

module.exports = function() {
  this.on('storeEmbeddings', async (req) => {
    try {
      const vectorPlugin = await cds.connect.to('cap-llm-plugin')
      const { DocumentChunk } = this.entities
      let textChunkEntries = []

      const pdf = await loadPDF(path.resolve(`${filePath}`))

      const textChunks = await chunk(pdf)

      console.log("Generating the vector embeddings for the text chunks.")
      // For each text chunk generate the embeddings
      for (const chunk of textChunks) {
        const embedding = await vectorPlugin.getEmbedding(chunk.pageContent)
        const entry = {
          "chunk_id": uuid(),
          "text_chunk": chunk.pageContent,
          "metadata_column": filePath,
          "embedding": array2VectorBuffer(embedding)
        }
        console.log(entry)
        textChunkEntries.push(entry)
      }

      console.log("Inserting text chunks with embeddings into db.")
      // Insert the text chunk with embeddings into db
      const insertStatus = await INSERT.into(DocumentChunk).entries(textChunkEntries)
      if (!insertStatus) {
        throw new Error("Insertion of text chunks into db failed!")
      }
      return `Embeddings stored successfully to table.`
    } catch (error) {
      // Handle any errors that occur during the execution
      console.log('Error while generating and storing vector embeddings:', error)
      throw error
    }
})

  this.on ('deleteEmbeddings', async (req) => {
    try {
      // Delete any previous records in the table
      const { DocumentChunk } = this.entities
      await DELETE.from(DocumentChunk)
      return "Success!"
    }
    catch (error) {
      // Handle any errors that occur during the execution
      console.log('Error while deleting the embeddings content in db:', error)
      throw error
    }
  })
}