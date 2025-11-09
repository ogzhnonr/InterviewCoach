import RNFS from 'react-native-fs';
import { Buffer } from 'buffer';
import { AZURE_TTS_KEY, AZURE_TTS_REGION } from '@env';

interface AzureTTSOptions {
  text: string;
  voice?: string; // Örn: 'tr-TR-AhmetNeural'
  outputFormat?: string; // Örn: 'audio-16khz-32kbitrate-mono-mp3'
}

export async function getAzureTTSAudioUrl({
  text,
  voice = 'tr-TR-AhmetNeural',
  outputFormat = 'audio-16khz-32kbitrate-mono-mp3',
}: AzureTTSOptions): Promise<string> {
  const endpoint = `https://${AZURE_TTS_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`;

  const ssml = `
    <speak version='1.0' xml:lang='tr-TR'>
      <voice xml:lang='tr-TR' xml:gender='Male' name='${voice}'>
        ${text}
      </voice>
    </speak>
  `;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': AZURE_TTS_KEY,
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': outputFormat,
      'User-Agent': 'InterviewCoachApp',
    },
    body: ssml,
  });

  if (!response.ok) throw new Error('Azure TTS API hatası');

  const arrayBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString('base64');
  const fileUri = `${RNFS.DocumentDirectoryPath}tts-output.mp3`;
  await RNFS.writeFile(fileUri, base64, 'base64');
  return fileUri;
}