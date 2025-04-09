import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './screens/HomeScreen';
import CameraScreen from './screens/CameraScreen';
 import ProcessingScreen from './screens/ProcessingScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Camera" component={CameraScreen} />
          <Stack.Screen 
            name="Processing" 
            component={ProcessingScreen}
            options={{ gestureEnabled: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });



// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { StyleSheet } from 'react-native';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import HomeScreen from './screens/HomeScreen';
// import CameraScreen from './screens/CameraScreen';
// // import AnalysisScreen from './screens/AnalysisScreen';
// import ProcessingScreen from './screens/PrecessingScreen';
// const Stack = createNativeStackNavigator();

// function RootStack() {
//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="Home" component={HomeScreen} />
//       <Stack.Screen name="Camera" component={CameraScreen} />
//       {/* <Stack.Screen name="Processing" component={AnalysisScreen} /> */}
//       <Stack.Screen name='Processing' component={ProcessingScreen}/>
//     </Stack.Navigator>
//   );
// }

// export default function App() {
//   return (
//     <SafeAreaProvider>
//       <NavigationContainer>
//         <RootStack />
//       </NavigationContainer>
//     </SafeAreaProvider>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });




// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { StyleSheet } from 'react-native';
// import { SafeAreaProvider } from "react-native-safe-area-context"
// import { Toaster } from 'sonner-native';
// import HomeScreen from "./screens/HomeScreen"
// import CameraScreen from "./screens/CameraScreen"
// import AnalysisScreen from "./screens/AnalysisScreen"

// const Stack = createNativeStackNavigator();

// function RootStack() {
//   return (
//     <Stack.Navigator screenOptions={{
//       headerShown: false
//     }}>
//       <Stack.Screen name="Home" component={HomeScreen} />
//       <Stack.Screen name="Camera" component={CameraScreen} />
//       {/* <Stack.Screen name="Result" component={AnalysisScreen} /> */}
//     </Stack.Navigator>
//   );
// }

// export default function App() {
//   return (
//     <SafeAreaProvider style={styles.container}>
//       <Toaster />
//       <NavigationContainer>
//         <RootStack />
//       </NavigationContainer>
//     </SafeAreaProvider>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1
//   }
// });