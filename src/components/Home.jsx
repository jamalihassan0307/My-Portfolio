import { useState, useEffect } from "react";
import { FaGithub, FaLinkedin, FaEnvelope, FaPhone, FaEdit } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";

const EditProfileModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState(user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://6788c4622c874e66b7d635aa.mockapi.io/user/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSave(formData);
        onClose();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows="3"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
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
      </div>
    </div>
  );
};

const Home = () => {
  const [personalInfo, setPersonalInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [projectCount, setProjectCount] = useState(0);
  const { currentUser } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchUserData();
    fetchProjectCount();
  }, [currentUser]);

  const fetchUserData = async () => {
    try {
      if (currentUser) {
        setPersonalInfo(currentUser);
        setLoading(false);
        return;
      }

      const response = await fetch('https://6788c4622c874e66b7d635aa.mockapi.io/user/1');
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await response.json();
      setPersonalInfo(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load profile data');
      setLoading(false);
    }
  };

  const fetchProjectCount = async () => {
    try {
      const response = await fetch('https://6788c4622c874e66b7d635aa.mockapi.io/Projects');
      const data = await response.json();
      setProjectCount(data.length);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleProfileUpdate = (updatedInfo) => {
    setPersonalInfo(updatedInfo);
  };

  if (loading || !personalInfo) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="w-64 h-64 md:w-80 md:h-80 relative">
            <div className="absolute inset-0 bg-blue-500 rounded-full opacity-10 blur-xl"></div>
            <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img
                src={personalInfo.image}
                alt={personalInfo.name}
                className="w-full h-full object-cover"
              />
              {currentUser && (
                <button 
                  className="absolute bottom-4 right-4 bg-blue-600 p-2 rounded-full text-white hover:bg-blue-700"
                  onClick={() => setShowEditModal(true)}
                >
                  <FaEdit size={20} />
                </button>
              )}
            </div>
          </div>

          <div className="text-center md:text-left max-w-xl">
            <h2 className="text-gray-600 text-xl mb-2">{personalInfo.title}</h2>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              {personalInfo.name}
            </h1>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              {personalInfo.bio}
            </p>

            <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start mb-8">
              <div className="flex items-center gap-2 text-gray-600">
                <FaEnvelope size={20} />
                <span>{personalInfo.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FaPhone size={20} />
                <span>{personalInfo.phone}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Technical Expertise
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {personalInfo.languages.map((skill, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-gray-700">
                  {skill.name}
                </span>
                <span className="text-blue-600">{skill.level}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${skill.level}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-4xl font-bold text-blue-600 mb-2">
                {projectCount}+
              </h3>
              <p className="text-gray-600">Projects Completed</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-bold text-blue-600 mb-2">5+</h3>
              <p className="text-gray-600">Years Experience</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-bold text-blue-600 mb-2">100%</h3>
              <p className="text-gray-600">Client Satisfaction</p>
            </div>
          </div>
        </div>
      </div>

      {showEditModal && (
        <EditProfileModal
          user={personalInfo}
          onClose={() => setShowEditModal(false)}
          onSave={handleProfileUpdate}
        />
      )}
    </div>
  );
};

export default Home;
