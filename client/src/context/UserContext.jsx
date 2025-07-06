import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/user/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUser(res.data.user);
    } catch (err) {
      console.error("Failed to fetch user", err);
      setUser(null);
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
