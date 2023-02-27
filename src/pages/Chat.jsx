import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineLogout } from "react-icons/hi";
import axios from "axios";
import { allUsersRoute, host, logoutRoute } from "../../utils/ApiRoutes";
import { ChatContainer } from "../components/ChatContainer";
import { io } from "socket.io-client";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
const Chat = () => {
  const navigate = useNavigate();
  const socket = useRef();

  const [currentUser, setCurrentUser] = useState(undefined);
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);

  const user = JSON.parse(localStorage.getItem("chat-user"));

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  const logout = async () => {
    const id = await JSON.parse(localStorage.getItem("chat-user"))._id;
    const data = await axios.get(`${logoutRoute}/${id}`);
    if (data.status === 200) {
      localStorage.clear();
      navigate("/login");
    }
  };

  useEffect(() => {
    (async () => {
      const data = await axios.get(`${allUsersRoute}/${user._id}`);
      setContacts(data.data);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!localStorage.getItem("chat-user")) {
        navigate("/login");
      } else {
        setCurrentUser(await JSON.parse(localStorage.getItem("chat-user")));
      }
    })();
  }, []);

  const handleChatChange = (index, current) => {
    setCurrentSelected(index);

    setCurrentChat(current);
  };
  return (
    <>
      <div className="bg-gray-700 flex md:h-screen w-screen justify-center items-center">
        <div className="w-11/12 h-4/5">
          <div className="md:grid md:grid-cols-12 h-full">
            {/* CAJA 1  */}
            <div className="mt-10 md:mt-0 col-span-4 relative">
              <div class="w-full p-4 bg-white border-gray-200 rounded-lg md:rounded-l-lg h-full shadow-2xl sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                <div className="mt-6">
                  <h5 class="text-lg mb-4 font-semibold leading-none text-gray-900 dark:text-white">
                    Chats
                  </h5>
                </div>
                <div class="flow-root ">
                  <ul role="list" class="">
                    {contacts &&
                      contacts.map((contact, index) => (
                        <>
                          <li
                            onClick={() => handleChatChange(index, contact)}
                            className={classNames(
                              index === currentSelected
                                ? "bg-cyan-500 text-white hover:bg-cyan-500"
                                : "text-white hover:bg-cyan-700 hover:text-white",
                              "cursor-pointer rounded-xl mt-2 py-3 border-t-2 border-cyan-700 sm:py-4"
                            )}
                            // className="cursor-pointer rounded-xl bg-gray-700 hover:bg-gray-600 mt-2 py-3 sm:py-4"
                          >
                            <div class="flex items-center space-x-4">
                              <div class="pl-4 flex-shrink-0">
                                <img
                                  class="w-10 h-10 rounded-full"
                                  src="https://res.cloudinary.com/dwhhfl68n/image/upload/v1641254915/portafolio/formik_vm3qyc.png"
                                  alt="profile image"
                                />
                              </div>
                              <div class="flex-1 min-w-0">
                                <p class="text-md font-medium text-gray-900 truncate dark:text-white">
                                  {contact.username}
                                </p>
                                {/* <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                    email@windster.com
                  </p> */}
                              </div>
                              {/* <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                  $320
                </div> */}
                            </div>
                          </li>
                        </>
                      ))}
                  </ul>
                </div>
                <div className="bottom-0 right-0 left-0 md:absolute p-4">
                  <div className="h-[1px] bg-gray-500 mt-4 mb-4"></div>
                  <div class="flex items-center justify-between mb-4">
                    <h5 class="text-2xl mb-2 font-bold leading-none text-gray-900 dark:text-white">
                      {user?.username}
                    </h5>
                    <button
                      onClick={() => logout()}
                      class="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
                    >
                      <HiOutlineLogout className="text-3xl" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* CAJA 2  */}
            <div className="mt-10 mb-16 md:mt-0 md:mb-0 relative overflow-hidden h-screen md:h-auto col-span-8 bg-stone-800 rounded-lg md:rounded-r-lg shadow-2xl">
              <ChatContainer currentChat={currentChat} socket={socket} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
