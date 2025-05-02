import PropTypes from "prop-types";
import { Link, NavLink } from "react-router-dom";
import { XMarkIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { LogOut } from "lucide-react";
import {
  Avatar,
  Button,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import {
  useMaterialTailwindController,
  setOpenSidenav,
} from "@/context";
import { AuthContext } from "../../context/AuthContext.jsx";
import { useContext, useState } from "react";

export function Sidenav({ brandImg, brandName, routes }) {
  const { Logout } = useContext(AuthContext);
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav } = controller;

  const [openDropdown, setOpenDropdown] = useState(null);

  const sidenavTypes = {
    dark: "bg-gradient-to-br from-gray-800 to-gray-900",
    white: "bg-white shadow-sm",
    transparent: "bg-transparent",
  };

  const toggleDropdown = (name) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  return (
    <aside
      className={`${sidenavTypes[sidenavType]} ${
        openSidenav ? "translate-x-0" : "-translate-x-80"
      } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0 border border-blue-gray-100`}
    >
      <div className="relative">
        <Link to="/" className="py-6 px-8 text-center">
          <Typography
            variant="h6"
            color={sidenavType === "dark" ? "white" : "blue-gray"}
          >
            {brandName}
          </Typography>
        </Link>
        <IconButton
          variant="text"
          color="white"
          size="sm"
          ripple={false}
          className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
          onClick={() => setOpenSidenav(dispatch, false)}
        >
          <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-white" />
        </IconButton>
      </div>

      <div className="m-4">
        {(routes || []).map(({ layout, title, pages }, key) => {
          const grouped = {};
          (pages || []).forEach((page) => {
            if (page.parent) {
              if (!grouped[page.parent]) grouped[page.parent] = [];
              grouped[page.parent].push(page);
            }
          });

          return (
            <ul key={key} className="mb-4 flex flex-col gap-1">
              {title && (
                <li className="mx-3.5 mt-4 mb-2">
                  <Typography
                    variant="small"
                    color={sidenavType === "dark" ? "white" : "blue-gray"}
                    className="font-black uppercase opacity-75"
                  >
                    {title}
                  </Typography>
                </li>
              )}

              {(pages || [])
                .filter((page) => !page.parent)
                .map(({ icon, name, path }) => (
                  <li key={name} className="w-full">
                    {grouped[name] ? (
                      <>
                        <button
                          onClick={() => toggleDropdown(name)}
                          className="flex items-center justify-between w-full px-4 py-2 rounded-lg transition text-white"
                        >
                          <span className="flex items-center gap-4">
                            {icon}
                            <Typography
                              color="inherit"
                              className="font-medium capitalize"
                            >
                              {name}
                            </Typography>
                          </span>
                          <ChevronDownIcon
                            className={`h-4 w-4 transition-transform ${
                              openDropdown === name ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {openDropdown === name && (
                          <ul className="pl-6">
                            {grouped[name].map(
                              ({ name: subName, path: subPath, icon: subIcon }) => (
                                <li key={subName}>
                                  <NavLink to={`/${layout}${subPath}`}>
                                    {({ isActive }) => (
                                      <Button
                                        variant="text"
                                        className={`flex items-center gap-4 px-4 py-2 capitalize w-full text-left ${
                                          isActive
                                            ? "bg-green-600 text-white"
                                            : "text-white"
                                        }`}
                                      >
                                        {subIcon && subIcon}
                                        <Typography
                                          color="inherit"
                                          className="font-medium"
                                        >
                                          {subName}
                                        </Typography>
                                      </Button>
                                    )}
                                  </NavLink>
                                </li>
                              )
                            )}
                          </ul>
                        )}
                      </>
                    ) : (
                      <NavLink to={`/${layout}${path}`}>
                        {({ isActive }) => (
                          <Button
                            variant="text"
                            className={`flex items-center gap-4 px-4 capitalize w-full ${
                              isActive
                                ? "bg-green-600 text-white"
                                : "text-white"
                            }`}
                          >
                            {icon}
                            <Typography
                              color="inherit"
                              className="font-medium capitalize"
                            >
                              {name}
                            </Typography>
                          </Button>
                        )}
                      </NavLink>
                    )}
                  </li>
                ))}
            </ul>
          );
        })}
      </div>

      <div
        onClick={() => Logout()}
        className="text-center absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-green-600 w-[70%] m-auto p-4 rounded-xl cursor-pointer hover:bg-green-800 transition duration-300 ease-in-out flex items-center"
      >
        <LogOut />
        <p className="ml-2">Logout</p>
      </div>
    </aside>
  );
}

Sidenav.defaultProps = {
  brandImg: "/img/logo-ct.png",
  brandName: "M7asby",
  routes: [], // ✅ AJOUT : valeur par défaut vide pour éviter les plantages
};

Sidenav.propTypes = {
  brandImg: PropTypes.string,
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
};

Sidenav.displayName = "/src/widgets/layout/sidnave.jsx";

export default Sidenav;
