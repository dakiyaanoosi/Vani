import AudioRecord from 'react-native-audio-record';
import { Leopard } from '@picovoice/leopard-react-native';
import RNFS from 'react-native-fs';
import { PICOVOICE_ACCESS_KEY } from '@env';

const ACCESS_KEY = PICOVOICE_ACCESS_KEY;
const MODEL_PATH = 'leopard_params.pv';

const AUDIO_FILE_NAME = 'speech.wav';
const AUDIO_FILE_PATH = `${RNFS.DocumentDirectoryPath}/${AUDIO_FILE_NAME}`;

export const startSTTRecording = async () => {
  AudioRecord.init({
    sampleRate: 16000,
    channels: 1,
    bitsPerSample: 16,
    wavFile: AUDIO_FILE_NAME,
  });

  AudioRecord.start();
};

export const stopSTTRecordingAndTranscribe = async () => {
  let transcript = '';

  try {
    const audioPath = await AudioRecord.stop();

    const leopard = await Leopard.create(ACCESS_KEY, MODEL_PATH);
    const result = await leopard.processFile(audioPath);

    transcript = result.transcript || '';

    await leopard.delete();
  } finally {
    try {
      const exists = await RNFS.exists(AUDIO_FILE_PATH);
      if (exists) {
        await RNFS.unlink(AUDIO_FILE_PATH);
      }
    } catch (e) {
      console.log('Failed to delete speech.wav:', e);
    }
  }

  return transcript;
};
