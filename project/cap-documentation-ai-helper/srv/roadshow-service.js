const cds = require('@sap/cds')
const tableName = 'SAP_ADVOCATES_DEMO_DOCUMENTCHUNK'
const embeddingColumn = 'EMBEDDING'
const contentColumn = 'TEXT_CHUNK'
const userQuery = 'In which city are Thomas Jung and Rich Heilman on April, 19th 2024?'
const instructions = 'Return the result in json format. Display the keys, the topic and the city in a table form.'

const altUserQuery = 'Who is joining the event in Madrid Spain?'
const altInstructions = 'Return the result in json format. Display the name.'

module.exports = function() {
    this.on('getRagResponse', async () => {
        try {
            const vectorplugin = await cds.connect.to('cap-llm-plugin')
            const ragResponse = await vectorplugin.getRagResponse(
                altUserQuery,
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