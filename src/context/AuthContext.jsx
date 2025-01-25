import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    // Check localStorage on initial load
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await fetch('https://6788c4622c874e66b7d635aa.mockapi.io/user');
      const users = await response.json();
      
      const user = users.find(
        (u) => u.email === credentials.email && u.password === credentials.password
      );

      if (user) {
        const { password, ...userWithoutPassword } = user;
        // Save user data to localStorage
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        setCurrentUser(userWithoutPassword);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  const updateUserData = async (newData) => {
    try {
      // Prepare data according to schema
      const updatePayload = {
        id: newData.id,
        name: newData.name,
        title: newData.title,
        image: newData.image,
        qualifications: newData.qualifications,
        bio: newData.bio,
        languages: newData.languages,
        email: newData.email,
        phone: newData.phone,
        password: newData.password // Keep existing password
      };

      // Update local storage and state first for immediate feedback
      localStorage.setItem('currentUser', JSON.stringify(updatePayload));
      setCurrentUser(updatePayload);

      // Sync with server
      const response = await fetch(`https://6788c4622c874e66b7d635aa.mockapi.io/user/${newData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePayload)
      });

      if (!response.ok) {
        throw new Error('Failed to sync with server');
      }

      // Get fresh data from server
      const freshData = await response.json();
      localStorage.setItem('currentUser', JSON.stringify(freshData));
      setCurrentUser(freshData);

    } catch (error) {
      console.error('Error updating user data:', error);
      // Continue using local data even if server sync fails
    }
  };

  const value = {
    currentUser,
    login,
    logout,
    loading,
    updateUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
