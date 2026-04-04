import { documentapi } from "../auth-config"

const DocAPi = {
    UplaodDocument : "/document-upload"
}

export const DocumentUpload = async (formData, config = {}) => {
    const response = await documentapi.post(DocAPi.UplaodDocument, formData, {
        ...config,
    
        withCredentials: true, 
        headers: {
            ...config.headers, 
        },
    });
    return response.data;
};