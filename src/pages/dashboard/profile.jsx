import { useState, useEffect, useContext } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Avatar,
  Typography,
  Tooltip,
  Button,
} from "@material-tailwind/react";
import { PencilIcon } from "@heroicons/react/24/solid";
import { ProfileInfoCard } from "@/widgets/cards";
import { AuthContext } from "../../context/AuthContext.jsx";
import { getUser } from "@/api/users";
import { EditProfile } from "./EditProfile.jsx";
import IsLoading from "@/configs/isLoading.jsx";

export function Profile() {
  const { getCurrentUser } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [imageSrc, setImageSrc] = useState("");
  const [updateUser, setUpdateUser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const toggleEdit = () => setUpdateUser(!updateUser);

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = getCurrentUser();
      if (currentUser?.id) {
        try {
          const data = await getUser(currentUser.id);
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

  return (
    <>
      {isLoading && <IsLoading />}
      {updateUser && !isLoading ? (
        <EditProfile />
      ) : (
        !isLoading && (
          <>
            <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url('/img/background-image.png')] bg-cover bg-center">
              <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
            </div>
            <Card className="mx-4 -mt-16 mb-6 border border-gray-200 shadow-lg rounded-xl p-6 bg-white">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <Avatar
                    src={imageSrc}
                    alt="User Avatar"
                    size="xl"
                    variant="rounded"
                    className="rounded-lg shadow-lg shadow-green-gray-500/40"
                  />
                  <div>
                    <Typography variant="h4" color="green-gray">
                      {userData?.firstName} {userData?.lastName}
                    </Typography>
                    <Typography variant="small" className="text-gray-600">
                      {userData?.role || "User"}
                    </Typography>
                  </div>
                </div>

                <Tooltip content="Edit Profile">
                  <Button
                    variant="outlined"
                    size="sm"
                    color="green"
                    onClick={toggleEdit}
                    className="flex items-center gap-2"
                  >
                    <PencilIcon className="h-5 w-5 text-green-500" />
                    Edit Profile
                  </Button>
                </Tooltip>
              </div>
            </Card>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mx-4">
              {/* User Details */}
              <Card className="p-6 border border-gray-200 shadow-md bg-white col-span-1">
                <Typography variant="h5" color="green-gray" className="mb-4">
                  Profile Information
                </Typography>
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

              {/* Projects Section */}
              <div className="col-span-2">
                <Typography variant="h5" color="green-gray" className="mb-4">
                  Projects
                </Typography>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  <Card className="p-4 border border-gray-200 shadow-md bg-white rounded-xl">
                    <CardBody className="py-2">
                      <Typography
                        variant="h5"
                        color="green-gray"
                        className="font-semibold mb-2"
                      >
                        {userData?.project?.name || "No Project Assigned"}
                      </Typography>
                      <Typography className="text-gray-500">
                        {userData?.project?.status || "Status Unavailable"}
                      </Typography>
                      <Typography className="text-gray-500 mt-1">
                        {userData?.project?.description || "No Description"}
                      </Typography>
                      <Typography className="text-gray-500 mt-2">
                        Start Date:{" "}
                        {userData?.project?.startDate
                          ? new Date(userData?.project.startDate)
                            .toISOString()
                            .slice(0, 10)
                          : "N/A"}
                      </Typography>
                    </CardBody>
                    <CardFooter className="flex justify-end">
                      <Button variant="outlined" size="sm">
                        View Project
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </div>
          </>
        )
      )}
    </>
  );
}

export default Profile;
