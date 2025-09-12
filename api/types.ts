export type ApiEnvelope<T = unknown> = {
  message?: string;
  data?: T;
  token?: string;
};

export type User = {
  id: number | string;
  fullName: string;
  email: string;
  matNumber?: string | null;
  faculty?: string | null;
  department?: string | null;
  level?: string | null;
  // add anything your backend returns
};
