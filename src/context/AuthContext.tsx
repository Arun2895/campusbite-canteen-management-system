import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

type Role = "admin" | "user";

type User = {
  name: string;
  role: Role;
};

type AuthContextValue = {
  user: User | null;
  signin: (name: string, role: Role) => void;
  signout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const signin = (name: string, role: Role) => {
    setUser({ name, role });
    // simple redirect: admins go to /admin, users go home
    if (role === "admin") navigate("/admin");
    else navigate("/");
  };

  const signout = () => {
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, signin, signout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export default AuthContext;
