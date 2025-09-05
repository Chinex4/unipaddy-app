import React, { useCallback } from "react";
import SuccessTemplate from "../../components/SuccessTemplate";
import { useRouter } from "expo-router";

export default function RegisterSuccess() {
  const router = useRouter();
  const toLogin = useCallback(() => router.replace("/(auth)/login"), [router]);

  return (
    <SuccessTemplate
      title="Account Created Successfully!"
      subtitle="You can log in."
      image={require("../../assets/images/unipaddy/password-change-success.png")}
      primaryCtaLabel="Return to Login  "
      onPrimaryPress={toLogin}
      backTargetHref="/(auth)/login"
    />
  );
}
