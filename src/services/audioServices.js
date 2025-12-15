import Sound from 'react-native-sound';

Sound.setCategory('Playback');

export const playAudio = (fileName) => {
  const audio = new Sound(fileName, Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log('Audio load failed', error);
      return;
    }
    audio.play((success) => {
      if (!success) console.log('Audio playback failed');
    });
  });

  return audio;
};

export const stopAudio = (audio) => {
  if (audio) audio.stop(() => audio.release());
};