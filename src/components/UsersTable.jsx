import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Input,
  IconButton,
  Tooltip,
  Spinner,
  Button,
} from "@material-tailwind/react";
import { NoSymbolIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
import axios from 'axios';
import Swal from 'sweetalert2';
import IsLoading from '@/configs/isLoading';

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [usersPerPage] = useState(6); // Number of users per page
  const URL = "http://localhost:3001/api";

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${URL}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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

  // Pagination Logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="px-4">
      <div className="mb-4">
        <Input
          label="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <IsLoading />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["User", "Email", "Role", "Project", "Status", "Actions"].map((head) => (
                    <th key={head} className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <Typography
                        variant="small"
                        className="text-[11px] font-medium uppercase text-blue-gray-400"
                      >
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user, index) => {
                  const isLast = index === currentUsers.length - 1;
                  const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={user._id}>
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={getImageUrl(user)}
                            alt={user.firstName || "User"}
                            size="sm"
                            className="border border-blue-gray-50 bg-blue-gray-50/50 object-contain p-1"
                          />
                          <Typography variant="small" color="blue-gray" className="font-bold">
                            {user.firstName} {user.lastName}
                          </Typography>
                        </div>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray">
                          {user.email || "N/A"}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray">
                          {user.role || "N/A"}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <div>
                          <Typography variant="small" color="blue-gray">
                            {user.project?.name || "No Project"}
                          </Typography>
                          <Typography variant="small" color="blue-gray" className="opacity-70">
                            {user.project?.status || "N/A"}
                          </Typography>
                        </div>
                      </td>
                      <td className={classes}>
                        <div className="w-max">
                          <Chip
                            size="sm"
                            variant="ghost"
                            value={user.isDisabled ? "offline" : "online"}
                            color={user.isDisabled ? "blue-gray" : "green"}
                          />
                        </div>
                      </td>
                      <td className={classes}>
                        <Tooltip content={user.isDisabled ? "Enable User" : "Disable User"}>
                          <IconButton
                            variant="text"
                            color={user.isDisabled ? "green" : "red"}
                            onClick={() => handleToggleStatus(user._id, user.isDisabled)}
                          >
                            {user.isDisabled ? (
                              <CheckCircleIcon className="h-4 w-4" />
                            ) : (
                              <NoSymbolIcon className="h-4 w-4" />
                            )}
                          </IconButton>
                        </Tooltip>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredUsers.length > usersPerPage && (
            <div className="flex justify-center mt-6">
              <div className="flex gap-2">
                {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }, (_, i) => (
                  <Button
                    key={i + 1}
                    variant={currentPage === i + 1 ? "filled" : "outlined"}
                    color="blue"
                    onClick={() => paginate(i + 1)}
                    className="px-4 py-2"
                  >
                    {i + 1}
                  </Button>
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