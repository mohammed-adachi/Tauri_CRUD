import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import MemberRegistration from "./MemberRegistration";
import Header from "./compoenets/header/index";
import Delete from "./delete";
import "./App.css";
import "./index.css";

import { BrowserRouter, Routes, Route } from 'react-router-dom';
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
 <Header> </Header>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/add_member" element={<MemberRegistration />} />
      <Route path="/delete" element={<Delete />} />
    </Routes>
  </BrowserRouter>
);
