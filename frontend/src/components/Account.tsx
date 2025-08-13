import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import { useSignup, useLogin } from "../hooks/useAuth";

type AuthMode = "login" | "signup";

const Account = () => {
  const navigate = useNavigate();

  const [mode, setMode] = useState<AuthMode>("signup");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [info, setInfo] = useState<string>("");
  const [error, setError] = useState<string>("");
  const login = useLogin();
  const signup = useSignup();

  const isLoading = login.isPending || signup.isPending;
  const errorMsg =
    (login.error as Error)?.message || (signup.error as Error)?.message;

  useEffect(() => {
    const existingToken = localStorage.getItem("token");
    if (existingToken) {
      navigate("/dashboard");
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    mode === "signup"
      ? signup.mutate(
          { username, password },
          {
            onSuccess: () => {
              setInfo("Account created successfully.");
              navigate("/dashboard");
              setUsername("");
              setPassword("");
            },
            onError: (error) => {
              setError(error.message);
            },
          }
        )
      : login.mutate(
          { username, password },
          {
            onSuccess: () => {
              setInfo("Logged in successfully.");
              navigate("/dashboard");
              setUsername("");
              setPassword("");
            },
            onError: (error) => {
              setError(error.message);
            },
          }
        );
  };

  const switchMode = () => {
    setMode((m) => (m === "signup" ? "login" : "signup"));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-blue-950 flex items-center justify-center px-4">
      <div className="relative p-[1px] rounded-3xl bg-gradient-to-r from-blue-500/40 via-blue-400/30 to-indigo-500/40 shadow-2xl shadow-blue-500/20 w-full max-w-md">
        <div className="bg-slate-950/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-blue-900/30">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-blue-200 via-white to-indigo-200 bg-clip-text text-transparent">
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </h2>
          <p className="text-blue-200/80 mb-6">
            {mode === "signup"
              ? "Sign up with a username and password"
              : "Log in with your credentials"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm text-blue-100 mb-1"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-md bg-slate-900/70 border border-blue-900/40 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/30 text-blue-50 placeholder-blue-300/40 px-4 py-3 outline-none"
                placeholder="your-username"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm text-blue-100 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete={
                  mode === "signup" ? "new-password" : "current-password"
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md bg-slate-900/70 border border-blue-900/40 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/30 text-blue-50 placeholder-blue-300/40 px-4 py-3 outline-none"
                placeholder="••••••••"
              />
            </div>

            {errorMsg && (
              <div className="text-red-400 text-sm bg-red-900/20 border border-red-800/40 rounded-md px-3 py-2">
                {error}
              </div>
            )}
            {info && !error && (
              <div className="text-green-300 text-sm bg-emerald-900/20 border border-emerald-800/40 rounded-md px-3 py-2">
                {info}
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                text={
                  isLoading
                    ? mode === "signup"
                      ? "Creating..."
                      : "Signing in..."
                    : mode === "signup"
                    ? "Sign Up"
                    : "Log In"
                }
              />
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={switchMode}
                text={
                  mode === "signup"
                    ? "Have an account? Log in"
                    : "Need an account? Sign up"
                }
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Account;
