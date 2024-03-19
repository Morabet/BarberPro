import React, { useCallback, useEffect, useState } from "react";
import { Nav, Navbar } from "react-bootstrap";
import { useAuth } from "../AuthContext";

export default function Header() {
  const { user } = useAuth();
  const [picture, setPicture] = useState(null);

  const fetchImage = async () => {
    if (user) {
      console.log(user.id);
      try {
        const response = await fetch(
          `http://localhost:5000/api/v1/image/${user.id}`
        );
        if (response.ok) {
          const blob = await response.blob();
          setPicture(blob);
        } else {
          console.log(`Failed to fetch image. Status: ${response.status}`);
          setPicture(null);
        }
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    }
  };

  useEffect(() => {
    fetchImage();
  }, [user]);

  return (
    <header>
      <Navbar
        bg="light"
        expand="lg"
        className="px-lg-4 py-lg-2 justify-content-between "
      >
        <nav class="navbar bg-body-tertiary">
          <div class="container-fluid">
            <a class="navbar-brand" href="/home">
              <img
                src="src/Image/BarberLogo.png"
                alt="Logo"
                width="40"
                height="40"
                class="d-inline-block align-text-center"
              />
              BarbarPro
            </a>
          </div>
        </nav>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse
          id="basic-navbar-nav"
          className="d-lg-none flex-grow-0"
        >
          {user ? (
            user.role === "barber" ? (
              <Nav.Link href="/profilbarber">
                <img
                  src={
                    picture
                      ? URL.createObjectURL(picture)
                      : "src/Image/icons8-user-50.png"
                  }
                  className="rounded-circle"
                  alt="userPic"
                  style={{ width: "45px", height: "45px" }}
                />
              </Nav.Link>
            ) : user.role === "client" ? (
              <Nav.Link href="/profilclient">
                <img
                  src={
                    picture
                      ? URL.createObjectURL(picture)
                      : "src/Image/icons8-user-50.png"
                  }
                  className="rounded-circle"
                  alt="userPic"
                  style={{ width: "45px", height: "45px" }}
                />
              </Nav.Link>
            ) : (
              <Nav.Link href="/login">
                <button type="button" className="btn btn-outline-secondary">
                  Login
                </button>
              </Nav.Link>
            )
          ) : (
            <Nav.Link href="/login">
              <button type="button" className="btn btn-outline-secondary">
                Login
              </button>
            </Nav.Link>
          )}
          <Nav>
            <Nav.Link href="#about">About</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
}
