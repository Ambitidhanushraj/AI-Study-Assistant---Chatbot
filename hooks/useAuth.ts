import { useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user in localStorage
    const savedUser = localStorage.getItem("ai-study-assistant-user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("ai-study-assistant-user");
      }
    }
    setLoading(false);
  }, []);

  const login = (email: string, password: string) => {
    // Simple mock authentication
    const mockUser: User = {
      id: Date.now().toString(),
      email,
      name: email.split("@")[0],
    };

    setUser(mockUser);
    localStorage.setItem("ai-study-assistant-user", JSON.stringify(mockUser));
    return Promise.resolve(mockUser);
  };

  const signup = (email: string, password: string) => {
    // Simple mock registration
    const mockUser: User = {
      id: Date.now().toString(),
      email,
      name: email.split("@")[0],
    };

    setUser(mockUser);
    localStorage.setItem("ai-study-assistant-user", JSON.stringify(mockUser));
    return Promise.resolve(mockUser);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ai-study-assistant-user");
  };

  return {
    user,
    loading,
    login,
    signup,
    logout,
  };
};
