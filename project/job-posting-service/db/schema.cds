namespace sap.codejam;

using {
  cuid,
  managed
} from '@sap/cds/common';

entity DocumentChunks : cuid, managed {
  metadata    : LargeString;
  text_chunks : LargeString;
  embedding   : Vector(1536);
}

entity JobPostings : cuid, managed {
  user_query   : String;
  rag_response : String;
}
