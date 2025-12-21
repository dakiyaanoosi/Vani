import AudioRecord from 'react-native-audio-record';
import { Leopard } from '@picovoice/leopard-react-native';
import { PICOVOICE_ACCESS_KEY } from '@env';

const ACCESS_KEY = PICOVOICE_ACCESS_KEY;
const MODEL_PATH = 'leopard_params.pv';

export const startSTTRecording = async () => {
  AudioRecord.init({
    sampleRate: 16000,
    channels: 1,
    bitsPerSample: 16,
    wavFile: 'speech.wav',
  });

  AudioRecord.start();
};

export const stopSTTRecordingAndTranscribe = async () => {
  const audioPath = await AudioRecord.stop();

  const leopard = await Leopard.create(ACCESS_KEY, MODEL_PATH);
  const result = await leopard.processFile(audioPath);
  await leopard.delete();

  return result.transcript || '';
};
