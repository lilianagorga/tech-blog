import {Fragment} from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, UserIcon, XMarkIcon, HomeIcon } from '@heroicons/react/24/outline'
import { Navigate, NavLink, Outlet } from "react-router-dom";
import {useStateContext} from "../contexts/ContextProvider.jsx";
import axiosClient from "../axios.js";

const navigation = [
  { name: 'Home', to: '/' },
  { name: 'Manage Panel', to: '/manage-panels' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function DefaultLayout() {
  const { currentUser, userToken, setUserToken, setCurrentUser } = useStateContext();


  const hasRequiredRolesOrPermissionsForManagePanel = () => {
    if (!currentUser || !currentUser.roles || !currentUser.permissions) {
      return false;
    }
    const hasRole = currentUser.roles.some(role => role.name === 'Admin');
    const hasPermission = currentUser.permissions.some(permission => permission.name === 'managePanel');
    return hasPermission || hasRole;
  }
  const canAccessPanel = hasRequiredRolesOrPermissionsForManagePanel();

  if (!userToken) {
    return <Navigate to="/user/login" />
  }


  const logout = (ev) => {
    ev.preventDefault();
    axiosClient.post('/logout')
      .then(res => {
        setCurrentUser({ roles: [], permissions: [] });
        setUserToken(null)
      })
  }


  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-gray-800">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-center space-x-4">
                        {navigation.map((item) => (
                          <NavLink
                            key={item.name}
                            to={item.to}
                            className={({ isActive }) => classNames(
                              isActive
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                              'rounded-md px-3 py-2 text-sm font-medium',
                              (!canAccessPanel && item.name === 'Manage Panel') ? 'hidden' : ''
                            )}
                            onClick={(e) => {
                              if ((!canAccessPanel && item.name === 'Manage Panel')) {
                                e.preventDefault();
                              }
                            }}
                          >
                            {item.name === 'Home' ? <HomeIcon className="h-4 w-4" /> : item.name}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6">
                      {/* Profile dropdown */}
                      <Menu as="div" className="relative ml-3">
                        <div>
                          <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                            <span className="absolute -inset-1.5" />
                            <span className="sr-only">Open user menu</span>
                            <UserIcon className="w-8 h-8 bg-black/25 p-2 rounded-full text-white"/>
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <Menu.Item>
                              <a href="#" onClick={(ev) => logout(ev)} className="bg-gray-100 block px-4 py-2 text-sm text-gray-700">Logout</a>
                            </Menu.Item>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                  <div className="-mr-2 flex md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="md:hidden">
                <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                  {navigation.map((item) => (
                    <NavLink
                      key={item.name}
                      as="a"
                      to={item.to}
                      className={({ isActive}) => classNames(
                        isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'block rounded-md px-3 py-2 text-base font-medium',
                        (!canAccessPanel && item.name === 'Manage Panel') ? 'hidden' : ''
                      )}
                      onClick={(e) => {
                        if ((!canAccessPanel && item.name === 'Manage Panel')) {
                          e.preventDefault();
                        }
                      }}
                    >
                      {item.name === 'Home' ? (
                        <div className="flex items-center">
                          <HomeIcon className="h-6 w-6" />
                        </div>
                      ) : (
                        item.name
                      )}
                    </NavLink>
                  ))}
                </div>
                <div className="border-t border-gray-700 pb-3 pt-4">
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0"><UserIcon className="w-8 h-8 bg-black/25 p-2 rounded-full text-white"/></div>
                    <div className="ml-3">
                      <div className="text-base font-medium leading-none text-white">{currentUser.name}</div>
                      <div className="text-sm font-medium leading-none text-gray-400">{currentUser.email}</div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    <Disclosure.Button as="a" href="#" onClick={(ev) => logout(ev)} className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white">Logout</Disclosure.Button>
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <Outlet />
      </div>
    </>
  )
}
