import React, { useState } from "react";
import { Modal, View, Text, Pressable, FlatList } from "react-native";
import { ChevronDown } from "lucide-react-native";

type Props = {
  label: string;
  placeholder?: string;
  value?: string;
  options: string[];
  onSelect: (v: string) => void;
  disabled?: boolean;
};

export default function SelectModal({
  label,
  placeholder = "Select",
  value,
  options,
  onSelect,
  disabled,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <View className="mt-2 mb-2">
      <Text className="text-sm text-gray-700 mb-1 font-general-medium">{label}</Text>

      <Pressable
        disabled={disabled}
        onPress={() => setOpen(true)}
        className={`flex-row items-center justify-between border rounded-lg px-3 py-3 ${
          disabled ? "bg-gray-100 border-gray-200" : "border-gray-300"
        }`}
      >
        <Text
          className={`font-general-medium ${
            value ? "text-black" : "text-gray-400"
          }`}
        >
          {value || placeholder}
        </Text>
        <ChevronDown size={18} color="#6b7280" />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable className="flex-1 bg-black/20" onPress={() => setOpen(false)}>
          <View className="mt-auto bg-white rounded-t-3xl p-4">
            <View className="h-1 w-12 bg-gray-300 self-center rounded-full mb-3" />
            <Text className="text-base font-general-bold mb-2">{label}</Text>

            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    onSelect(item);
                    setOpen(false);
                  }}
                  className="py-3 border-b border-gray-100"
                >
                  <Text className="text-[15px] font-general">{item}</Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
