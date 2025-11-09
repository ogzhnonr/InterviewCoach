import React, { useRef } from 'react';
import { View, Button } from 'react-native';
import { Audio } from 'expo-av';

interface AudioPlayerProps {
  audioUri: string;
}

export function AudioPlayer({ audioUri }: AudioPlayerProps) {
  const soundRef = useRef<Audio.Sound | null>(null);

  async function playAudio() {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
    soundRef.current = sound;
    await sound.playAsync();
  }

  return (
    <View>
      <Button title="Sesi Dinle" onPress={playAudio} />
    </View>
  );
}