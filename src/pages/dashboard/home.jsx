import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";


import { StatisticsCard } from "@/widgets/cards";
import { getUserWithProjects, getUsersByProjectId } from "../../api/project"; // Fonction API

import { StatisticsChart } from "@/widgets/charts";
import {
  statisticsCardsData,
  statisticsChartsData,
  projectsTableData,
  ordersOverviewData,
} from "@/data";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Tooltip,
} from "@material-tailwind/react";
import {
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";

export function Home() {
  const [projectCount, setProjectCount] = useState(0);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getCurrentUser } = useContext(AuthContext);

  const user = getCurrentUser();
  const userId = user?.id;

  // Fonction pour convertir image binaire vers base64
  const getImageUrl = (image) => {
    if (image && image.data && image.contentType) {
      const base64String = btoa(
        new Uint8Array(image.data.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );
      return `data:${image.contentType};base64,${base64String}`;
    }
    return "/default-avatar.png"; // avatar par défaut si pas d'image
  };

  // Appel API pour récupérer les projets et leurs utilisateurs
  useEffect(() => {
    if (!userId) return;

    const fetchProjects = async () => {
      setLoading(true);
      try {
        const data = await getUserWithProjects(userId); // Appel API principal
        console.log("Projects API response:", JSON.stringify(data, null, 2));

        if (data && Array.isArray(data.projects)) {
          const enrichedProjects = await Promise.all(
            data.projects.map(async (project) => {
              // Appel API pour récupérer les users du projet
              try {
                const users = await getUsersByProjectId(project._id);
                return { ...project, users };
              } catch (err) {
                console.error(`Error fetching users for project ${project._id}`, err);
                return { ...project, users: [] };
              }
            })
          );

          setProjects(enrichedProjects);
          setProjectCount(enrichedProjects.length);
        } else {
          console.warn("Expected projects array, got:", data);
          setProjectCount(0);
        }
      } catch (error) {
        console.error("Error fetching projects", error);
        setProjectCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [userId]);

  if (!userId) {
    return <div>Veuillez vous connecter pour voir vos projets.</div>;
  }

  return (
    <div className="mt-12">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          <div>Loading stats…</div>
        ) : (
          <StatisticsCard
            title="Projects"
            icon={<CheckCircleIcon className="w-6 h-6 text-white" />}
            value={projectCount}
            footer={
              <Typography className="font-normal text-blue-gray-600">
                <strong>{projectCount}</strong> projects
              </Typography>
            }
          />
        )}
      </div>
      <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
        {statisticsChartsData.map((props) => (
          <StatisticsChart
            key={props.title}
            {...props}
            footer={
              <Typography
                variant="small"
                className="flex items-center font-normal text-blue-gray-600"
              >
                <ClockIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400" />
                &nbsp;{props.footer}
              </Typography>
            }
          />
        ))}
      </div>
      <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="overflow-hidden xl:col-span-3 border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center justify-between p-6"
          >
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-1">
                Projects
              </Typography>
              <Typography
                variant="small"
                className="flex items-center gap-1 font-normal text-blue-gray-600"
              >
                <CheckCircleIcon strokeWidth={3} className="h-4 w-4 text-blue-gray-200" />
                <strong>{projectCount} projects</strong> loaded
              </Typography>
            </div>
            <Menu placement="left-start">
              <MenuHandler>
                <IconButton size="sm" variant="text" color="blue-gray">
                  <EllipsisVerticalIcon
                    strokeWidth={3}
                    fill="currenColor"
                    className="h-6 w-6"
                  />
                </IconButton>
              </MenuHandler>
              <MenuList>
                <MenuItem>Refresh</MenuItem>
              </MenuList>
            </Menu>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["Project Name", "Status", "Members"].map((el) => (
                    <th
                      key={el}
                      className="border-b border-blue-gray-50 py-3 px-6 text-left"
                    >
                      <Typography
                        variant="small"
                        className="text-[11px] font-medium uppercase text-blue-gray-400"
                      >
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {projects.map((project, key) => {
                  const className = `py-3 px-5 ${
                    key === projects.length - 1 ? "" : "border-b border-blue-gray-50"
                  }`;
                  return (
                    <tr key={project._id}>
                      <td className={className}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold"
                        >
                          {project.title}
                        </Typography>
                      </td>
                      <td className={className}>
                        <div
                          className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                            project.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : project.status === "ongoing"
                              ? "bg-blue-100 text-blue-800"
                              : project.status === "planned"
                              ? "bg-red-100 text-red-800"
                              : "bg-red-50 text-red-500"
                          }`}
                        >
                          {project.status.charAt(0).toUpperCase() +
                            project.status.slice(1)}
                        </div>
                      </td>
                      <td className={className}>
                        {project.users && project.users.length > 0 ? (
                          project.users.map((user) => {
                            const imageUrl = getImageUrl(user.image);
                            return (
                              <Tooltip
                                key={user._id}
                                content={user.name || "Utilisateur"}
                              >
                                <Avatar
                                  src={imageUrl}
                                  alt={user.name || "User"}
                                  size="xs"
                                  variant="circular"
                                  className="cursor-pointer border-2 border-white -ml-2.5 first:ml-0"
                                />
                              </Tooltip>
                            );
                          })
                        ) : (
                          <Typography variant="small" className="text-blue-gray-400">
                            Aucun membre
                          </Typography>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default Home;
