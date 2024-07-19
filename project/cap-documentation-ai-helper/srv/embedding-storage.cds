using { sap.advocates.demo as db } from '../db/schema';

service EmbeddingStorageService {
    entity DocumentChunk as projection on db.DocumentChunk excluding { embedding };

    function storeEmbeddings() returns String;
    function deleteEmbeddings() returns String;
}