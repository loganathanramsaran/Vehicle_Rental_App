// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./context/UserContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import NavbarSidebarLayout from "./components/NavbarSidebarLayout";

import VehicleList from "./pages/vehicleList";
import AddVehicle from "./pages/AddVehicle";
import BookVehicle from "./pages/BookVehicle";
import MyBookings from "./pages/MyBookings";
import AdminBookings from "./pages/AdminBookings";
import AdminVehicleList from "./pages/AdminVehicleList";
import EditVehicle from "./pages/EditVehicle";
import Profile from "./pages/Profile";

function App() {
  return (
    <UserProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes with NavbarSidebarLayout */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <NavbarSidebarLayout>
                <Dashboard />
              </NavbarSidebarLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/vehicles"
          element={
            <ProtectedRoute>
              <NavbarSidebarLayout>
                <VehicleList />
              </NavbarSidebarLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-vehicle"
          element={
            <ProtectedRoute adminOnly={true}>
              <NavbarSidebarLayout>
                <AddVehicle />
              </NavbarSidebarLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/vehicles/:id/book"
          element={
            <ProtectedRoute>
              <NavbarSidebarLayout>
                <BookVehicle />
              </NavbarSidebarLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute adminOnly={false}>
              <NavbarSidebarLayout>
                <MyBookings />
              </NavbarSidebarLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute adminOnly={true}>
              <NavbarSidebarLayout>
                <AdminBookings />
              </NavbarSidebarLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/vehicles"
          element={
            <ProtectedRoute adminOnly={true}>
              <NavbarSidebarLayout>
                <AdminVehicleList />
              </NavbarSidebarLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/vehicles/edit/:id"
          element={
            <ProtectedRoute adminOnly={true}>
              <NavbarSidebarLayout>
                <EditVehicle />
              </NavbarSidebarLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <NavbarSidebarLayout>
                <Profile />
              </NavbarSidebarLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </UserProvider>
  );
}

export default App;
