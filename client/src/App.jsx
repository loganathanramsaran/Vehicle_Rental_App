// src/App.jsx
import { Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";

import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
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
import AdminUserList from "./pages/AdminUserList";
import AdminVehicleApprovals from "./pages/AdminVehicleApprovals";
import MyListedVehicles from "./pages/MyListedVehicles";
import ListMyVehicle from "./pages/ListMyVehicle";

function App() {
  return (
    <>
      <UserProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/about"
            element={
              <MainLayout>
                <About />
              </MainLayout>
            }
          />
          <Route
            path="/services"
            element={
              <MainLayout>
                <Services />{" "}
              </MainLayout>
            }
          />
          <Route
            path="/contact"
            element={
              <MainLayout>
                <Contact />{" "}
              </MainLayout>
            }
          />
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
              <ProtectedRoute adminOnly={false}>
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
            path="/edit-vehicle/:id"
            element={
              <ProtectedRoute >
                <MainLayout>
                  <EditVehicle />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/feedback"
            element={
              <ProtectedRoute adminOnly={true}>
                <MainLayout>
                  <AdminFeedbacks />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute adminOnly={true}>
                <MainLayout>
                  <AdminUserList />
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
          <Route
            path="/admin/approvals"
            element={
              <ProtectedRoute adminOnly={true}>
                <MainLayout>
                  <AdminVehicleApprovals />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-vehicles"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <MyListedVehicles />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/my/list-vehicle"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ListMyVehicle />
                </MainLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
        {/* Toast container should be rendered once in the app */}
      </UserProvider>
    </>
  );
}

export default App;
