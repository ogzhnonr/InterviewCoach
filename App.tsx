/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { InterviewProvider } from './src/contexts/InterviewContext';
import { AppNavigator } from './src/navigation/AppNavigator';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <InterviewProvider>
        <AppNavigator />
      </InterviewProvider>
    </SafeAreaProvider>
  );
}

export default App;
