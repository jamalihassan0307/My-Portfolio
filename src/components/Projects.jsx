import { useState, useEffect } from "react";
import ProjectCard from "./ProjectCard";
import ProjectForm from "./ProjectForm";
import AddProjectButton from "./AddProjectButton";
import { useAuth } from "../context/AuthContext";

const Projects = () => {
  const { currentUser } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('https://6788c4622c874e66b7d635aa.mockapi.io/Projects');
      const data = await response.json();
      setProjects(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setLoading(false);
    }
  };

  const handleAddProject = (newProject) => {
    setProjects([
      ...projects,
      {
        ...newProject,
        id: projects.length + 1,
      },
    ]);
  };

  const handleEditProject = (updatedProject) => {
    setProjects(
      projects.map((p) => (p.id === updatedProject.id ? updatedProject : p))
    );
    setEditingProject(null);
  };

  const handleDeleteProject = (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      setProjects(projects.filter((p) => p.id !== projectId));
    }
  };

  const openEditForm = (project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Featured Projects</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={currentUser ? () => openEditForm(project) : undefined}
              onDelete={currentUser ? () => handleDeleteProject(project.id) : undefined}
            />
          ))}
        </div>
      )}

      {currentUser && <AddProjectButton onAddProject={handleAddProject} />}

      {showForm && editingProject && (
        <ProjectForm
          project={editingProject}
          onSubmit={handleEditProject}
          onClose={() => {
            setShowForm(false);
            setEditingProject(null);
          }}
        />
      )}
    </div>
  );
};

export default Projects;
