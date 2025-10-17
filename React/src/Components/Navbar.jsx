import React, { useState, useEffect } from "react";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import {
  Bars3Icon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.jpg";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function NavBar() {
  const location = useLocation();

  const [userInfo, setUserInfo] = useState(() => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  });

  // Función para actualizar userInfo desde localStorage
  const actualizarUserInfo = () => {
    const user = localStorage.getItem("user");
    setUserInfo(user ? JSON.parse(user) : null);
  };

  useEffect(() => {
    // Escuchar el evento storage para detectar cambios en otras pestañas
    window.addEventListener("storage", actualizarUserInfo);

    return () => {
      window.removeEventListener("storage", actualizarUserInfo);
    };
  }, []);

  // Además, puedes actualizar userInfo cuando el componente se monta,
  // pero ya lo hicimos con useState inicial

const rol = userInfo?.rol;

let navigation = [];

if (rol === "admin" || userInfo?.es_admin) {
  navigation = [
    { name: "Monitoreo", to: "/Monitor" },
    { name: "Productos", to: "/ProductosAdmin" },
    { name: "Pedidos", to: "/Pedidos" },
    { name: "RegistrarGranja", to: "/RegistrarGranja" },
    { name: "Reporte", to: "/Reporte" },
    //{ name: "Stock", to: "/Stock" },
    //{ name: "Editar Precios", to: "/Precios" },
    { name: "Informacion", to: "/Informacion" },
  ];
} else if (rol === "propietario") {
  navigation = [
    { name: "Monitoreo", to: "/Monitor" },
    { name: "Reporte", to: "/Reporte" },
  ];
} else {
  // usuario normal
  navigation = [
    { name: "Productos", to: "/Productos" },
    { name: "Informacion", to: "/Informacion" },
  ];
}

  return (
    <Disclosure as="nav" className="bg-[#16a085]">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="block size-6 group-data-open:hidden"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden size-6 group-data-open:block"
              />
            </DisclosureButton>
          </div>

          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <img
                alt="Your Company"
                src={logo}
                className="h-11 w-auto rounded-lg"
              />
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => {
                  const active = location.pathname === item.to;
                  return (
                    <Link
                      key={item.name}
                      to={item.to}
                      className={classNames(
                        active
                          ? "bg-[#117a65] text-white"
                          : "text-white hover:bg-[#117a65]",
                        "rounded-md px-3 py-2 text-lg font-bold"
                      )}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {rol === "cliente" && userInfo && (
              <Link
                to="/carrito"
                className="relative mr-4 hover:scale-110 transition-transform duration-200"
              >
                <ShoppingCartIcon className="size-7 text-white" />
              </Link>
            )}
            <Menu as="div" className="relative ml-3">
              <div>
                <MenuButton className="relative flex rounded-full bg-[#117a65] size-8 hover:scale-110 transition-transform duration-200">
                  <span className="sr-only">Open user menu</span>
                  <UserIcon aria-hidden="true" className="size-8" color="white" />
                </MenuButton>
              </div>
              <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5">
                <MenuItem>
                  <Link
                    to="/perfil"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Your Profile
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link
                    to="/configuracion"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Settings
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link
                    to="/logout"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </Link>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => {
            const active = location.pathname === item.to;
            return (
              <DisclosureButton
                key={item.name}
                as={Link}
                to={item.to}
                className={classNames(
                  active
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white",
                  "block rounded-md px-3 py-2 text-base font-medium"
                )}
              >
                {item.name}
              </DisclosureButton>
            );
          })}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
