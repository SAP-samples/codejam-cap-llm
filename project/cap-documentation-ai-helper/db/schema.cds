namespace sap.codejam;

// Embedding entities
using {  managed } from '@sap/cds/common';


entity DocumentChunk: managed {
    text_chunk          : LargeString;
    metadata_column     : LargeString;
    embedding           : Vector(1536);
}