const ProjectModal = ({ project, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <img
          src={project.image}
          alt={project.name}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />

        <h2 className="text-2xl font-bold mb-2">{project.name}</h2>
        <p className="text-gray-600 mb-4">{project.description}</p>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Technologies Used:</h3>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech, index) => (
              <span key={index} className="bg-gray-200 px-3 py-1 rounded">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
