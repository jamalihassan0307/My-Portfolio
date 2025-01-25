import { useState } from "react";

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        className="relative rounded-lg overflow-hidden shadow-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={project.image}
          alt={project.name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-xl font-semibold">{project.name}</h3>
        </div>

        {isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center space-y-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-white px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              Read More
            </button>
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 z-50 text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="overflow-y-auto flex-1 p-6">
              <img
                src={project.image}
                alt={project.name}
                className="w-full h-[400px] object-cover rounded-lg mb-6"
              />

              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-gray-900">
                  {project.name}
                </h3>

                <div className="prose max-w-none">
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xl font-semibold text-gray-900">
                    Technologies Used
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xl font-semibold text-gray-900">
                    Project Features
                  </h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Responsive design for all devices</li>
                    <li>Modern user interface with intuitive navigation</li>
                    <li>Optimized performance and loading times</li>
                    <li>Secure authentication and data protection</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectCard;
