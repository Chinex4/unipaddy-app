import React, { useState } from "react";
import { View, Text, Alert, Pressable, ScrollView } from "react-native";
import GradientHeader from "@/components/headers/GradientHeader";
import TextField from "@/components/ui/TextField";
import { AtSign, KeyRound } from "lucide-react-native";

export default function AccountInfoScreen() {
  const [email, setEmail] = useState("travisscott@gmail.com");
  const [pwd, setPwd] = useState("");

  const confirm = (title: string, message: string, onYes: () => void) => {
    Alert.alert(title, message, [
      { text: "Cancel", style: "cancel" },
      { text: "Yes", style: "destructive", onPress: onYes },
    ]);
  };

  return (
    <View className="flex-1 bg-white">
      <GradientHeader title="Account Information" height={100} />

      <ScrollView className="px-4 -mt-10">
        <Text className="font-general text-gray-500 mb-4">
          Receive notifications about latest news & system updates from us.
        </Text>

        <TextField
          label="Email Address"
          icon={<AtSign size={18} color="#6B7280" />}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
        />

        <TextField
          label="Enter Password"
          icon={<KeyRound size={18} color="#6B7280" />}
          placeholder="••••••••"
          value={pwd}
          onChangeText={setPwd}
          secureTextEntry
        />

        <Text className="mt-4 font-general-semibold text-gray-900">
          Delete Account
        </Text>
        <Text className="font-general text-gray-500 mb-4">
          Your account will be permanently deleted and all your data will be
          lost, deactivate account instead.
        </Text>

        <Pressable
          onPress={() =>
            confirm(
              "Delete Account",
              "Are you sure you want to delete your account?",
              () => {
                // TODO: call Laravel endpoint later
                Alert.alert("Deleted", "Account successfully deleted");
              }
            )
          }
          className="bg-red-500 py-4 rounded-2xl mb-3"
        >
          <Text className="text-white text-center font-general-semibold">
            Delete Account
          </Text>
        </Pressable>

        <Pressable
          onPress={() =>
            confirm("Deactivate", "Temporarily disable your account?", () => {
              Alert.alert(
                "Deactivated",
                "You can re-activate anytime by logging in."
              );
            })
          }
          className="border border-primary-base py-4 rounded-2xl"
        >
          <Text className="text-primary-base text-center font-general-semibold">
            Deactivate Account
          </Text>
        </Pressable>

        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
