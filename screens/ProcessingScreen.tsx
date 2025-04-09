import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
import { torch, MobileModel } from 'react-native-pytorch-core';
import * as MediaLibrary from 'expo-media-library';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import {  media } from 'react-native-pytorch-core';

interface Props {
    route: {
      params: {
        videoUri: string;
      };
    };
  }
  

  const BUFFER_SIZE = 30;
  const CONFIDENCE_THRESHOLD = 0.65;
export default function ProcessingScreen({ route }: Props) {
    const { videoUri } = route.params;


    const [progress, setProgress] = useState(0);
    const [result, setResult] = useState<string | null>(null);
    const [confidence, setConfidence] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(true);

        // Model references
    const modelRef = React.useRef<{
        pose: any;
        lstm: any;
        }>({ pose: null, lstm: null });

            // Load models on mount
    // useEffect(() => {
    //     const loadModels = async () => {
    //     try {
    //         modelRef.current.pose = await MobileModel.download(
    //         require('../assets/models/yolov8n-pose.ptl')
    //         );
    //         modelRef.current.lstm = await MobileModel.download(
    //         require('../assets/models/canine_dysplasia_lstm.ptl')
    //         );
    //         processVideo();
    //     } catch (err) {
    //         setError('Failed to load models');
    //         setIsProcessing(false);
    //     }
    //     };

    //     loadModels();

    //     return () => {
    //     // Cleanup resources
    //     modelRef.current.pose = null;
    //     modelRef.current.lstm = null;
    //     };
    // }, []);

          const processVideo = async () => {
            try {
              // Get video information
              const videoInfo = await MediaLibrary.getAssetInfoAsync(videoUri);
              if (!videoInfo.localUri) {
                throw new Error('Video URI not found');
              }
        
              // Extract frames (simplified example)
              const frameUris = await extractVideoFrames(videoInfo.localUri);
              const poseBuffer: number[] = [];
              
              // Process each frame
            //   for (let i = 0; i < frameUris.length; i++) {
            //     const frameResult = await processFrame(frameUris[i]);
                
            //     if (frameResult) {
            //       poseBuffer.push(...frameResult);
            //       // Maintain buffer size
            //       if (poseBuffer.length > BUFFER_SIZE * 51) {
            //         poseBuffer.splice(0, poseBuffer.length - BUFFER_SIZE * 51);
            //       }
            //     }
        
            //     // Update progress
            //     setProgress(i / frameUris.length);
        
            //     // Make prediction when buffer is full
            //     if (poseBuffer.length === BUFFER_SIZE * 51) {
            //     //   const sequence = torch.tensor(poseBuffer, {
            //     //     dtype: torch.float32
            //     //   }).reshape([1, BUFFER_SIZE, 51]);
            //     const tensorData = Array.from(poseBuffer); // Convert Float32Array to number[]
            //     const sequence = torch.tensor(tensorData, {
            //       dtype: torch.float32,
            //     }).reshape([1, BUFFER_SIZE, 51]);
                
            //       const output = await modelRef.current.lstm.forward(sequence);
            //       const prob = output.data[0];
                  
            //       setConfidence(prob);
            //       setResult(
            //         prob > CONFIDENCE_THRESHOLD 
            //           ? `Dysplasia Detected (${(prob * 100).toFixed(1)}%)`
            //           : `Normal (${(prob * 100).toFixed(1)}%)`
            //       );
            //     }
            //   }
        
              setIsProcessing(false);
            } catch (err) {
              setError('Failed to process video');
              setIsProcessing(false);
            }
          };



    return (
      <SafeAreaView style={styles.container}>
        <Text>Processing Screen</Text>
      </SafeAreaView>
    );
  }

  // Helper function to extract frames (simplified example)
  async function extractVideoFrames(uri: string): Promise<string[]> {
    // Implement actual frame extraction logic using expo-media-library or ffmpeg
    return Array(30).fill(uri); // Placeholder
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
