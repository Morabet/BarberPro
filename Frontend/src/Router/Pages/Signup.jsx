import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../App.css"; // Add your own CSS file for styling
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";

export default function Signup() {
  const navigate = useNavigate();

  const { setUser } = useAuth();

  const usernameRef = useRef();
  const phoneRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const roleRef = useRef();
  const addressRef = useRef();
  const [errors, setErrors] = useState({});

  const api_sign = "http://localhost:5000/api/v1/signup";

  const [selectedRole, setSelectedRole] = useState("client");

  const handleCheckboxChange = (event) => {
    const newValue = event.target.checked ? "barber" : "client";
    setSelectedRole(newValue);
  };

  const validForm = () => {
    const name = usernameRef.current.value;
    const phone = phoneRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    let isFromValid = true;

    setErrors([]);

    if (name.trim() === "") {
      setErrors((prevState) => {
        return {
          ...prevState,
          ...{ name: "name required" },
        };
      });
      isFromValid = false;
    }
    if (phone.trim() === "") {
      setErrors((prevState) => {
        return {
          ...prevState,
          ...{ phone: "phone required" },
        };
      });
      isFromValid = false;
    }
    if (email.trim() === "") {
      setErrors((prevState) => {
        return {
          ...prevState,
          ...{ email: "email required" },
        };
      });
      isFromValid = false;
    }
    if (password.trim() === "") {
      setErrors((prevState) => {
        return {
          ...prevState,
          ...{ password: "password required" },
        };
      });
      isFromValid = false;
    }
    return isFromValid;
  };

  const getError = (fieldName) => {
    return errors[fieldName];
  };

  const hasError = (fieldName) => {
    return getError(fieldName) !== undefined;
  };

  const displayError = (fieldName) => {
    const field = document.querySelector(`#${fieldName}`);
    if (hasError(fieldName)) {
      field.style.border = "red 2px solid";
      return (
        <div className="text-start text-white mb-2">{getError(fieldName)}</div>
      );
    }
    if (field !== null) {
      field.removeAttribute("style");
    }
  };

  const resetFrom = () => {
    usernameRef.current.value = "";
    phoneRef.current.value = "";
    emailRef.current.value = "";
    passwordRef.current.value = "";
    setSelectedRole("client");
    if (selectedRole === "barber") {
      addressRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validForm()) {
      let Data = {
        name: usernameRef.current.value,
        phone: phoneRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value,
        role: selectedRole,
      };
      if (selectedRole === "barber") {
        Data = {
          ...Data,
          location: addressRef.current.value,
        };
      }
      try {
        // Make a POST request to your signup API endpoint
        const response = await fetch(api_sign, {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(Data),
        });

        if (response.ok) {
          const userData = await response.json();
          console.log(JSON.stringify(Data));

          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
          navigate("/home");
          console.log("Signup successful");
          resetFrom();
          // Redirect to login page or any other desired page
        } else if (response.status === 400) {
          // Email conflict - Duplicate email
          alert("Email already in used");
        } else {
          // Other error
          const errorData = await response.json();
          console.error("Signup failed", errorData);
          alert("Signup failed. Please try again.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An unexpected error occurred. Please try again later.");
      }
    }
  };

  useEffect(() => {
    usernameRef.current.focus();
  }, []);

  return (
    <div className="login-page">
      <Container>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col
            md={6}
            className="text-center text-white border border-secondary border-2 rounded p-3"
          >
            <h2 className=" mb-4 ">Sign Up</h2>
            <Form onSubmit={handleSubmit}>
              <input
                type="text"
                id="name"
                placeholder="Enter Name"
                className="form-control mb-3"
                ref={usernameRef}
              />
              {displayError("name")}

              <input
                type="phone"
                id="phone"
                placeholder="Enter Phone"
                className="form-control mb-3"
                ref={phoneRef}
              />
              {displayError("phone")}

              <input
                type="email"
                id="email"
                placeholder="Enter email"
                className="form-control mb-3"
                ref={emailRef}
              />
              {displayError("email")}

              <input
                type="password"
                id="password"
                placeholder="Enter Password"
                className="form-control mb-3"
                ref={passwordRef}
              />
              {displayError("password")}

              <div className="form-check mb-3">
                <div className="d-flex">
                  <input
                    className="form-check-input me-2"
                    checked={selectedRole === "barber"}
                    onChange={handleCheckboxChange}
                    type="checkbox"
                    id="acceptAllConditions"
                    ref={roleRef}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="acceptAllConditions"
                  >
                    Are you barber ?
                  </label>
                </div>
              </div>
              {selectedRole === "barber" && (
                <input
                  type="text"
                  id="address"
                  placeholder="Enter your address"
                  className="form-control mb-3"
                  ref={addressRef}
                />
              )}
              <Button type="submit" className="btn btn-secondary w-50 mb-3">
                Sign Up
              </Button>
              <p className="text-end mb-0">
                Don't have an account ?{" "}
                <Link to="/login" className="text-light">
                  Login
                </Link>
              </p>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
