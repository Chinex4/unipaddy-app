import React, { useState } from "react";
import { View, TextInput, Text, Pressable } from "react-native";
import { Eye, EyeOff } from "lucide-react-native";

type Props = {
  label?: string;
  icon?: React.ReactNode;
  placeholder?: string;
  value?: string;
  onChangeText?: (t: string) => void;
  secureTextEntry?: boolean;
  disabled?: boolean;
  keyboardType?: any;
};

export default function TextField({
  label,
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  disabled,
  keyboardType,
}: Props) {
  const [hide, setHide] = useState(!!secureTextEntry);

  return (
    <View className="mb-4">
      {!!label && (
        <Text className="text-gray-700 mb-2 font-general">{label}</Text>
      )}
      <View
        className={`w-full h-14 px-4 rounded-2xl bg-gray-100 flex-row items-center ${disabled ? "opacity-60" : ""}`}
      >
        <View className="mr-3">{icon}</View>
        <TextInput
          className="flex-1 font-general text-[15px] text-gray-900"
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          editable={!disabled}
          secureTextEntry={hide}
          keyboardType={keyboardType}
          placeholderTextColor="#9CA3AF"
        />
        {secureTextEntry && (
          <Pressable onPress={() => setHide((s) => !s)}>
            {hide ? (
              <Eye size={18} color="#9CA3AF" />
            ) : (
              <EyeOff size={18} color="#9CA3AF" />
            )}
          </Pressable>
        )}
      </View>
    </View>
  );
}
