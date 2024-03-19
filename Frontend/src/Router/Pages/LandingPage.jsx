import { Link } from "react-router-dom";
import "../../landingPage.css";

export default function LandingPage() {
  return (
    <div className="container ">
      <h1 className="d-flex justify-content-center heading">
        Welcome to BarberPro
      </h1>
      <div className="mt-4">
        <div
          className="d-flex justify-content-center align-items-center"
          xs={12}
          md={5}
        >
          <img
            src="src/Image/BarberLogo.png"
            alt="BarberPro Logo"
            style={{ height: "300px" }}
          />
        </div>
        <p className="subheading">With BarberPro, you can:</p>
        <div className="d-flex justify-content-center">
          <div className="list-group list-group-light text-start">
            <a
              href="#"
              className="list-group-item list-group-item-action px-3 border-0 rounded-3 mb-1 list-group-item-dark"
            >
              Search for barbers based on location and availability
            </a>
            <a
              href="#"
              className="list-group-item list-group-item-action px-3 border-0 rounded-3 mb-1 list-group-item-light"
            >
              View detailed profiles and reviews of barbers
            </a>
            <a
              href="#"
              className="list-group-item list-group-item-action px-3 border-0 rounded-3 mb-1 list-group-item-dark"
            >
              Book appointments online with just a few clicks
            </a>
            <a
              href="#"
              className="list-group-item list-group-item-action px-3 border-0 rounded-3 mb-1 list-group-item-light"
            >
              Receive reminders for upcoming appointments
            </a>
            <a
              href="#"
              className="list-group-item list-group-item-action px-3 border-0 rounded-3 mb-1 list-group-item-dark"
            >
              Share your feedback and experiences by leaving reviews
            </a>
          </div>
        </div>
        <div className="d-grid gap-2 d-md-flex justify-content-md-end mb-4">
          <Link to="/home" className="btn btn-primary btn-lg">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
