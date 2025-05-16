
import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Alert, Button } from 'react-native';
import { Camera, CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as MediaLibrary from 'expo-media-library';
import { Audio } from 'expo-av';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

// Add type for navigation prop
type CameraScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Camera'
>;
export default function CameraScreen() {
  const navigation = useNavigation<CameraScreenNavigationProp>();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();
  const [cameraFacing, setCameraFacing] = useState<'back' | 'front'>('back');
  const [isRecording, setIsRecording] = useState(false);
  // const navigation = useNavigation();
  const cameraRef = useRef<CameraView>(null);

  
  useEffect(() => {
    const verifyPermissions = async () => {
      if (!cameraPermission?.granted) await requestCameraPermission();
      if (!microphonePermission?.granted) await requestMicrophonePermission();
    };
    verifyPermissions();
  }, []);
  

  if (!cameraPermission?.granted || !microphonePermission?.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          {!cameraPermission?.granted ? 'Camera permission required\n' : ''}
          {!microphonePermission?.granted ? 'Microphone permission required' : ''}
        </Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => {
            if (!cameraPermission?.granted) requestCameraPermission();
            if (!microphonePermission?.granted) requestMicrophonePermission();
          }}
        >
          <Text style={styles.buttonText}>Grant Permissions</Text>
        </TouchableOpacity>
      </View>
    );
  }


  

// const toggleRecording = async () => {
//     if (!cameraRef.current) {
//       Alert.alert("Camera not ready");
//       return;
//     }
  
//     try {
//       if (isRecording) {
//         await cameraRef.current.stopRecording();
//         setIsRecording(false);
//       } else {
//         // Android requires audio permission even when muted[2][9]
//         const { status } = await Audio.requestPermissionsAsync();
//         if (status !== 'granted') {
//           Alert.alert("Audio permission required for recording");
//           return;
//         }
  
//         setIsRecording(true);
        
//         const videoData = await cameraRef.current.recordAsync({
//           maxDuration: Platform.OS === 'android' ? 30000 : 30, // Android=ms, iOS=sec[2][9]
//         //   mute: false, // Required for Android recording[2][9]
//         //   quality: '720p'
//         });
  
//         if (videoData?.uri) {
//           const asset = await MediaLibrary.createAssetAsync(videoData.uri);
//           await MediaLibrary.createAlbumAsync('AppVideos', asset, false);
          
//         //   navigation.navigate('Results', { 
//         //     videoUri: videoData.uri
//         //   });
//         }
//       }
//     } catch (error) {
//       Alert.alert("Recording Failed", error.message);
//       setIsRecording(false);
//     } finally {
//       if (isRecording) { // Cleanup if still recording
//         cameraRef.current?.stopRecording();
//         setIsRecording(false);
//       }
//     }
//   };
  

const toggleRecording = async () => {
  if (!cameraRef.current) {
    Alert.alert("Camera not ready");
    return;
  }

  try {
    if (isRecording) {
      await cameraRef.current.stopRecording();
      setIsRecording(false);
    } else {
      setIsRecording(true);

      const videoData = await cameraRef.current.recordAsync({
        maxDuration: 30, // Seconds for both platforms
      });

      if (videoData?.uri) {
        // const { status } = await MediaLibrary.requestPermissionsAsync();
        // if (status === "granted") {
        //   const asset = await MediaLibrary.createAssetAsync(videoData.uri);
        //   await MediaLibrary.createAlbumAsync('AppVideos', asset, false);
          
        // }
         navigation.navigate('Processing', { videoUri: videoData.uri });
      }
    }
  } catch (error) {
    Alert.alert("Recording Failed", error.message);
    setIsRecording(false);
  } finally {
    if (isRecording) {
      cameraRef.current?.stopRecording();
      setIsRecording(false);
    }
  }
};



  return (
    <SafeAreaView style={styles.container}>
      <CameraView 
        ref={cameraRef}
        style={styles.camera} 
        facing={cameraFacing}
        mode="video" // Add this line
        enableTorch={false}
      >
        <View style={styles.overlay}>
          <View style={styles.guideBox} />
        </View>

        <View style={styles.controls}>
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={() => setCameraFacing(current => 
              current === 'front' ? 'back' : 'front'
            )}
          >
            <MaterialIcons name="flip-camera-ios" size={28} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.recordButton, isRecording && styles.recording]}
            onPress={toggleRecording}
          >
            <View style={styles.recordButtonInner} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton}>
            <MaterialIcons name="settings" size={28} color="#FFF" />
          </TouchableOpacity>
        </View>
      </CameraView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  buttonContainer:{
    backgroundColor:"#fff",
    alignSelf:"flex-end"
  },
  video: {
    flex: 1,
    alignSelf: "stretch"
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideBox: {
    width: 300,
    height: 200,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: 10,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 30,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButtonInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FF4444',
  },
  recording: {
    backgroundColor: 'rgba(255,0,0,0.3)',
  },
  text: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    margin: 20,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    margin: 20,
  },
  buttonText: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
