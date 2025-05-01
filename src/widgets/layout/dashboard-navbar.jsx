import { useLocation, Link } from "react-router-dom";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Breadcrumbs,
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Badge,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  BellIcon,
  ClockIcon,
  CreditCardIcon,
  Bars3Icon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";
import {
  useMaterialTailwindController,
  setOpenConfigurator,
  setOpenSidenav,
} from "@/context";

import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { getUpcomingTasks } from "@/api/tasks";
import { format, parseISO, differenceInDays } from "date-fns";

export function DashboardNavbar() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const { Logout, getCurrentUser } = useContext(AuthContext);
  const currentUser = getCurrentUser();

  console.log("Current User:", currentUser);

  useEffect(() => {
    const fetchUpcomingTasks = async () => {
      if (currentUser?.id) {
        try {
          const tasks = await getUpcomingTasks(currentUser.id);
          setUpcomingTasks(tasks);
          const urgentTasks = tasks.filter(task => {
            const daysUntilDue = differenceInDays(parseISO(task.dueDate), new Date());
            return daysUntilDue <= 2;
          });
          setUnreadNotifications(urgentTasks.length);
        } catch (error) {
          console.error("Error fetching upcoming tasks:", error);
        }
      }
    };

    fetchUpcomingTasks();
    
    const interval = setInterval(fetchUpcomingTasks, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [currentUser?._id]);

  const handleLogout = async () => {
    try {
      await Logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const getNotificationIcon = (daysUntilDue) => {
    if (daysUntilDue <= 0) {
      return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />;
    } else if (daysUntilDue <= 1) {
      return <ExclamationTriangleIcon className="h-4 w-4 text-orange-500" />;
    } else {
      return <ClockIcon className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getNotificationText = (daysUntilDue) => {
    if (daysUntilDue <= 0) {
      return "Due today!";
    } else if (daysUntilDue === 1) {
      return "Due tomorrow";
    } else {
      return `Due in ${daysUntilDue} days`;
    }
  };

  return (
    <Navbar
      color={fixedNavbar ? "white" : "transparent"}
      className={`rounded-xl transition-all ${
        fixedNavbar
          ? "sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/5"
          : "px-0 py-1"
      }`}
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
        <div className="capitalize">
          <Breadcrumbs
            className={`bg-transparent p-0 transition-all ${
              fixedNavbar ? "mt-1" : ""
            }`}
          >
            <Link to={`/${layout}`}>
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal opacity-50 transition-all hover:text-blue-500 hover:opacity-100"
              >
                {layout}
              </Typography>
            </Link>
            <Typography variant="small" color="blue-gray" className="font-normal">
              {page}
            </Typography>
          </Breadcrumbs>
          <Typography variant="h6" color="blue-gray">
            {page}
          </Typography>
        </div>
        <div className="flex items-center">
          <div className="mr-auto md:mr-4 md:w-56">
            <Input label="Search" />
          </div>
          <IconButton
            variant="text"
            color="blue-gray"
            className="grid xl:hidden"
            onClick={() => setOpenSidenav(dispatch, !openSidenav)}
          >
            <Bars3Icon strokeWidth={3} className="h-6 w-6 text-blue-gray-500" />
          </IconButton>

          <div className="flex items-center gap-4">
            {currentUser && (
              <Menu>
                <MenuHandler>
                  <Avatar
                    src={
                      currentUser.image?.data
                        ? `data:${currentUser.image.contentType};base64,${btoa(
                            String.fromCharCode(...new Uint8Array(currentUser.image.data.data))
                          )}`
                        : "https://via.placeholder.com/150"
                    }
                    alt="User Avatar"
                    size="sm"
                    variant="circular"
                    className="cursor-pointer"
                  />
                </MenuHandler>
                <MenuList>
                  <MenuItem>
                    <Link to="/dashboard/profile" className="flex items-center gap-2">
                      <UserCircleIcon className="h-5 w-5" />
                      <Typography variant="small">See your profile</Typography>
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={handleLogout} className="flex items-center gap-2">
                    <Typography variant="small" color="red">
                      Logout
                    </Typography>
                  </MenuItem>
                </MenuList>
              </Menu>
            )}
          </div>

          <Menu>
            <MenuHandler>
              <IconButton variant="text" color="blue-gray">
                <Badge
                  content={unreadNotifications}
                  color="red"
                  className={`${unreadNotifications === 0 ? 'hidden' : ''}`}
                >
                  <BellIcon className="h-5 w-5 text-blue-gray-500" />
                </Badge>
              </IconButton>
            </MenuHandler>
            <MenuList className="w-max border-0 max-h-96 overflow-y-auto">
              {upcomingTasks.length === 0 ? (
                <MenuItem className="flex items-center gap-3">
                  <Typography variant="small" color="blue-gray" className="font-normal">
                    No upcoming tasks
                  </Typography>
                </MenuItem>
              ) : (
                upcomingTasks.map((task) => {
                  const daysUntilDue = differenceInDays(parseISO(task.dueDate), new Date());
                  return (
                    <MenuItem key={task._id} className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-tr from-blue-gray-800 to-blue-gray-900">
                        {getNotificationIcon(daysUntilDue)}
                      </div>
                      <div>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="mb-1 font-normal"
                        >
                          <strong>{task.title}</strong> - {getNotificationText(daysUntilDue)}
                        </Typography>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="flex items-center gap-1 text-xs font-normal opacity-60"
                        >
                          Due: {format(parseISO(task.dueDate), 'MMM d, yyyy')}
                        </Typography>
                        {task.description && (
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="mt-1 text-xs font-normal opacity-60"
                          >
                            {task.description.substring(0, 50)}...
                          </Typography>
                        )}
                      </div>
                    </MenuItem>
                  );
                })
              )}
            </MenuList>
          </Menu>
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={() => setOpenConfigurator(dispatch, true)}
          >
            <Cog6ToothIcon className="h-5 w-5 text-blue-gray-500" />
          </IconButton>
        </div>
      </div>
    </Navbar>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default DashboardNavbar;