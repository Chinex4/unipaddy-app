import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, TextInput, Pressable, Keyboard, TouchableWithoutFeedback } from "react-native";
import BackHeader from "../../components/BackHeader";
import GradientButton from "../../components/ui/GradientButton";
import { useRouter, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  verifyEmail,
  loginVerify,
  passwordVerify,
  resendRegisterOtp,
  loginResendOtp,
  passwordResendOtp,
} from "@/redux/auth/auth.thunks";
import { showError } from "@/components/ui/toast";

type OtpType = "register" | "login" | "forgotPassword";

export default function OtpVerification() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string; type?: string }>();
  const paramEmail = Array.isArray(params.email) ? params.email[0] : params.email;
  const type = (Array.isArray(params.type) ? params.type[0] : params.type) as OtpType | undefined;

  const dispatch = useAppDispatch();
  const lastEmail = useAppSelector((s) => s.auth.lastEmailForOtp);
  const resolvedEmail = paramEmail || lastEmail || "";

  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputs = useRef<TextInput[]>([]);
  const [cooldown, setCooldown] = useState(60);

  // Start resend cooldown on mount
  useEffect(() => {
    setCooldown(60);
    const t = setInterval(() => setCooldown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const code = useMemo(() => otp.join(""), [otp]);
  const canContinue = code.length === otp.length && /^\d{4}$/.test(code);

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) return;
    const next = [...otp];
    next[index] = text.replace(/[^0-9]/g, ""); // only digits
    setOtp(next);
    if (text && index < otp.length - 1) inputs.current[index + 1]?.focus();
  };

  const handleBackspace = (text: string, index: number) => {
    if (!text && index > 0) inputs.current[index - 1]?.focus();
  };

  const handleContinue = async () => {
    if (!type) return showError("Unknown OTP type");
    if (!resolvedEmail) return showError("Missing email");

    if (type === "register") {
      await dispatch(verifyEmail({ email: resolvedEmail, code })).unwrap();
      // optional success screen, else go home
      router.replace("/(auth)/register-success");
      return;
    }
    if (type === "login") {
      await dispatch(loginVerify({ email: resolvedEmail, code })).unwrap();
      router.replace("/home"); // adjust to your app’s home route
      return;
    }
    if (type === "forgotPassword") {
      // returns reset_token in the action.payload (see thunk)
      const reset_token = await dispatch(passwordVerify({ email: resolvedEmail, code })).unwrap();
      router.replace(`/(auth)/create-new-password?email=${encodeURIComponent(resolvedEmail)}&token=${encodeURIComponent(reset_token)}`);
      return;
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    if (!resolvedEmail) return showError("Missing email");
    if (!type) return showError("Unknown OTP type");

    if (type === "register") {
      await dispatch(resendRegisterOtp(resolvedEmail)).unwrap();
    } else if (type === "login") {
      await dispatch(loginResendOtp(resolvedEmail)).unwrap();
    } else if (type === "forgotPassword") {
      await dispatch(passwordResendOtp(resolvedEmail)).unwrap();
    }
    setCooldown(60);
  };

  return (
    <>
      <StatusBar style="dark" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View className="flex-1 bg-white font-general">
          <BackHeader />
          <View className="px-5">
            <Text className="text-4xl text-black text-center font-general-bold">Enter Verification Code</Text>
            <Text className="text-gray-500 mt-2 text-[16px] font-general text-center">
              Enter code that was sent to {resolvedEmail || "your email"}
            </Text>
          </View>

          <View className="flex-row justify-center mt-10 gap-4">
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => { if (ref) inputs.current[index] = ref!; }}
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
            <GradientButton title="Continue" onPress={handleContinue} disabled={!canContinue} />
          </View>

          <View className="flex-row justify-center mt-4">
            <Text className="text-gray-500 font-general">Didn’t receive any code?</Text>
            <Pressable onPress={handleResend} disabled={cooldown > 0}>
              <Text className={`font-general-semibold ml-1 ${cooldown > 0 ? "text-gray-400" : "text-primary-base"}`}>
                {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend Code"}
              </Text>
            </Pressable>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </>
  );
}
