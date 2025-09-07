// components/FAB.tsx
import React from "react";
import { Pressable } from "react-native";
import { Plus } from "lucide-react-native";

export default function FAB({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="absolute bottom-44 z-50 right-5 h-14 w-14 rounded-full bg-primary-base items-center justify-center shadow-lg"
      android_ripple={{ color: "#ffffff22", borderless: true }}
    >
      <Plus size={26} color="#fff" />
    </Pressable>
  );
}
