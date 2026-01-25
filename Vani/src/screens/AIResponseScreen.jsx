import {
  GEMINI_RESPONSE_API_KEY_1,
  GEMINI_RESPONSE_API_KEY_2,
  GEMINI_RESPONSE_API_KEY_3,
  GEMINI_RESPONSE_API_KEY_4,
  GEMINI_RESPONSE_API_KEY_5,
} from '@env';
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/Feather';
import Call112Button from '../components/Call112Button';
import { saveAIResponse } from '../services/aiStorage';

const API_KEYS = [
  GEMINI_RESPONSE_API_KEY_1,
  GEMINI_RESPONSE_API_KEY_2,
  GEMINI_RESPONSE_API_KEY_3,
  GEMINI_RESPONSE_API_KEY_4,
  GEMINI_RESPONSE_API_KEY_5,
];

let currentKeyIndex = 0;

const SYSTEM_INSTRUCTION = `
You are Vani AI, a health, medical, and emergency assistance AI.
You are NOT a general-purpose assistant.

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

1. EMERGENCY / ACTIONABLE HEALTH GUIDANCE
Immediate step-by-step guidance is required. Or, the user is asking what to do, how to manage, or how to get relief.

2. HEALTH / MEDICAL / FITNESS INFORMATION
The user wants a definition, explanation, symptoms, causes, or basic help.

3. OUTSIDE SCOPE
Not related to health, safety, emergency, fitness or medical questions.

========================
RESPONSE RULES
========================
▶ CASE 1: EMERGENCY / ACTIONABLE HEALTH GUIDANCE
Return FORMAT A (structured JSON).
This includes emergencies, symptoms, pain, illness, and first-aid situations.

▶ CASE 2: HEALTH / MEDICAL / FITNESS INFORMATION
Return FORMAT B with a SHORT, SIMPLE explanation.

▶ CASE 3: OUTSIDE SCOPE
Return FORMAT B with a brief scope message.
Do NOT answer the actual question.

========================
FORMAT A: STRUCTURED RESPONSE
========================
LANGUAGE TASK:
You must return structured responses in MULTIPLE LANGUAGES.

Mandatory persistent languages:
- English (en)
- Hindi (hi)
- Bengali (bn)

Additionally:
Detect the user's input language.
Set it as "display_lang".
If the user's language is NOT en/hi/bn, include that language content as "user_lang".

Use ONLY when step-by-step guidance is appropriate.

{
  "type": "structured",
  "display_lang": "code",
  "title": {
    "en": "e.g. Heat Stroke, Fever, etc. (Don't include words like management, first aid, etc. in the title",
    "hi": "e.g. लू लगना",
    "bn": "...",
    "user_lang": "..."
  },
  "steps": {
    "en": ["Short, clear step.", "One action per step."],
    "hi": ["संक्षिप्त, स्पष्ट कदम।", "..."],
    "bn": ["...", "..."],
    "user_lang": ["...", "..."]
  },
  "red_flags": {
    "en": ["Critical warning", "When to see urgent help"],
    "hi": ["...", "..."],
    "bn": ["...", "..."],
    "user_lang": ["...", "..."]
  }
}
Note: "display_lang" should be the language code (e.g. "fr", "en", "hi").
If display_lang is en, hi, or bn, you do not need "user_lang" keys.

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
  const [savedMap, setSavedMap] = useState({});
  const scrollRef = useRef(null);

  const fetchAIResponse = async userQuery => {
    const currentKey = API_KEYS[currentKeyIndex];
    currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;

    try {
      setLoading(true);

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${currentKey}`,
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

      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status}`);
      }

      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

      console.log(rawText);

      if (!rawText || rawText.trim().length === 0) {
        handleError(SCOPE_FALLBACK_MESSAGE);
        return;
      }

      const cleanText = rawText
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      let parsed;
      try {
        parsed = JSON.parse(cleanText);
      } catch (e) {
        const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            parsed = JSON.parse(jsonMatch[0]);
          } catch (e2) {
            parsed = { type: 'text', answer: SCOPE_FALLBACK_MESSAGE };
          }
        } else {
          parsed = { type: 'text', answer: SCOPE_FALLBACK_MESSAGE };
        }
      }

      if (!parsed || (parsed.type === 'text' && !parsed.answer)) {
        parsed = { type: 'text', answer: SCOPE_FALLBACK_MESSAGE };
      }

      setMessages(prev => [...prev, { role: 'ai', data: parsed }]);
    } catch (err) {
      handleError(ERROR_FALLBACK_MESSAGE);
    } finally {
      setLoading(false);
    }
  };

  const handleError = msg => {
    setMessages(prev => [
      ...prev,
      { role: 'ai', data: { type: 'text', answer: msg } },
    ]);
    setLoading(false);
  };

  useEffect(() => {
    if (!prompt) return;
    setMessages(prev => [...prev, { role: 'user', text: prompt }]);
    fetchAIResponse(prompt);
  }, [prompt]);

  const getContent = (data, field) => {
    if (data[field]?.[data.display_lang]) {
      return data[field][data.display_lang];
    }
    if (data[field]?.['user_lang']) {
      return data[field]['user_lang'];
    }
    return data[field]?.['en'] || [];
  };

  const sanitizeForOffline = data => {
    return {
      title: {
        en: data.title.en,
        hi: data.title.hi,
        bn: data.title.bn,
      },
      steps: {
        en: data.steps.en,
        hi: data.steps.hi,
        bn: data.steps.bn,
      },
      red_flags: {
        en: data.red_flags?.en || [],
        hi: data.red_flags?.hi || [],
        bn: data.red_flags?.bn || [],
      },
    };
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="keyboard-backspace" size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.hospitalButton}
          onPress={() => {
            Linking.openURL(
              'https://www.google.com/maps/search/?api=1&query=nearby+hospitals',
            );
          }}
        >
          <Icon2 name="external-link" size={18} color="#fff" />
          <Text style={styles.audioText}>Nearby Hospitals</Text>
        </TouchableOpacity>

        <Call112Button />
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
            const displayTitle = getContent(msg.data, 'title');
            const displaySteps = getContent(msg.data, 'steps');
            const displayFlags = getContent(msg.data, 'red_flags');

            return (
              <View key={index} style={styles.structuredWrapper}>
                <View style={styles.headerRow}>
                  <Text style={styles.structuredTitle}>
                    {typeof displayTitle === 'string'
                      ? displayTitle
                      : 'Emergency Guidance'}
                  </Text>

                  <TouchableOpacity
                    style={[
                      styles.audioButton,
                      savedMap[index] && { opacity: 0.5 },
                    ]}
                    disabled={savedMap[index]}
                    onPress={async () => {
                      const cleanData = sanitizeForOffline(msg.data);

                      const aiObj = {
                        id: `ai_${Date.now()}`,
                        type: 'ai',
                        titles: cleanData.title,
                        steps: cleanData.steps,
                        red_flags: cleanData.red_flags,
                        savedAt: Date.now(),
                      };

                      await saveAIResponse(aiObj);
                      setSavedMap(prev => ({ ...prev, [index]: true }));
                    }}
                  >
                    <Icon
                      name={savedMap[index] ? 'check' : 'download'}
                      size={18}
                      color="#fff"
                    />
                    <Text style={styles.audioText}>
                      {savedMap[index] ? 'Saved Offline' : 'Save Offline'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {Array.isArray(displaySteps) &&
                  displaySteps.map((step, i) => (
                    <View key={i} style={styles.stepItem}>
                      <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>{i + 1}</Text>
                      </View>
                      <Text style={styles.stepText}>{step}</Text>
                    </View>
                  ))}

                {Array.isArray(displayFlags) && displayFlags.length > 0 && (
                  <View style={styles.alertBox}>
                    <View style={styles.alertHeader}>
                      <Icon name="warning-amber" size={18} color="#ff4d4d" />
                      <Text style={styles.alertTitle}>Emergency Warning</Text>
                    </View>
                    {displayFlags.map((flag, i) => (
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: { padding: 16, paddingBottom: 120 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  structuredTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    marginRight: 10,
  },
  audioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 24,
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#777',
  },
  audioText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  userRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 14,
  },
  userBubble: {
    backgroundColor: '#134d37',
    padding: 14,
    borderRadius: 12,
    maxWidth: '80%',
  },
  userText: { color: '#fff', fontSize: 16, lineHeight: 22 },
  aiWrapper: { alignItems: 'center', marginBottom: 20 },
  aiBubble: {
    backgroundColor: '#111',
    padding: 14,
    borderRadius: 12,
    maxWidth: '90%',
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
  hospitalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#777',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
});
