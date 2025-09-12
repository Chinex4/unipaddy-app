import React, { useMemo, useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import BackHeader from "../../components/BackHeader";
import GradientButton from "../../components/ui/GradientButton";
import { Lock, Eye, EyeOff, Check, X } from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAppDispatch } from "@/store/hooks";
import { passwordReset } from "@/redux/auth/auth.thunks";
import { showError } from "@/components/ui/toast";

const schema = yup.object({
  password: yup
    .string()
    .required("Password is required")
    .min(8, "At least 8 characters")
    .matches(/[a-z]/, "Must include a lowercase letter")
    .matches(/[A-Z]/, "Must include an uppercase letter")
    .matches(/[0-9]/, "Must include a number")
    .matches(/[^A-Za-z0-9]/, "Must include a special character"),
  confirmPassword: yup
    .string()
    .required("Confirm your password")
    .oneOf([yup.ref("password")], "Passwords do not match"),
});

type FormData = { password: string; confirmPassword: string };

export default function CreateNewPassword() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Expect params from OTP screen
  const params = useLocalSearchParams<{ email?: string; token?: string }>();
  const email = Array.isArray(params.email) ? params.email[0] : params.email;
  const reset_token = Array.isArray(params.token)
    ? params.token[0]
    : params.token;

  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: { password: "", confirmPassword: "" },
  });

  // Live chips
  const password = useWatch({ control, name: "password" }) || "";
  const checks = useMemo(
    () => ({
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
      len8: password.length >= 8,
    }),
    [password]
  );
  const allPassed =
    checks.upper &&
    checks.lower &&
    checks.number &&
    checks.special &&
    checks.len8;

  const onSubmit = async (data: FormData) => {
    if (!email || !reset_token) {
      showError("Missing reset token. Please restart the reset flow.");
      return;
    }

    await dispatch(
      passwordReset({
        email,
        reset_token,
        password: data.password,
        password_confirmation: data.confirmPassword,
      })
    ).unwrap();

    // backend revokes tokens; route to your success screen (or login)
    router.replace("/(auth)/password-reset-success");
  };

  const Chip = ({ label, active }: { label: string; active: boolean }) => (
    <View
      className={`px-4 py-2 rounded-full mr-2 mb-3 flex-row items-center ${
        active ? "bg-primary-base" : "bg-white"
      } border ${active ? "border-primary-base" : "border-gray-300"}`}
    >
      {active ? (
        <Check size={16} color="#fff" />
      ) : (
        <X size={16} color="#6b7280" />
      )}
      <Text
        className={`ml-2 text-[13px] ${
          active
            ? "text-white font-general-medium"
            : "text-gray-500 font-general"
        }`}
      >
        {label}
      </Text>
    </View>
  );

  return (
    <>
      <StatusBar style="dark" />
      <KeyboardAwareScrollView
        className="flex-1 bg-white"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <BackHeader />

        {/* Title */}
        <View className="px-5 mt-6">
          <Text className="text-3xl text-black font-general-bold">
            Create New Password
          </Text>
          <Text className="text-gray-500 mt-2 text-[14px] font-general">
            Enter a strong password for {email ?? "your account"}.
          </Text>
        </View>

        {/* Password */}
        <View className="px-5 mt-6">
          <Text className="text-sm text-gray-700 mb-1 font-general-medium">
            Enter Password
          </Text>
          <View className="flex-row items-center border border-primary-base rounded-xl px-3">
            <Lock size={18} color="#6b7280" />
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Enter your password"
                  className="flex-1 px-2 py-3 font-general-medium"
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry={!showPwd}
                  autoCapitalize="none"
                />
              )}
            />
            <Pressable onPress={() => setShowPwd((v) => !v)} hitSlop={8}>
              {showPwd ? (
                <Eye size={18} color="#6b7280" />
              ) : (
                <EyeOff size={18} color="#6b7280" />
              )}
            </Pressable>
          </View>
          {errors.password && (
            <Text className="text-red-500 text-xs font-general mt-1">
              {errors.password.message}
            </Text>
          )}

          {/* Rule chips */}
          <View className="flex-row flex-wrap mt-3">
            <Chip label="Uppercase" active={checks.upper} />
            <Chip label="Lowercase" active={checks.lower} />
            <Chip label="Number" active={checks.number} />
            <Chip label="8 Characters" active={checks.len8} />
            <Chip label="Special Characters" active={checks.special} />
          </View>
        </View>

        {/* Confirm */}
        <View className="px-5 mt-5">
          <Text className="text-sm text-gray-700 mb-1 font-general-medium">
            Confirm Password
          </Text>
          <View className="flex-row items-center border border-gray-300 rounded-xl px-3">
            <Lock size={18} color="#6b7280" />
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Confirm your Password"
                  className="flex-1 px-2 py-3 font-general-medium"
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry={!showConfirm}
                  autoCapitalize="none"
                />
              )}
            />
            <Pressable onPress={() => setShowConfirm((v) => !v)} hitSlop={8}>
              {showConfirm ? (
                <Eye size={18} color="#6b7280" />
              ) : (
                <EyeOff size={18} color="#6b7280" />
              )}
            </Pressable>
          </View>
          {errors.confirmPassword && (
            <Text className="text-red-500 text-xs font-general mt-1">
              {errors.confirmPassword.message}
            </Text>
          )}
        </View>

        {/* Continue */}
        <View className="px-5 mt-32">
          <GradientButton
            title={isSubmitting ? "Saving..." : "Continue"}
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid || !allPassed || isSubmitting}
          />
        </View>
      </KeyboardAwareScrollView>
    </>
  );
}
