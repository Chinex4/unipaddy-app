import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "react-native";

export default function CgpaScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-5 pt-2">
        <Text className="font-general text-2xl text-gray-900">CGPA</Text>
      </View>
    </SafeAreaView>
  );
}
