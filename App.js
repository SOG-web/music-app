import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView } from 'react-native';
import Constants from 'expo-constants';

import { AudioProvider } from './app/context';
import AppNavigator from './app/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, paddingTop: Constants.statusBarHeight }}>
      <AudioProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AudioProvider>
    </SafeAreaView>
  );
}
