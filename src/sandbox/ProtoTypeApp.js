import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Linking } from 'react-native';
import Geolocation from '@react-native-community/geolocation';


export default function ProtoTypeApp() {
  const [location, setLocation] = useState(null);
  const [symptom, setSymptom] = useState("");
  const [aiResponse, setAiResponse] = useState("");




  // Fetch user location
  const getLocation = () => {
    Geolocation.getCurrentPosition(
      pos => {
        const coords = pos.coords;
        setLocation({
          latitude: coords.latitude,
          longitude: coords.longitude
        });
        Alert.alert("Location Fetched", `Lat: ${coords.latitude}\nLng: ${coords.longitude}`);
      },
      err => Alert.alert("Error", err.message),
      { enableHighAccuracy: true }
    );
  };

  // Basic AI for symptoms (offline logic)
  const analyzeSymptoms = () => {
    if (!symptom.trim()) {
      Alert.alert("Enter Symptoms", "Please type your symptoms first.");
      return;
    }

    let response = "";

    if (symptom.includes("fever")) response = "Possible fever. Drink water and rest. If above 102°F, contact doctor.";
    else if (symptom.includes("chest pain")) response = "Chest pain is serious. Call emergency services immediately.";
    else if (symptom.includes("headache")) response = "Mild headache. Rest in a dark room and drink water.";
    else response = "Unable to identify. Please consult a doctor if symptoms persist.";

    setAiResponse(response);
  };

  // Emergency Call
  const callAmbulance = () => {
    Linking.openURL("tel:102"); // India ambulance number
  };

  const callPolice = () => {
    Linking.openURL("tel:100");
  };

  return (
    <View style={styles.container}>

      {/* App Title */}
      <Text style={styles.title}>🚨 Emergency AI</Text>

      {/* SOS Button */}
      <TouchableOpacity style={styles.sosButton} onPress={callAmbulance}>
        <Text style={styles.sosText}>SOS</Text>
      </TouchableOpacity>

      {/* Get Location */}
      <TouchableOpacity style={styles.btn} onPress={getLocation}>
        <Text style={styles.btnText}>📍 Get My Location</Text>
      </TouchableOpacity>

      {location && (
        <Text style={styles.locationText}>
          Lat: {location.latitude} | Lng: {location.longitude}
        </Text>
      )}

      {/* AI Medical Assistant */}
      <Text style={styles.heading}>🧠 Medical AI Assistant</Text>

      {/* Symptom Buttons */}
      <View style={styles.symptomBox}>
        <TouchableOpacity style={styles.symptomBtn} onPress={() => setSymptom("fever")}>
          <Text style={styles.symptomText}>Fever</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.symptomBtn} onPress={() => setSymptom("chest pain")}>
          <Text style={styles.symptomText}>Chest Pain</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.symptomBtn} onPress={() => setSymptom("headache")}>
          <Text style={styles.symptomText}>Headache</Text>
        </TouchableOpacity>
      </View>

      {/* Analyze Symptoms */}
      <TouchableOpacity style={styles.btn} onPress={analyzeSymptoms}>
        <Text style={styles.btnText}>Analyze My Symptoms</Text>
      </TouchableOpacity>

      {aiResponse !== "" && (
        <Text style={styles.resultText}>{aiResponse}</Text>
      )}

      {/* Police Call */}
      <TouchableOpacity style={styles.policeBtn} onPress={callPolice}>
        <Text style={styles.btnText}>🚓 Call Police (100)</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 40
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20
  },
  sosButton: {
    backgroundColor: "red",
    width: 150,
    height: 150,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20
  },
  sosText: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "bold"
  },
  btn: {
    backgroundColor: "#007bff",
    padding: 12,
    width: 220,
    borderRadius: 10,
    marginVertical: 10
  },
  btnText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 16
  },
  locationText: {
    marginTop: 5,
    fontSize: 14,
    color: "#333"
  },
  heading: {
    marginTop: 30,
    fontSize: 22,
    fontWeight: "bold"
  },
  symptomBox: {
    flexDirection: "row",
    marginTop: 20
  },
  symptomBtn: {
    backgroundColor: "#eee",
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 8
  },
  symptomText: {
    fontSize: 14
  },
  resultText: {
    marginTop: 15,
    fontSize: 16,
    textAlign: "center",
    width: 280
  },
  policeBtn: {
    backgroundColor: "#000",
    padding: 12,
    width: 220,
    borderRadius: 10,
    marginTop: 20
  }
});
