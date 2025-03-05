import React, { Fragment } from "react";
import { Avatar, Box } from "@mui/material";
import { Menu, Transition } from "@headlessui/react";
import { LogOut } from "lucide-react";
import {useMeQuery} from "@/services/api";
import {ImProfile} from "react-icons/im";
import {redirect} from "next/navigation";

interface userName{
    username: string
}

const Authenticated = () => {
     const {data} =  useMeQuery()

    // @ts-ignore
    const userName: string = data?.username;
    const initials = userName?.split(" ").map((name) => name[0]).join("");

    return (
        <Box className="sticky top-0 z-50">
            <Menu as="div" className="relative inline-block text-left">
                <Menu.Button>
                    <Avatar alt="User Avatar" sx={{ width: 50, height: 50 }}>
                        {initials}
                    </Avatar>
                </Menu.Button>

                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="absolute right-0 w-36 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="px-1 py-1">
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        className={`${
                                            active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                                        } group flex rounded-md items-center w-full px-2 py-1 text-sm`}
                                        onClick={() =>redirect('/profile')}
                                    >
                                        <ImProfile className='size-5 mr-2 mb-1'/>
                                        Profile
                                    </button>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        className={`${
                                            active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                                        } group flex rounded-md items-center w-full px-2 py-1 text-sm`}
                                        onClick={() => console.log("Hit")}
                                    >
                                        <LogOut className="w-5 h-5 mr-2" aria-hidden="true" />
                                        Sign out
                                    </button>
                                )}
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </Box>
    );
};

export default Authenticated;
