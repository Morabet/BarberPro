import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
// import './index.css'
import BarbersList from "./Router/Pages/BarbersList.jsx";
import Header from "./Form/Header.jsx";
import StyleList from "./Router/Pages/StyleList.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./Form/Footer.jsx";
import Login from "./Router/Pages/Login.jsx";
import Signup from "./Router/Pages/Signup.jsx";
import { AuthProvider } from "./AuthContext";
import ProfileBarber from "./Router/Pages/ProfileBarber.jsx";
import ProfileClient from "./Router/Pages/ProfileClient.jsx";
import LandingPage from "./Router/Pages/LandingPage.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <div className="flex-grow-1 ">
          <Router>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/home" element={<BarbersList />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profilclient" element={<ProfileClient />} />
              <Route path="/profilbarber" element={<ProfileBarber />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/barbers/:barber_id" element={<StyleList />} />
            </Routes>
          </Router>
        </div>
        <Footer />
      </div>
    </AuthProvider>
  </React.StrictMode>
);
