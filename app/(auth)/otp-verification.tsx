import React, { useRef, useState } from "react";
import { View, Text, TextInput, Pressable, Keyboard, TouchableWithoutFeedback } from "react-native";
import BackHeader from "../../components/BackHeader";
import GradientButton from "../../components/ui/GradientButton";
import { useRouter, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function OtpVerification() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string; type?: string }>();
  const email = Array.isArray(params.email) ? params.email[0] : params.email;
  const type = Array.isArray(params.type) ? params.type[0] : params.type;

  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputs = useRef<TextInput[]>([]);

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) return;
    const next = [...otp];
    next[index] = text;
    setOtp(next);
    if (text && index < otp.length - 1) inputs.current[index + 1]?.focus();
  };

  const handleBackspace = (text: string, index: number) => {
    if (!text && index > 0) inputs.current[index - 1]?.focus();
  };

  const handleContinue = () => {
    const code = otp.join("");
    console.log("Entered OTP:", code);

    // Ensure all digits entered
    if (code.length !== otp.length) return;

    // Route based on 'type'
    if (type === "forgotPassword") {
      router.replace("/(auth)/create-new-password");
    } else if (type === "register") {
      router.replace("/(auth)/register-success");
    } else {
      // Fallback if no type provided
      router.replace("/(auth)/login");
    }
  };

  return (
    <>
      <StatusBar style="dark" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View className="flex-1 bg-white font-general">
          <BackHeader />
          <View className="px-5">
            <Text className="text-4xl text-black text-center font-general-bold">
              Enter Verification Code
            </Text>
            <Text className="text-gray-500 mt-2 text-[16px] font-general text-center">
              Enter code that was sent to {email ?? "your email"}
            </Text>
          </View>

          <View className="flex-row justify-center mt-10 gap-4">
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => { if (ref) inputs.current[index] = ref; }}
                value={digit}
                onChangeText={(t) => handleChange(t, index)}
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === "Backspace") handleBackspace(digit, index);
                }}
                keyboardType="numeric"
                maxLength={1}
                className="size-16 text-center text-3xl border border-unigrey/70 rounded-md font-general-semibold text-black"
              />
            ))}
          </View>

          <View className="px-5 mt-72">
            <GradientButton title="Continue" onPress={handleContinue} />
          </View>

          <View className="flex-row justify-center mt-4">
            <Text className="text-gray-500 font-general">Didn’t receive any code?</Text>
            <Pressable onPress={() => console.log("Resend OTP")}>
              <Text className="text-primary-base font-general-semibold ml-1">Resend Code</Text>
            </Pressable>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </>
  );
}
