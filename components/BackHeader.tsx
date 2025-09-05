import { View, Pressable, Image } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { useRouter } from "expo-router";
import OtpVerification from "@/app/(auth)/otp-verification";

type Props = {
  onBackOverride?: () => void;
  fallbackHref?: string;
  hideIfNoHistory?: boolean;
};

export default function BackHeader({
  fallbackHref = "/",
  hideIfNoHistory = false,
  onBackOverride,
} : Props) {
  const router = useRouter();
  const canGoBack = router.canGoBack?.() ?? false;

  const handleBack = () => {
    if (canGoBack) {
      router.back();
    } else if (fallbackHref) {
      router.replace(fallbackHref as any);
    }
    else if (onBackOverride) {
      onBackOverride();
    }
  };

  return (
    <View className="relative">
      {/* Background Image */}
      <Image
        source={require("../assets/images/unipaddy/bg-skyblue.png")}
        className="w-full h-64"
        resizeMode="cover"
      />

      <View className="absolute inset-0 flex-row justify-between items-center top-12 px-4">
        {/* Only show back if allowed */}
        {(!hideIfNoHistory || canGoBack || onBackOverride) && (
          <View className="absolute left-4 flex-row items-center">
            <Pressable
              onPress={handleBack}
              className="p-4 bg-white rounded-full"
              android_ripple={{ borderless: true }}
            >
              <ArrowLeft size={22} color="#000" />
            </Pressable>
          </View>
        )}

        {/* Logo */}
        <View className="absolute right-4">
          <Image
            source={require("../assets/images/unipaddy/logo2.png")}
            className="size-10"
            resizeMode="contain"
          />
        </View>
      </View>
    </View>
  );
}
