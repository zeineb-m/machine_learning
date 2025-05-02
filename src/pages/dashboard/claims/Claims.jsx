import React, { useEffect, useState, useContext } from "react";
import {
  getClaims,
  createClaim,
  updateClaim,
  deleteClaim,
} from "@/api/Claims";
import { AuthContext } from "@/context/AuthContext";
import Swal from "sweetalert2";
import IsLoading from "@/configs/isLoading";

const Claims = () => {
  const { user } = useContext(AuthContext);

  const initialForm = {
    userId: user?.id || "", 
    subject: "",
    message: "",
  };

  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const data = await getClaims();
      setClaims(data);
    } catch (error) {
      console.error("Failed to fetch claims", error);
      Swal.fire({
        title: "Error",
        text: "Failed to fetch claims.",
        icon: "error",
        confirmButtonText: "Okay",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchClaims();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const claimData = {
        ...formData,
        userId: user?._id, 
      };

      if (editingId) {
        await updateClaim(editingId, claimData);
        Swal.fire({
          title: "Success",
          text: "Claim updated successfully.",
          icon: "success",
          confirmButtonText: "Okay",
        });
      } else {
        await createClaim(claimData);
        Swal.fire({
          title: "Success",
          text: "Claim created successfully.",
          icon: "success",
          confirmButtonText: "Okay",
        });
      }

      setFormData({ ...initialForm, userId: user?._id });
      setEditingId(null);
      fetchClaims();
    } catch (err) {
      console.error("Submit error", err);
      Swal.fire({
        title: "Error",
        text: "Failed to submit the claim.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  };

  const handleEdit = (claim) => {
    setFormData({
      userId: claim.user?._id || "",
      subject: claim.subject,
      message: claim.message,
      status: claim.status,
    });
    setEditingId(claim._id);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
    });
    if (result.isConfirmed) {
        try {
            await deleteClaim(id);
            Swal.fire({
            title: "Deleted!",
            text: "Claim deleted successfully.",
            icon: "success",
            confirmButtonText: "Okay",
            });
            fetchClaims();
        } catch (err) {
            console.error("Delete error", err);
            Swal.fire({
            title: "Error",
            text: "Failed to delete the claim.",
            icon: "error",
            confirmButtonText: "Try Again",
            });
        }
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {editingId ? "Update Your Claim" : "Create a New Claim"}
          </h2>
          <p className="mt-3 text-xl text-gray-500">
            {editingId ? "Modify your existing claim" : "Submit a new claim to our support team"}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                placeholder="What's this about?"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                required
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                id="message"
                placeholder="Describe your issue in detail..."
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 shadow-md"
              >
                {editingId ? "Update Claim" : "Submit Claim"}
              </button>
            </div>
          </form>
        </div>

        {/* Claims List */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Your Claims
            </h3>
          </div>
          
          {loading ? (
           <IsLoading />
          ) : claims.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No claims</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new claim.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {claims.map((claim) => (
                <li key={claim._id} className="p-6 hover:bg-gray-50 transition duration-150 ease-in-out">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-gray-900">{claim.subject}</h3>
                        <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(claim.status)}`}>
                          {claim.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">{claim.message}</p>

{claim.response && (
  <div className="mt-4 p-4 border-l-4 border-green-500 bg-green-50 rounded-md">
    <p className="text-sm font-semibold text-green-800">Admin Response:</p>
    <p className="mt-1 text-sm text-green-700 whitespace-pre-line">{claim.response}</p>
  </div>
)}
                      <p className="mt-2 text-xs text-gray-500">
                        Submitted by: <span className="font-medium">{claim.user?.email}</span>
                      </p>
                    </div>
                    
                    <div className="mt-4 sm:mt-0 sm:ml-4 flex space-x-3">
                      <button
                        onClick={() => handleEdit(claim)}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(claim._id)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Claims;