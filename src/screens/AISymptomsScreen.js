import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator 
} from 'react-native';
import axios from 'axios';
import NetworkStatus from '../hooks/NetworkStatus';

const GEMINI_API_KEY = "key-SSXppYRjfPjbWOZjZ1jw4"; 

export default function AISymptomScreen() {
  const isOnline = NetworkStatus();
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!symptoms.trim()) {
      Alert.alert("Error", "Please describe your symptoms first.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
     
      const modelId = "gemini-2.0-flash";
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${GEMINI_API_KEY}`;

      const body = {
        contents: [{
          parts: [{
            text: `Act as a professional medical first-aid assistant. Analyze these symptoms: ${symptoms}.`
          }]
        }],
        generationConfig: {
      
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              issue: { type: "string" },
              severity: { type: "string" }, // Emergency, Urgent, or Stable
              steps: { 
                type: "array", 
                items: { type: "string" } 
              },
              redFlags: { 
                type: "array", 
                items: { type: "string" } 
              },
              confidence: { type: "number" }
            },
            required: ["issue", "severity", "steps", "redFlags", "confidence"]
          }
        }
      };

      // 4. THE AXIOS REQUEST
      const response = await axios.post(url, body, {
        headers: { "Content-Type": "application/json" }
      });

      // 5. EXTRACT DATA
      // Structure: response.data -> candidates[0] -> content -> parts[0] -> text
      const rawText = response.data.candidates[0].content.parts[0].text;
      const parsedData = JSON.parse(rawText);

      // Simple safety logic
      if (parsedData.confidence < 50) {
        Alert.alert(
          "Uncertain Results", 
          "The AI is not confident in this analysis. Please consult a doctor immediately."
        );
      } else {
        setResult(parsedData);
      }

    } catch (error) {
      // 6. DEBUGGING ALERTS: This will tell you EXACTLY what happened
      let status = error.response ? error.response.status : "Network Error";
      let detail = error.response?.data?.error?.message || error.message;
      
      console.error("Gemini Error Detail:", detail);
      Alert.alert(`API Error ${status}`, `Details: ${detail}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🤖 AI Symptom Analysis</Text>

      <TextInput
        style={styles.input}
        placeholder="Describe your symptoms (e.g., 'high fever, headache, stiff neck')..."
        placeholderTextColor="#999"
        value={symptoms}
        onChangeText={setSymptoms}
        editable={isOnline && !loading}
        multiline
      />

      <TouchableOpacity
        style={[
          styles.button,
          (!isOnline || !symptoms.trim() || loading) && { backgroundColor: '#B0BEC5' }
        ]}
        disabled={!isOnline || !symptoms.trim() || loading}
        onPress={handleAnalyze}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Analyze Now</Text>
        )}
      </TouchableOpacity>

      {!isOnline && <Text style={styles.hint}>⚠️ Internet connection required for analysis</Text>}

      {result && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>🧠 Possible Assessment: {result.issue}</Text>
          <Text style={[
            styles.severity, 
            { color: result.severity === 'Emergency' ? '#D32F2F' : '#1976D2' }
          ]}>
            ⚠️ Severity: {result.severity}
          </Text>

          <Text style={styles.sectionTitle}>✅ Recommended First Aid:</Text>
          {result.steps.map((step, idx) => (
            <Text key={idx} style={styles.step}>• {step}</Text>
          ))}

          <Text style={styles.sectionTitle}>🚩 Red Flags (Seek Immediate Care):</Text>
          {result.redFlags.map((flag, idx) => (
            <Text key={idx} style={styles.redFlag}>• {flag}</Text>
          ))}

          <Text style={styles.confidence}>Analysis Confidence: {result.confidence}%</Text>
        </View>
      )}

      <Text style={styles.disclaimer}>
        Note: This is an AI assessment and does not replace medical advice. In a real emergency, call 108/112 immediately.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 60, backgroundColor: '#F9FAFB' },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 20, textAlign: 'center', color: '#1A237E' },
  input: { borderWidth: 1, borderColor: '#CFD8DC', borderRadius: 12, padding: 15, marginBottom: 20, minHeight: 140, textAlignVertical: 'top', backgroundColor: '#fff', fontSize: 16 },
  button: { backgroundColor: '#1A237E', padding: 18, borderRadius: 12, alignItems: 'center', elevation: 3 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  hint: { marginTop: 10, fontSize: 13, color: '#D32F2F', textAlign: 'center', fontWeight: 'bold' },
  resultBox: { marginTop: 30, padding: 20, borderRadius: 15, backgroundColor: '#E3F2FD', borderLeftWidth: 8, borderLeftColor: '#1A237E' },
  resultTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, color: '#1A237E' },
  severity: { fontSize: 16, fontWeight: '800', marginBottom: 15 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginTop: 18, marginBottom: 8, color: '#333' },
  step: { fontSize: 15, marginBottom: 6, color: '#444', lineHeight: 22 },
  redFlag: { fontSize: 15, color: '#D32F2F', marginBottom: 6, fontWeight: '500' },
  confidence: { marginTop: 25, fontSize: 12, fontStyle: 'italic', color: '#78909C' },
  disclaimer: { marginTop: 40, fontSize: 11, color: '#90A4AE', textAlign: 'center', lineHeight: 16 }
});