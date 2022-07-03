import { NavigationContainer } from '@react-navigation/native';
import { AudioProvider } from './app/context';
import AppNavigator from './app/navigation/AppNavigator';

export default function App() {
  return (
    <AudioProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AudioProvider>
  );
}
