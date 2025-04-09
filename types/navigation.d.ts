// types/navigation.d.ts
export type RootStackParamList = {
    Camera: undefined; // No parameters expected
    Home: undefined; // No parameters expected
    Processing: { videoUri: string }; // Expects a videoUri parameter
    Results: { result: string }; // Expects a result parameter
  };
  