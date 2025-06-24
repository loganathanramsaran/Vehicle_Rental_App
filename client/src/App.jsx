import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import VehicleList from "./pages/vehicleList";
import AddVehicle from "./pages/AddVehicle";
import BookVehicle from "./pages/BookVehicle";
import MyBookings from "./pages/MyBookings";

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
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />
      </Routes>
  );
}

export default App;
