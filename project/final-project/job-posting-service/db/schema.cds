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

annotate JobPostings with @(
    title             : '{i18n>responses}',
    Common.Label      : '{i18n>responses}',
    Common.SemanticKey: [user_query]
) {
    ID           @(Common.Text: user_query);
    user_query   @(title: '{i18n>user_queryText}');
    rag_response @(title: '{i18n>rag_responseText}');
};
