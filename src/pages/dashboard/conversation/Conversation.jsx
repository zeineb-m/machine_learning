import React, { useState, useEffect , useContext} from 'react';
import { PaperAirplaneIcon, FolderIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';
import ProjectMessaging from './ProjectMessaging';
import { AuthContext } from '@/context/AuthContext';
import {getUserWithProjects} from '@/api/project';
import IsLoading from '@/configs/isLoading';


const Conversation = () => {
  const [projects, setProjects] = useState([]);
  console.log(projects, 'projects');    
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getCurrentUser } = useContext(AuthContext); 
  const user = getCurrentUser() ;
  const userId = user.id ;

  console.log(userId, 'userId');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await getUserWithProjects(userId);
        setProjects(response.projects);
        setError(null);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProjects();
    }
  }, [userId]);

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <FolderIcon className="h-5 w-5 mr-2 text-green-600" />
            My Projects
          </h2>
        </div>
        
        {loading ? (
          <IsLoading />
        ) : error ? (
          <div className="flex-1 flex items-center justify-center text-red-500 p-4">
            {error}
          </div>
        ) : projects.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-gray-500 p-4 text-center">
            No projects found. Create a project to start messaging.
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {projects.map((project) => (
              <div
                key={project._id}
                onClick={() => setSelectedProject(project)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedProject?._id === project._id ? 'bg-green-50' : ''
                }`}
              >
                <h3 className="font-medium text-gray-800">{project.name}</h3>
                <p className="text-sm text-gray-500 truncate">
                  {project.description || 'No description'}
                </p>
                <div className="flex items-center mt-1 text-xs text-gray-400">
                  <ChatBubbleLeftRightIcon className="h-3 w-3 mr-1" />
                  <span>{project.messageCount || 0} messages</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col">
        {selectedProject ? (
          <ProjectMessaging 
            projectId={selectedProject._id} 
            senderId={userId} 
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-gray-500">
            <ChatBubbleLeftRightIcon className="h-12 w-12 mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-1">Select a project</h3>
            <p className="text-sm">Choose a project from the sidebar to view messages</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Conversation;