import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { IoMdSend } from "react-icons/io";
import { recieveMessageRoute, sendMessageRoute } from "../../utils/ApiRoutes";
import axios from "axios";

export const ChatContainer = ({ currentChat, socket }) => {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  console.log(arrivalMessage);
  const user = JSON.parse(localStorage.getItem("chat-user"));

  useEffect(() => {
    (async () => {
      const data = await JSON.parse(localStorage.getItem("chat-user"));
      const response = await axios.post(recieveMessageRoute, {
        from: data._id,
        to: currentChat._id,
      });
      setMessages(response.data);
    })();
  }, [currentChat]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  const formik = useFormik({
    initialValues: {
      sendMessage: "",
    },

    onSubmit: (values, { resetForm }) => {
      console.log(values);
      const msg = values.sendMessage;
      resetForm();
      const data = JSON.parse(localStorage.getItem("chat-user"));
      socket.current.emit("send-msg", {
        to: currentChat._id,
        from: data._id,
        msg,
      });
      (async () => {
        await axios.post(sendMessageRoute, {
          from: data._id,
          to: currentChat._id,
          message: msg,
        });
      })();
      const msgs = [...messages];
      msgs.push({ fromSelf: true, message: msg });
      setMessages(msgs);
    },
  });

  return (
    <>
      {currentChat ? (
        <>
          <div className=" bg-cyan-500 p-4 rounded-lg md:rounded-tr-lg">
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
                  {currentChat?.username}
                </p>
              </div>
            </div>
          </div>
          <div className="h-full mt-2 overflow-auto scrollbar">
            {messages &&
              messages.map((message) =>
                message.fromSelf ? (
                  <div className="grid justify-items-end">
                    <div className="bg-cyan-200 p-2 rounded-xl m-2 w-fit">
                      <p className="font-semibold text-xl">{message.message}</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid justify-items-start">
                    <div className="bg-cyan-300 p-2 rounded-xl m-2 w-fit">
                      <p className="font-semibold text-xl">{message.message}</p>
                    </div>
                  </div>
                )
              )}
            {/* <div className="grid justify-items-start">
              <div className="bg-blue-500 p-2 rounded-xl m-2 w-fit">
                <p className="font-semibold text-xl">dfghfdg</p>
              </div>
            </div>

            <div className="grid justify-items-end">
              <div className="bg-orange-500 p-2 rounded-xl m-2 w-fit">
                <p className="font-semibold text-xl">dfghfdg</p>
              </div>
            </div> */}
            <div className="h-[25px]"></div>
          </div>
          <div className="bottom-0 bg-slate-900 p-2 absolute left-0 right-0">
            <form onSubmit={formik.handleSubmit}>
              <div className="w-full pl-2 flex items-center justify-between">
                <input
                  name="sendMessage"
                  id="sendMessage"
                  onChange={formik.handleChange}
                  value={formik.values.sendMessage}
                  type="text"
                  class="bg-gray-50 w-full m-auto border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Type a message"
                  required
                />
                <div className="p-1 pl-2 pr-2 pt-2">
                  <button type="submit">
                    <IoMdSend className="text-2xl" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </>
      ) : (
        `Welcome, ${user?.username}! Please select a chat to start messaging.`
      )}
    </>
  );
};
