using { sap.codejam as db } from '../db/schema';

service ChatService @(requires: 'authenticated-user') {
    
    entity Conversation @(restrict: [{
        grant: ['READ', 'WRITE', 'DELETE'],
        where: 'user_id = $user'
    }])             as projection on db.Conversation;
    
    entity Message  as projection on db.Message;

    type RagResponse_AdditionalContents {
        score        : String;
        page_content : String;
    }

    type RagResponse {
        role                 : String;
        content              : String;
        message_time         : String;
        additional_contents  : array of RagResponse_AdditionalContents;
    }

    action getChatRagResponse(conversation_id   : String,
                              message_id        : String,
                              time_of_message   : Timestamp,
                              user_id           : String,
                              user_query        : String) 
                              returns RagResponse;
}