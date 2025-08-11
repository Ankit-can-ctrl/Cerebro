import { useMutation } from "@tanstack/react-query";
import { api } from "../lib/axios";

// what are credentials look like
type credentials = {
  username: string;
  password: string;
};

// what the reponse from the server looks like
type AuthResponse = {
  token: string;
  message?: string;
};

export function useSignup() {
  // we use useMutation whenever we want to change the data on the server(post,put,delete) and for fetching data we use useQuery
  //<AuthResponse, Error, credentials> this is typescripts generic typing for usemutation
  //   where credentials and authResponse have defined and Error is built in errors type
  return useMutation<AuthResponse, Error, credentials>({
    mutationKey: ["auth", "signup"],
    mutationFn: async (credentials: credentials) => {
      const response = await api.post("/auth/signup", credentials);
      localStorage.setItem("token", response.data.token);
      return response.data;
    },
  });
}

export function useLogin() {
  return useMutation<AuthResponse, Error, credentials>({
    mutationKey: ["auth", "login"],
    mutationFn: async (credentials: credentials) => {
      const response = await api.post("/auth/login", credentials);
      localStorage.setItem("token", response.data.token);
      return response.data;
    },
  });
}
