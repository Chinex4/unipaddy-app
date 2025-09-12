import React from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import GradientButton from "../../components/ui/GradientButton";
import BackHeader from "../../components/BackHeader";
import { Mail } from "lucide-react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useAppDispatch } from "@/store/hooks";
import { passwordForgot } from "@/redux/auth/auth.thunks";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
});

type ForgotPasswordFormData = { email: string };

export default function ForgotPassword() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    await dispatch(passwordForgot(data.email)).unwrap();
    router.push(
      `/(auth)/otp-verification?email=${encodeURIComponent(
        data.email
      )}&type=forgotPassword`
    );
  };

  return (
    <>
      <StatusBar style="dark" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAwareScrollView
          className="flex-1 bg-white font-general"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <BackHeader />

          {/* Title */}
          <View className="px-5 mt-6">
            <Text className="text-3xl text-black font-general-bold">
              Forgot Password?
            </Text>
            <Text className="text-gray-500 mt-2 text-[14px] font-general">
              Enter the email address you used during registration. We’ll send
              you a 4-digit code to reset your password.
            </Text>
          </View>

          {/* Form */}
          <View className="px-5 mt-8">
            <Text className="text-sm text-gray-700 mb-1 font-general-medium">
              Email Address
            </Text>
            <View className="flex-row items-center border border-gray-300 rounded-lg px-3">
              <Mail size={18} color="gray" />
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder="Enter your email"
                    className="flex-1 px-2 py-3 font-general-medium"
                    onChangeText={onChange}
                    value={value}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                )}
              />
            </View>
            {errors.email && (
              <Text className="text-red-500 text-xs font-general mt-1">
                {errors.email.message}
              </Text>
            )}

            {/* Submit */}
            <GradientButton
              title={isSubmitting ? "Please wait..." : "Send Reset Code"}
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            />

            {/* Back to Login */}
            <View className="flex-row justify-center mt-6">
              <Text className="text-gray-600 font-general">
                Remembered your password?
              </Text>
              <Pressable onPress={() => router.push("/(auth)/login")}>
                <Text className="text-primary-base font-general-semibold ml-1">
                  Login
                </Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </>
  );
}
