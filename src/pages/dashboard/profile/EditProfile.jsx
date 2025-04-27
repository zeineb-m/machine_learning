import { useState, useEffect, useContext } from "react";
import { Card, CardBody, Typography, Button, Input } from "@material-tailwind/react";
import { AuthContext } from "@/context/AuthContext.jsx";
import { getUser, updateUser, changePassword } from "@/api/users";
import Swal from "sweetalert2";
import IsLoading from "@/configs/isLoading";

export function EditProfile({ onBack }) {
  const { getCurrentUser } = useContext(AuthContext);
  const [loading , setLoading] = useState(true);
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
        setLoading(false);
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    if (currentUser?.id) {
      fetchUserData();
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate age >= 18
    const birthDateObj = new Date(userData.birthDate);
    const today = new Date();
    const age = today.getFullYear() - birthDateObj.getFullYear();
    const hasBirthdayPassed =
      today.getMonth() > birthDateObj.getMonth() ||
      (today.getMonth() === birthDateObj.getMonth() && today.getDate() >= birthDateObj.getDate());
    const actualAge = hasBirthdayPassed ? age : age - 1;
  
    if (actualAge < 18) {
      Swal.fire("Error", "You must be at least 18 years old.", "error");
      return;
    }
  
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      Swal.fire("Error", "Please enter a valid email address.", "error");
      return;
    }
  
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
      setError(error.response?.data?.message || "Failed to change password.");
      Swal.fire("Error", error.response?.data?.message || "Failed to change password.", "error");
    }
  };

  // Calculate max birth date (must be 18+)
  const today = new Date();
  const maxBirthDate = new Date(today.setFullYear(today.getFullYear() - 18)).toISOString().slice(0, 10);

  return (
    <>
      {loading && <IsLoading />}
      <Card className="mx-auto mt-8 mb-6 w-full max-w-2xl border border-gray-200 shadow-lg">
        <CardBody className="p-6">
          <Typography
            variant="h6"
            color="green-gray"
            className="mb-6 cursor-pointer color-green-600 hover:underline transition duration-300"
            onClick={onBack}
          >
            Back to my profile
          </Typography>

          {/* Tabs */}
          <div className="flex justify-between mb-6">
            <Button
              onClick={() => setActiveTab("profile")}
              className={`w-1/2 py-2 text-lg rounded-none ${
                activeTab === "profile" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              Edit Profile
            </Button>
            <Button
              onClick={() => setActiveTab("password")}
              className={`w-1/2 py-2 text-lg rounded-none ${
                activeTab === "password" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              Change Password
            </Button>
          </div>

          {/* Profile Form */}
          {activeTab === "profile" ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <Typography variant="h4" color="blue-gray">
                Edit Profile
              </Typography>
              <Input label="First Name" name="firstName" value={userData.firstName} onChange={handleInputChange} required />
              <Input label="Last Name" name="lastName" value={userData.lastName} onChange={handleInputChange} required />
              <Input label="Gender" name="gender" value={userData.gender} onChange={handleInputChange} />
              <Input
                type="date"
                label="Birth Date"
                name="birthDate"
                value={userData.birthDate}
                onChange={handleInputChange}
                required
                max={maxBirthDate}
              />
              <Input label="Phone" name="phone" value={userData.phone} onChange={handleInputChange} required />
              <Input label="Email" name="email" value={userData.email} onChange={handleInputChange} required />
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
                Save Changes
              </Button>
            </form>
          ) : (
            // Password Form
            <form onSubmit={handlePasswordChange} className="space-y-5">
              <Typography variant="h4" color="blue-gray">
                Change Password
              </Typography>
              <Input
                type="password"
                label="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <Input
                type="password"
                label="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <Input
                type="password"
                label="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {error && <Typography color="red">{error}</Typography>}
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
                Update Password
              </Button>
            </form>
          )}
        </CardBody>
      </Card>
    </>
  );
}
