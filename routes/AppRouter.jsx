import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChatContainer } from "../src/components/ChatContainer";
import Chat from "../src/pages/Chat";

import Login from "../src/pages/Login";
import Register from "../src/pages/Register";

const AppRouter = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<Chat />}> */}
          {/* outlet  */}
          {/* <Route path="/chat-messages" element={<ChatContainer />} /> */}
          {/* </Route> */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Chat />} />
          <Route path="/chat-messages" element={<ChatContainer />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default AppRouter;
