// src/App.jsx
import { Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";

import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import PaymentHistory from "./pages/PaymentHistory";
import VehicleList from "./pages/vehicleList";
import AddVehicle from "./pages/AddVehicle";
import BookVehicle from "./pages/BookVehicle";
import MyBookings from "./pages/MyBookings";
import AdminBookings from "./pages/AdminBookings";
import AdminVehicleList from "./pages/AdminVehicleList";
import EditVehicle from "./pages/EditVehicle";
import Profile from "./pages/Profile";
import LandingPage from "./pages/LandingPage";
import VehicleDetails from "./pages/VehicleDetails";
import MainLayout from "./components/MainLayout"; 
import AdminFeedbacks from "./pages/AdminFeedbacks";
import MiniVehicleCarousel from "./components/MiniVehicleCarousel";

function App() {
  return (
    <UserProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<MainLayout><About /></MainLayout>} />
        <Route path="/services" element={<MainLayout><Services /> </MainLayout>} />
        <Route path="/contact" element={<MainLayout><Contact /> </MainLayout>} />
        <Route path="/vehicle/:id" element={<VehicleDetails />} />
        <Route path="/" element={<MiniVehicleCarousel />} />

        
        {/* Protected Routes with MainLayout */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/vehicles"
          element={
            <ProtectedRoute>
              <MainLayout>
                <VehicleList />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-vehicle"
          element={
            <ProtectedRoute adminOnly={true}>
              <MainLayout>
                <AddVehicle />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/vehicles/:id/book"
          element={
            <ProtectedRoute>
              <MainLayout>
                <BookVehicle />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute adminOnly={false}>
              <MainLayout>
                <MyBookings />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute adminOnly={true}>
              <MainLayout>
                <AdminBookings />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/vehicles"
          element={
            <ProtectedRoute adminOnly={true}>
              <MainLayout>
                <AdminVehicleList />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/vehicles/edit/:id"
          element={
            <ProtectedRoute adminOnly={true}>
              <MainLayout>
                <EditVehicle />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/feedback"
          element={
            <ProtectedRoute adminOnly={true}>
              <MainLayout>
                <AdminFeedbacks />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Profile />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/paymenthistory"
          element={
            <ProtectedRoute>
              <MainLayout>
                <PaymentHistory />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/vehicle/:id"
          element={
            <ProtectedRoute>
              <MainLayout>
                <VehicleDetails />
              </MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </UserProvider>
  );
}

export default App;
