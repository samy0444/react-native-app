// import React, { useEffect, useRef, useState } from 'react';
// import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
// import { Camera } from 'expo-camera';
// import * as MediaLibrary from 'expo-media-library';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { torch, MobileModel } from 'react-native-pytorch-core';

// const BUFFER_SIZE = 30;
// const CONFIDENCE_THRESHOLD = 0.65;

// const App = () => {
//   const [cameraPermission, setCameraPermission] = useState(false);
//   const [microphonePermission, setMicrophonePermission] = useState(false);
//   const [mediaLibraryPermission, setMediaLibraryPermission] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [isModelReady, setIsModelReady] = useState(false);
//   const [result, setResult] = useState<string | null>(null);
//   const [confidence, setConfidence] = useState(0);

//   const cameraRef = useRef<Camera>(null);
//   const poseBuffer = useRef<number[]>([]);
//   const modelRef = useRef({
//     pose: null,
//     lstm: null,
//   });

//   // Request permissions
//   useEffect(() => {
//     (async () => {
//       const cameraStatus = await Camera.requestPermissionsAsync();
//       const microphoneStatus = await Camera.requestMicrophonePermissionsAsync();
//       const mediaLibraryStatus = await MediaLibrary.requestPermissionsAsync();

//       setCameraPermission(cameraStatus.granted);
//       setMicrophonePermission(microphoneStatus.granted);
//       setMediaLibraryPermission(mediaLibraryStatus.granted);
//     })();
//   }, []);

//   // Load models
//   useEffect(() => {
//     const loadModels = async () => {
//       try {
//         modelRef.current.pose = await MobileModel.download(
//           require('./assets/yolov8n-pose.ptl')
//         );
//         modelRef.current.lstm = await MobileModel.download(
//           require('./assets/canine_dysplasia_lstm.ptl')
//         );
//         setIsModelReady(true);
//       } catch (error) {
//         console.error('Error loading models:', error);
//       }
//     };

//     loadModels();
    
//   }, []);

//   // Process video frames
//   const processFrame = async (frameUri: string) => {
//     if (!modelRef.current.pose || !modelRef.current.lstm) return;

//     try {
//       // Convert frame to tensor
//       const imageTensor = await torch.media.imageFromFile(frameUri).toTensor();

//       // Run pose estimation
//       const poseOutput = await modelRef.current.pose.forward(imageTensor);
//       const keypoints = poseOutput[0].data;

//       // Update buffer
//       if (keypoints.length === 51) {
//         poseBuffer.current.push(...keypoints);
//         if (poseBuffer.current.length > BUFFER_SIZE * 51) {
//           poseBuffer.current.splice(0, poseBuffer.current.length - BUFFER_SIZE * 51);
//         }
//       }

//       // Run LSTM prediction if buffer is full
//       if (poseBuffer.current.length === BUFFER_SIZE * 51) {
//         const lstmInput = torch.tensor(
//           Array.from(poseBuffer.current),
//           [1, BUFFER_SIZE, 51]
//         );
//         const output = await modelRef.current.lstm.forward(lstmInput);
//         const prob = output.data[0];

//         // Calculate probability and update result
//         const percentage = (prob * 100).toFixed(1);
//         const status =
//           prob > CONFIDENCE_THRESHOLD ? `Dysplasia Detected (${percentage}%)` : `Normal (${percentage}%)`;

//         setConfidence(prob);
//         setResult(status);
//       }
//     } catch (error) {
//       console.error('Error processing frame:', error);
//     }
//   };

//   // Start/stop recording
// //   const toggleRecording = async () => {
// //     if (!cameraRef.current) return;

// //     try {
// //       if (isRecording) {
// //         await cameraRef.current.stopRecording();
// //         setIsRecording(false);
// //       } else {
// //         setIsRecording(true);

// //         const videoData = await cameraRef.current.recordAsync({
// //           maxDuration: 30,
// //         });

// //         console.log('Video recorded at:', videoData.uri);

// //         // Save video to media library
// //         await MediaLibrary.saveToLibraryAsync(videoData.uri);

// //         // Process video frames for dysplasia detection
// //         processFrame(videoData.uri);

// //         setIsRecording(false);
// //       }
// //     } catch (error) {
// //       console.error('Error during recording:', error);
// //       setIsRecording(false);
// //     }
// //   };

//   if (!cameraPermission || !microphonePermission || !mediaLibraryPermission) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.text}>Permissions required</Text>
//       </View>
//     );
//   }

//   if (!isModelReady) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#0000ff" />
//         <Text style={styles.text}>Loading models...</Text>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <Camera ref={cameraRef} style={styles.camera} type={Camera.Constants.Type.back}>
//         <TouchableOpacity onPress={toggleRecording} style={styles.recordButton}>
//           <Text style={styles.recordButtonText}>
//             {isRecording ? 'Stop Recording' : 'Start Recording'}
//           </Text>
//         </TouchableOpacity>

//         {result && (
//           <View style={styles.resultContainer}>
//             <Text style={[
//               styles.resultText,
//               { color: confidence > CONFIDENCE_THRESHOLD ? '#FF4444' : '#44FF44' },
//             ]}>
//               {result}
//             </Text>
//           </View>
//         )}
//       </Camera>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#000' },
//   camera: { flex: 1 },
//   recordButton: { position: 'absolute', bottom: 50, alignSelf: 'center', padding: 10, backgroundColor: '#2196F3', borderRadius: 5 },
//   recordButtonText: { color: '#FFF', fontSize: 16 },
// });

// export default App;





// // const AnalysisScreen = () => {
// //   const [isModelReady, setIsModelReady] = useState(false);
// //   const [cameraPermission, setCameraPermission] = useState(false);
// //   const [audioPermission, setAudioPermission] = useState(false);
// //   const [result, setResult] = useState<string | null>(null);
// //   const [confidence, setConfidence] = useState(0);
// //   const [isRecording, setIsRecording] = useState(false);
  
// // //   const cameraRef = useRef<CameraType>(null);
// // // 1. Fix camera reference type
// // const cameraRef = useRef<Camera>(null); // Instead of CameraType
// //   const poseBuffer = useRef<number[]>([]);
// //   const modelRef = useRef<ModelType>({ pose: null, lstm: null });

// //   // Load models
// //   const loadModels = async () => {
// //     try {
// //       modelRef.current.pose = await MobileModel.download(
// //         require('../assets/models/yolov8n-pose.ptl')
// //       );
// //       modelRef.current.lstm = await MobileModel.download(
// //         require('../assets/models/canine_dysplasia_lstm.ptl')
// //       );
// //       setIsModelReady(true);
// //     } catch (error) {
// //       console.error('Model loading error:', error);
// //     }
// //   };

// //   // Request permissions
// //   useEffect(() => {
// //     (async () => {
// //       const cameraStatus = await Camera.requestCameraPermissionsAsync();
// //       const audioStatus = await Camera.requestMicrophonePermissionsAsync();
// //       setCameraPermission(cameraStatus.status === 'granted');
// //       setAudioPermission(audioStatus.status === 'granted');
// //     })();

// //     loadModels();
// //   }, []);

// //   // Process video frames
// //   const processFrame = async (frameUri: string) => {
// //     if (!modelRef.current.pose || !modelRef.current.lstm) return null;

// //     try {
// //       const image = await torch.media.imageFromFile(frameUri);
// //       const inputTensor = await image.toTensor();

// //       // Pose estimation
// //       const poseOutput = await modelRef.current.pose.forward(inputTensor);
// //       const keypoints = poseOutput[0].data as number[];

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
// //             Array.from(poseBuffer.current),
// //           [1, BUFFER_SIZE, 51]
// //         );
// //         const output = await modelRef.current.lstm.forward(lstmInput);
// //         const prob = output.data[0];

// //         // Calculate percentage and format result
// //         const percentage = (prob * 100).toFixed(1);
// //         const status = prob > CONFIDENCE_THRESHOLD ? "Dysplasia Detected" : "Normal";

// //         setConfidence(prob);
// //         setResult(`${status} (${percentage}%)`);
// //       }
// //     } catch (error) {
// //       console.error('Frame processing error:', error);
// //     }
// //   };





// // // 2. Ensure you call methods on the camera instance
// // // 2. Update toggleRecording function
// // const toggleRecording = async () => {
// //     if (!cameraRef.current) return;
  
// //     try {
// //       if (isRecording) {
// //         await cameraRef.current.stopRecording();
// //       } else {
// //         const video = await cameraRef.current.recordAsync({
// //           maxDuration: 10,
// //           mute: false,
// //         });
// //         processFrame(video.uri);
// //       }
// //     } catch (error) {
// //       console.error('Recording error:', error);
// //     } finally {
// //       setIsRecording(!isRecording);
// //     }
// //   };
  
// //   // 3. Add missing permissions request
// //   useEffect(() => {
// //     (async () => {
// //       await Camera.requestCameraPermissionsAsync();
// //       await Camera.requestMicrophonePermissionsAsync();
// //     })();
// //   }, []);


// // //   // Start/stop video recording
// // //   const toggleRecording = async () => {
// // //     if (!cameraRef.current) return;

// // //     if (isRecording) {
// // //       await cameraRef.current.stopRecording();
// // //       setIsRecording(false);
// // //     } else {
// // //       setIsRecording(true);

// // //       const videoData = await cameraRef.current.recordAsync({
// // //         maxDuration: 10,
// // //         mute: false,
// // //       });

// // //       console.log('Video recorded at:', videoData.uri);

// // //       // Process recorded video frames for dysplasia detection
// // //       processFrame(videoData.uri);

// // //       setIsRecording(false);
// // //     }
// // //   };

// //   if (!cameraPermission || !audioPermission) {
// //     return (
// //       <View style={styles.container}>
// //         <Text style={styles.text}>Camera and microphone permissions required</Text>
// //       </View>
// //     );
// //   }

// //   if (!isModelReady) {
// //     return (
// //       <View style={styles.container}>
// //         <ActivityIndicator size="large" color="#0000ff" />
// //         <Text style={styles.text}>Loading models...</Text>
// //       </View>
// //     );
// //   }

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <Camera
// //         ref={cameraRef}
// //         style={styles.camera}
// //         type={CameraType.back}
// //       >
// //         <View style={styles.overlay}>
// //           <TouchableOpacity onPress={toggleRecording} style={styles.recordButton}>
// //             <Text style={styles.recordButtonText}>
// //               {isRecording ? 'Stop Recording' : 'Start Recording'}
// //             </Text>
// //           </TouchableOpacity>

// //           {result && (
// //             <View style={styles.resultContainer}>
// //               <Text style={[
// //                 styles.resultText,
// //                 { color: confidence > CONFIDENCE_THRESHOLD ? '#FF4444' : '#44FF44' }
// //               ]}>
// //                 {result}
// //               </Text>
// //             </View>
// //           )}
// //         </View>
// //       </Camera>
// //     </SafeAreaView>
// //   );
// // };
// // const styles = StyleSheet.create({
// //     container: {
// //       flex: 1,
// //       backgroundColor: '#000',
// //     },
// //     text: {
// //       color: 'white',
// //       fontSize: 16,
// //       textAlign: 'center',
// //       marginTop: 10,
// //     },
// //     camera: {
// //       flex: 1,
// //     },
// //     overlay: {
// //       ...StyleSheet.absoluteFillObject,
// //       justifyContent: 'space-between',
// //       alignItems: 'center',
// //       paddingVertical: 20,
// //     },
// //     recordButton: {
// //       backgroundColor: '#2196F3',
// //       paddingHorizontal: 20,
// //       paddingVertical: 10,
// //       borderRadius: 5,
// //       marginBottom: 20,
// //     },
// //     recordButtonText: {
// //       color: '#FFF',
// //       fontSize: 16,
// //       fontWeight: 'bold',
// //     },
// //     resultContainer: {
// //       padding: 15,
// //       backgroundColor: 'rgba(0,0,0,0.7)',
// //       borderRadius: 10,
// //       alignItems: 'center',
// //     },
// //     resultText: {
// //       fontSize: 18,
// //       fontWeight: 'bold',
// //       marginTop: 10,
// //       color: 'white',
// //     },
// //     disclaimer: {
// //       color: 'white',
// //       fontSize: 12,
// //       textAlign: 'center',
// //       backgroundColor: 'rgba(0,0,0,0.7)',
// //       padding: 10,
// //       borderRadius: 5,
// //     }
// //   });
  

// // export default AnalysisScreen;
