// app/splash.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(async () => {
      // const onboarded = await AsyncStorage.getItem("hasOnboarded");
      const onboarded = false;
      const token = await AsyncStorage.getItem("userToken");
      // const token = false;

      if (!onboarded) {
        router.replace("/(onboarding)");
      } else if (!token) {
        router.replace("/(auth)/login");
      } else {
        router.replace("/(tabs)");
      }
    }, 2000); // 2s

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/unipaddy/logo.png")}
        style={styles.logo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2563eb", // your primary blue
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
});
