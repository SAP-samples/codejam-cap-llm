namespace sap.codejam;

// Embedding entities

entity DocumentChunk {
    key chunk_id        : UUID not null;
    text_chunk          : LargeString;
    metadata_column     : LargeString;
    embedding           : Vector(1536);
}