import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../lib/firebase";
import axios from "axios";
import { useAppDispatch } from "../redux/hooks";
import { setAlertContent } from "../redux/rootSlice";

export const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"ADMIN" | "MANAGER" | "MEMBER">("MEMBER");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const teamId = import.meta.env.VITE_TEAM_ID;

    if (!name.trim()) {
      dispatch(
        setAlertContent({ type: "error", message: "Name is required." })
      );
      return;
    }

    try {
      // 1. Firebase Auth registration
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;
      await updateProfile(firebaseUser, { displayName: name });

      // 2. Send user data including Firebase UID to backend
      const response = await axios.post("https://server-team-collaboration.onrender.com/api/users/register", {
        firebaseUid: firebaseUser.uid,
        name,
        email,
        role,
        teamId,
      });

      dispatch(
        setAlertContent({ type: "success", message: response.data.message })
      );

      setName("");
      setEmail("");
      setPassword("");
      setRole("MEMBER");

      navigate("/");
    } catch (err: any) {
      console.error(err);
      dispatch(
        setAlertContent({
          type: "error",
          message:
            err.response?.data?.message ||
            err.message ||
            "Registration failed.",
        })
      );
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#020124]">
      <form
        onSubmit={handleRegister}
        className="bg-white shadow-md shadow-white rounded-xl p-10 w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          Register for TeamCollab
        </h2>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full mb-4 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <select
          className="w-full mb-4 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={role}
          onChange={(e) =>
            setRole(e.target.value as "ADMIN" | "MANAGER" | "MEMBER")
          }
        >
          <option value="MEMBER">Member</option>
          <option value="MANAGER">Manager</option>
          <option value="ADMIN">Admin</option>
        </select>

        <button
          type="submit"
          className="w-full bg-[#020124] text-white font-bold py-2 px-4 rounded-lg transition"
        >
          Register
        </button>

        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <span
            className="text-blue-600 font-medium cursor-pointer underline"
            onClick={() => navigate("/")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};
