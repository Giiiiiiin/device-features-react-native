import { SafeAreaView } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { styles } from './src/styles/globalStyles';
import FlashMessage from "react-native-flash-message";
import { GlobalContextProvider } from './src/context/globalContext';

export default function App() {
  return (
    <>
      <SafeAreaView style={styles.container}>
        <GlobalContextProvider>
          <AppNavigator />
        </GlobalContextProvider>
      </SafeAreaView>
      <FlashMessage position="bottom" />
    </>
  );
}
