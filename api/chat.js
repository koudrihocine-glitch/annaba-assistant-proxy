export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const SYSTEM_PROMPT = `Tu es "Annaba Assistant", un guide expert en patrimoine local pour la visite virtuelle Visit Annaba. Ton ton est accueillant, érudit et chaleureux. Tu connais Hippone, les monuments et les sites côtiers d'Annaba. Réponds en 3-4 phrases maximum, sans émojis ni formatage Markdown, avec des phrases fluides optimisées pour la synthèse vocale. Si la question est hors sujet, ramène poliment le visiteur à la découverte de la ville.`;

  try {
    const { messages } = req.body;
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        max_tokens: 250,
        temperature: 0.75,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages]
      })
    });
    const data = await response.json();
    res.json({ reply: data.choices[0].message.content.trim() });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
}
