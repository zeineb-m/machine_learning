import { Routes, Route } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import {
  Sidenav,
  DashboardNavbar,
  Configurator,
  Footer,
} from "@/widgets/layout";
import { Suspense, useContext } from "react";
import { motion } from "framer-motion";
import { useMaterialTailwindController, setOpenConfigurator } from "@/context";
import { AuthContext } from "@/context/AuthContext";
import IsLoading from "@/configs/isLoading";
import RoutesComponent, { hiddenRoutes } from "@/routes";

export function Dashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;
  const { user } = useContext(AuthContext);

  // Animation transition settings
  const fadeInTransition = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      <Sidenav
        routes={RoutesComponent()}  
        brandImg={
          sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
        }
      />
      <div className="p-4 xl:ml-80">
        <DashboardNavbar />
        <Configurator />
        <IconButton
          size="lg"
          color="white"
          className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
          ripple={false}
          onClick={() => setOpenConfigurator(dispatch, true)}
        >
          <Cog6ToothIcon className="h-5 w-5" />
        </IconButton>
        <Suspense fallback={<IsLoading />}>
          <Routes>
            {RoutesComponent().map(
              ({ layout, pages }) =>
                layout === "dashboard" &&
                pages.map(({ path, element }) => (
                  <Route
                    key={path}
                    path={path}
                    element={<motion.div {...fadeInTransition}>{element}</motion.div>}
                  />
                ))
            )}

            {hiddenRoutes.map(({ path, element }) => (
              <Route
                key={path}
                path={path}
                element={<motion.div {...fadeInTransition}>{element}</motion.div>}
              />
            ))}
          </Routes>
        </Suspense>
        <div className="text-blue-gray-600">
          <Footer />
        </div>
      </div>
    </div>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
