import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const router = useRouter();

  const handleLogin = async () => {
    await AsyncStorage.setItem("userToken", "dummy-token");
    router.replace("/(tabs)");
  };

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-[General-Bold] mb-6">Login Screen</Text>
      <TouchableOpacity
        className="bg-blue-600 px-6 py-3 rounded-full"
        onPress={handleLogin}
      >
        <Text className="text-white font-[General]">Login</Text>
      </TouchableOpacity>
    </View>
  );
}
