import React, { useCallback, useEffect, useRef, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useAuth } from "../AuthContext";
import LoginPage from "../Router/Pages/Login";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers";

export default function AddReview(props) {
  const navigate = useNavigate();

  const barber_id = props.data;

  const { user } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const reviewRef = useRef();

  const api_create_review = "http://localhost:5000/api/v1/reviews";

  const handleShowModal = (callback) => {
    {
      user ? setShowModal(true) : callback();
    }
  };

  const handleCloseModal = () => setShowModal(false);

  const resetFrom = () => {
    reviewRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user) {
      const reviewData = {
        barber_id: barber_id,
        client_id: user.id,
        name: user.name,
        email: user.email,
        comment: reviewRef.current.value,
      };
      try {
        // Make a POST request to your signup API endpoint
        const response = await fetch(api_create_review, {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(reviewData),
        });
        if (response.ok) {
          console.log(JSON.stringify(reviewData));
          console.log("Create review successful");

          props.updateReviewsList();
          resetFrom();
        } else {
          const errorData = await response.json(); // Parse JSON response for error details
          console.error("Create review failed", errorData);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }

    setShowModal(false);
  };

  return (
    <>
      {user && user.role === "barber" ? (
        <Button
          className="btn btn-primary btn-lg"
          onClick={() => {
            handleShowModal(() => {
              navigate("/login");
            });
          }}
          disabled
        >
          Add Review
        </Button>
      ) : (
        <Button
          className="btn btn-primary btn-lg"
          onClick={() => {
            handleShowModal(() => {
              navigate("/login");
            });
          }}
        >
          Add Review
        </Button>
      )}

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {user && (
              <div>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    id="name"
                    value={user.name}
                    className="form-control mb-3"
                    disabled
                  />
                  <label>Name </label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    id="email"
                    value={user.email}
                    className="form-control mb-3"
                    disabled
                  />
                  <label>Email address</label>
                </div>
              </div>
            )}
            <div className="form-floating">
              <textarea
                className="form-control mb-3"
                style={{ height: "100px" }}
                placeholder="Leave a comment here"
                id="comment"
                ref={reviewRef}
              ></textarea>
              <label>Comments</label>
            </div>
            <Button variant="primary" type="submit">
              Submit Review
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
