using {sap.codejam as db} from '../db/schema';

service EmbeddingStorageService {
    entity DocumentChunks as
        projection on db.DocumentChunks
        excluding {
            embedding
        };

    function storeEmbeddings()  returns String;
    function deleteEmbeddings() returns String;
}
