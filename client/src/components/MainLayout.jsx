// src/components/MainLayout.jsx
import Navbar from "../sections/Navbar";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen dark:bg-gray-800 flex flex-col">
      <Navbar />
      <main className="flex-1 ">{children}</main>
    </div>
  );
};

export default MainLayout;
