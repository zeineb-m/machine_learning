import { useState, useEffect, useContext, useRef } from "react";
import { Card, CardBody, Avatar, Typography, Tooltip, Button, Input } from "@material-tailwind/react";
import { PencilIcon, MagnifyingGlassIcon, MicrophoneIcon } from "@heroicons/react/24/solid";
import { ProfileInfoCard } from "@/widgets/cards";
import { AuthContext } from "@/context/AuthContext.jsx";
import { EditProfile } from "./EditProfile.jsx";
import IsLoading from "@/configs/isLoading.jsx";
import { getUserWithProjects } from "@/api/project.jsx";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; 
import { Typewriter } from "react-simple-typewriter";

const Profile = () => {
  const history = useNavigate();
  const { getCurrentUser } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [imageSrc, setImageSrc] = useState("");
  const [updateUser, setUpdateUser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(5);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);


  console.log("User Data:", userData);


  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'fr-FR';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchTerm(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        if (isListening) {
          recognitionRef.current.start();
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening]);

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Could not start speech recognition:', error);
      }
    }
  };

  const handleAddFile = (projectId) => {
    setSelectedProjectId(projectId);
    history("/dashboard/files/add", { state: { projectId } });
  };

  const handleGrandLivre = (projectId) => {
    history(`/dashboard/grand-livre/${projectId}`);
  };

  const toggleEdit = () => setUpdateUser(!updateUser);

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = getCurrentUser();
      if (currentUser?.id) {
        try {
          const data = await getUserWithProjects(currentUser.id);
          setUserData(data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchUserData();
  }, [getCurrentUser]);

  useEffect(() => {
    if (userData?.image?.data) {
      const buffer = new Uint8Array(userData.image.data.data);
      const base64String = `data:${userData.image.contentType};base64,${btoa(
        String.fromCharCode(...buffer)
      )}`;
      setImageSrc(base64String);
      setIsLoading(false);
    }
  }, [userData]);

  const handleDetails = (id) => {
    history(`/dashboard/project-details/${id}`);
  };

  
  const filteredProjects = userData?.projects?.filter(project => {
    const cleanText = (text) => {
      if (!text) return '';
      return text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]\s*$/, '').toLowerCase();
    };

    const cleanSearchTerm = cleanText(searchTerm);
    const cleanTitle = cleanText(project.title);
    const cleanDescription = cleanText(project.description);

    return cleanTitle.includes(cleanSearchTerm) || 
           cleanDescription.includes(cleanSearchTerm);
  });

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects?.slice(indexOfFirstProject, indexOfLastProject);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleBilan = (projectId) => {
    history(`/dashboard/bilan/${projectId}`);
  };

  const handleFinance = (projectId) => {
    history(`/dashboard/finance/${projectId}`);
  };
  const handleCashFlow = (projectId) => {
    history(`/dashboard/cashflow/${projectId}`);
  };
  return (
    <>
      {isLoading && <IsLoading />}
      {updateUser && !isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <EditProfile onBack={toggleEdit} />
        </motion.div>
      ) : (
        !isLoading && (
          <>
            <motion.div
              className="relative mt-8 h-96 w-full overflow-hidden rounded-xl bg-gradient-to-r from-green-500 to-purple-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="absolute inset-0 bg-black/50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Typography variant="h1" className="text-white text-5xl font-bold">
                  Welcome, {userData?.firstName}!
                </Typography>
              </div>
            </motion.div>
            <motion.div
              className="mx-4 -mt-24 mb-6 border-0 shadow-xl rounded-2xl bg-gradient-to-r from-green-50 to-purple-50 relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 z-[10000]">
                <div className="flex items-center gap-6">
                  <Avatar
                    src={imageSrc}
                    alt="User Avatar"
                    size="xxl"
                    variant="circular"
                    className="rounded-full border-4 border-white shadow-2xl"
                  />
                  <div>
                    <Typography variant="h3" className="text-gray-900">
                      {userData?.firstName} {userData?.lastName}
                    </Typography>
                    <Typography variant="h6" className="text-gray-600">
                      {userData?.role || "User"}
                    </Typography>
                  </div> 
                </div>

                <Tooltip content="Edit Profile">
                  <Button
                    variant="gradient"
                    size="lg"
                    color="green"
                    onClick={toggleEdit}
                    className="flex items-center gap-2 shadow-lg hover:shadow-green-500/40"
                  >
                    <PencilIcon className="h-5 w-5" />
                    Edit Profile
                  </Button>
                </Tooltip>
              </div>
            </motion.div>
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-3 gap-8 mx-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-6 border-0 shadow-lg rounded-2xl bg-gradient-to-r from-green-50 to-purple-50">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Typography
                    variant="h4"
                    className="text-gray-900 mb-6 font-serif"
                  >
                    <Typewriter
                      words={["Profile Information"]}
                      loop={false}
                      cursor
                      cursorStyle="_"
                      typeSpeed={100}
                      deleteSpeed={50}
                    />
                  </Typography>
                </motion.div>
                <ProfileInfoCard
                  description="about me"
                  details={{
                    "First Name": userData?.firstName,
                    "Last Name": userData?.lastName,
                    Gender: userData?.gender,
                    "Birth Date": userData?.birthDate
                      ? new Date(userData?.birthDate).toISOString().slice(0, 10)
                      : "N/A",
                    Phone: userData?.phone || "N/A",
                    Email: userData?.email,
                  }}
                />
              </Card>
              <div className="col-span-2">
                <div className="flex justify-between items-center mb-6">
                  <Typography variant="h4" className="text-gray-900">
                    Projects
                  </Typography>
                  <div className="flex items-center gap-2">
                    <div className="w-72 relative">
                      <Input
                        label="Search projects..."
                        icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setCurrentPage(1);
                        }}
                      />
                      {isListening && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                          <Typography className="text-purple-600 animate-pulse">
                            Listening...
                          </Typography>
                        </div>
                      )}
                    </div>
                    <Tooltip content="Voice search">
                      <Button
                        variant="gradient"
                        color={isListening ? "red" : "purple"}
                        onClick={toggleListen}
                        className="p-2"
                      >
                        <MicrophoneIcon className="h-5 w-5" />
                      </Button>
                    </Tooltip>
                  </div>
                </div>
                {filteredProjects?.length > 0 ? (
                  <>
                    <motion.div
                      className="overflow-x-auto"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >

  <table className="w-full min-w-[800px] table-auto border-collapse">
    <thead>
      <tr className="bg-gradient-to-r from-green-500 to-purple-600 text-white">
        <th className="px-4 py-3 text-left whitespace-nowrap">Project Name</th>
        <th className="px-4 py-3 text-left whitespace-nowrap">Status</th>
        <th className="px-4 py-3 text-left whitespace-nowrap">Start Date</th>
        <th className="px-4 py-3 text-left whitespace-nowrap">Description</th>
        <th className="px-4 py-3 text-left whitespace-nowrap">Actions</th>
      </tr>
    </thead>
    <tbody>
      {currentProjects?.map((project, index) => (
        <tr
          key={index}
          className={`${
            index % 2 === 0 ? "bg-gray-50" : "bg-white"
          } hover:bg-gray-100 transition-colors duration-200`}
        >
          <td className="px-4 py-4 whitespace-nowrap">{project?.title}</td>
          <td className="px-4 py-4">
            <span
              className={`px-2 py-1 rounded-full text-sm whitespace-nowrap ${
                project?.status === "Completed"
                  ? "bg-green-100 text-green-800"
                  : project?.status === "In Progress"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {project?.status}
            </span>
          </td>
          <td className="px-4 py-4 whitespace-nowrap">
            {new Date(project?.startDate).toISOString().slice(0, 10)}
          </td>
          <td className="px-4 py-4 whitespace-nowrap truncate max-w-xs">{project?.description}</td>
          <td className="px-4 py-4 flex flex-wrap gap-2">
            <Button
              variant="gradient"
              size="sm"
              color="green"
              className="shadow-md hover:shadow-green-500/40"
              onClick={() => handleDetails(project._id)}
            >
              View
            </Button>
            <Button
              variant="gradient"
              size="sm"
              color="purple"
              className="shadow-md hover:shadow-purple-600/40"
              onClick={() => handleAddFile(project._id)}
            >
              Add File
            </Button>
            <Button
              variant="gradient"
              size="sm"
              color="blue"
              className="shadow-md hover:shadow-blue-500/40"
              onClick={() => handleBilan(project._id)}
            >
              Bilan
            </Button>
            <Button
              variant="gradient"
              size="sm"
              color="orange"
              className="shadow-md hover:shadow-orange-500/40"
              onClick={() => handleGrandLivre(project._id)}
            >
              Grand Livre
            </Button>
            <Button
    variant="gradient"
    size="sm"
    color="pink"
    className="shadow-md hover:shadow-pink-400/40"
    onClick={() => handleFinance(project._id)}
  >
    Finance
  </Button>
  <Button
    variant="gradient"
    size="sm"
    color="cyan"
    className="shadow-md hover:shadow-cyan-400/40"
    onClick={() => handleCashFlow(project._id)}
  >
    Cash Flow
  </Button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
                    </motion.div>
                    {/* Pagination */}
                    <div className="flex justify-between mt-4">
                      <Button
                        variant="outlined"
                        size="sm"
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outlined"
                        size="sm"
                        onClick={() => paginate(currentPage + 1)}
                        disabled={indexOfLastProject >= filteredProjects?.length}
                      >
                        Next
                      </Button>
                    </div>
                  </>
                ) : (
                  <Typography variant="h6" className="text-gray-600">
                    {searchTerm ? "No projects match your search." : "No projects available."}
                  </Typography>
                )}
              </div>
            </motion.div>
          </>
        )
      )}
    </>
  );
}

export default Profile;