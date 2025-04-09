// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import { MaterialIcons } from '@expo/vector-icons';

// interface ResultsOverlayProps {
//   results: {
//     isDysplasia: boolean;
//     probability: number;
//   };
//   onClose: () => void;
// }

// export const ResultsOverlay: React.FC<ResultsOverlayProps> = ({ results, onClose }) => {
//   const { isDysplasia, probability } = results;
  
//   return (
//     <View style={styles.container}>
//       <View style={styles.card}>
//         <TouchableOpacity style={styles.closeButton} onPress={onClose}>
//           <MaterialIcons name="close" size={24} color="#333" />
//         </TouchableOpacity>
        
//         <Text style={styles.title}>Analysis Results</Text>
        
//         <View style={[
//           styles.resultBox,
//           { backgroundColor: isDysplasia ? '#FFE5E5' : '#E5FFE5' }
//         ]}>
//           <Text style={[
//             styles.resultText,
//             { color: isDysplasia ? '#FF4444' : '#44AA44' }
//           ]}>
//             {isDysplasia ? 'Dysplasia Detected' : 'Normal Movement Pattern'}
//           </Text>
//         </View>
        
//         <View style={styles.probabilityContainer}>
//           <Text style={styles.probabilityLabel}>Confidence Level:</Text>
//           <View style={styles.meter}>
//             <View 
//               style={[
//                 styles.meterFill,
//                 { width: `${probability}%` }
//               ]} 
//             />
//           </View>
//           <Text style={styles.probabilityText}>{probability.toFixed(1)}%</Text>
//         </View>
        
//         <TouchableOpacity style={styles.button} onPress={onClose}>
//           <Text style={styles.buttonText}>Record Again</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   card: {
//     backgroundColor: 'white',
//     borderRadius: 15,
//     padding: 20,
//     width: '100%',
//     maxWidth: 400,
//   },
//   closeButton: {
//     position: 'absolute',
//     right: 15,
//     top: 15,
//     zIndex: 1,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   resultBox: {
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 20,
//   },
//   resultText: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   probabilityContainer: {
//     marginBottom: 20,
//   },
//   probabilityLabel: {
//     fontSize: 16,
//     marginBottom: 8,
//   },
//   meter: {
//     height: 20,
//     backgroundColor: '#f0f0f0',
//     borderRadius: 10,
//     overflow: 'hidden',
//     marginBottom: 5,
//   },
//   meterFill: {
//     height: '100%',
//     backgroundColor: '#4CAF50',
//   },
//   probabilityText: {
//     textAlign: 'right',
//     fontSize: 14,
//     color: '#666',
//   },
//   button: {
//     backgroundColor: '#007AFF',
//     padding: 15,
//     borderRadius: 10,
//   },
//   buttonText: {
//     color: 'white',
//     textAlign: 'center',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });