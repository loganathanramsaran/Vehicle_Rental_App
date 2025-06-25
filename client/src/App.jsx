import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import VehicleList from "./pages/vehicleList";
import AddVehicle from "./pages/AddVehicle";
import BookVehicle from "./pages/BookVehicle";
import MyBookings from "./pages/MyBookings";
import AdminBookings from "./pages/AdminBookings";
import AdminVehicleList from "./pages/AdminVehicleList";
import EditVehicle from "./pages/EditVehicle";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/vehicles" element={<VehicleList />} />
      <Route
        path="/add-vehicle"
        element={
          <ProtectedRoute adminOnly={true}>
            <AddVehicle />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vehicles/:id/book"
        element={
          <ProtectedRoute>
            <BookVehicle />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-bookings"
        element={
          <ProtectedRoute adminOnly={false}>
            <MyBookings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/bookings"
        element={
          <ProtectedRoute adminOnly={true}>
            <AdminBookings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/vehicles"
        element={
          <ProtectedRoute adminOnly={true}>
            <AdminVehicleList />
          </ProtectedRoute>
        }
      />
      <Route
  path="/vehicles/edit/:id"
  element={
    <ProtectedRoute adminOnly={true}>
      <EditVehicle />
    </ProtectedRoute>
  }
/>
    </Routes>
  );
}

export default App;
