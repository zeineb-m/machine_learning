import { Suspense, lazy } from "react";
import { motion } from "framer-motion"; 
import { AuthContext } from "./context/AuthContext";
import { useContext } from "react";
import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  ClipboardIcon,
  FolderIcon,
  ChatBubbleBottomCenterTextIcon , 
  ExclamationCircleIcon
} from "@heroicons/react/24/solid";

import IsLoading from "./configs/isLoading";
import AddProject from "./pages/dashboard/projects/AddProject";
import Projects from "./pages/dashboard/projects/Projects";
import Balance from "./pages/dashboard/balance/Balance";
import MyTasks from "./pages/dashboard/tasks/MyTasks";
import AddUser from "./pages/dashboard/users/adduser";
import Conversation from "./pages/dashboard/conversation/Conversation";
import Claims from "./pages/dashboard/claims/Claims";
import ClaimsList from "./pages/dashboard/claims/ClaimsList";



const Home = lazy(() => import("@/pages/dashboard/Home"));
const Profile = lazy(() => import("@/pages/dashboard/profile/profile"));
const Tables = lazy(() => import("@/pages/dashboard/users/Tables"));
const ProjectDetails = lazy(() => import("./pages/dashboard/projects/project-details/ProjectDetails"));
const EditFile = lazy(() => import("./pages/dashboard/files/EditFile"));
const FileView = lazy(() => import("./pages/dashboard/files/FileView"));
const AddFile = lazy(() => import("./pages/dashboard/files/AddFile"));
const Bilan = lazy(() => import("./pages/dashboard/files/Bilan"));
const Files = lazy(() => import('./pages/dashboard/files/Files'));
const GrandLivre = lazy(() => import("./pages/dashboard/files/GrandLivre"));
const BudgetManagement = lazy(() => import("./pages/dashboard/budget/BudgetManagement"));
const BudgetVariance = lazy(() => import("./pages/dashboard/budget/BudgetVariance"));
const EvaluationSolvabilite = lazy(() => import("./pages/dashboard/finance/solvabilite"));
const CashFlowPrediction = lazy(() => import("./pages/dashboard/finance/cashFlowPredection"));
const icon = {
  className: "w-5 h-5 text-inherit",
};

const fadeInTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.5 },
};

export const RoutesComponent = () => {
  const { user } = useContext(AuthContext); 

  return [
    {
      layout: "dashboard",
      pages: [
        {
          icon: <HomeIcon {...icon} />,
          name: "Dashboard",
          path: "/home",
          element: (
            <Suspense fallback={<IsLoading />}>
              <motion.div {...fadeInTransition}>
                <Home />
              </motion.div>
            </Suspense>
          ),
        },
        {
          icon: <UserCircleIcon {...icon} />,
          name: "Profile",
          path: "/profile",
          element: (
            <Suspense fallback={<IsLoading />}>
              <motion.div {...fadeInTransition}>
                <Profile />
              </motion.div>
            </Suspense>
          ),
        },
        {
          icon: <ClipboardIcon {...icon} />,
          name: "My Tasks",
          path: "/tasks",
          element: (
            <Suspense fallback={<IsLoading />}>
              <motion.div {...fadeInTransition}>
                <MyTasks />
              </motion.div>
            </Suspense>
          ),
        },
        {
          icon: <ChatBubbleBottomCenterTextIcon {...icon} />,
          name: "conversation",
          path: "/conversation",
          element: (
            <Suspense fallback={<IsLoading />}>
              <motion.div {...fadeInTransition}>
                <Conversation />
              </motion.div>
            </Suspense>
          ),
        },
        user?.role === "admin" && {
          icon: <TableCellsIcon {...icon} />,
          name: "Users",
          path: "",
        },
        {
          icon: <TableCellsIcon {...icon} />,
          name: "List Users",
          path: "/tables",
          parent: "Users",
          element: (
            <Suspense fallback={<IsLoading />}>
              <motion.div {...fadeInTransition}>
                <Tables />
              </motion.div>
            </Suspense>
          ),
        },
        {
          icon: <DocumentTextIcon {...icon} />,
          name: "Add User",
          path: "/add-user",
          parent: "Users",
          element: (
            <Suspense fallback={<IsLoading />}>
              <motion.div {...fadeInTransition}>
                <AddUser />
              </motion.div>
            </Suspense>
          ),
        },
        {
          icon: <FolderIcon {...icon} />,
          name: "Projects",
          path: "",
        },
        {
          icon: <DocumentTextIcon {...icon} />,
          name: "List Projects",
          path: "/projects",
          parent: "Projects",
          element: (
            <Suspense fallback={<IsLoading />}>
              <motion.div {...fadeInTransition}>
                <Projects />
              </motion.div>
            </Suspense>
          ),
        },
        {
          icon: <ClipboardDocumentListIcon {...icon} />,
          name: "Add New Project",
          path: "/add-project",
          parent: "Projects",
          element: (
            <Suspense fallback={<IsLoading />}>
              <motion.div {...fadeInTransition}>
                <AddProject />
              </motion.div>
            </Suspense>
          ),
        },
        {
          icon: <DocumentTextIcon {...icon} />,
          name: "Files",
          path: "/files",
          element: (
            <Suspense fallback={<IsLoading />}>
              <motion.div {...fadeInTransition}>
                <Files />
              </motion.div>
            </Suspense>
          ),
        },
        {
          icon: <ExclamationCircleIcon {...icon} />,
          name: "Claims",
          path: "/claims",
          element: (
            <Suspense fallback={<IsLoading />}>
              <motion.div {...fadeInTransition}>
                <Claims />
              </motion.div>
            </Suspense>
          ),
        } , 
        {
          icon: <ExclamationCircleIcon {...icon} />,
          name: "All Claims",
          path: "/all-claims",
          element: (
            <Suspense fallback={<IsLoading />}>
              <motion.div {...fadeInTransition}>
                <ClaimsList />
              </motion.div>
            </Suspense>
          ),
        }

      ].filter(Boolean), 
    },
  ];
};

export const hiddenRoutes = [
  {
    path: "/project-details/:id",
    element: (
      <Suspense fallback={<IsLoading />}>
        <motion.div {...fadeInTransition}>
          <ProjectDetails />
        </motion.div>
      </Suspense>
    ),
  },
  {
    path: "/files/add",
    element: (
      <Suspense fallback={<IsLoading />}>
        <motion.div {...fadeInTransition}>
          <AddFile />
        </motion.div>
      </Suspense>
    ),
  },
  {
    icon: <ClipboardDocumentListIcon {...icon} />,
    name: "Add New Project",
    path: "/add-project",
    element: (
      <Suspense fallback={<IsLoading />}>
        <motion.div {...fadeInTransition}>
          <AddProject />
        </motion.div>
      </Suspense>
    ),
  },
  {
    path: "/files/edit/:id",
    element: (
      <Suspense fallback={<IsLoading />}>
        <motion.div {...fadeInTransition}>
          <EditFile />
        </motion.div>
      </Suspense>
    ),
  },
  {
    path: "/files/:id",
    element: (
      <Suspense fallback={<IsLoading />}>
        <motion.div {...fadeInTransition}>
          <FileView />
        </motion.div>
      </Suspense>
    ),
  },
  {
    path: "/bilan/:projectId",
    element: (
      <Suspense fallback={<IsLoading />}>
        <motion.div {...fadeInTransition}>
          <Bilan />
        </motion.div>
      </Suspense>
    ),
  },
  {
    path: "/grand-livre/:projectId",
    element: (
      <Suspense fallback={<IsLoading />}>
        <motion.div {...fadeInTransition}>
          <GrandLivre />
        </motion.div>
      </Suspense>
    ),
  },
  {

    path: "/budget/:projectId",
    element: (
      <Suspense fallback={<IsLoading />}>
        <motion.div {...fadeInTransition}>
          <BudgetManagement />
        </motion.div>
      </Suspense>
    ),
  },
  {
    path: "/budget-variance/:projectId/:trimestre/:annee",
    element: (
      <Suspense fallback={<IsLoading />}>
        <motion.div {...fadeInTransition}>
          <BudgetVariance />
</motion.div>
      </Suspense>
)
},
  {

    path: "/finance/:projectId",
    element: (
      <Suspense fallback={<IsLoading />}>
        <motion.div {...fadeInTransition}>
          <EvaluationSolvabilite />
  </motion.div>
      </Suspense>
)
}, 
  {
    path: "/balance-general/:projectId",
    element: (
      <Suspense fallback={<IsLoading />}>
        <motion.div {...fadeInTransition}>
          <Balance />
        </motion.div>
      </Suspense>
    ),
  },
  {
    path: "/cashflow/:projectId",
    element: (
      <Suspense fallback={<IsLoading />}>
        <motion.div {...fadeInTransition}>
          <CashFlowPrediction />
        </motion.div>
      </Suspense>
    ),
  }

];

export default RoutesComponent;