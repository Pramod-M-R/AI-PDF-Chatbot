import axios from "axios";

const API = axios.create({
  baseURL: "https://rag-chatbot-by-pramod-production.up.railway.app",
});

// Upload PDF
export const uploadPDF = async (file) => {

  const formData = new FormData();

  formData.append("file", file);

  const response = await API.post(
    "/upload-pdf",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;

};

// Chat
export const askQuestion = async (question) => {

  const response = await API.post(
    "/chat",
    {
      question,
    }
  );

  return response.data;

};

// Get uploaded documents
export const getDocuments = async () => {

  const response = await API.get(
    "/documents"
  );

  return response.data;

};

// Reset knowledge base
export const resetKnowledgeBase = async () => {

  const response = await API.post("/reset");

  return response.data;

};
export default API;
