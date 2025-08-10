exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { message } = JSON.parse(event.body || '{}');
    const path = event.path;
    
    let response_text;
    
    if (path.includes('medical')) {
      response_text = `🏥 Medical AI: Thank you for your question: '${message}'. I'm here to help with medical information.`;
    } else if (path.includes('mental-health')) {
      response_text = `🧠 Mental Health AI: I understand you said: '${message}'. Mental health is important - how can I support you?`;
    } else if (path.includes('education')) {
      response_text = `📚 Education AI: Great question: '${message}'. Let me help you learn!`;
    } else if (path.includes('finance')) {
      response_text = `💰 Finance AI: About '${message}' - I can help you with financial advice.`;
    } else if (path.includes('legal')) {
      response_text = `⚖️ Legal AI: Regarding '${message}' - I can provide legal information.`;
    } else if (path.includes('career')) {
      response_text = `💼 Career AI: About '${message}' - Let me help with your career development.`;
    } else if (path.includes('developer')) {
      response_text = `💻 Developer AI: You asked: '${message}'. Let me help you with coding!`;
    } else if (path.includes('entertainment')) {
      response_text = `🎮 Entertainment AI: About '${message}' - Let me suggest something fun!`;
    } else {
      response_text = `🤖 General AI: Hello! You said: '${message}'. How can I assist you?`;
    }
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        response: response_text,
        status: 'success',
        endpoint: path
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error.message,
        message: 'Function error occurred'
      })
    };
  }
};
