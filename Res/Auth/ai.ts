const apiKey = 'AIzaSyA4j2IpSmXyzBDiOqmGVBbYr2hR68BPgXw'
const searchApiURL = 'https://try-dinner-capable-driving-production.pipeops.app/api/v1'
const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Implc3Vzd3JpdGVzQGdtYWlsLmNvbSIsImlkIjoiNjY3MzJlNGI2Mzk1ZDI2MmVlYzUwZTAyIiwicm9sZSI6MTk4NCwiaWF0IjoxNzIwMjU5OTMzLCJleHAiOjE3MjAzMTM5MzN9.Rr9MX4TBxMuaz35PPs1hKxY4ROgBfHLjNCt2ysidtYA'
import { GoogleGenerativeAI } from "@google/generative-ai";
const googleAI = new GoogleGenerativeAI(apiKey);
const geminiConfig = {
    temperature: 0.9,
    topP: 1,
    topK: 1,
    maxOutputTokens: 4096,
  };
  
  const geminiModel = googleAI.getGenerativeModel({ model: "gemini-pro", ...geminiConfig });
  
 
  export const generate = async (prompt: string): Promise<any> => {
    try {
      const result = await geminiModel.generateContent(prompt);
      const response = result.response;
      console.log(response.text());
      return response.text()
    } catch (error) {
      console.error("Error during generation:", error);
      return 
    }
  };
  
 










export const analyzeResult = async (text: string) => {
    try {
        const stateCode = text.slice(0, 3);
        const lgaCode = text.slice(3, 5);
        const wardCode = text.slice(5, 8);
        const puCode = text.slice(8, 11);
        const url = `${searchApiURL}/polling_units/${stateCode}${lgaCode}${wardCode}${puCode}`
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        });
        const data = await response.json()
        return data
    } catch (error) {
        return 
    }
}


