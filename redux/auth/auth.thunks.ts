import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/api/axios";
import { saveToken, saveUser, clearToken, clearUser } from "@/storage/auth";
import { setPhase, setLastEmail, setSession, clearSession } from "./auth.slice";
import { showPromise, showSuccess } from "@/components/ui/toast";
import type { ApiEnvelope, User } from "@/api/types";

/** ---------- Registration ---------- */
export const register = createAsyncThunk(
  "auth/register",
  async (
    body: {
      fullName: string;
      email: string;
      matNumber: string;
      faculty: string;
      department: string;
      level: string;
      password: string;
    },
    { dispatch }
  ) => {
    await showPromise(
      api.post<ApiEnvelope>("/auth/register", body),
      "Creating account…",
      "Registration successful. OTP sent."
    );
    dispatch(setLastEmail(body.email));
    dispatch(setPhase("awaiting_otp"));
  }
);

export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (body: { email: string; code: string }, { dispatch }) => {
    const res = await showPromise(
      api.post<ApiEnvelope<{ user: User }>>("/auth/verify-email", body),
      "Verifying…",
      "Email verified"
    );
    const token = res.data.token!;
    const user = (res.data.data as any)?.user ?? null;

    if (token) await saveToken(token);
    if (user) await saveUser(user);

    dispatch(setSession({ user, token }));
  }
);

export const resendRegisterOtp = createAsyncThunk(
  "auth/resendRegisterOtp",
  async (email: string) => {
    await showPromise(
      api.post<ApiEnvelope>("/auth/resend-otp", { email }),
      "Sending OTP…",
      "OTP resent"
    );
  }
);

/** ---------- Login (2-step) ---------- */
// redux/auth/auth.thunks.ts
export const loginStart = createAsyncThunk(
  "auth/loginStart",
  async (
    body: { email: string; password: string },
    { dispatch }
  ): Promise<
    { requiresOtp: true } | { requiresOtp: false; token: string; user: any }
  > => {
    const res = await showPromise(
      api.post("/auth/login", body), // backend returns { requires_otp: boolean, ... }
      "Checking credentials…",
      "Logged in"
    );

    const { requires_otp, token, user } = res.data;

    if (requires_otp) {
      dispatch(setLastEmail(body.email));
      dispatch(setPhase("awaiting_otp"));
      return { requiresOtp: true };
    }

    // immediate login path (no OTP)
    // store token/user however your app does it:
    await saveToken(token);
    await saveUser(user);
    dispatch(setPhase("authenticated"));

    return { requiresOtp: false, token, user };
  }
);

export const loginVerify = createAsyncThunk(
  "auth/loginVerify",
  async (body: { email: string; code: string }, { dispatch }) => {
    const res = await showPromise(
      api.post<ApiEnvelope<{ user: User }>>("/auth/login/verify", body),
      "Verifying…",
      "Logged in"
    );
    const token = res.data.token!;
    const user = (res.data.data as any)?.user ?? null;

    if (token) await saveToken(token);
    if (user) await saveUser(user);

    dispatch(setSession({ user, token }));
  }
);

export const loginResendOtp = createAsyncThunk(
  "auth/loginResendOtp",
  async (email: string) => {
    await showPromise(
      api.post<ApiEnvelope>("/auth/login/resend-otp", { email }),
      "Sending OTP…",
      "OTP resent"
    );
  }
);

/** ---------- Forgot Password ---------- */
export const passwordForgot = createAsyncThunk(
  "auth/passwordForgot",
  async (email: string, { dispatch }) => {
    // Backend returns plain { message, data?: { email, expires } } and 200 even if user doesn't exist
    const res = await showPromise(
      api.post("/auth/password/forgot", { email }),
      "Requesting reset…",
      "If this email exists, a reset code has been sent."
    );
    // Route is success regardless of existence → proceed
    dispatch(setLastEmail(email));
    dispatch(setPhase("password_reset_pending"));
    return res.data; // optional: { message, data? }
  }
);

export const passwordVerify = createAsyncThunk(
  "auth/passwordVerify",
  async (body: { email: string; code: string }) => {
    // IMPORTANT: don't post twice!
    const res = await showPromise(
      api.post<{ message: string; reset_token: string; expires: string }>(
        "/auth/password/verify",
        body
      ),
      "Verifying OTP…",
      "OTP verified"
    );

    // return the token to the component, don't persist it
    return res.data.reset_token;
  }
);

// 3) Reset password
export const passwordReset = createAsyncThunk(
  "auth/passwordReset",
  async (body: {
    email: string;
    reset_token: string;
    password: string;
    password_confirmation: string;
  }) => {
    await showPromise(
      api.post("/auth/password/reset", body),
      "Saving new password…",
      "Password updated"
    );
    // Server revokes tokens—clear any local session just in case
    await clearToken();
    await clearUser();
    showSuccess("Please log in with your new password.");
  }
);

// 4) Resend OTP
export const passwordResendOtp = createAsyncThunk(
  "auth/passwordResendOtp",
  async (email: string) => {
    await showPromise(
      api.post("/auth/password/resend-otp", { email }),
      "Sending OTP…",
      "If this email exists, a reset code has been resent."
    );
  }
);

/** ---------- Google OAuth ---------- */
export const googleSignIn = createAsyncThunk(
  "auth/googleSignIn",
  async (id_token: string, { dispatch }) => {
    const res = await api.post<ApiEnvelope<{ user: User }>>("/auth/google", {
      id_token,
    });

    if (res.status === 202) {
      const email = (res.data.data as any)?.email;
      if (email) dispatch(setLastEmail(email));
      dispatch(setPhase("awaiting_otp"));
      showSuccess("OTP sent to your email");
      return { requiresOtp: true as const };
    }

    const token = res.data.token!;
    const user = (res.data.data as any)?.user ?? null;
    if (token) await saveToken(token);
    if (user) await saveUser(user);
    dispatch(setSession({ user, token }));
    showSuccess("Signed in with Google");
    return { requiresOtp: false as const };
  }
);

export const googleVerifyOtp = createAsyncThunk(
  "auth/googleVerifyOtp",
  async (body: { email: string; code: string }, { dispatch }) => {
    const res = await showPromise(
      api.post<ApiEnvelope<{ user: User }>>("/auth/google/verify-otp", body),
      "Verifying…",
      "Signed in"
    );
    const token = res.data.token!;
    const user = (res.data.data as any)?.user ?? null;
    if (token) await saveToken(token);
    if (user) await saveUser(user);
    dispatch(setSession({ user, token }));
  }
);

/** ---------- Local logout ---------- */
export const localLogout = createAsyncThunk(
  "auth/localLogout",
  async (_, { dispatch }) => {
    await clearToken();
    await clearUser();
    dispatch(clearSession());
  }
);
