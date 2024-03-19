import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import BasicDateCalendar from "./DateCalendar";

export default function AddAppoint(props) {
  const navigate = useNavigate();

  const barber_id = props.data;
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const api_create_appointment = "http://localhost:5000/api/v1/appointments";

  const handleShowModal = (callback) => {
    {
      user ? setShowModal(true) : callback();
    }
  };

  const handleCloseModal = () => setShowModal(false);

  const handleDateChange = (date) => {
    // Manually adjust the date
    // const newDate = dayjs(date).add(1, 'day'); // Increment the day by 1 to get the correct date
    setSelectedDate(date);
    console.log(date.toISOString());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedDate) {
      if (user) {
        const bookData = {
          barber_id: barber_id,
          client_id: user.id,
          booking_date: selectedDate.toISOString(),
        };
        try {
          // Make a POST request to your signup API endpoint
          const response = await fetch(api_create_appointment, {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(bookData),
          });
          if (response.ok) {
            console.log(JSON.stringify(bookData));
            console.log("Create Appoint successful");
            setSuccessMessage("Successfully Booked");
            setTimeout(() => {
              setSuccessMessage("");
            }, 500);
          } else {
            const errorData = await response.json(); // Parse JSON response for error details
            console.error("Create Appoint failed", errorData);
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }
      setTimeout(() => {
        setShowModal(false);
      }, 500);
    } else {
      alert("Please select a day for the appointment");
    }
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
          Book Now
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
          Book Now
        </Button>
      )}

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Book</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {user && (
              <BasicDateCalendar
                selectedDate={selectedDate}
                onDateChange={handleDateChange}
              />
            )}
            <Button variant="primary" type="submit">
              Submit Book
            </Button>
            {successMessage && (
              <div className="alert alert-success mt-2" role="alert">
                {successMessage}
              </div>
            )}
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
