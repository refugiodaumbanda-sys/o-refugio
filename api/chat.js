// Ponte segura entre o site e a API da Anthropic.
// A chave da API fica só aqui no servidor, nunca exposta no navegador.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { system, messages, max_tokens } = req.body;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-5',
        max_tokens: max_tokens || 1000,
        system: system,
        messages: messages
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Erro da API Anthropic:', data);
      return res.status(response.status).json({ error: 'Erro ao falar com a IA' });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Erro na ponte:', error);
    return res.status(500).json({ error: 'Erro interno na ponte' });
  }
}
