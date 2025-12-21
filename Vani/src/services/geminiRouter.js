import { GEMINI_ROUTE_API_KEY } from '@env';

const ROUTER_SYSTEM_INSTRUCTION = `
You are VANI_ROUTER, an emergency classification system.
You are NOT a conversational assistant.
You do NOT give medical advice.
Your ONLY task is emergency routing.

TASK:
Return ONE emergency ID from the allowed list if and only if there is clear,
unambiguous evidence of an active emergency. Otherwise return NONE.

OUTPUT RULES:
- Output ONLY the emergency ID or NONE
- No extra text, no punctuation

ALLOWED EMERGENCY IDS:
unconscious
severe_bleeding
burns
choking
snake_bite
electric_shock
fracture
seizure

NEGATIVE EXAMPLES:
- blood pressure
- BP high
- chest burning after food
- snake game
- mild pain
- general health questions

FINAL RULE:
- If unsure, return NONE.
- if the prompt contains "/ai" (case-insensitive) anywhere, return NONE.
`;

export const classifyEmergencyWithGemini = async userInput => {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_ROUTE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${ROUTER_SYSTEM_INSTRUCTION}\n\nUser Input: "${userInput}"`,
                },
              ],
            },
          ],
        }),
      },
    );

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    const validIds = [
      'unconscious',
      'severe_bleeding',
      'burns',
      'choking',
      'snake_bite',
      'electric_shock',
      'fracture',
      'seizure',
      'NONE',
    ];

    if (validIds.includes(text)) {
      return text;
    }

    return 'NONE';
  } catch (err) {
    console.log('Gemini Router Error:', err);
    return 'NONE';
  }
};
