// src/pages/AdminUserList.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useUserContext } from "../context/UserContext";
import toast from "react-hot-toast";

function AdminUserList() {
  const { user } = useUserContext();
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch users", err);
      toast.error("Failed to load users");
    }
  };

  const updateRole = async (userId, isAdmin) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/admin/user-role`,
        { userId, isAdmin },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Role updated successfully");
      fetchUsers();
    } catch (err) {
      console.error("❌ Role update failed:", err);
      toast.error(err.response?.data?.error || "Failed to update role");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <section className="bg-gradient-to-r from-white via-orange-300 to-white dark:from-gray-700 dark:via-gray-900 dark:to-gray-700 min-h-screen py-10">
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">User Role Management</h1>
        <div className="overflow-x-auto">
          <table className="w-full border shadow-sm">
            <thead className="bg-gray-100 text-sm text-gray-700">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-center">Role</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3 text-center font-medium">
                    {u.isAdmin ? "Admin" : "User"}
                  </td>
                  <td className="p-3 text-center">
                    {u._id === user?._id ? (
                      <span className="text-gray-400 italic">You</span>
                    ) : (
                      <button
                        onClick={() => updateRole(u._id, !u.isAdmin)}
                        className={`px-3 py-1 rounded text-sm font-semibold ${
                          u.isAdmin
                            ? "bg-red-600 hover:bg-red-700 text-white"
                            : "bg-green-600 hover:bg-green-700 text-white"
                        }`}
                      >
                        Make {u.isAdmin ? "User" : "Admin"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default AdminUserList;
