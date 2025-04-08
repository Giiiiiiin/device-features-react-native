import { SafeAreaView } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { styles } from './src/styles/globalStyles';
import FlashMessage from "react-native-flash-message";

export default function App() {
  return (
    <>
      <SafeAreaView style={styles.container}>
          <AppNavigator />
      </SafeAreaView>
      <FlashMessage position="bottom" />
    </>
  );
}
