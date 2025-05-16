import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

// Add type for navigation prop
type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;
// export default function HomeScreen() {
//   const navigation = useNavigation<HomeScreenNavigationProp>();

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerText}>PetGait Analyzer</Text>
//         <Text style={styles.subtitle}>Movement Analysis Tool</Text>
//       </View>

//       <View style={styles.content}>
//         <TouchableOpacity 
//           style={styles.button}
//           onPress={() => navigation.navigate('Camera')}
//         >
//           <MaterialIcons name="camera" size={32} color="#FFF" />
//           <Text style={styles.buttonText}>Start Analysis</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F5F5F5',
//   },
//   header: {
//     padding: 20,
//     backgroundColor: '#FFF',
//     alignItems: 'center',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E0E0E0',
//   },
//   headerText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#666',
//     marginTop: 5,
//   },
//   content: {
//     flex: 1,
//     paddingHorizontal: 20,
//     justifyContent: 'center',
//   },
//   button: {
//     backgroundColor: '#4CAF50',
//     paddingVertical: 15,
//     borderRadius: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 15,
//     elevation: 3,
//   },
//   buttonText: {
//     color: '#FFF',
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginLeft: 10,
//   },
// });




// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { MaterialIcons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';
// import React from 'react';

export default function HomeScreen() {
  // const navigation = useNavigation();
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>PetGait Analyzer</Text>
        <Text style={styles.subtitle}>Movement Analysis Tool</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Camera')}
        >
          <MaterialIcons name="camera" size={32} color="#FFF" />
          <Text style={styles.buttonText}>Start Analysis</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.historyButton]}
          onPress={() => navigation.navigate('History')}
        >
          <MaterialIcons name="history" size={32} color="#FFF" />
          <Text style={styles.buttonText}>View History</Text>
        </TouchableOpacity>

        <View style={styles.disclaimer}>
          <MaterialIcons name="info" size={24} color="#666" />
          <Text style={styles.disclaimerText}>
            This tool is for educational purposes only. It is not a medical diagnostic device. Always consult with a veterinarian for proper diagnosis.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFF',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  historyButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  disclaimer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  disclaimerText: {
    flex: 1,
    marginLeft: 10,
    color: '#666',
    fontSize: 14,
  },
});


// // import React from 'react';
// // import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
// // import { SafeAreaView } from 'react-native-safe-area-context';
// // import { useNavigation } from '@react-navigation/native';
// // import { MaterialIcons } from '@expo/vector-icons';

// // export default function HomeScreen() {
// //   const navigation = useNavigation();

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <View style={styles.content}>
// //         <View style={styles.header}>
// //           <Image 
// //             source={{ uri: 'https://api.a0.dev/assets/image?text=cute%20healthy%20dog%20medical%20checkup&aspect=1:1' }}
// //             style={styles.headerImage}
// //           />
// //           <Text style={styles.title}>Dog Gait Analysis</Text>
// //           <Text style={styles.subtitle}>Screen your dog for hip dysplasia</Text>
// //         </View>

// //         <View style={styles.infoContainer}>
// //           <View style={styles.infoCard}>
// //             <MaterialIcons name="pets" size={24} color="#007AFF" />
// //             <Text style={styles.infoTitle}>Real-time Analysis</Text>
// //             <Text style={styles.infoText}>
// //               Advanced AI technology to analyze your dog's movement patterns
// //             </Text>
// //           </View>

// //           <View style={styles.infoCard}>
// //             <MaterialIcons name="medical-services" size={24} color="#007AFF" />
// //             <Text style={styles.infoTitle}>Early Detection</Text>
// //             <Text style={styles.infoText}>
// //               Detect potential hip dysplasia signs early for better treatment
// //             </Text>
// //           </View>
// //         </View>

// //         <TouchableOpacity 
// //           style={styles.startButton}
// //           onPress={() => navigation.navigate('Camera')}
// //         >
// //           <MaterialIcons name="videocam" size={24} color="white" />
// //           <Text style={styles.startButtonText}>Start Screening</Text>
// //         </TouchableOpacity>
// //       </View>
// //     </SafeAreaView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#f5f5f5',
// //   },
// //   content: {
// //     flex: 1,
// //     padding: 20,
// //   },
// //   header: {
// //     alignItems: 'center',
// //     marginBottom: 30,
// //   },
// //   headerImage: {
// //     width: 200,
// //     height: 200,
// //     borderRadius: 100,
// //     marginBottom: 20,
// //   },
// //   title: {
// //     fontSize: 28,
// //     fontWeight: 'bold',
// //     color: '#333',
// //     textAlign: 'center',
// //   },
// //   subtitle: {
// //     fontSize: 16,
// //     color: '#666',
// //     textAlign: 'center',
// //     marginTop: 8,
// //   },
// //   infoContainer: {
// //     flexDirection: 'column',
// //     gap: 16,
// //     marginBottom: 30,
// //   },
// //   infoCard: {
// //     backgroundColor: 'white',
// //     borderRadius: 12,
// //     padding: 16,
// //     alignItems: 'center',
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //     elevation: 2,
// //   },
// //   infoTitle: {
// //     fontSize: 18,
// //     fontWeight: '600',
// //     color: '#333',
// //     marginVertical: 8,
// //   },
// //   infoText: {
// //     fontSize: 14,
// //     color: '#666',
// //     textAlign: 'center',
// //   },
// //   startButton: {
// //     backgroundColor: '#007AFF',
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     padding: 16,
// //     borderRadius: 12,
// //     gap: 8,
// //   },
// //   startButtonText: {
// //     color: 'white',
// //     fontSize: 18,
// //     fontWeight: '600',
// //   },
// // });