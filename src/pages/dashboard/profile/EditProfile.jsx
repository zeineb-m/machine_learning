import { useState, useEffect, useContext } from "react";
import { Card, CardBody, Typography, Button, Input } from "@material-tailwind/react";
import { AuthContext } from "@/context/AuthContext.jsx";
import { getUser, updateUser, changePassword } from "@/api/users";
import Swal from "sweetalert2";

export function EditProfile() {
  const { getCurrentUser } = useContext(AuthContext);
  const currentUser = getCurrentUser();

  const [activeTab, setActiveTab] = useState("profile");
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    birthDate: "",
    phone: "",
    email: "",
  });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUser(currentUser.id);
        setUserData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          gender: data.gender || "",
          birthDate: data.birthDate ? new Date(data.birthDate).toISOString().slice(0, 10) : "",
          phone: data.phone || "",
          email: data.email || "",
        });
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      }
    };

    if (currentUser?.id) {
      fetchUserData();
    }
  }, []);
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Updating ${name} to ${value}`); 
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(currentUser.id, userData);
      Swal.fire("Success", "Profile updated successfully!", "success");
    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire("Error", "Failed to update profile.", "error");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      await changePassword(currentUser.id, currentPassword, newPassword);
      Swal.fire("Success", "Password changed successfully!", "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setError("");
    } catch (error) {
      console.error("Error changing password:", error);
      setError(error.response?.data?.message || "Unknown error.");
      Swal.fire("Error", error.response?.data?.message || "Failed to change password.", "error");
    }
  };

  return (
    <Card className="mx-auto mt-8 mb-6 w-full max-w-2xl border border-green-gray-200 shadow-lg">
      <CardBody className="p-6">
        <div className="flex justify-between mb-6">
          <Button 
            onClick={() => setActiveTab("profile")}
            className={`w-1/2 py-2 text-lg rounded-none ${activeTab === "profile" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"}`}>
            Edit Profile
          </Button>
          <Button 
            onClick={() => setActiveTab("password")}
            className={`w-1/2 py-2 text-lg rounded-none ${activeTab === "password" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"}`}>
            Change Password
          </Button>
        </div>

        {activeTab === "profile" ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <Typography variant="h4" color="green-gray">
              Edit Profile
            </Typography>
            <Input label="First Name" name="firstName" value={userData.firstName} onChange={handleInputChange} required />
            <Input label="Last Name" name="lastName" value={userData.lastName} onChange={handleInputChange} required />
            <Input label="Gender" name="gender" value={userData.gender} onChange={handleInputChange} />
            <Input type="date" label="Birth Date" name="birthDate" value={userData.birthDate} onChange={handleInputChange} required />
            <Input label="Phone" name="phone" value={userData.phone} onChange={handleInputChange} required />
            <Input label="Email" name="email" value={userData.email} onChange={handleInputChange} required />
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
              Save Changes
            </Button>
          </form>
        ) : (
          <form onSubmit={handlePasswordChange} className="space-y-5">
            <Typography variant="h4" color="green-gray">
              Change Password
            </Typography>
            <Input type="password" label="Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
            <Input type="password" label="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            <Input type="password" label="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            {error && <Typography color="red">{error}</Typography>}
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
              Update Password
            </Button>
          </form>
        )}
      </CardBody>
    </Card>
  );
}

export default EditProfile;
