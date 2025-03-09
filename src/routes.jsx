import { Suspense, lazy } from "react";
import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  ServerStackIcon,
} from "@heroicons/react/24/solid";

import IsLoading from "./configs/isLoading";
import AddProject from "./pages/dashboard/projects/AddProject";

const Home = lazy(() => import("@/pages/dashboard/Home"));
const Profile = lazy(() => import("@/pages/dashboard/profile/profile"));
const Tables = lazy(() => import("@/pages/dashboard/users/Tables"));
const ProjectDetails = lazy(() => import("./pages/dashboard/projects/project-details/ProjectDetails"));

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: (
          <Suspense fallback={<IsLoading />}>
            <Home />
          </Suspense>
        ),
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "Profile",
        path: "/profile",
        element: (
          <Suspense fallback={<IsLoading />}>
            <Profile />
          </Suspense>
        ),
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Users",
        path: "/tables",
        element: (
          <Suspense fallback={<IsLoading />}>
            <Tables />
          </Suspense>
        ),
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Add New Project",
        path: "/add-project",
        element: (
          <Suspense fallback={<IsLoading />}>
            <AddProject />
          </Suspense>
        ),
      },
    ],
  },
  {
    title: "projects",
    layout: "project",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "projects",
        path: "/projects",
        element: (
          <Suspense fallback={<IsLoading />}>
            <AddProject />
          </Suspense>
        ),
      },
    ],
  },
];

export const hiddenRoutes = [
  {
    path: "/project-details/:id",
    element: (
      <Suspense fallback={<IsLoading />}>
        <ProjectDetails />
      </Suspense>
    ),
  },
];

export default routes;
