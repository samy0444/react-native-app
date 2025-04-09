// // import React, { useState, useRef, useEffect } from 'react';
// // import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
// // import { useNavigation } from '@react-navigation/native';
// // import { toast } from 'sonner-native';
// // import { Camera } from 'expo-camera'; // Changed from CameraView to Camera
// // import { MaterialIcons } from '@expo/vector-icons';
// // import * as MediaLibrary from 'expo-media-library';
// // import { StatusBar } from 'expo-status-bar';
// // import { torch, MobileModel } from 'react-native-pytorch-core';

// // const { width, height } = Dimensions.get('window');

// // // Constants from AnalysisScreen
// // const BUFFER_SIZE = 30;
// // const CONFIDENCE_THRESHOLD = 0.65;

// // export default function CameraComponent() {
// //   const [cameraPermission, requestCameraPermission] = Camera.useCameraPermissions();
// //   const [mediaPermission, setMediaPermission] = useState<boolean>(false);
// //   const [microphonePermission, requestMicrophonePermission] = Camera.useMicrophonePermissions();
// //   const [facing, setFacing] = useState(Camera.Constants.Type.back); // Changed to match Camera component
// //   const [isRecording, setIsRecording] = useState(false);
// //   const [isProcessing, setIsProcessing] = useState(false);
// //   const [isModelReady, setIsModelReady] = useState(false);
// //   const [detectionResult, setDetectionResult] = useState<{
// //     status: 'normal' | 'dysplasia' | null;
// //     probability: number;
// //   }>({ status: null, probability: 0 });

// //   const cameraRef = useRef<Camera>(null);
// //   const poseBuffer = useRef<number[]>([]);
// //   const modelRef = useRef({
// //     pose: null,
// //     lstm: null,
// //   });

// //   const navigation = useNavigation();

// //   // Load ML models
// //   useEffect(() => {
// //     const loadModels = async () => {
// //       try {
// //         modelRef.current.pose = await MobileModel.download(
// //           require('../assets/yolov8n-pose.ptl')
// //         );
// //         modelRef.current.lstm = await MobileModel.download(
// //           require('../assets/canine_dysplasia_lstm.ptl')
// //         );
// //         setIsModelReady(true);
// //       } catch (error) {
// //         console.error('Error loading models:', error);
// //         toast.error('Failed to load ML models');
// //       }
// //     };

// //     loadModels();
// //   }, []);

// //   // Request permissions
// //   useEffect(() => {
// //     (async () => {
// //       const { status } = await MediaLibrary.requestPermissionsAsync();
// //       setMediaPermission(status === 'granted');
// //     })();
// //   }, []);

// //   const requestPermissions = async () => {
// //     await requestCameraPermission();
// //     await requestMicrophonePermission();
// //     const { status } = await MediaLibrary.requestPermissionsAsync();
// //     setMediaPermission(status === 'granted');
// //   };

// //   // Process video frames - from AnalysisScreen
// //   const processFrame = async (frameUri: string) => {
// //     if (!modelRef.current.pose || !modelRef.current.lstm) return;
    
// //     setIsProcessing(true);
// //     try {
// //       // Convert frame to tensor
// //       const imageTensor = await torch.media.imageFromFile(frameUri).toTensor();

// //       // Run pose estimation
// //       const poseOutput = await modelRef.current.pose.forward(imageTensor);
// //       const keypoints = poseOutput[0].data;

// //       // Update buffer
// //       if (keypoints.length === 51) {
// //         poseBuffer.current.push(...keypoints);
// //         if (poseBuffer.current.length > BUFFER_SIZE * 51) {
// //           poseBuffer.current.splice(0, poseBuffer.current.length - BUFFER_SIZE * 51);
// //         }
// //       }

// //       // Run LSTM prediction if buffer is full
// //       if (poseBuffer.current.length === BUFFER_SIZE * 51) {
// //         const lstmInput = torch.tensor(
// //           Array.from(poseBuffer.current),
// //           [1, BUFFER_SIZE, 51]
// //         );
// //         const output = await modelRef.current.lstm.forward(lstmInput);
// //         const prob = output.data[0];

// //         // Update detection result
// //         const newResult = {
// //           status: prob > CONFIDENCE_THRESHOLD ? 'dysplasia' : 'normal',
// //           probability: prob * 100
// //         };
        
// //         setDetectionResult(newResult);
        
// //         // Optionally navigate to results screen
// //         navigation.navigate('Results', { result: newResult });
// //       }
// //     } catch (error) {
// //       console.error('Error processing frame:', error);
// //       toast.error('Error analyzing video');
// //     } finally {
// //       setIsProcessing(false);
// //     }
// //   };

// //   if (!cameraPermission || !microphonePermission || mediaPermission === undefined) {
// //     return (
// //       <View style={styles.permissionContainer}>
// //         <Text style={styles.permissionText}>We need camera and media library permissions</Text>
// //         <TouchableOpacity style={styles.permissionButton} onPress={requestPermissions}>
// //           <Text style={styles.permissionButtonText}>Grant Permissions</Text>
// //         </TouchableOpacity>
// //       </View>
// //     );
// //   }

// //   if (!cameraPermission?.granted || !microphonePermission?.granted || !mediaPermission) {
// //     return (
// //       <View style={styles.permissionContainer}>
// //         <Text style={styles.permissionText}>Permission denied. Please enable camera and media access.</Text>
// //         <TouchableOpacity style={styles.permissionButton} onPress={requestPermissions}>
// //           <Text style={styles.permissionButtonText}>Grant Permissions</Text>
// //         </TouchableOpacity>
// //       </View>
// //     );
// //   }

// //   if (!isModelReady) {
// //     return (
// //       <View style={styles.permissionContainer}>
// //         <Text style={styles.permissionText}>Loading ML models...</Text>
// //       </View>
// //     );
// //   }

// //   const toggleCameraFacing = () => {
// //     setFacing(current => 
// //       current === Camera.Constants.Type.back
// //         ? Camera.Constants.Type.front
// //         : Camera.Constants.Type.back
// //     );
// //   };
  
// //   const toggleRecording = async () => {
// //     if (!isRecording) {
// //       try {
// //         setIsRecording(true);
// //         if (cameraRef.current) {
// //           const videoData = await cameraRef.current.recordAsync({
// //             maxDuration: 30,
// //           });
          
// //           // Save to media library
// //           await MediaLibrary.saveToLibraryAsync(videoData.uri);
// //           console.log('Video saved at:', videoData.uri);
          
// //           // Process the video with the ML model
// //           setIsRecording(false);
// //           await processFrame(videoData.uri);
// //         }
// //       } catch (error) {
// //         console.error('Failed to start recording:', error);
// //         setIsRecording(false);
// //         toast.error('Failed to record video');
// //       }
// //     } else {
// //       try {
// //         setIsRecording(false);
// //         if (cameraRef.current) {
// //           await cameraRef.current.stopRecording();
// //         }
// //       } catch (error) {
// //         console.error('Failed to stop recording:', error);
// //         toast.error('Failed to stop recording');
// //       }
// //     }
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <StatusBar style="light" />
// //       <Camera
// //         ref={cameraRef}
// //         style={styles.camera}
// //         type={facing}
// //       >
// //         <View style={styles.overlay}>
// //           {/* Detection Result Display */}
// //           {detectionResult.status && (
// //             <View style={[
// //               styles.resultContainer,
// //               detectionResult.status === 'normal' ? styles.normalResult : styles.dysplasiaResult
// //             ]}>
// //               <Text style={styles.resultText}>
// //                 {detectionResult.status === 'normal' ? 'Normal Movement Pattern' : 'Dysplasia Detected'}
// //               </Text>
// //               <Text style={styles.probabilityText}>
// //                 {`Confidence: ${detectionResult.probability.toFixed(1)}%`}
// //               </Text>
// //             </View>
// //           )}

// //           {isProcessing && (
// //             <View style={styles.processingContainer}>
// //               <Text style={styles.processingText}>Analyzing video...</Text>
// //             </View>
// //           )}

// //           {/* Controls */}
// //           <View style={styles.controls}>
// //             <TouchableOpacity style={styles.controlButton} onPress={toggleCameraFacing}>
// //               <MaterialIcons name="flip-camera-ios" size={32} color="white" />
// //             </TouchableOpacity>
            
// //             <TouchableOpacity 
// //               style={[styles.recordButton, isRecording && styles.recordingButton]} 
// //               onPress={toggleRecording}
// //               disabled={isProcessing}
// //             >
// //               <View style={[styles.recordButtonInner, isRecording && styles.recordingButtonInner]} />
// //             </TouchableOpacity>
// //           </View>
// //         </View>
// //       </Camera>
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: 'black',
// //   },
// //   camera: {
// //     flex: 1,
// //   },
// //   overlay: {
// //     flex: 1,
// //     backgroundColor: 'transparent',
// //     justifyContent: 'space-between',
// //     padding: 20,
// //   },
// //   controls: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-around',
// //     alignItems: 'center',
// //     marginBottom: 30,
// //   },
// //   controlButton: {
// //     width: 60,
// //     height: 60,
// //     borderRadius: 30,
// //     backgroundColor: 'rgba(0,0,0,0.5)',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   recordButton: {
// //     width: 80,
// //     height: 80,
// //     borderRadius: 40,
// //     backgroundColor: 'white',
// //     padding: 5,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   recordButtonInner: {
// //     width: 60,
// //     height: 60,
// //     borderRadius: 30,
// //     backgroundColor: '#ff0000',
// //   },
// //   recordingButton: {
// //     backgroundColor: '#ff0000',
// //   },
// //   recordingButtonInner: {
// //     backgroundColor: 'white',
// //     width: 30,
// //     height: 30,
// //     borderRadius: 5,
// //   },
// //   resultContainer: {
// //     padding: 15,
// //     borderRadius: 10,
// //     alignItems: 'center',
// //     marginTop: 50,
// //   },
// //   normalResult: {
// //     backgroundColor: 'rgba(46, 204, 113, 0.8)',
// //   },
// //   dysplasiaResult: {
// //     backgroundColor: 'rgba(231, 76, 60, 0.8)',
// //   },
// //   resultText: {
// //     color: 'white',
// //     fontSize: 20,
// //     fontWeight: 'bold',
// //   },
// //   probabilityText: {
// //     color: 'white',
// //     fontSize: 16,
// //     marginTop: 5,
// //   },
// //   processingContainer: {
// //     padding: 15,
// //     borderRadius: 10,
// //     alignItems: 'center',
// //     marginTop: 20,
// //     backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //   },
// //   processingText: {
// //     color: 'white',
// //     fontSize: 16,
// //   },
// //   permissionContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     padding: 20,
// //   },
// //   permissionText: {
// //     fontSize: 18,
// //     textAlign: 'center',
// //     marginBottom: 20,
// //   },
// //   permissionButton: {
// //     backgroundColor: '#007AFF',
// //     padding: 15,
// //     borderRadius: 10,
// //   },
// //   permissionButtonText: {
// //     color: 'white',
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //   },
// // });





// import React, { useState, useRef, useEffect } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { toast } from 'sonner-native';
// import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
// import { MaterialIcons } from '@expo/vector-icons';
// import * as MediaLibrary from 'expo-media-library';
// import { StatusBar } from 'expo-status-bar';

// const { width, height } = Dimensions.get('window');

// export default function CameraComponent() {
//   const [cameraPermission, requestCameraPermission] = useCameraPermissions();
//   const [mediaPermission, setMediaPermission] = useState<boolean>(false);
//   const [facing, setFacing] = useState<CameraType>('back');
//   const [isRecording, setIsRecording] = useState(false);
//   const [detectionResult, setDetectionResult] = useState<{
//     status: 'normal' | 'dysplasia' | null;
//     probability: number;
//   }>({ status: null, probability: 0 });

//   const cameraRef = useRef(null);  useEffect(() => {
//     (async () => {
//       const { status } = await MediaLibrary.requestPermissionsAsync();
//       setMediaPermission(status === 'granted');
//     })();
//   }, []);

//   const requestPermissions = async () => {
//     await requestCameraPermission();
//     const { status } = await MediaLibrary.requestPermissionsAsync();
//     setMediaPermission(status === 'granted');
//   };

//   if (!cameraPermission || mediaPermission === undefined) {
//     return (
//       <View style={styles.permissionContainer}>
//         <Text style={styles.permissionText}>We need camera and media library permissions</Text>
//         <TouchableOpacity style={styles.permissionButton} onPress={requestPermissions}>
//           <Text style={styles.permissionButtonText}>Grant Permissions</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }  if (!cameraPermission?.granted || !mediaPermission) {
//     return (
//       <View style={styles.permissionContainer}>
//         <Text style={styles.permissionText}>Permission denied. Please enable camera and media access.</Text>
//         <TouchableOpacity style={styles.permissionButton} onPress={requestPermissions}>
//           <Text style={styles.permissionButtonText}>Grant Permissions</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const toggleCameraFacing = () => {
//     setFacing(current => (current === 'back' ? 'front' : 'back'));
//   };  const navigation = useNavigation();
  
//   const toggleRecording = async () => {
//     if (!isRecording) {
//       try {
//         setIsRecording(true);
//         if (cameraRef.current) {
//           const { uri } = await cameraRef.current.recordAsync();
          
//           // Simulate ML processing
//           // In a real app, this would be where you process the video
//           setTimeout(() => {
//             setIsRecording(false);
//             const result = {
//               status: Math.random() > 0.5 ? 'normal' : 'dysplasia',
//               probability: Math.random() * 100
//             };
//             setDetectionResult({status: Math.random() > 0.5 ? 'normal' : 'dysplasia', probability:  Math.random() * 100});
            
//             // Navigate to results screen
//             navigation.navigate('Results', { result });
//           }, 3000);
//         }
//       } catch (error) {
//         console.error('Failed to start recording:', error);
//         setIsRecording(false);
//         toast.error('Failed to start recording');
//       }
//     } else {
//       try {
//         setIsRecording(false);
//         if (cameraRef.current) {
//           await cameraRef.current.stopRecording();
//         }
//       } catch (error) {
//         console.error('Failed to stop recording:', error);
//         toast.error('Failed to stop recording');
//       }
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar style="light" />
//       <CameraView 
//         ref={cameraRef}
//         style={styles.camera} 
//         facing={facing}
//       >
//         <View style={styles.overlay}>
//           {/* Detection Result Display */}
//           {detectionResult.status && (
//             <View style={[
//               styles.resultContainer,
//               detectionResult.status === 'normal' ? styles.normalResult : styles.dysplasiaResult
//             ]}>
//               <Text style={styles.resultText}>
//                 {detectionResult.status === 'normal' ? 'Normal Movement Pattern' : 'Dysplasia Detected'}
//               </Text>
//               <Text style={styles.probabilityText}>
//                 {`Confidence: ${detectionResult.probability.toFixed(1)}%`}
//               </Text>
//             </View>
//           )}

//           {/* Controls */}
//           <View style={styles.controls}>
//             <TouchableOpacity style={styles.controlButton} onPress={toggleCameraFacing}>
//               <MaterialIcons name="flip-camera-ios" size={32} color="white" />
//             </TouchableOpacity>
            
//             <TouchableOpacity 
//               style={[styles.recordButton, isRecording && styles.recordingButton]} 
//               onPress={toggleRecording}
//             >
//               <View style={[styles.recordButtonInner, isRecording && styles.recordingButtonInner]} />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </CameraView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'black',
//   },
//   camera: {
//     flex: 1,
//   },
//   overlay: {
//     flex: 1,
//     backgroundColor: 'transparent',
//     justifyContent: 'space-between',
//     padding: 20,
//   },
//   controls: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     marginBottom: 30,
//   },
//   controlButton: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   recordButton: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: 'white',
//     padding: 5,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   recordButtonInner: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: '#ff0000',
//   },
//   recordingButton: {
//     backgroundColor: '#ff0000',
//   },
//   recordingButtonInner: {
//     backgroundColor: 'white',
//     width: 30,
//     height: 30,
//     borderRadius: 5,
//   },
//   resultContainer: {
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginTop: 50,
//   },
//   normalResult: {
//     backgroundColor: 'rgba(46, 204, 113, 0.8)',
//   },
//   dysplasiaResult: {
//     backgroundColor: 'rgba(231, 76, 60, 0.8)',
//   },
//   resultText: {
//     color: 'white',
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   probabilityText: {
//     color: 'white',
//     fontSize: 16,
//     marginTop: 5,
//   },
//   permissionContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   permissionText: {
//     fontSize: 18,
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   permissionButton: {
//     backgroundColor: '#007AFF',
//     padding: 15,
//     borderRadius: 10,
//   },
//   permissionButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });