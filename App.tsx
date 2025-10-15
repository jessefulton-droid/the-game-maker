import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { RootStackParamList } from './app/types';

// Import screens
import { HomeScreen } from './app/screens/HomeScreen';
import { CameraScreen } from './app/screens/CameraScreen';
import { BookDiscussionScreen } from './app/screens/BookDiscussionScreen';
import { GameDesignScreen } from './app/screens/GameDesignScreen';
import { GenerationScreen } from './app/screens/GenerationScreen';
import { GameScreen } from './app/screens/GameScreen';
import { FeedbackScreen } from './app/screens/FeedbackScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
        />
        <Stack.Screen 
          name="Camera" 
          component={CameraScreen}
        />
        <Stack.Screen 
          name="BookDiscussion" 
          component={BookDiscussionScreen}
        />
        <Stack.Screen 
          name="GameDesign" 
          component={GameDesignScreen}
        />
        <Stack.Screen 
          name="Generation" 
          component={GenerationScreen}
        />
        <Stack.Screen 
          name="Game" 
          component={GameScreen}
        />
        <Stack.Screen 
          name="Feedback" 
          component={FeedbackScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
