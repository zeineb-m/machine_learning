import { Suspense, lazy } from "react";
import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
} from "@heroicons/react/24/solid";

import IsLoading from "./configs/isLoading";
import { ForgotPassword } from "./layouts";

const Home = lazy(() => import("@/pages/dashboard/Home"));
const Profile = lazy(() => import("@/pages/dashboard/Profile"));
const Tables = lazy(() => import("@/pages/dashboard/Tables"));
const Notifications = lazy(() => import("@/pages/dashboard/Notifications"));
const LoginSignupForm = lazy(() => import("./pages/auth/LoginSignupForm"));

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
        name: "profile",
        path: "/profile",
        element: (
          <Suspense fallback={<IsLoading />}>
            <Profile />
          </Suspense>
        ),
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "tables",
        path: "/tables",
        element: (
          <Suspense fallback={<IsLoading />}>
            <Tables />
          </Suspense>
        ),
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "notifications",
        path: "/notifications",
        element: (
          <Suspense fallback={<IsLoading />}>
            <Notifications />
          </Suspense>
        ),
      },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: (
          <Suspense fallback={<IsLoading />}>
            <LoginSignupForm />
          </Suspense>
        ),
      },
    ],
  },
];

export default routes;
