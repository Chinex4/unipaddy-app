import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  Pressable,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GradientButton from "../../components/ui/GradientButton";
import BackHeader from "../../components/BackHeader";
import { Mail, Lock, Eye, EyeOff } from "lucide-react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Min 6 characters").required("Password is required"),
});

type LoginFormData = {
  email: string;
  password: string;
};

export default function LoginScreen() {
  const [secureText, setSecureText] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      if (rememberMe) {
        await AsyncStorage.setItem("user", JSON.stringify(data));
      }
      router.replace("/"); // Redirect to home
    } catch (e) {
      console.log(e);
    }
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
          <BackHeader hideIfNoHistory />

          {/* Welcome */}
          <View className="px-5 mt-4">
            <Text className="text-4xl text-black font-general-bold">
              Hi, Welcome Back 👋
            </Text>
            <Text className="text-gray-500 mt-1 text-[14px] font-general">
              Hello, we missed you, kindly sign in to get access to your account!
            </Text>
          </View>

          {/* Form */}
          <View className="px-5 mt-6">
            {/* Email */}
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

            {/* Password */}
            <Text className="text-sm text-gray-700 mt-4 mb-1 font-general-medium">
              Password
            </Text>
            <View className="flex-row items-center border border-gray-300 rounded-lg px-3">
              <Lock size={18} color="gray" />
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder="Enter your password"
                    className="flex-1 px-2 py-3 font-general-medium"
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry={secureText}
                  />
                )}
              />
              <Pressable onPress={() => setSecureText(!secureText)}>
                {secureText ? <EyeOff size={18} color="gray" /> : <Eye size={18} color="gray" />}
              </Pressable>
            </View>
            {errors.password && (
              <Text className="text-red-500 text-xs font-general mt-1">
                {errors.password.message}
              </Text>
            )}

            {/* Remember Me + Forgot */}
            <View className="flex-row justify-between items-center mt-3">
              <Pressable
                onPress={() => setRememberMe(!rememberMe)}
                className="flex-row items-center"
              >
                <View
                  className={`w-5 h-5 border rounded mr-2 ${
                    rememberMe ? "bg-primary-base" : "border-gray-400"
                  }`}
                />
                <Text className="text-gray-600 text-sm font-general-medium">
                  Remember Me
                </Text>
              </Pressable>

              <Pressable onPress={() => router.push("/(auth)/forgot-password")}>
                <Text className="text-primary-base text-sm font-general-medium font-semibold">
                  Forgot Password?
                </Text>
              </Pressable>
            </View>

            {/* Login Button */}
            <GradientButton title="Login" onPress={handleSubmit(onSubmit)} />
          </View>

          {/* Google Sign In */}
          <View className="px-5 mt-10">
            <Text className="text-center text-gray-500 mb-3 font-general">
              Or Sign In Using
            </Text>
            <Pressable
              className="flex-row items-center justify-center border border-gray-300 rounded-lg py-3"
              onPress={() => console.log("Google login")}
            >
              <Image
                source={require("../../assets/images/unipaddy/google.png")}
                className="w-5 h-5 mr-2"
              />
              <Text className="text-black font-general-medium">Google</Text>
            </Pressable>
          </View>

          {/* Sign Up */}
          <View className="flex-row justify-center mt-8 mb-10">
            <Text className="text-gray-600 font-general">Don’t have an account?</Text>
            <Pressable onPress={() => router.push("/(auth)/register")}>
              <Text className="text-primary-base font-general-semibold ml-1">
                Create One
              </Text>
            </Pressable>
          </View>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </>
  );
}
