// import axios from 'axios';
// import { MessageInterface } from '@/types/types';
// import { API_KEY, API_URL } from '@/config/runpodConfigs';

// async function callChatBotAPI(messages: MessageInterface[]): Promise<MessageInterface> {
//     try {
//         const response = await axios.post(API_URL, {
//             input: { messages }
//         }, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${API_KEY}`
//             }
//         });

//         let output = response.data;
//         let outputMessage: MessageInterface = output['output'];

//         return outputMessage;
//     } catch (error) {
//         console.error('Error calling the API:', error);
//         throw error;
//     }
// }

// export { callChatBotAPI };
import axios from 'axios';
import { MessageInterface } from '@/types/types';
import { API_URL } from '@/config/runpodConfigs';
import { getAuthToken } from '@/services/tokenStore';

async function callChatBotAPI(messages: MessageInterface[]): Promise<MessageInterface> {
    try {
        const token = getAuthToken();
        const headers: any = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        } else {
            console.warn('[callChatBotAPI] No auth token found.');
        }

        const response = await axios.post(`${API_URL}/chat`, {
            input: { messages }
        }, {
            headers,
            timeout: 90000, // 90 seconds timeout for AI response generation
        });

        return response.data;
    } catch (error: any) {
        const status = error.response?.status;
        const message = error.message;
        console.error('Error calling the API:', status || 'No Status', message);
        throw error;
    }
}

async function callVoiceChatBotAPI(audioUri: string): Promise<MessageInterface & { transcription?: string, error?: string }> {
    try {
        const token = getAuthToken();
        const headers: any = {
            'Content-Type': 'multipart/form-data',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        } else {
            console.warn('[callVoiceChatBotAPI] No auth token found.');
        }

        const formData = new FormData();
        // @ts-ignore
        formData.append('file', {
            uri: audioUri,
            name: 'voice_recording.m4a',
            type: 'audio/m4a',
        });

        const response = await axios.post(`${API_URL}/voice-chat`, formData, {
            headers,
            timeout: 90000, // Increased to 90 seconds for heavy audio processing
        });
        
        return response.data;
    } catch (error: any) {
        const status = error.response?.status;
        const message = error.message;
        console.error('Error calling the Voice API:', status || 'No Status', message);
        throw error;
    }
}

async function getChatHistory(): Promise<MessageInterface[]> {
    try {
        const token = getAuthToken();
        const headers: any = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        } else {
            console.warn('[getChatHistory] No auth token found.');
        }

        const response = await axios.get(`${API_URL}/chat/history`, { headers });
        return response.data as MessageInterface[];
    } catch (error: any) {
        console.error('Error fetching chat history:', error.response?.status, error.message);
        return [];
    }
}

async function deleteChatHistory(): Promise<boolean> {
    try {
        const token = getAuthToken();
        const headers: any = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        const response = await axios.delete(`${API_URL}/chat/history`, { headers });
        return response.status === 200;
    } catch (error: any) {
        console.error('Error deleting chat history:', error.response?.status, error.message);
        return false;
    }
}

export { callChatBotAPI, callVoiceChatBotAPI, getChatHistory, deleteChatHistory };