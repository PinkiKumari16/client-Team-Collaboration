import React, { useState } from "react";
import type { FormEvent } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAppDispatch } from "../redux/hooks";
import { setUserRole, setUserTeam, setAlertContent } from "../redux/rootSlice";

export const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(setAlertContent(null));
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      const response = await axios.post("https://server-team-collaboration.onrender.com/api/users/login", {
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email,
      });

      const userData = response.data.user;
      dispatch(setUserTeam(userData.team));
      dispatch(setUserRole(userData.role));
      localStorage.setItem("user", JSON.stringify(userData));

      dispatch(
        setAlertContent({ type: "success", message: "Login successful!" })
      );

      navigate("/dashboard");
    } catch (err: any) {
      console.error("Login failed:", err.response?.data || err.message);
      dispatch(
        setAlertContent({
          type: "error",
          message:
            err.response?.data?.error || "Invalid credentials or server error.",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#020124]">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md shadow-white rounded-xl p-10 w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          Login to TeamCollab
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-[#020124] text-white font-bold py-2 px-4 rounded-lg transition"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-4 text-sm text-center">
          Don't have an account?{" "}
          <span
            className="text-blue-600 font-medium cursor-pointer underline"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
};
