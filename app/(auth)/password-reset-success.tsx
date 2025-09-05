import React, { useCallback } from "react";
import SuccessTemplate from "../../components/SuccessTemplate";
import { useRouter } from "expo-router";

export default function PasswordResetSuccess() {
  const router = useRouter();
  const toLogin = useCallback(() => router.replace("/(auth)/login"), [router]);

  return (
    <SuccessTemplate
      title="Password successfully changed"
      subtitle="You can now return back to login"
      image={require("../../assets/images/unipaddy/password-change-success.png")}
      primaryCtaLabel="Return to Login  →"
      onPrimaryPress={toLogin}
      backTargetHref="/(auth)/login"
    />
  );
}
