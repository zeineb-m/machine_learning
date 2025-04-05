import React, { useState, useEffect } from 'react';
import {
  Typography,
  Avatar,
  Chip,
  Input,
  IconButton,
  Tooltip,
  Button,
  Alert,
  Select,
  Option
} from "@material-tailwind/react";
import { 
  NoSymbolIcon, 
  CheckCircleIcon, 
  MicrophoneIcon,
  XMarkIcon,
  ArrowPathIcon,
  LanguageIcon
} from "@heroicons/react/24/solid";
import axios from 'axios';
import Swal from 'sweetalert2';
import IsLoading from '@/configs/isLoading';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const UsersTable = () => {
  // Data state
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isManualInput, setIsManualInput] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1); 
  const [usersPerPage] = useState(6); 
  
  // Speech recognition
  const { 
    transcript,
    listening,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
    resetTranscript
  } = useSpeechRecognition();
  
  const [speechError, setSpeechError] = useState(null);
  const [language, setLanguage] = useState('en-US');
  const URL = "http://localhost:3001/api";

  const cleanTranscript = (text) => {
    return text
      .replace(/\.$/, '') // Remove trailing period
      .replace(/\s+\./g, ' ') // Remove any periods after spaces
      .replace(/\s{2,}/g, ' '); // Remove extra spaces
  };
  // Language options
  const languageOptions = [
    { value: 'en-US', label: 'English' },
    { value: 'fr-FR', label: 'Français' }
  ];

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${URL}/users`, {
        headers: {
          token: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      if (response.status !== 200) { 
        throw new Error(response.data.message || 'Failed to fetch users');
      }
  
      setUsers(response.data);
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || error.message, "error");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle speech recognition
  useEffect(() => {
    if (!isManualInput && transcript) {
      const cleaned = cleanTranscript(transcript);
      setSearchQuery(cleaned);
    }
  }, [transcript, isManualInput]);

  const startListening = async () => {
    try {
      setSpeechError(null);
      setIsManualInput(false);
      resetTranscript();
      
      if (!isMicrophoneAvailable) {
        throw new Error('Microphone not available');
      }
      
      await SpeechRecognition.startListening({
        continuous: true,
        language: language,
      });
    } catch (err) {
      setSpeechError(err.message);
      console.error('Speech recognition error:', err);
    }
  };

  const stopListening = async () => {
    try {
      await SpeechRecognition.stopListening();
    } catch (err) {
      console.error('Error stopping recognition:', err);
    }
  };

  const handleSearchChange = (e) => {
    setIsManualInput(true);
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
    resetTranscript();
    setIsManualInput(false);
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const action = currentStatus ? 'enable' : 'disable';
      const result = await Swal.fire({
        title: `${action.charAt(0).toUpperCase() + action.slice(1)} User`,
        text: `Are you sure you want to ${action} this user?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: currentStatus ? '#3085d6' : '#d33',
        cancelButtonColor: '#d33',
        confirmButtonText: `Yes, ${action} user!`
      });

      if (result.isConfirmed) {
        await axios.put(`${URL}/users/${userId}/toggle-status`);
        await fetchUsers();
        Swal.fire('Success!', `User has been ${action}d.`, 'success');
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
      Swal.fire('Error!', 'Failed to update user status.', 'error');
    }
  };

  // Filter and paginate users
  const filteredUsers = users.filter((user) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      user.firstName?.toLowerCase().includes(searchTerm) ||
      user.lastName?.toLowerCase().includes(searchTerm) ||
      user.email?.toLowerCase().includes(searchTerm) ||
      user.role?.toLowerCase().includes(searchTerm) ||
      user.project?.name?.toLowerCase().includes(searchTerm)
    );
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getImageUrl = (user) => {
    if (!user?.image?.data?.data) return null;
    try {
      const buffer = new Uint8Array(user.image.data.data);
      return `data:${user.image.contentType};base64,${btoa(String.fromCharCode(...buffer))}`;
    } catch (error) {
      console.error('Error converting image:', error);
      return null;
    }
  };

  return (
    <div className="px-4">
      {/* Search Section */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-2 mb-2">
          <div className="relative flex-grow">
            <Input
              label={language === 'fr-FR' ? "Rechercher des utilisateurs..." : "Search users..."}
              value={searchQuery}
              onChange={handleSearchChange}
              icon={
                searchQuery && (
                  <XMarkIcon 
                    className="h-5 w-5 cursor-pointer" 
                    onClick={clearSearch}
                  />
                )
              }
            />
          </div>
          
          <div className="flex gap-2">
            <Select
              value={language}
              onChange={(value) => setLanguage(value)}
              label={language === 'fr-FR' ? "Langue" : "Language"}
              icon={<LanguageIcon className="h-5 w-5" />}
              className="min-w-[120px]"
            >
              {languageOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
            
            <Tooltip 
              content={
                listening 
                  ? language === 'fr-FR' ? "Arrêter l'écoute" : "Stop listening" 
                  : language === 'fr-FR' ? "Recherche vocale" : "Voice search"
              }
            >
              <IconButton
                variant="gradient"
                color={listening ? "red" : "blue"}
                onClick={listening ? stopListening : startListening}
                disabled={!browserSupportsSpeechRecognition || !isMicrophoneAvailable}
                className="rounded-full"
              >
                {listening ? (
                  <ArrowPathIcon className="h-5 w-5 animate-spin" />
                ) : (
                  <MicrophoneIcon className="h-5 w-5" />
                )}
              </IconButton>
            </Tooltip>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex flex-wrap gap-2 items-center">
          {listening && (
            <Chip
              value={language === 'fr-FR' ? "Écoute en cours..." : "Listening..."}
              color="red"
              icon={<div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />}
              className="text-xs"
            />
          )}
          
          {!browserSupportsSpeechRecognition && (
            <Alert color="red" className="py-2">
              {language === 'fr-FR' 
                ? "Votre navigateur ne prend pas en charge la reconnaissance vocale." 
                : "Your browser doesn't support speech recognition."}
            </Alert>
          )}
          
          {!isMicrophoneAvailable && (
            <Alert color="amber" className="py-2">
              {language === 'fr-FR'
                ? "L'accès au microphone est requis pour la recherche vocale."
                : "Microphone access is required for voice search."}
            </Alert>
          )}
          
          {speechError && (
            <Alert color="red" className="py-2">
              {language === 'fr-FR' ? "Erreur :" : "Error:"} {speechError}
            </Alert>
          )}
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <IsLoading />
      ) : (
        <>
          <div className="overflow-x-auto shadow-lg rounded-lg">
            <table className="w-full min-w-[640px] table-auto">
              {/* Table Header */}
              <thead>
                <tr className="bg-blue-gray-50">
                  {[
                    language === 'fr-FR' ? "Utilisateur" : "User", 
                    "Email",
                    language === 'fr-FR' ? "Rôle" : "Role",
                    language === 'fr-FR' ? "Projet" : "Project",
                    language === 'fr-FR' ? "Statut" : "Status",
                    language === 'fr-FR' ? "Actions" : "Actions"
                  ].map((head) => (
                    <th key={head} className="border-b border-blue-gray-100 py-3 px-6 text-left">
                      <Typography
                        variant="small"
                        className="text-xs font-bold uppercase text-blue-gray-700"
                      >
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              
              {/* Table Body */}
              <tbody>
                {currentUsers.length > 0 ? (
                  currentUsers.map((user, index) => (
                    <tr key={user._id} className="hover:bg-blue-gray-50/50">
                      <td className="py-4 px-6 border-b border-blue-gray-100">
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={getImageUrl(user)}
                            alt={user.firstName || "User"}
                            size="sm"
                            className="border border-blue-gray-100 bg-white"
                          />
                          <Typography variant="small" className="font-semibold">
                            {user.firstName} {user.lastName}
                          </Typography>
                        </div>
                      </td>
                      <td className="py-4 px-6 border-b border-blue-gray-100">
                        <Typography variant="small" className="text-blue-gray-600">
                          {user.email || "N/A"}
                        </Typography>
                      </td>
                      <td className="py-4 px-6 border-b border-blue-gray-100">
                        <Chip
                          size="sm"
                          variant="outlined"
                          value={user.role || "N/A"}
                          color="blue"
                        />
                      </td>
                      <td className="py-4 px-6 border-b border-blue-gray-100">
                        <div>
                          <Typography variant="small" className="font-medium">
                            {user.project?.name || (language === 'fr-FR' ? "Aucun projet" : "No Project")}
                          </Typography>
                          {user.project?.status && (
                            <Typography variant="small" className="text-blue-gray-500">
                              {user.project.status}
                            </Typography>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 border-b border-blue-gray-100">
                        <Chip
                          size="sm"
                          value={user.isDisabled 
                            ? language === 'fr-FR' ? "Désactivé" : "Disabled" 
                            : language === 'fr-FR' ? "Actif" : "Active"}
                          color={user.isDisabled ? "red" : "green"}
                          className="font-medium"
                        />
                      </td>
                      <td className="py-4 px-6 border-b border-blue-gray-100">
                        <Tooltip 
                          content={user.isDisabled 
                            ? language === 'fr-FR' ? "Activer l'utilisateur" : "Enable user" 
                            : language === 'fr-FR' ? "Désactiver l'utilisateur" : "Disable user"}
                        >
                          <IconButton
                            variant="text"
                            color={user.isDisabled ? "green" : "red"}
                            onClick={() => handleToggleStatus(user._id, user.isDisabled)}
                          >
                            {user.isDisabled ? (
                              <CheckCircleIcon className="h-5 w-5" />
                            ) : (
                              <NoSymbolIcon className="h-5 w-5" />
                            )}
                          </IconButton>
                        </Tooltip>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center">
                      <Typography variant="h6" color="blue-gray">
                        {language === 'fr-FR' 
                          ? "Aucun utilisateur trouvé correspondant à votre recherche" 
                          : "No users found matching your search"}
                      </Typography>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredUsers.length > usersPerPage && (
            <div className="flex justify-center mt-6">
              <div className="flex gap-1">
                {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }, (_, i) => (
                  <IconButton
                    key={i + 1}
                    variant={currentPage === i + 1 ? "filled" : "text"}
                    color="blue"
                    onClick={() => paginate(i + 1)}
                    className="rounded-full"
                  >
                    {i + 1}
                  </IconButton>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UsersTable;