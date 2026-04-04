
import {DocumentAnalytics} from "../auth-config"
const DocAPi = {
    UplaodDocument : "/analytics/stats"
}

export const DocumentAnalysis= async () => {
   const response = await DocumentAnalytics.get(DocAPi.UplaodDocument,{
    withCredentials : true
   });
   return response;
};