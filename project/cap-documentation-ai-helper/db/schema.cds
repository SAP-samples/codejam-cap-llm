namespace sap.codejam;

// Chat client entities

entity Conversation {
    key conversation_id: UUID not null;
    user_id             : String;
    title               : String;
    time_of_creation    : Timestamp;
    time_of_last_update : Timestamp;
    to_message          : Composition of many Message 
                            on to_message.conversation_id = $self;
}

entity Message {
    key conversation_id : Association to Conversation;
    key message_id      : UUID not null;
    role                : String;
    content             : LargeString;
    time_of_creation    : Timestamp;
}

// Embedding entities

entity DocumentChunk {
    text_chunk          : LargeString;
    metadata_column     : LargeString;
    embedding           : Vector(1536);
}