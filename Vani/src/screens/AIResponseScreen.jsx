import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { GEMINI_RESPONSE_API_KEY } from '@env';

const SYSTEM_INSTRUCTION = `
You are VANI_RESPONSE, a health, medical, and emergency assistance AI.
You are NOT a general-purpose assistant.

You must respond in the SAME LANGUAGE as the user's input.

========================
ALLOWED SCOPE
========================
You may respond ONLY to topics related to:
- health and medicine
- injuries and emergencies
- first aid
- symptoms and prevention
- safety and well-being

You must NOT respond to:
- people or celebrities
- sports, politics, history
- technology or coding
- general knowledge outside health

========================
TASK CLASSIFICATION
========================
Classify the user's query into ONE category:

1. EMERGENCY / ACTIONABLE  
   Immediate step-by-step guidance is required.

2. HEALTH / MEDICAL INFORMATION  
   The user wants a definition, explanation, symptoms, causes, or basic help.

3. OUTSIDE SCOPE  
   Not related to health or safety.

========================
RESPONSE RULES
========================

▶ CASE 1: EMERGENCY / ACTIONABLE  
Return FORMAT A (structured JSON).

▶ CASE 2: HEALTH / MEDICAL INFORMATION  
Return FORMAT B with a SHORT, SIMPLE explanation.

▶ CASE 3: OUTSIDE SCOPE  
Return FORMAT B with a brief scope message.
Do NOT answer the actual question.

========================
FORMAT A: STRUCTURED RESPONSE
========================
Use ONLY when step-by-step guidance is appropriate.

{
  "type": "structured",
  "steps": [
    "Short, clear step.",
    "One action per step.",
    "No numbering."
  ],
  "red_flags": [
    "Critical warning.",
    "When to seek urgent help."
  ]
}

Rules:
- Steps must be short and imperative
- Do NOT number steps
- Do NOT use markdown
- No diagnosis
- No medicine names or dosages

========================
FORMAT B: TEXT RESPONSE
========================
Use for health information or scope messages.

{
  "type": "text",
  "answer": "A brief, plain-text explanation in 3–5 short sentences."
}

Rules for FORMAT B:
- NO bullet points
- NO numbering
- NO markdown (**, *, -, #)
- NO headings
- Keep the response concise and calm
- Avoid unnecessary detail
- If lifestyle advice is needed, summarize it briefly

========================
CRITICAL OUTPUT RULES
========================
- Output ONLY valid JSON
- No extra text outside JSON
- No markdown symbols
- No emojis
- No lists or formatting
- If unsure, prefer FORMAT B
`;

const SCOPE_FALLBACK_MESSAGE =
  'I can help with emergencies or health-related questions. Please describe a medical situation or ask for emergency guidance.';

const ERROR_FALLBACK_MESSAGE =
  'I’m unable to respond right now. Please check your internet connection or try again shortly.';

const AIResponseScreen = ({ navigation, route }) => {
  const { prompt } = route.params || {};

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef(null);

  const fetchAIResponse = async userQuery => {
    try {
      setLoading(true);

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_RESPONSE_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `${SYSTEM_INSTRUCTION}\n\nUser Input: "${userQuery}"`,
                  },
                ],
              },
            ],
          }),
        },
      );

      // --- FIX START ---
      // Check for HTTP errors (like 503, 500, 400)
      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status}`);
      }
      // --- FIX END ---

      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

      if (!rawText || rawText.trim().length === 0) {
        setMessages(prev => [
          ...prev,
          {
            role: 'ai',
            data: {
              type: 'text',
              answer: SCOPE_FALLBACK_MESSAGE,
            },
          },
        ]);
        setLoading(false);
        return;
      }

      let parsed;

      try {
        parsed = JSON.parse(rawText);
      } catch (e) {
        parsed = {
          type: 'text',
          answer: SCOPE_FALLBACK_MESSAGE,
        };
      }

      // 🔒 HARD FAIL-SAFE: empty or invalid content
      if (
        !parsed ||
        (parsed.type === 'text' &&
          (!parsed.answer || parsed.answer.trim().length === 0))
      ) {
        parsed = {
          type: 'text',
          answer: SCOPE_FALLBACK_MESSAGE,
        };
      }

      if (
        parsed.type === 'structured' &&
        (!Array.isArray(parsed.steps) || parsed.steps.length === 0)
      ) {
        parsed = {
          type: 'text',
          answer: SCOPE_FALLBACK_MESSAGE,
        };
      }

      setMessages(prev => [...prev, { role: 'ai', data: parsed }]);
    } catch (err) {
      console.error('AI Fetch Error:', err); // Helpful for debugging
      setMessages(prev => [
        ...prev,
        {
          role: 'ai',
          data: {
            type: 'text',
            answer: ERROR_FALLBACK_MESSAGE,
          },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!prompt) return;

    setMessages(prev => [...prev, { role: 'user', text: prompt }]);
    fetchAIResponse(prompt);
  }, [prompt]);

  return (
    <View style={styles.container}>
      {/* Back */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.content}
        onContentSizeChange={() =>
          scrollRef.current?.scrollToEnd({ animated: true })
        }
      >
        {messages.map((msg, index) => {
          if (msg.role === 'user') {
            return (
              <View key={index} style={styles.userRow}>
                <View style={styles.userBubble}>
                  <Text style={styles.userText}>{msg.text}</Text>
                </View>
              </View>
            );
          }

          if (msg.data.type === 'structured') {
            return (
              <View key={index} style={styles.structuredWrapper}>
                {msg.data.steps.map((step, i) => (
                  <View key={i} style={styles.stepItem}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>{i + 1}</Text>
                    </View>
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                ))}

                {msg.data.red_flags?.length > 0 && (
                  <View style={styles.alertBox}>
                    <View style={styles.alertHeader}>
                      <Icon
                        name="exclamation-triangle"
                        size={18}
                        color="#ff4d4d"
                      />
                      <Text style={styles.alertTitle}>Emergency Warning</Text>
                    </View>

                    {msg.data.red_flags.map((flag, i) => (
                      <Text key={i} style={styles.alertText}>
                        • {flag}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            );
          }

          return (
            <View key={index} style={styles.aiWrapper}>
              <View style={styles.aiBubble}>
                <Text style={styles.aiText}>{msg.data.answer}</Text>
              </View>
            </View>
          );
        })}

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ff4d4d" />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default AIResponseScreen;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { padding: 16 },
  content: { padding: 16, paddingBottom: 120 },

  userRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 14,
  },
  userBubble: {
    backgroundColor: '#25D366',
    padding: 14,
    borderRadius: 18,
    maxWidth: '80%',
  },
  userText: { color: '#fff', fontSize: 15, lineHeight: 22 },

  aiWrapper: { alignItems: 'center', marginBottom: 20 },
  aiBubble: {
    backgroundColor: '#111',
    padding: 14,
    borderRadius: 12,
    maxWidth: '85%',
  },
  aiText: { color: '#eee', fontSize: 15, lineHeight: 24 },

  structuredWrapper: { marginBottom: 30 },

  stepItem: { flexDirection: 'row', marginBottom: 16 },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ff4d4d',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: { color: '#fff', fontWeight: '600' },
  stepText: { color: '#fff', fontSize: 16, flex: 1 },

  alertBox: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#1a0000',
    borderWidth: 1,
    borderColor: '#ff4d4d',
  },
  alertHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  alertTitle: {
    color: '#ff4d4d',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  alertText: { color: '#fff', fontSize: 14, marginBottom: 6 },

  loadingContainer: { alignItems: 'center', marginTop: 10 },
});
