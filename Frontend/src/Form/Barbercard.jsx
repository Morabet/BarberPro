import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Barbercard({ barber }) {
  const [picture, setPicture] = useState(null);

  const handleBarberClick = (barberId) => {
    // Use navigation library or update state to switch to the details page
    console.log(`Clicked on barber with ID: ${barberId}`);
  };

  const fetchImage = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/image/${barber.id}`
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
      setPicture(null); // Set picture to null on error
    }
  };

  useEffect(() => {
    fetchImage();
  }, [barber]);

  return (
    <Link className="text-decoration-none" to={`/barbers/${barber.id}`}>
      <div className="card p-0" onClick={() => handleBarberClick(barber.id)}>
        <img
          src={
            picture
              ? URL.createObjectURL(picture)
              : "src/Image/icons8-user-100.png"
          }
          style={{ width: "100%", height: "300px" }}
          className="card-img-top"
        />
        <div className="card-body d-flex w-100 justify-content-center">
          <h5 className="card-title m-0 ps-4 ">{barber.name}</h5>
        </div>
      </div>
    </Link>
  );
}
