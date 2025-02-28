import axios from 'axios';

export async function generateResponse(message: string): Promise<string> {
  const API_URL = 'https://api.openai.com/v1/chat/completions';
  const API_KEY = import.meta.env.VITE_OPENAI_API_KEY; // Certifique-se de definir essa variável de ambiente

  try {
    const response = await axios.post(
      API_URL,
      {
        model: 'gpt-4o-mini', // Modelo que você mencionou
        messages: [{ role: 'user', content: message }],
        temperature: 1,
        max_tokens: 2048,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        }
      }
    );

    // Retorna a resposta do ChatGPT
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Erro ao gerar resposta:', error);
    throw error;
  }
} 