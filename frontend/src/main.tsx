import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { HashRouter, Routes, Route } from "react-router-dom";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <HashRouter basename={"/"}>
  {/* The rest of your app goes here */}
  <Routes>
    <Route path="/" element={<App />}>
      {/* <Route path="about" element={<About />} />
      <Route path="users" element={<Users />} />
      <Route path="*" element={<NoMatch />} /> */}
    </Route>
  </Routes>
</HashRouter>
)
