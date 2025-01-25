import { useState } from "react";
import ProjectForm from "./ProjectForm";

const AddProjectButton = ({ onAddProject }) => {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 z-40 flex items-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        <span className="hidden md:inline">Add Project</span>
      </button>

      {showForm && (
        <ProjectForm
          onSubmit={(newProject) => {
            onAddProject(newProject);
            setShowForm(false);
          }}
          onClose={() => setShowForm(false)}
        />
      )}
    </>
  );
};

export default AddProjectButton;
