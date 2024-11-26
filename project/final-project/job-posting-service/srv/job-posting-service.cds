using {sap.codejam as db} from '../db/schema';

service JobPostingService {
    entity DocumentChunks as
        projection on db.DocumentChunks
        excluding {
            embedding
        };

    entity JobPostings    as projection on db.JobPostings;
    function executeJobPostingRAG(user_query : String)        returns String;
    function createJobPosting(user_query : String)            returns String;
    function deleteJobPosting(id : String)                    returns String;
    function deleteJobPostings()                              returns String;
    function createJobPostingWithComplex(user_query : String) returns String;
}
