import { useEffect, useState } from "react";
import Barbercard from "../../Form/Barbercard";
import Header from "../../Form/Header";
import { useAuth } from "../../AuthContext";

export default function BarbersList() {
  const { user } = useAuth();
  console.log(user);

  const [barbersList, setbarbersList] = useState([]);

  const API_URL = "http://localhost:5000/api/v1/barbers";

  const getBarbers = () => {
    fetch(API_URL)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        console.error("Network response was not ok");
        // return Promise.reject('Products fetch failed')
      })
      .then((response) => setbarbersList(response))
      .catch((error) => console.log("Error fetching data:", error));
  };

  const displayBarbers = () => {
    if (barbersList.length > 0) {
      return (
        <div className="row">
          {barbersList.map((barber, key) => (
            <div className="col-md-6 col-lg-3 pb-4" key={key}>
              <Barbercard barber={barber} />
            </div>
          ))}
        </div>
      );
    }
    return null; // Return null or some other content when the list is empty
  };

  useEffect(() => {
    // Simulate API call to fetch data
    getBarbers();
  }, []);

  return (
    <div className="container-fluid">
      <div className="card text-bg-dark  ">
        <img
          src="src/Image/barberback2.png"
          style={{ height: "350px" }}
          className="card-img"
          alt="..."
        />

        <div className="card-img-overlay  d-flex flex-column align-items-start">
          <h2 className="card-title pt-4 ps-4">Description</h2>
          <p className="card-text ps-4">
            BarberPro is your go-to platform for scheduling barber appointments
            with the finest barbershops in your city. select your preferred
            barber, and reserve your appointment with ease.Say goodbye to
            waiting and hello to a well-organized grooming schedule tailored
            just for you.
          </p>
        </div>
      </div>
      <h1 className="d-flex w-100 justify-content-center mt-2 ">
        <span className="badge text-bg-secondary ">Choose Your Stylists </span>{" "}
      </h1>
      {displayBarbers()}
    </div>
  );
}
