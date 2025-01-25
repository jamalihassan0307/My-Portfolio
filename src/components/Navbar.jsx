import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginModal from "./LoginModal";

const Navbar = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { currentUser, login, logout } = useAuth();

  const handleLogin = async (credentials) => {
    try {
      const success = await login(credentials);
      if (success) {
        setShowLoginModal(false);
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error('Login error:', error);
      alert("Login failed");
    }
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-gray-800 text-white">
      <div className="text-xl font-bold">
        <Link to="/">Ali Hassan Portfolio</Link>
      </div>

      <div className="flex items-center space-x-4">
        <Link to="/" className="hover:text-gray-300">
          Home
        </Link>
        <Link to="/projects" className="hover:text-gray-300">
          Projects
        </Link>

        {currentUser ? (
          <div className="flex items-center space-x-4">
            <Link 
              to="/profile" 
              className="flex items-center space-x-2 hover:text-gray-300"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img
                  src={currentUser.image || "https://via.placeholder.com/32"}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span>{currentUser.name}</span>
            </Link>
            <button
              onClick={logout}
              className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowLoginModal(true)}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Login
          </button>
        )}
      </div>

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
        />
      )}
    </nav>
  );
};

export default Navbar;
