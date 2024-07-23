const cds = require('@sap/cds')
const { DELETE } = cds.ql
const { handleMemoryBeforeRAGCall, handleMemoryAfterRAGCall } = require('./memory-helper')
const prompts = require('./ai-prompts.json')

user_id = cds.env.requires["USER_ID"]

const tableName = 'SAP_CODEJAM_DOCUMENTCHUNK'
const embeddingColumn = 'EMBEDDING'
const contentColumn = 'TEXT_CHUNK'

const promptCategory = {
    "user-prompt"    : prompts.requestPrompt,
    "generic-prompt" : prompts.genericPrompt,
    "system-prompt"  : prompts.systemPrompt
}

// function getFormattedDate(timeStamp) {
//     const timestamp = Number(timestamp)
//     const date = Date(timestamp)
//     return Intl.DateTimeFormat('en-US', {
//         timeZone: 'GMT',
//     }).format(date)
// }

module.exports = function () {
    this.on('getChatRagResponse', async (req) => {
        try {
            // Requesting input data...
            const { conversationId,
                    messageId,
                    messageTime,
                    userId,
                    userQuery
             } = req.data

             const { Conversation, Message } = this.entities

             const llmPlugin = await cds.connect.to("cap-llm-plugin")
             
             // refactor out 41 - 51

             let determinationPayload = [{
                "role"      : "system",
                "content"   : `${promptCategory['system-prompt']}`
             }]

             const userQuestion = [{
                "role"      : "user",
                "content"   : `${promptCategory['user-prompt']}`
             }]

             determinationPayload.push(...userQuestion)
             let payload = {
                "messages" : determinationPayload
             }

             const determinationResponse = await llmPlugin.getChatCompletion(payload)
             const determinationJSON = JSON.parse(determinationResponse.content)
             const category = determinationJSON?.category

             // handle memory before the RAG LLM call
             const memoryContext = await handleMemoryBeforeRAGCall(conversationId, messageId, messageTime, userId, userQuery, Conversation, Message)

            /*Single method to perform the following :
            - Embed the input query
            - Perform similarity search based on the user query 
            - Construct the prompt based on the system instruction and similarity search
            - Call chat completion model to retrieve relevant answer to the user query
            */
           const chatRagResponse = await llmPlugin.getRagResponse(
            userQuery,
            tableName,
            embeddingColumn,
            contentColumn,
            promptCategory[category],
            memoryContext.length > 0 ? memoryContext : undefined,
            30
           )

           // handle memory after the RAG LLM call
           const responseTimestamp = new Date().toISOString()
           await handleMemoryAfterRAGCall(conversationId, responseTimestamp, chatRagResponse.completion, )
           
           const response = {
            "role"                  : chatRagResponse.completion.role,
            "content"               : chatRagResponse.completion.content,
            "messageTime"           : responseTimestamp,
            "additionalContents"    : chatRagResponse.additionalContents,
           }

           return response
        } catch (error) {
            console.log('Error while generating response for user query: ', error)
            throw error
        }
    })

    this.on('deleteChatData', async () => {
        try {
            const { Conversation, Message } = this.entities
            await DELETE.from(Conversation)
            await DELETE.from(Message)
            return "Success!"
        } catch (error) {
            console.log('Error while deleting the chat content in db:', error)
            throw error
        }
    })
}