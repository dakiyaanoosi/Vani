# Vani — Offline Emergency AI & SOS App

Vani is an **offline-first emergency assistance mobile application** built using **React Native**, designed to help users during **real-life emergencies**, even when **internet connectivity is unavailable**.

The app combines **preloaded emergency guidance**, **AI-powered health assistance**, and a **robust SOS system** that sends emergency alerts via **SMS with GPS location**.

The core philosophy of Vani is simple:

> In emergencies, the app must work — with or without internet.


## Key Features

### SOS Emergency System
- One-tap SOS trigger
- Sends **SMS alerts** to saved emergency contacts
- Includes **Google Maps location link**
- Works completely **offline**
- Countdown confirmation to prevent accidental triggers
- Customizable SOS message
- Emergency contacts stored securely on device


### AI-Powered Emergency Assistance
- Natural language chat interface
- Uses **Google Gemini API** when internet is available
- Strictly limited to:
  - Emergencies
  - First aid
  - Health & safety
- Automatically falls back to offline guidance when internet is unavailable


### Offline Emergency Guidance
- Preloaded **decision-tree based emergency database**
- Detects emergencies such as:
  - Severe bleeding
  - Burns
  - Choking
  - Snake bite
  - Electric shock
  - Fractures
  - Seizures
  - Unconsciousness
- Provides:
  - Step-by-step instructions
  - Critical red-flag warnings
- Fully functional **without internet**


### Emergency Audio Instructions
- Audio guidance for emergencies
- Plays automatically when an emergency screen opens
- Audio stored locally for reliability in release APKs


### Offline Speech-to-Text
- Voice input powered by **Picovoice Leopard**
- Works completely **offline**
- Converts speech directly into chat input
- Temporary audio files are deleted after processing to prevent storage issues


### Location Handling
- Uses device GPS
- Works **without internet**
- Location included as Google Maps link in SOS SMS
- Compatible with real-world offline GPS behavior


### Nearby Hospitals & Helplines
- Option to open Google Maps with **“Nearby hospitals”** search
- Dedicated helplines screen with:
  - Ambulance
  - Police
  - Fire
  - Women helpline
  - Child helpline, etc.
- One-tap calling support


### Multi-Language Support
- Emergency content available in:
  - English
  - Hindi
  - Bengali
- Language switch applies across:
  - Offline guidance
  - Emergency audio
  - UI content


## Tech Stack

### Frontend
- React Native (CLI)
- JavaScript (ES6+)

### Native & Device APIs
- SMS (Android native module)
- GPS / Location services
- Microphone access
- Contacts picker
- Local storage (AsyncStorage)

### AI & Speech
- Google Gemini API (online AI)
- Picovoice Leopard (offline speech-to-text)

### Audio
- Emergency audio playback using `react-native-sound-player`
- Audio resources stored in Android `res/raw` for release stability


## Android Permissions

Vani requests Android permissions **only when required**, and each permission is used strictly for emergency-related functionality.

| Permission | Purpose |
|-----------|--------|
| `INTERNET` | Required for AI-powered emergency assistance (Google Gemini API) |
| `RECORD_AUDIO` | Enables offline speech-to-text for voice input |
| `ACCESS_FINE_LOCATION` | Fetches precise GPS coordinates for SOS messages |
| `ACCESS_COARSE_LOCATION` | Allows fallback location access when fine location is unavailable |
| `SEND_SMS` | Sends SOS alerts directly via SMS to emergency contacts |
| `WRITE_EXTERNAL_STORAGE` | Temporarily stores audio recordings for offline speech-to-text |

All permissions are requested **at runtime**, only when the associated feature is used.

Vani does **not** collect, store, or transmit personal data beyond what is required to perform emergency actions.


## Offline-First Design

| Feature                     | Works Offline |
|-----------------------------|---------------|
| SOS via SMS                 | Yes           |
| GPS Location                | Yes           |
| Emergency Instructions      | Yes           |
| Emergency Audio             | Yes           |
| Speech-to-Text              | Yes           |
| AI Chat                     | No            |

The app **never blocks SOS functionality due to lack of internet**.


## App Link

**APK / App Link:**  https://drive.google.com/file/d/1WXsaj88HCPc2ggxBpqWVfM3xK-Z_BwTA/view?usp=drive_link


## Getting Started

```
git clone https://github.com/dakiyaanoosi/Vani
cd Vani
npm install
npx react-native run-android
```


