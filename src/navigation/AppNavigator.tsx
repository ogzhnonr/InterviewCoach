import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ProfessionSelectionScreen } from '../screens/ProfessionSelectionScreen';
import { QuestionsScreen } from '../screens/QuestionsScreen';
import { FeedbackScreen } from '../screens/FeedbackScreen';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="ProfessionSelection"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right'
        }}
      >
        <Stack.Screen name="ProfessionSelection" component={ProfessionSelectionScreen} />
        <Stack.Screen name="Questions" component={QuestionsScreen} />
        <Stack.Screen name="Feedback" component={FeedbackScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}; 