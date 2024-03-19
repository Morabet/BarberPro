import React, { useState, useEffect } from "react";
import { Table, Container } from "react-bootstrap";
import { useAuth } from "../AuthContext";

export default function TableAppoitClient() {
  const { user } = useAuth();

  const [appointList, setappointList] = useState([]);
  const [userDetails, setUserDetails] = useState([]);

  const getAppointments = async () => {
    if (user) {
      try {
        const api_appoint = `http://localhost:5000/api/v1/users/${user.id}/appointments`;
        const response = await fetch(api_appoint);
        if (response.ok) {
          const appointmentsWithDetails = await response.json();
          console.log("Appointments with details", appointmentsWithDetails);
          setappointList(appointmentsWithDetails);
          // Fetch user details for each user ID
          const userIds = appointmentsWithDetails.map(
            (appointment) => appointment.barber_id
          );
          await fetchUserDetails(userIds);
        } else {
          console.error("Network response was not ok");
        }
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    }
  };

  const fetchUserDetails = async (userIds) => {
    try {
      const userDetailsPromises = userIds.map(async (userId) => {
        const response = await fetch(
          `http://localhost:5000/api/v1/users/${userId}`
        );
        return response.ok ? response.json() : null;
      });

      const userDetails = await Promise.all(userDetailsPromises);

      setUserDetails(userDetails.filter((userDetail) => userDetail !== null));
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const formatBookingDate = (bookingDate) => {
    return new Date(bookingDate).toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDeleteAppointment = async (appointmentId) => {
    if (user) {
      try {
        const apiDeleteAppointment = `http://localhost:5000/api/v1/users/${user.id}/appointments/${appointmentId}`;
        const response = await fetch(apiDeleteAppointment, {
          method: "DELETE",
        });

        if (response.ok) {
          // If the deletion is successful, update the state or fetch appointments again
          // Example: Refetch appointments
          getAppointments();
          console.log("Appointment deleted successfully!");
        } else {
          const errorData = await response.json(); // Parse JSON response for error details
          console.error("Appointment deletion failed:", errorData);
        }
      } catch (error) {
        console.error("Error deleting appointment:", error);
      }
    }
  };

  useEffect(() => {
    // Simulate API call to fetch data
    getAppointments();
  }, [user]);

  console.log(appointList);

  return (
    <Container>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Barber</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Date</th>
            <th>Action</th> {/* Add this column for the delete button */}
          </tr>
        </thead>
        <tbody>
          {appointList && appointList.length > 0 ? (
            appointList.map((appoint, key) => (
              <tr key={key}>
                {userDetails[key] && (
                  <>
                    <td>{userDetails[key].name}</td>
                    <td>{userDetails[key].email}</td>
                    <td>{userDetails[key].phone}</td>
                    <td>{formatBookingDate(appoint.booking_date)}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteAppointment(appoint.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No appointments available</td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
}
