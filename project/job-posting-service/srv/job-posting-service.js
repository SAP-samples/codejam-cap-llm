export default function () {
  this.on('createVectorEmbeddings', async (req) => {
    await DBUtils.insertVectorEmbedding(await AIHelper.createVectorEmbedding())
    return 'Vector embeddings created and stored in database'
  })

  this.on('deleteVectorEmbeddings', async (req) => {
    // implementation goes here
  })
}
