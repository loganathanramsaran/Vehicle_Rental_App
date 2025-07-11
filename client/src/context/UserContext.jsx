import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

const fetchUser = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.warn("⚠️ No token found in localStorage");
    setUser(null);
    return;
  }

  try {
    const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setUser(res.data.user); // ✅ check your backend returns `{ user }`
  } catch (err) {
    console.error("❌ Failed to fetch user", err.response?.data || err.message);
    setUser(null);
    // Optionally: remove malformed/expired token
    localStorage.removeItem("token");
  }
};

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
}
