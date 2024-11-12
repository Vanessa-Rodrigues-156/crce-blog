"use client";
import { Switch } from "@/components/Toggle";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { directusLogin } from "@/lib/auth";

const Page = () => {
  const [isStudent, setIsStudent] = useState(true);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  function checkIfTeacher() {
    setIsStudent(!isStudent);
    setIdentifier("");
  }

  async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    try {
      const user = await directusLogin({ identifier, password });
      console.log("Login successful:", user);

      // Redirect based on the isStudent state
      if (isStudent) {
        // router.push("/home/home-page");
      } else {
        // router.push("/home/my-blogs");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError("Invalid credentials. Please try again.");
    }
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 m-4"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          {isStudent ? "Student Sign In" : "Teacher Sign In"}
        </h2>
        <form onSubmit={handleSignIn} className="space-y-6">
          <div>
            <label
              htmlFor="identifier"
              className="text-sm font-medium text-gray-700 block mb-2"
            >
              {isStudent ? "Roll Number" : "Employee ID"}
            </label>
            <input
              type="text"
              id="identifier"
              name="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700 block mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-indigo-600 text-white rounded-md py-2 px-4 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-300"
          >
            Sign In
          </motion.button>
        </form>
        <p className="mt-8 text-xs text-center text-gray-500">
          Don't have an account?
          <Link
            href="/signup"
            className="text-indigo-600 hover:text-indigo-500"
          >
            Sign up here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Page;
