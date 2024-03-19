import React, { useState, useEffect } from "react";
import { Table, Container } from "react-bootstrap";
import { useAuth } from "../AuthContext";
import BasicDatePicker from "./DatePicker";

export default function TableAppoitBarber() {
  const { user } = useAuth();

  const [appointList, setappointList] = useState([]);
  const [userDetails, setUserDetails] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date) => {
    // Manually adjust the date
    // const newDate = dayjs(date).add(1, 'day'); // Increment the day by 1 to get the correct date
    setSelectedDate(date);
    console.log(date.toISOString());
  };

  const fetchAppointments = async () => {
    if (user) {
      try {
        // Format the date to include only the date part (YYYY-MM-DD)
        const formattedDate = selectedDate.toISOString().split("T")[0];
        console.log("Formatted Date:", formattedDate);
        const api_appoint = `http://localhost:5000/api/v1/users/${user.id}/appointmentsDate?date=${formattedDate}`;
        const response = await fetch(api_appoint);

        if (response.ok) {
          const newAppointments = await response.json();
          console.log("Appointments with details", newAppointments);
          setappointList(newAppointments);
          const userIds = newAppointments.map(
            (appointment) => appointment.client_id
          );
          console.log(userIds);
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
    const userDetailsPromises = userIds.map(async (userId) => {
      const response = await fetch(
        `http://localhost:5000/api/v1/users/${userId}`
      );
      return response.ok ? response.json() : null;
    });

    const userDetails = await Promise.all(userDetailsPromises);
    setUserDetails(userDetails.filter((userDetail) => userDetail !== null));
  };

  useEffect(() => {
    // Simulate API call to fetch data
    fetchAppointments();
  }, [selectedDate, user]);

  console.log(appointList);

  return (
    <Container>
      <div className="container mb-2 mt-2">
        <div className="d-flex justify-content-between flex-column flex-md-row">
          <h1>
            <span className="badge text-bg-secondary ">My Appointments : </span>
          </h1>
          <BasicDatePicker
            selected={selectedDate}
            onDateChange={handleDateChange}
            // Set defaultDate to today's date
            defaultDate={new Date()}
            className="mt-2 mt-md-0" // Adjust margin-top for spacing
          />
        </div>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Phone</th>
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
                  </>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No appointments available</td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
}
