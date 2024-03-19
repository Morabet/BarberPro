import React, { useRef, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useAuth } from "../AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export default function AddStyle({ updateStylesList }) {
  const { user } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const styleNameRef = useRef();
  const priceRef = useRef();

  const handleShowModal = () => setShowModal(true);

  const handleCloseModal = () => setShowModal(false);

  const resetFrom = () => {
    styleNameRef.current.value = "";
    priceRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user) {
      const api_create_style = `http://localhost:5000/api/v1/barbers/${user.id}/styles`;
      const styleData = {
        barber_id: user.id,
        style_name: styleNameRef.current.value,
        price: priceRef.current.value,
      };
      try {
        // Make a POST request to your signup API endpoint
        const response = await fetch(api_create_style, {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(styleData),
        });
        if (response.ok) {
          console.log(JSON.stringify(styleData));
          console.log("Create style successful");
          // Update stylesList in parent component
          updateStylesList(); // This function should be passed from the parent component
          resetFrom();
        } else if (response.status === 401) {
          console.error("Name already exists");
          alert("Style Name already exists");
        } else {
          const errorData = await response.json(); // Parse JSON response for error details
          console.error("Create style failed", errorData);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }

    setShowModal(false);
  };

  return (
    <>
      <div className="d-grid gap-2 col-12 col-md-4 mx-auto">
        <button
          className="btn btn-secondary btn-lg m-4"
          onClick={handleShowModal}
        >
          <FontAwesomeIcon icon={faPlus} className="me-3" />
          <span className="me-3">Add Style </span>
        </button>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Syle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <div className="form-floating mb-3">
              <input
                type="text"
                id="style_name"
                placeholder="Enter style name"
                ref={styleNameRef}
                className="form-control mb-3"
              />
              <label>Style Name </label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="number"
                id="price"
                placeholder="Enter price"
                ref={priceRef}
                className="form-control mb-3"
              />
              <label>Price</label>
            </div>
            <Button variant="primary" type="submit">
              Confirm
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
