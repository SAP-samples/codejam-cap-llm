const cds = require('@sap/cds')
const tableName = 'SAP_CODEJAM_DOCUMENTCHUNK'
const embeddingColumn = 'EMBEDDING'
const contentColumn = 'TEXT_CHUNK'
const userQuery = 'Explain to me what CAP is.'
const instructions = 'Return the result in json format.'

module.exports = function() {
    this.on('getRagResponse', async () => {
        try {
            const vectorplugin = await cds.connect.to('cap-llm-plugin')
            const ragResponse = await vectorplugin.getRagResponse(
                userQuery,
                tableName,
                embeddingColumn,
                contentColumn
            )
            return ragResponse
        } catch (error) {
            console.log('Error while generating response for user query:', error)
            throw error;
        }
    })

    this.on('executeSimilaritySearch', async () => {
        const vectorplugin = await cds.connect.to('cap-llm-plugin')
        const embeddings = await vectorplugin.getEmbedding(userQuery)
        const similaritySearchResults = await vectorplugin.similaritySearch(
            tableName,
            embeddingColumn,
            contentColumn,
            embeddings,
            'L2DISTANCE',
            3
        )
        return similaritySearchResults
    })
}