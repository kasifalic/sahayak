// API Configuration for Sahayak Backend
export const API_BASE_URL = "https://agentic-ai-backend-1055718553765.us-central1.run.app";

// Generate unique session ID
export function generateSessionId() {
  return 'sahayak_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Chat API call function
export async function sendChatMessage(message, userId = "default_user", sessionId = null) {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: message,
        user_id: userId,
        session_id: sessionId || generateSessionId()
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data; // Returns: {response: "AI response", session_id: "session_id"}
  } catch (error) {
    console.error('Error calling chat API:', error);
    throw error;
  }
}

// Health check function
export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking backend health:', error);
    throw error;
  }
}

// API endpoints configuration
export const API_ENDPOINTS = {
  CHAT: `${API_BASE_URL}/chat`,
  HEALTH: `${API_BASE_URL}/health`
};

// Default API configuration
export const API_CONFIG = {
  timeout: 30000, // 30 seconds
  retries: 3,
  retryDelay: 1000 // 1 second
}; 