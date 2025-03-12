import { Suspense, lazy } from "react";
import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  ServerStackIcon,
  DocumentTextIcon, 
} from "@heroicons/react/24/solid";

import IsLoading from "./configs/isLoading";
import AddProject from "./pages/dashboard/projects/AddProject";

const Home = lazy(() => import("@/pages/dashboard/Home"));
const Profile = lazy(() => import("@/pages/dashboard/profile/profile"));
const Tables = lazy(() => import("@/pages/dashboard/users/Tables"));
const ProjectDetails = lazy(() => import("./pages/dashboard/projects/project-details/ProjectDetails"));
const EditFile = lazy(() => import("./pages/dashboard/files/EditFile"));
const FileView = lazy(() => import("./pages/dashboard/files/FileView"));
const AddFile = lazy(() => import("./pages/dashboard/files/AddFile"));
const Bilan = lazy(() => import("./pages/dashboard/files/Bilan"));
const Files = lazy(()=> import('./pages/dashboard/files/Files'))

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
        icon: <DocumentTextIcon {...icon} />,
        name: "Files",
        path: "/files",
        element: (
          <Suspense fallback={<IsLoading />}>
            <Files />
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
  {
    path: "/files/add", 
    element: (
      <Suspense fallback={<IsLoading />}>
        <AddFile />
      </Suspense>
    ),
  },
  {
    path: "/files/edit/:id", 
    element: (
      <Suspense fallback={<IsLoading />}>
        <EditFile />
      </Suspense>
    ),
  },
  {
    path: "/files/:id",
    element: (
      <Suspense fallback={<IsLoading />}>
        <FileView />
      </Suspense>
    ),
  },
  {
    path: "/bilan/:projectId",
    element: (
      <Suspense fallback={<IsLoading />}>
          <Bilan />
      </Suspense>
    ),
  },

  
];

export default routes;
