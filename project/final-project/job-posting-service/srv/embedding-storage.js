// export default function () {
//   /**
//    * OData function handler for creating and storing vector embeddings based on a context document.
//    * The embeddings get created with the given embedding model.
//    * The deployed embedding model can be looked up in the SAP AI Core instance. It can be exchanged based on the model deployments.
//    * As of now the context document is hard-coded.
//    * @param {*} req - The request parameters
//    * @return {string} - Success message for db insertion.
//    */
//   this.on('createEmbeddings', async () => {
//     let entries = await Utils.createEmbeddingEntries(await Utils.embed());
//     return await Utils.insertEmbeddings(entries);
//   });

//   /**
//    * OData function handler for deleting vector embeddings entries from the HANA db.
//    * @param {*} req - The request parameters
//    * @return {string} - Success message for deleting the vector embedding entries.
//    */
//   this.on('deleteEmbeddings', async req => {
//     return await Utils.deleteEmbeddings(req.data.scenario);
//   });
// }
