import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert 
} from 'react-native';
import NetworkStatus from '../hooks/NetworkStatus';
import axios from 'axios';

export default function AISymptomScreen() {
  const isOnline = NetworkStatus();
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
  if (!symptoms.trim()) return;
  setLoading(true);
  setResult(null);

  try {
    const GEMINI_API_KEY = "api key"; // from Google AI Studio

    const body = {
      // you can format into structured prompt to ask for JSON output
      "contents": [
        {
          "parts": [
            {
              "text": `User has the following symptoms: ${symptoms}.
Respond with JSON exactly in this format:
{
  "issue": "string",
  "severity": "string",
  "steps": ["step1","step2"],
  "redFlags": ["flag1","flag2"],
  "confidence": "number"
}`
            }
          ]
        }
      ]
    };

    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

    const response = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY,
      }
    });

    console.log("Gemini raw:", response.data);

    // Extract the text response
    const text = response.data.candidates?.[0]?.content?.parts
      ?.map(p => p.text)
      ?.join("") || "";

    if (!text) {
      Alert.alert("Error", "No response text from Gemini");
      setLoading(false);
      return;
    }

    let parsed;
    try {
      parsed = JSON.parse(text.trim());
    } catch (e) {
      Alert.alert("Error", "Invalid JSON from Gemini. Try simplifying.");
      setLoading(false);
      return;
    }

    if (Number(parsed.confidence || 0) < 60) {
      Alert.alert(
        "Low Confidence",
        "AI is unsure about the diagnosis. Please seek immediate medical help."
      );
      setResult(null);
    } else {
      setResult(parsed);
    }

  } catch (e) {
    console.error("Gemini API error:", e.response?.data || e.message);
    Alert.alert("Error", "Gemini API request failed.");
  } finally {
    setLoading(false);
  }
};


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🤖 AI Symptom Analysis</Text>

      <TextInput
        style={styles.input}
        placeholder="Describe your symptoms..."
        value={symptoms}
        onChangeText={setSymptoms}
        editable={isOnline && !loading}
        multiline
      />

      <TouchableOpacity
        style={[
          styles.button,
          (!isOnline || !symptoms.trim() || loading) && { backgroundColor: '#E0E0E0' }
        ]}
        disabled={!isOnline || !symptoms.trim() || loading}
        onPress={handleAnalyze}
      >
        <Text style={[
          styles.buttonText, 
          (!isOnline || !symptoms.trim() || loading) && { color: '#9E9E9E' }
        ]}>
          {loading ? 'Analyzing...' : 'Analyze'}
        </Text>
      </TouchableOpacity>

      {!isOnline && <Text style={styles.hint}>Internet required for AI analysis</Text>}

      {result && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>🧠 Possible Issue: {result.issue}</Text>
          <Text style={styles.severity}>⚠ Severity: {result.severity}</Text>

          <Text style={styles.sectionTitle}>✅ Steps:</Text>
          {result.steps.map((step, idx) => (
            <Text key={idx} style={styles.step}>• {step}</Text>
          ))}

          <Text style={styles.sectionTitle}>🚩 Red Flags:</Text>
          {result.redFlags.map((flag, idx) => (
            <Text key={idx} style={styles.redFlag}>• {flag}</Text>
          ))}

          <Text style={styles.confidence}>🔒 Confidence: {result.confidence}%</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 12, marginBottom: 16, minHeight: 80 },
  button: { backgroundColor: '#0D47A1', padding: 16, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  hint: { marginTop: 6, fontSize: 12, color: '#777', textAlign: 'center' },
  resultBox: { marginTop: 24, padding: 16, borderRadius: 10, backgroundColor: '#E3F2FD' },
  resultTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  severity: { fontWeight: '700', marginBottom: 8 },
  sectionTitle: { fontWeight: '700', marginTop: 12, marginBottom: 6 },
  step: { marginBottom: 4 },
  redFlag: { color: '#B71C1C', marginBottom: 4 },
  confidence: { marginTop: 12, fontWeight: '700' }
});
