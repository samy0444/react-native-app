import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView, Button } from 'react-native';

type ProcessingScreenProps = {
  route: { params: { videoUri: string } };
};

export default function ProcessingScreen({ route }: ProcessingScreenProps) {
  const { videoUri } = route.params;
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // const uploadVideo = async () => {
  //   setIsProcessing(true);
  //   setError(null);

  //   try {
  //     const formData = new FormData();
  //     formData.append('file', { uri: videoUri, name: 'uploaded_video.mp4', type: 'video/mp4' });

  //     const apiResponse = await fetch('http://192.168.1.9:8000/ws/process-video', {
  //       method: 'POST',
  //       body: formData,
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });

  //     if (!apiResponse.ok) {
  //       throw new Error(`Server error: ${apiResponse.statusText}`);
  //     }

  //     const resultJson = await apiResponse.json();
  //     console.log(resultJson);
      
  //     setResult(
  //       `Diagnosis: ${resultJson.diagnosis}\nProbability: ${(resultJson.dysplasia_probability * 100).toFixed(2)}%`
  //     );
      
  //   } catch (err) {
  //     console.error('Error uploading video:', err);
  //     setError('Failed to upload video or process results.');
  //   } finally {
  //     setIsProcessing(false);
  //   }
  // };


  // for running locally http
  const uploadVideo = async () => {
    setIsProcessing(true);
    setError(null);
  
    try {
      const formData = new FormData();
      
      // Create a file-like object for React Native
      formData.append('file', {
        uri: videoUri,
        name: 'uploaded_video.mp4',
        type: 'video/mp4',
      } as any); // Temporary type assertion
      console.log("==== form =====", formData)
      const apiResponse = await fetch(
        'http://192.168.1.4:8080/process-video',
        {
          method: 'POST',
          body: formData,
          // Do NOT include Content-Type header - React Native sets it automatically
        }
      );
  
      if (!apiResponse.ok) {
        throw new Error(`Server error: ${apiResponse.statusText}`);
      }
  
      const result = await apiResponse.json();
      console.log(result);
      
      setResult(
        `Diagnosis: ${result.diagnosis}\nProbability: ${(result.dysplasia_probability * 100).toFixed(2)}%`
      );
    } catch (err) {
      console.error('Full error:', err);
      setError('Upload failed. Check network connection.');
    } finally {
      setIsProcessing(false);
    }
  };
  

  // for https
  // const uploadVideo = async () => {
  //   setIsProcessing(true);
  //   setError(null);
  
  //   try {
  //     // Create WebSocket connection
  //     const ws = new WebSocket('wss://displaysia-fastapi-samsri2908-dev.apps.rm3.7wse.p1.openshiftapps.com/ws/process-video');
  
  //     ws.onopen = async () => {
  //       // Send video as binary data frame-by-frame
  //       const response = await fetch(videoUri);
  //       const blob = await response.blob();
  //       ws.send(blob);
  //     };
  
  //     ws.onmessage = (event) => {
  //       const result = JSON.parse(event.data);
  //       setResult(`Diagnosis: ${result.diagnosis}\nProbability: ${result.dysplasia_probability}%`);
  //       ws.close();
  //     };
  
  //     ws.onerror = (error) => {
  //       console.error('WebSocket error:', error);
  //       setError('WebSocket connection failed');
  //     };
  
  //   } catch (err) {
  //     console.error('Error:', err);
  //     setError('Failed to process video');
  //   } finally {
  //     setIsProcessing(false);
  //   }
  // };
 
  // const uploadVideo = async () => {
  //   setIsProcessing(true);
  //   setError(null);
  
  //   try {
  //     const ws = new WebSocket('wss://displaysia-fastapi-samsri2908-dev.apps.rm3.7wse.p1.openshiftapps.com/ws/process-video');
  
  //     ws.onopen = async () => {
  //       const response = await fetch(videoUri);
  //       const blob = await response.blob();
  
  //       // Send video data in chunks (1MB per chunk)
  //       const chunkSize = 1024 * 1024; // 1MB
  //       for (let start = 0; start < blob.size; start += chunkSize) {
  //         const chunk = blob.slice(start, start + chunkSize);
  //         ws.send(chunk);
  //       }
  
  //       // Notify server that all chunks have been sent
  //       ws.send(JSON.stringify({ type: 'end' }));
  //     };
  
  //     ws.onmessage = (event) => {
  //       const result = JSON.parse(event.data);
  //       setResult(`Diagnosis: ${result.diagnosis}\nProbability: ${result.dysplasia_probability}%`);
  //       ws.close();
  //     };
  
  //     ws.onerror = (error) => {
  //       console.error('WebSocket error:', error);
  //       setError('WebSocket connection failed');
  //     };
  
  //     ws.onclose = (event) => {
  //       if (event.code !== 1000) {
  //         console.error(`WebSocket closed with code: ${event.code}, reason: ${event.reason}`);
  //         setError(`Connection closed: ${event.reason || 'Unknown error'}`);
  //       }
  //     };
  //   } catch (err) {
  //     console.error('Error:', err);
  //     setError('Failed to process video');
  //   } finally {
  //     setIsProcessing(false);
  //   }
  // };
  

  return (
    <SafeAreaView style={styles.container}>
      {isProcessing ? (
        <>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.progressText}>Uploading...</Text>
        </>
      ) : (
        <>
          {result ? (
            <View style={styles.resultContainer}>
              <Text style={styles.resultText}>{result}</Text>
            </View>
          ) : (
            <Button title="Start Processing" onPress={uploadVideo} />
          )}
          {error && <Text style={styles.errorText}>{error}</Text>}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  progressText: {
    marginTop: 20,
    fontSize: 18,
  },
  resultContainer: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#F0F0F0',
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
});





// import React, { useState } from 'react';
// import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView, Button } from 'react-native';


// import * as MediaLibrary from 'expo-media-library';
// import Tflite from 'react-native-tflite';
// import { RouteProp } from '@react-navigation/native';
// import { RootStackParamList } from '../types/navigation';

// type ProcessingScreenRouteProp = RouteProp<RootStackParamList, 'Processing'>;
// interface Props {
//   route: ProcessingScreenRouteProp;
// }

// export default function ProcessingScreen({ route }: Props) {
//   const { videoUri } = route.params;
//   const [progress, setProgress] = useState(0);
//   const [result, setResult] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [isProcessing, setIsProcessing] = useState(false);

//   const uploadVideo = async () => {
//     setIsProcessing(true);
//     setError(null);

//     try {
//       const formData = new FormData();
//       const response = await fetch(videoUri);
//       const blob = await response.blob();
//       formData.append('file', blob, 'uploaded_video.mp4');

//       const apiResponse = await fetch('http://192.168.1.9:8000/process-video', {
//         method: 'POST',
//         body: formData,
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       if (!apiResponse.ok) {
//         throw new Error(`Server error: ${apiResponse.statusText}`);
//       }

//       const result = await apiResponse.json();
//       console.log(result)
//       setResult(
//         `Diagnosis: ${result.diagnosis}\nProbability: ${(result.dysplasia_probability * 100).toFixed(2)}%`
//       );
//     } catch (err) {
//       console.error('Error uploading video:', err);
//       setError('Failed to upload video or process results.');
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       {isProcessing ? (
//         <>
//           <ActivityIndicator size="large" color="#0000ff" />
//           <Text style={styles.progressText}>Uploading... {progress}%</Text>
//         </>
//       ) : (
//         <>
//           {result ? (
//             <View style={styles.resultContainer}>
//               <Text style={styles.resultText}>{result}</Text>
//             </View>
//           ) : (
//             <Button title="Start Processing" onPress={uploadVideo} />
//           )}
//           {error && <Text style={styles.errorText}>{error}</Text>}
//         </>
//       )}
//     </SafeAreaView>
//   );
// }




// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#FFF',
//   },
//   progressText: {
//     marginTop: 20,
//     fontSize: 18,
//   },
//   resultContainer: {
//     padding: 20,
//     borderRadius: 10,
//     backgroundColor: '#F0F0F0',
//   },
//   resultText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
//   errorText: {
//     color: 'red',
//     fontSize: 18,
//   },
// });




// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
// import * as MediaLibrary from 'expo-media-library';
// import Tflite from 'react-native-tflite';
// import { RouteProp } from '@react-navigation/native';
// import { RootStackParamList } from '../types/navigation';

// type ProcessingScreenRouteProp = RouteProp<RootStackParamList, 'Processing'>;

// interface Props {
//   route: ProcessingScreenRouteProp;
// }

// const BUFFER_SIZE = 30;
// const CONFIDENCE_THRESHOLD = 0.65;

// export default function ProcessingScreen({ route }: Props) {
//   const { videoUri } = route.params;
//   const [progress, setProgress] = useState(0);
//   const [result, setResult] = useState<string | null>(null);
//   const [confidence, setConfidence] = useState(0);
//   const [error, setError] = useState<string | null>(null);
//   const [isProcessing, setIsProcessing] = useState(true);

//   // Model references
//   const tfliteRef = React.useRef<Tflite | null>(null);
//   const modelRef = React.useRef<{
//     pose: any;
//     lstm: any;
//     }>({ pose: null, lstm: null });
//   // Load models on mount
// // processingScreen.tsx
// useEffect(() => {
//     const initializeTFLite = async () => {
//       try {
//         console.log('Initializing TFLite...');
//         const tfliteInstance = new Tflite();
//         console.log('TFLite instance created.');
//         await tfliteInstance.loadModel({
//           model: require('../assets/models/yolov8n-pose_float32.tflite'),
//           labels: '',
//           numThreads: 4,
//         });
//         console.log('Model loaded successfully.');
        
//         tfliteRef.current = tfliteInstance;
//         processVideo();
//       } catch (err) {
//         setError('Failed to load models');
//         setIsProcessing(false);
//       }
//     };
  
//     initializeTFLite();
  
//     return () => {
//       if (tfliteRef.current) {
//         tfliteRef.current.close();
//       }
//     };
//   }, []);
  
  

//   const processVideo = async () => {
//     try {
//       // Get video information
//       const videoInfo = await MediaLibrary.getAssetInfoAsync(videoUri);
//       if (!videoInfo.localUri) {
//         throw new Error('Video URI not found');
//       }

//       // Extract frames (simplified example)
//       const frameUris = await extractVideoFrames(videoInfo.localUri);
//       const poseBuffer: number[] = [];

//     //   // Process each frame
//     //   for (let i = 0; i < frameUris.length; i++) {
//     //     const frameResult = await processFrame(frameUris[i]);

//     //     if (frameResult) {
//     //       poseBuffer.push(...frameResult);

//     //       // Maintain buffer size
//     //       if (poseBuffer.length > BUFFER_SIZE * 51) {
//     //         poseBuffer.splice(0, poseBuffer.length - BUFFER_SIZE * 51);
//     //       }
//     //     }

//     //     // Update progress
//     //     setProgress(i / frameUris.length);

//     //     // Make prediction when buffer is full
//     //     if (poseBuffer.length === BUFFER_SIZE * 51) {
//     //       const sequenceTensor = Float32Array.from(poseBuffer);

//     //       // Run LSTM inference
//     //       tfliteRef.current.runModelOnInput(
//     //         {
//     //           input: sequenceTensor,
//     //           inputShape: [1, BUFFER_SIZE, 51], // Shape of the LSTM input tensor
//     //         },
//     //         (err, output) => {
//     //           if (err) {
//     //             console.error('LSTM inference error:', err);
//     //             return;
//     //           }

//     //           if (output && output[0]) {
//     //             const prob = output[0];
//     //             setConfidence(prob);

//     //             setResult(
//     //               prob > CONFIDENCE_THRESHOLD
//     //                 ? `Dysplasia Detected (${(prob * 100).toFixed(1)}%)`
//     //                 : `Normal (${(prob * 100).toFixed(1)}%)`
//     //             );
//     //           }
//     //         }
//     //       );
//     //     }
//     //   }

//       setIsProcessing(false);
//     } catch (err) {
//       console.error('Error processing video:', err);
//       setError('Failed to process video');
//       setIsProcessing(false);
//     }
//   };

//   // Frame processing logic using TFLite pose detection model
// //   const processFrame = async (uri: string): Promise<number[] | null> => {
// //     try {
// //       return new Promise((resolve, reject) => {
// //         tfliteRef.current.runModelOnImage(
// //           {
// //             path: uri,
// //             imageMean: 127.5,
// //             imageStd: 127.5,
// //             numResults: 1,
// //             threshold: CONFIDENCE_THRESHOLD,
// //           },
// //           (err, output) => {
// //             if (err) {
// //               console.error('Pose detection error:', err);
// //               reject(null);
// //             }

// //             if (output && output[0]) {
// //               resolve(output[0].data); // Extract pose keypoints data
// //             } else {
// //               resolve(null);
// //             }
// //           }
// //         );
// //       });
// //     } catch (err) {
// //       console.error('Error processing frame:', err);
// //       return null;
// //     }
// //   };

//   if (error) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.errorText}>{error}</Text>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       {isProcessing ? (
//         <>
//           <ActivityIndicator size="large" color="#0000ff" />
//           <Text style={styles.progressText}>
//             Processing... {Math.round(progress * 100)}%
//           </Text>
//         </>
//       ) : (
//         <View style={styles.resultContainer}>
//           <Text
//             style={[
//               styles.resultText,
//               { color: confidence > CONFIDENCE_THRESHOLD ? '#FF4444' : '#44FF44' },
//             ]}
//           >
//             {result}
//           </Text>
//         </View>
//       )}
//     </SafeAreaView>
//   );
// }

// // Helper function to extract frames from a video file
// async function extractVideoFrames(uri: string): Promise<string[]> {
//   // Implement actual frame extraction logic using expo-media-library or ffmpeg
//   return Array(30).fill(uri); // Placeholder for extracted frames URIs
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#FFF',
//   },
//   progressText: {
//     marginTop: 20,
//     fontSize: 18,
//   },
//   resultContainer: {
//     padding: 20,
//     borderRadius: 10,
//     backgroundColor: '#F0F0F0',
//   },
//   resultText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
//   errorText: {
//     color: 'red',
//     fontSize: 18,
//   },
// });





// import React, { useState, useEffect } from 'react';
// import { View, Image, Text, Button, StyleSheet } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import TfliteReact from 'react-native-tflite';
// import RNFS from 'react-native-fs';


// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
// import { torch, MobileModel } from 'react-native-pytorch-core';
// import * as MediaLibrary from 'expo-media-library';
// import { RouteProp } from '@react-navigation/native';
// import { RootStackParamList } from '../types/navigation';
// import {  media } from 'react-native-pytorch-core';

// interface Props {
//     route: {
//       params: {
//         videoUri: string;
//       };
//     };
//   }
  

//   const BUFFER_SIZE = 30;
//   const CONFIDENCE_THRESHOLD = 0.65;
// export default function ProcessingScreen({ route }: Props) {
//     const { videoUri } = route.params;


//     const [progress, setProgress] = useState(0);
//     const [result, setResult] = useState<string | null>(null);
//     const [confidence, setConfidence] = useState(0);
//     const [error, setError] = useState<string | null>(null);
//     const [isProcessing, setIsProcessing] = useState(true);

//         // Model references
    // const modelRef = React.useRef<{
    //     pose: any;
    //     lstm: any;
    //     }>({ pose: null, lstm: null });

//     //         // Load models on mount
//     // useEffect(() => {
//     //     const loadModels = async () => {
//     //     try {
//     //         modelRef.current.pose = await MobileModel.download(
//     //         require('../assets/models/yolov8n-pose.ptl')
//     //         );
//     //         modelRef.current.lstm = await MobileModel.download(
//     //         require('../assets/models/canine_dysplasia_lstm.ptl')
//     //         );
//     //         processVideo();
//     //     } catch (err) {
//     //         setError('Failed to load models');
//     //         setIsProcessing(false);
//     //     }
//     //     };

//     //     loadModels();
//     //     processVideo()
//     //     return () => {
//     //     // Cleanup resources
//     //     modelRef.current.pose = null;
//     //     modelRef.current.lstm = null;
//     //     };
//     // }, []);

//     //       const processVideo = async () => {
//     //         try {
//     //           // Get video information
//     //           const videoInfo = await MediaLibrary.getAssetInfoAsync(videoUri);
//     //           if (!videoInfo.localUri) {
//     //             throw new Error('Video URI not found');
//     //           }
        
//     //           // Extract frames (simplified example)
//     //           const frameUris = await extractVideoFrames(videoInfo.localUri);
//     //           const poseBuffer: number[] = [];
              
//     //           // Process each frame
//     //         //   for (let i = 0; i < frameUris.length; i++) {
//     //         //     const frameResult = await processFrame(frameUris[i]);
                
//     //         //     if (frameResult) {
//     //         //       poseBuffer.push(...frameResult);
//     //         //       // Maintain buffer size
//     //         //       if (poseBuffer.length > BUFFER_SIZE * 51) {
//     //         //         poseBuffer.splice(0, poseBuffer.length - BUFFER_SIZE * 51);
//     //         //       }
//     //         //     }
        
//     //         //     // Update progress
//     //         //     setProgress(i / frameUris.length);
        
//     //         //     // Make prediction when buffer is full
//     //         //     if (poseBuffer.length === BUFFER_SIZE * 51) {
//     //         //     //   const sequence = torch.tensor(poseBuffer, {
//     //         //     //     dtype: torch.float32
//     //         //     //   }).reshape([1, BUFFER_SIZE, 51]);
//     //         //     const tensorData = Array.from(poseBuffer); // Convert Float32Array to number[]
//     //         //     const sequence = torch.tensor(tensorData, {
//     //         //       dtype: torch.float32,
//     //         //     }).reshape([1, BUFFER_SIZE, 51]);
                
//     //         //       const output = await modelRef.current.lstm.forward(sequence);
//     //         //       const prob = output.data[0];
                  
//     //         //       setConfidence(prob);
//     //         //       setResult(
//     //         //         prob > CONFIDENCE_THRESHOLD 
//     //         //           ? `Dysplasia Detected (${(prob * 100).toFixed(1)}%)`
//     //         //           : `Normal (${(prob * 100).toFixed(1)}%)`
//     //         //       );
//     //         //     }
//     //         //   }
        
//     //           setIsProcessing(false);
//     //         } catch (err) {
//     //           setError('Failed to process video');
//     //           setIsProcessing(false);
//     //         }
//     //       };




//     const [image, setImage] = useState(null);
//     const [results, setResults] = useState([]);
  
//     useEffect(() => {
//       // Load the model when component mounts
//       TfliteReact.loadModel({
//         model: 'yolov8n.tflite',
//         labels: 'labels.txt',
//         numThreads: 4,
//       });
  
//       return () => {
//         // Unload model when component unmounts
//         TfliteReact.close();
//       };
//     }, []);
  
//     const pickImage = async () => {
//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [4, 3],
//         quality: 1,
//       });
  
//       if (!result.canceled) {
//         setImage(result.uri);
//         processImage(result.uri);
//       }
//     };
  
//     const processImage = async (uri) => {
//       // Process the TFLite model output
//       const confidenceThreshold = 0.5;
      
//       // Run detection
//       TfliteReact.detectObjectOnImage({
//         path: uri,
//         threshold: confidenceThreshold,
//         numResultsPerClass: 5,
//       }, (err, res) => {
//         if (err) {
//           console.error(err);
//         } else {
//           setResults(res);
//         }
//       });
//     };
  
//     return (
//       <View style={styles.container}>
//         <Button title="Pick an image" onPress={pickImage} />
//         {image && <Image source={{ uri: image }} style={styles.image} />}
//         {results.length > 0 && (
//           <View style={styles.resultContainer}>
//             <Text style={styles.resultTitle}>Detection Results:</Text>
//             {results.map((item, index) => (
//               <Text key={index} style={styles.detection}>
//                 {item.detectedClass} ({(item.confidenceInClass * 100).toFixed(2)}%)
//               </Text>
//             ))}
//           </View>
//         )}
//       </View>
//     );



//     // return (
//     //   <SafeAreaView style={styles.container}>
//     //     <Text>Processing Screen</Text>
//     //   </SafeAreaView>
//     // );
//   }

//   // Helper function to extract frames (simplified example)
//   async function extractVideoFrames(uri: string): Promise<string[]> {
//     // Implement actual frame extraction logic using expo-media-library or ffmpeg
//     return Array(30).fill(uri); // Placeholder
//   }

//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       justifyContent: 'center',
//       alignItems: 'center',
//       backgroundColor: '#FFF',
//     },
//     progressText: {
//       marginTop: 20,
//       fontSize: 18,
//     },
//     resultContainer: {
//       padding: 20,
//       borderRadius: 10,
//       backgroundColor: '#F0F0F0',
//     },
//     resultText: {
//       fontSize: 24,
//       fontWeight: 'bold',
//     },
//     errorText: {
//       color: 'red',
//       fontSize: 18,
//     },
//   });

  
  


  



// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
// import { torch, MobileModel } from 'react-native-pytorch-core';
// import * as MediaLibrary from 'expo-media-library';
// import { RouteProp } from '@react-navigation/native';
// import { RootStackParamList } from '../types/navigation';
// import {  media } from 'react-native-pytorch-core';

// type ProcessingScreenRouteProp = RouteProp<RootStackParamList, 'Processing'>;

// interface Props {
//   route: ProcessingScreenRouteProp;
// }

// const BUFFER_SIZE = 30;
// const CONFIDENCE_THRESHOLD = 0.65;

// export default function ProcessingScreen({ route }: Props) {
//   const { videoUri } = route.params;
//   const [progress, setProgress] = useState(0);
//   const [result, setResult] = useState<string | null>(null);
//   const [confidence, setConfidence] = useState(0);
//   const [error, setError] = useState<string | null>(null);
//   const [isProcessing, setIsProcessing] = useState(true);

//   // Model references
//   const modelRef = React.useRef<{
//     pose: any;
//     lstm: any;
//   }>({ pose: null, lstm: null });

//   // Load models on mount
//   // useEffect(() => {
//   //   const loadModels = async () => {
//   //     try {
//   //       modelRef.current.pose = await MobileModel.download(
//   //         require('../assets/models/yolov8n-pose.ptl')
//   //       );
//   //       modelRef.current.lstm = await MobileModel.download(
//   //         require('../assets/models/canine_dysplasia_lstm.ptl')
//   //       );
//   //       processVideo();
//   //     } catch (err) {
//   //       setError('Failed to load models');
//   //       setIsProcessing(false);
//   //     }
//   //   };

//   //   loadModels();

//   //   return () => {
//   //     // Cleanup resources
//   //     modelRef.current.pose = null;
//   //     modelRef.current.lstm = null;
//   //   };
//   // }, []);

// //   useEffect(() => {
// //     const loadModels = async () => {
// //       try {
// //         const [poseModel, lstmModel] = await Promise.all([
// //           MobileModel.download(require('../assets/models/yolov8n-pose.ptl')),
// //           MobileModel.download(require('../assets/models/canine_dysplasia_lstm.ptl'))
// //         ]);
        
// //         if (!poseModel || !lstmModel) {
// //           throw new Error('Failed to load models');
// //         }
        
// //         modelRef.current = {
// //           pose: poseModel,
// //           lstm: lstmModel
// //         };
        
// //         processVideo();
// //       } catch (err) {
// //         setError('Model loading failed: ' + err.message);
// //         setIsProcessing(false);
// //       }
// //     };
// //     loadModels();
// //   }, []);
  

//   const processVideo = async () => {
//     try {
//       // Get video information
//       const videoInfo = await MediaLibrary.getAssetInfoAsync(videoUri);
//       if (!videoInfo.localUri) {
//         throw new Error('Video URI not found');
//       }

//       // Extract frames (simplified example)
//       const frameUris = await extractVideoFrames(videoInfo.localUri);
//       const poseBuffer: number[] = [];

//       // Process each frame
//       for (let i = 0; i < frameUris.length; i++) {
//         const frameResult = await processFrame(frameUris[i]);
        
//         if (frameResult) {
//           poseBuffer.push(...frameResult);
//           // Maintain buffer size
//           if (poseBuffer.length > BUFFER_SIZE * 51) {
//             poseBuffer.splice(0, poseBuffer.length - BUFFER_SIZE * 51);
//           }
//         }

//         // Update progress
//         setProgress(i / frameUris.length);

//         // Make prediction when buffer is full
//         if (poseBuffer.length === BUFFER_SIZE * 51) {
//         //   const sequence = torch.tensor(poseBuffer, {
//         //     dtype: torch.float32
//         //   }).reshape([1, BUFFER_SIZE, 51]);
//         const tensorData = Array.from(poseBuffer); // Convert Float32Array to number[]
//         const sequence = torch.tensor(tensorData, {
//           dtype: torch.float32,
//         }).reshape([1, BUFFER_SIZE, 51]);
        
//           const output = await modelRef.current.lstm.forward(sequence);
//           const prob = output.data[0];
          
//           setConfidence(prob);
//           setResult(
//             prob > CONFIDENCE_THRESHOLD 
//               ? `Dysplasia Detected (${(prob * 100).toFixed(1)}%)`
//               : `Normal (${(prob * 100).toFixed(1)}%)`
//           );
//         }
//       }

//       setIsProcessing(false);
//     } catch (err) {
//       setError('Failed to process video');
//       setIsProcessing(false);
//     }
//   };

//   // // Simplified frame processing
//   // const processFrame = async (uri: string): Promise<number[] | null> => {
//   //   try {
//   //     const imageTensor = await torch.media.imageFromFile(uri).toTensor();
//   //     const output = await modelRef.current.pose.forward(imageTensor);
//   //     return output[0].data;
//   //   } catch (err) {
//   //     return null;
//   //   }
//   // };
//   // 2. Update frame processing
// // Import necessary modules

// const processFrame = async (image: any): Promise<number[] | null> => {
//   try {
//     // Get image dimensions
//     const width = image.getWidth();
//     const height = image.getHeight();

//     // Convert image to a blob
//     const blob = media.toBlob(image);

//     // Create a tensor from the blob
//     let tensor = torch.fromBlob(blob, [height, width, 3]);

//     // Rearrange tensor dimensions from HWC to CHW (channels first)
//     tensor = tensor.permute([2, 0, 1]);

//     // Normalize the tensor (divide by 255 to get values between [0, 1])
//     tensor = tensor.div(255);

//     // Run the model's forward pass with the tensor
//     const output = await modelRef.current.pose.forward(tensor);

//     // Release memory used by the image
//     image.release();

//     return output[0].data;
//   } catch (err) {
//     console.error('Error processing frame:', err);
//     return null;
//   }
// };



//   if (error) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.errorText}>{error}</Text>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       {isProcessing ? (
//         <>
//           <ActivityIndicator size="large" color="#0000ff" />
//           <Text style={styles.progressText}>
//             Processing... {Math.round(progress * 100)}%
//           </Text>
//         </>
//       ) : (
//         <View style={styles.resultContainer}>
//           <Text style={[
//             styles.resultText,
//             { color: confidence > CONFIDENCE_THRESHOLD ? '#FF4444' : '#44FF44' }
//           ]}>
//             {result}
//           </Text>
//         </View>
//       )}
//     </SafeAreaView>
//   );
// }

// // Helper function to extract frames (simplified example)
// async function extractVideoFrames(uri: string): Promise<string[]> {
//   // Implement actual frame extraction logic using expo-media-library or ffmpeg
//   return Array(30).fill(uri); // Placeholder
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#FFF',
//   },
//   progressText: {
//     marginTop: 20,
//     fontSize: 18,
//   },
//   resultContainer: {
//     padding: 20,
//     borderRadius: 10,
//     backgroundColor: '#F0F0F0',
//   },
//   resultText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
//   errorText: {
//     color: 'red',
//     fontSize: 18,
//   },
// });
