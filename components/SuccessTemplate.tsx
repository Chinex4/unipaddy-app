import React, { useCallback } from "react";
import { View, Text, Image, ImageSourcePropType, BackHandler } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter, useFocusEffect } from "expo-router";
import BackHeader from "./BackHeader";
import GradientButton from "./ui/GradientButton";

type Props = {
  title: string;
  subtitle?: string;
  image: ImageSourcePropType;
  primaryCtaLabel: string;
  /** Called when the primary button is pressed. If not provided, we use backTargetHref (or "/"). */
  onPrimaryPress?: () => void;
  /** If set, ALL back actions will redirect here via router.replace */
  backTargetHref?: string;
  /** If true, hide back arrow when there's no history (default false because we override back anyway) */
  hideBackIfNoHistory?: boolean;
};

export default function SuccessTemplate({
  title,
  subtitle,
  image,
  primaryCtaLabel,
  onPrimaryPress,
  backTargetHref,
  hideBackIfNoHistory = false,
}: Props) {
  const router = useRouter();

  const goBackTarget = useCallback(() => {
    if (backTargetHref) {
      router.replace(backTargetHref as any);
    } else {
      router.replace("/"); // fallback if no target provided
    }
  }, [router, backTargetHref]);

  // Intercept Android hardware back to force target route if provided
  useFocusEffect(
    useCallback(() => {
      if (!backTargetHref) return () => {};
      const sub = BackHandler.addEventListener("hardwareBackPress", () => {
        goBackTarget();
        return true;
      });
      return () => sub.remove();
    }, [goBackTarget, backTargetHref])
  );

  return (
    <>
      <StatusBar style="dark" />
      <View className="flex-1 bg-white font-general">
        {/* If backTargetHref is provided, force header back to that route */}
        <BackHeader
          onBackOverride={backTargetHref ? goBackTarget : undefined}
          hideIfNoHistory={hideBackIfNoHistory}
        />

        {/* Illustration */}
        <View className="items-center">
          <Image source={image} className="size-[300px]" resizeMode="contain" />
        </View>

        {/* Texts */}
        <View className="px-5 mt-6 items-center">
          <Text className="text-3xl font-general-bold text-center text-black">{title}</Text>
          {subtitle ? (
            <Text className="text-gray-500 text-[16px] font-general mt-2 text-center">
              {subtitle}
            </Text>
          ) : null}
        </View>

        {/* Primary CTA */}
        <View className="px-5 mt-10">
          <GradientButton
            title={primaryCtaLabel}
            onPress={
              onPrimaryPress
                ? onPrimaryPress
                : () => (backTargetHref ? router.replace(backTargetHref as any) : router.replace("/"))
            }
          />
        </View>
      </View>
    </>
  );
}
