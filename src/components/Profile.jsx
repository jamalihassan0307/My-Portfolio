import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaEdit, FaEnvelope, FaPhone } from "react-icons/fa";
import toast, { Toaster } from 'react-hot-toast';

const Profile = () => {
  const { currentUser, updateUserData } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }
    setUserData(currentUser);
    setEditForm(currentUser);
    setLoading(false);
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Updating profile...');
    
    try {
      // Prepare the data according to the schema
      const updatedData = {
        id: currentUser.id, // Keep the existing ID
        name: editForm.name,
        title: editForm.title,
        image: editForm.image,
        qualifications: editForm.qualifications,
        bio: editForm.bio,
        languages: editForm.languages,
        email: editForm.email,
        phone: editForm.phone,
        password: currentUser.password // Keep the existing password
      };

      // Update through context which will handle API call
      await updateUserData(updatedData);
      
      // Update local state
      setUserData(updatedData);
      setIsEditing(false);
      
      toast.success('Profile updated successfully!', {
        id: loadingToast,
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.', {
        id: loadingToast,
      });
    }
  };

  const handleLanguageChange = (index, field, value) => {
    const updatedLanguages = [...editForm.languages];
    updatedLanguages[index] = {
      ...updatedLanguages[index],
      [field]: field === 'level' ? parseInt(value) : value
    };
    setEditForm({ ...editForm, languages: updatedLanguages });
  };

  const addNewLanguage = () => {
    setEditForm({
      ...editForm,
      languages: [...editForm.languages, { name: '', level: 50 }]
    });
  };

  const removeLanguage = (index) => {
    const updatedLanguages = editForm.languages.filter((_, i) => i !== index);
    setEditForm({ ...editForm, languages: updatedLanguages });
  };

  const validateImageUrl = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };

  const handleImageChange = async (e) => {
    const newUrl = e.target.value;
    setEditForm({ ...editForm, image: newUrl });
    
    if (newUrl) {
      const isValid = await validateImageUrl(newUrl);
      if (!isValid) {
        toast.error('Invalid image URL. Please provide a valid image link.');
      }
    }
  };

  if (loading || !userData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster 
        position="top-right"
        toastOptions={{
          success: {
            duration: 3000,
            style: {
              background: '#10B981',
              color: 'white',
            },
          },
          error: {
            duration: 3000,
            style: {
              background: '#EF4444',
              color: 'white',
            },
          },
          loading: {
            style: {
              background: '#3B82F6',
              color: 'white',
            },
          },
        }}
      />
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="relative h-48 bg-gradient-to-r from-blue-600 to-purple-600">
            {currentUser && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100"
              >
                <FaEdit className="text-blue-600" size={20} />
              </button>
            )}
          </div>

          {/* Profile Content */}
          <div className="relative px-6 py-10">
            <div className="absolute -top-20 left-1/2 transform -translate-x-1/2">
              <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-lg">
                <img
                  src={userData.image}
                  alt={userData.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="mt-16 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Qualifications</label>
                    <input
                      type="text"
                      value={editForm.qualifications}
                      onChange={(e) => setEditForm({ ...editForm, qualifications: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Profile Image URL</label>
                    <input
                      type="url"
                      value={editForm.image}
                      onChange={handleImageChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="https://example.com/image.jpg"
                      required
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Please provide a direct link to an image (e.g., ending in .jpg, .png, etc.)
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Bio</label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    rows="4"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">Technical Skills</h3>
                    <button
                      type="button"
                      onClick={addNewLanguage}
                      className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
                    >
                      Add Skill
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {editForm.languages.map((language, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={language.name}
                            onChange={(e) => handleLanguageChange(index, 'name', e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Skill name"
                          />
                        </div>
                        <div className="flex-1">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={language.level}
                            onChange={(e) => handleLanguageChange(index, 'level', e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeLanguage(index)}
                          className="p-2 text-red-600 hover:text-red-800"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setEditForm(userData);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="mt-16 text-center">
                <h2 className="text-3xl font-bold text-gray-900">{userData.name}</h2>
                <p className="text-xl text-gray-600 mt-2">{userData.title}</p>
                <p className="mt-4 text-gray-600 max-w-2xl mx-auto">{userData.bio}</p>

                <div className="mt-6 flex justify-center space-x-6">
                  <div className="flex items-center text-gray-600">
                    <FaEnvelope className="mr-2" />
                    {userData.email}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaPhone className="mr-2" />
                    {userData.phone}
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">Technical Skills</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                    {userData.languages.map((skill, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">{skill.name}</span>
                          <span className="text-blue-600">{skill.level}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 