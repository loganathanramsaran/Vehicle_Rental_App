import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function AuthLayout({
  children,
  side = "left",
  title,
  message,
  image,
  linkText,
  linkTo,
}) {
  const isLeft = side === "left";

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-orange-400 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-extrabold">
        Welcome To Our <span className="text-orange-600">Vehicle Rental</span>{" "}
        Application
      </h1>
      <p className="text-lg text-gray-800 mt-2 mb-8">
        Please login or register to continue
      </p>

      <div className="bg-white shadow-2xl rounded-xl overflow-hidden flex flex-col md:flex-row w-[90%] max-w-5xl">
        {/* Info Panel */}
        <motion.div
          initial={{ x: isLeft ? -100 : 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className={`hidden md:flex md:w-1/2 ${
            isLeft ? "bg-orange-600" : "bg-orange-600"
          } text-white flex-col items-center justify-center p-10`}
        >
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-center text-lg">{message}</p>
          {image && <img src={image} alt="graphic" className="w-40 mt-6" />}
        </motion.div>

        {/* Form Panel */}
        <motion.div
          initial={{ x: isLeft ? 100 : -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-1/2 p-8 sm:p-12"
        >
          {children}
          {linkText && linkTo && (
            <p className="text-sm text-center mt-4">
              <Link
                to={linkTo}
                className={`${
                  isLeft ? "text-orange-600" : "text-orange-600"
                } hover:underline`}
              >
                {linkText}
              </Link>
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default AuthLayout;
