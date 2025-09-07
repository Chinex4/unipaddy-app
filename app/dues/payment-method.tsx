// app/dues/payment-method.tsx
import React, { useMemo, useState, useCallback } from "react";
import { View, Text, Pressable, Alert, Image } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useRouter } from "expo-router";
import Constants from "expo-constants";
import { ChevronRight, CreditCard, Send, Hash, ArrowLeft } from "lucide-react-native";
import { PaystackProvider, usePaystack } from "react-native-paystack-webview";
import { LinearGradient } from "expo-linear-gradient";

type Channel = "card" | "bank_transfer" | "ussd";
type Channels = Channel[];

const formatNaira = (n: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(
    n
  );

const channelToMethod = (chs: Channels | null): string => {
  const c = chs?.[0];
  if (c === "bank_transfer") return "Transfer";
  if (c === "ussd") return "USSD";
  return "Card";
};

function PayButton({
  total,
  email,
  reference,
  onSuccess,
  onCancel,
}: {
  total: number;
  email: string;
  reference: string;
  onSuccess: (ref: string) => void;
  onCancel: () => void;
}) {
  const { popup } = usePaystack();

  const handlePay = useCallback(() => {
    popup.checkout({
      email,
      amount: total, // ✅ Naira (number), per v5 docs
      reference,
      onSuccess: (res: any) => {
        // res usually contains reference and status
        const ref = res?.reference || res?.transactionRef || reference;
        onSuccess(String(ref));
      },
      onCancel,
      onLoad: () => {}, // optional
      onError: () => {}, // optional
    });
  }, [email, total, reference, onSuccess, onCancel, popup]);

  return (
    <Pressable
      onPress={handlePay}
      className="mx-5 mt-6 rounded-2xl bg-primary-base py-4 items-center"
    >
      <Text className="font-general text-white text-base">Pay Now</Text>
    </Pressable>
  );
}

export default function PaymentMethod() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const params = useLocalSearchParams();
  const id = typeof params.id === "string" ? params.id : "";
  const title = typeof params.title === "string" ? params.title : "Dues";
  const amountStr = typeof params.amount === "string" ? params.amount : "0";

  const baseAmount = Number(amountStr) || 0;
  const charge = 200;
  const total = baseAmount + charge;

  const paystackKey =
    (Constants.expoConfig?.extra as any)?.paystackPublicKey ||
    process.env.EXPO_PUBLIC_PAYSTACK_PK;

  // User-selected channel (controls Provider.defaultChannels)
  const [channels, setChannels] = useState<Channels | null>(null);
  const reference = useMemo(() => `UNI_${id || "unknown"}_${Date.now()}`, [id]);

  const handleSuccess = (ref: string) => {
    router.replace({
      pathname: "/receipt/[receipt]",
      params: {
        receipt: String(ref),
        title,
        id,
        amount: String(baseAmount),
        charge: String(charge),
        total: String(total),
        method: channelToMethod(channels),
        time: new Date().toLocaleString(),
        sender: "You",
        status: "success",
      },
    });
  };

  const handleCancel = () => {
    Alert.alert("Payment cancelled");
  };

  // Basic guards
  const disabled = !paystackKey || !channels;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["left", "right"]}>
      <StatusBar style="dark" />
      <LinearGradient
        colors={["#E8F0FF", "#ffffff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="w-full"
      >
        <View
          style={{ paddingTop: insets.top + 9 }}
          className="h-64 w-full relative"
        >
          {/* Background decorative image (non-interactive) */}
          <View
            pointerEvents="none"
            className="absolute top-0 left-0 w-full h-full"
          >
            <Image
              source={require("@/assets/images/unipaddy/bg-skyblue.png")}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
          <View className="px-5 flex-row items-center justify-between mt-10">
            <Pressable
              onPress={() => router.back()}
              className="h-10 w-10 rounded-full bg-white/70 items-center justify-center"
            >
              <ArrowLeft size={20} color="#111827" />
            </Pressable>
            
          </View>

          <View className="px-5 items-center justify-center mt-4">
            <Text className="mt-4 text-center font-general-semibold text-3xl text-black">
              Payment Gateway
            </Text>
            <Text className="text-center mt-2 text-gray-500 font-general">
              Select Payment Gateway
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Amount summary */}
      <View className="bg-white mx-5 mt-6 rounded-2xl px-5 py-4 shadow-sm border border-gray-100">
        <Text className="text-gray-500 font-general">Amount to pay</Text>
        <Text className="mt-1 text-2xl font-general text-black">
          {formatNaira(total)}
        </Text>
        <View className="h-px bg-gray-200 my-3" />
        <View className="flex-row gap-6">
          <Text className="font-general text-gray-500">
            Amount:{" "}
            <Text className="text-gray-700">{formatNaira(baseAmount)}</Text>
          </Text>
          <Text className="font-general text-gray-500">
            Charges:{" "}
            <Text className="text-gray-700">{formatNaira(charge)}</Text>
          </Text>
        </View>
      </View>

      {/* Payment options */}
      <Text className="mx-5 mt-8 mb-3 font-general text-gray-700">
        Select Payment Method
      </Text>

      <View className="mx-5 rounded-2xl overflow-hidden bg-gray-50">
        <Pressable
          onPress={() => setChannels(["bank_transfer"])}
          className="px-5 py-5 bg-gray-50 flex-row items-center justify-between"
        >
          <View className="flex-row items-center gap-3">
            <Send size={20} color="#111827" />
            <Text className="font-general text-black">Pay with Transfer</Text>
          </View>
          <ChevronRight size={18} color="#9CA3AF" />
        </Pressable>

        <View className="h-px bg-gray-200" />

        <Pressable
          onPress={() => setChannels(["card"])}
          className="px-5 py-5 bg-gray-50 flex-row items-center justify-between"
        >
          <View className="flex-row items-center gap-3">
            <CreditCard size={20} color="#111827" />
            <Text className="font-general text-black">Pay with Card</Text>
          </View>
          <ChevronRight size={18} color="#9CA3AF" />
        </Pressable>

        <View className="h-px bg-gray-200" />

        <Pressable
          onPress={() => setChannels(["ussd"])}
          className="px-5 py-5 bg-gray-50 flex-row items-center justify-between"
        >
          <View className="flex-row items-center gap-3">
            <Hash size={20} color="#111827" />
            <Text className="font-general text-black">Pay with USSD</Text>
          </View>
          <ChevronRight size={18} color="#9CA3AF" />
        </Pressable>
      </View>

      {/* Keys / warnings */}
      {!paystackKey && (
        <View className="mx-5 mt-4 rounded-xl bg-red-50 p-3">
          <Text className="text-red-600 font-general">
            Missing Paystack public key. Set{" "}
            <Text className="font-bold">EXPO_PUBLIC_PAYSTACK_PK</Text> (or{" "}
            <Text className="font-bold">extra.paystackPublicKey</Text> in
            app.json).
          </Text>
        </View>
      )}

      {/* 🔑 v5 requires a Provider. We scope it here so defaultChannels reflects selection */}
      {/* ...inside your return, where the provider renders... */}
      <View className="mt-12">
        {paystackKey && channels && (
          <PaystackProvider
            publicKey={paystackKey}
            defaultChannels={channels}
            currency="NGN"
            
            // debug // helpful logs in dev
          >
            {/* add extra space above the button */}
            <View className="mt-10 mx-5">
              <Text className="font-general text-gray-500 mb-2">
                You selected: {channelToMethod(channels)}.
              </Text>
              <PayButton
                total={total}
                email="student@example.com"
                reference={reference}
                onSuccess={handleSuccess}
                onCancel={handleCancel}
              />
            </View>
          </PaystackProvider>
        )}
      </View>

      {/* Disable button hint when not selectable */}
      {disabled && (
        <View className="mx-5 mt-3 rounded-xl bg-amber-50 p-3">
          <Text className="text-amber-700 font-general">
            Select a payment method to continue.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
