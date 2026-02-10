import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Utensils } from "lucide-react";

export default function Login() {
  const { signin } = useAuth();
  const [name, setName] = useState("");
  const [role, setRole] = useState<"admin" | "user">("user");
  const [studentClass, setStudentClass] = useState("");
  const [section, setSection] = useState("");
  const [phone, setPhone] = useState("");
  const [regNo, setRegNo] = useState("");
  const [college, setCollege] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    signin(name || (role === "admin" ? "Admin" : "User"), role);
  };

  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Branding */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white mb-4">
            <Utensils className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-bold text-black">Campus<span className="text-primary">Bites</span></h2>
          <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Smart Canteen</p>
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-black mb-2">Welcome back</h1>
          <p className="text-sm text-slate-600">Sign in with your college details</p>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <label className="block">
              <span className="text-sm font-medium text-black mb-1 block">Full Name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                placeholder="Your name"
                required
              />
            </label>
          </div>

          {/* College */}
          <div className="space-y-2">
            <label className="block">
              <span className="text-sm font-medium text-black mb-1 block">College</span>
              <input
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                placeholder="Your college"
                required
              />
            </label>
          </div>

          {/* Academic Details */}
          <div className="grid grid-cols-3 gap-2">
            <label className="block">
              <span className="text-xs font-medium text-black mb-1 block">Year</span>
              <input
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                placeholder="2nd"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-black mb-1 block">Section</span>
              <input
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                placeholder="A"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-black mb-1 block">Reg No</span>
              <input
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                placeholder="RA21..."
              />
            </label>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="block">
              <span className="text-sm font-medium text-black mb-1 block">Phone</span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                placeholder="+91 98765 43210"
              />
            </label>
          </div>

          {/* Role Selection */}
          <div className="flex gap-2 bg-slate-100 p-1 rounded-lg mt-6">
            <button
              type="button"
              onClick={() => setRole("user")}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                role === "user" ? "bg-white text-primary shadow-sm" : "text-black hover:text-primary"
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole("admin")}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                role === "admin" ? "bg-white text-primary shadow-sm" : "text-black hover:text-primary"
              }`}
            >
              Admin
            </button>
          </div>

          {/* Submit Button */}
          <button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-lg mt-6 transition-all">
            Sign in
          </button>
        </form>
      </div>
    </main>
  );
}