import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../App.css"; // Add your own CSS file for styling
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();

  const api_log = "http://localhost:5000/api/v1/login";

  const { setUser } = useAuth();

  const emailRef = useRef();
  const passwordRef = useRef();
  const [errors, setErrors] = useState({});

  const validForm = () => {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    let isFromValid = true;

    setErrors([]);

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
    emailRef.current.value = "";
    passwordRef.current.value = "";
  };

  const handleLogin = async (e) => {
    // Perform login logic, for example, making an API request to authenticate the user
    e.preventDefault();
    console.log(errors);
    if (validForm()) {
      const Data = {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      };
      try {
        // Make a POST request to your signup API endpoint
        const response = await fetch(api_log, {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(Data),
        });
        if (response.ok) {
          const userData = await response.json();
          console.log(JSON.stringify(userData));
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
          navigate("/home");
          console.log("Login successful");
          resetFrom();
          // Redirect to login page or any other desired page
        } else if (response.status === 401) {
          alert("Invalid email or password");
        } else {
          // Other error
          const errorData = await response.json();
          console.error("login failed", errorData);
          alert("login failed. Please try again.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An unexpected error occurred. Please try again later.");
      }
    }
  };

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  return (
    <div className="login-page">
      <Container>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col
            md={6}
            className="text-center text-white border border-secondary border-2 rounded p-3"
          >
            <h2 className=" mb-4 ">Login</h2>

            <Form onSubmit={handleLogin}>
              <input
                type="email"
                id="email"
                placeholder={"Enter Email"}
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

              <Button type="submit" className="btn btn-secondary w-50 mb-3">
                Login
              </Button>

              <p className="text-end mb-0">
                Don't have an account ?{" "}
                <Link to="/signup" className="text-light">
                  Sign Up
                </Link>
              </p>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
