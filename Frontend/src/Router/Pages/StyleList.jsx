import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Stylecard from "../../Form/Stylecardbook";
import Reviewcard from "../../Form/Reviewcard";
import AddReview from "../../Form/AddReview";
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardSubTitle,
  MDBCardText,
  MDBCardLink,
  MDBRow,
  MDBCol,
} from "mdb-react-ui-kit";
import { useAuth } from "../../AuthContext";
import Stylecardbook from "../../Form/Stylecardbook";
import { Table } from "react-bootstrap";

export default function StyleList() {
  const { barber_id } = useParams();
  const { user } = useAuth();

  const [stylesList, setstylesList] = useState([]);
  const [reviewsList, setreviewsList] = useState([]);

  const api_styles = `http://localhost:5000/api/v1/barbers/${barber_id}/styles`;
  const api_reviews = `http://localhost:5000/api/v1/barbers/${barber_id}/reviews`;

  const getStyles = () => {
    fetch(api_styles)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        console.error("Network response was not ok");
        // return Promise.reject('Products fetch failed')
      })
      .then((response) => setstylesList(response))
      .catch((error) => console.log("Error fetching data:", error));
  };

  const displayStyles = () => {
    if (stylesList.length > 0) {
      return (
        <div className="row ">
          {stylesList.map((style, key) => (
            <div className="col-md-4 col-lg-3 pb-4" key={key}>
              <Stylecardbook style={style} barber_id={barber_id} />
            </div>
          ))}
        </div>
      );
    }
    return <h1>NO Style hair</h1>;
  };

  const updateReviewsList = async () => {
    try {
      const response = await fetch(api_reviews);
      if (response.ok) {
        const newReviewsList = await response.json();
        setreviewsList(newReviewsList);
      } else {
        console.error("Network response was not ok");
      }
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const displayReviews = () => {
    if (reviewsList.length > 0) {
      return (
        <div className="row ">
          {reviewsList.map((review, key) => (
            <div className=" col-lg-6 pb-4" key={key}>
              <Reviewcard review={review} />
            </div>
          ))}
        </div>
      );
    }
    return <h1>NO REVIEWS</h1>;
  };
  useEffect(() => {
    // Simulate API call to fetch data
    getStyles();
    updateReviewsList();
  }, [user]);

  return (
    <div className="container-fluid">
      <div className="container">
        <h1 className="">Styles</h1>
        {displayStyles()}
      </div>
      <h1>Location </h1>
      <div className="map-section">
        <div className="gmap-frame">
          <iframe
            width="100%"
            height="400"
            frameborder="0"
            scrolling="no"
            marginheight="0"
            marginwidth="0"
            src="https://maps.google.com/maps?width=100%25&amp;height=400&amp;hl=en&amp;q=Saniat%20Rmel%20Statium+(tetouan)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
          >
            <a href="https://www.gps.ie/">gps vehicle tracker</a>
          </iframe>
        </div>
      </div>
      <div className="container_fluid">
        <div className="row justify-content-between">
          <div className="col-auto">
            <h1>Reviews</h1>
          </div>
          <div className="col-auto">
            <AddReview data={barber_id} updateReviewsList={updateReviewsList} />
          </div>
        </div>
      </div>
      {displayReviews()}
      <MDBRow className="justify-content-center mb-3">
        <MDBCol md="5">
          <MDBCard>
            <MDBCardBody>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Opening Hours</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Monday 8:30 - 6:30</td>
                  </tr>
                </tbody>
                <tbody>
                  <tr>
                    <td>Tuesday 8:30 - 7</td>
                  </tr>
                </tbody>
                <tbody>
                  <tr>
                    <td>Wednesday 8:30 - 7</td>
                  </tr>
                </tbody>
                <tbody>
                  <tr>
                    <td>Thursday 8:30 - 8</td>
                  </tr>
                </tbody>
                <tbody>
                  <tr>
                    <td>Friday 8:30 - 6</td>
                  </tr>
                </tbody>
                <tbody>
                  <tr>
                    <td>Saturday 8:30 - 3:30</td>
                  </tr>
                </tbody>
                <tbody>
                  <tr>
                    <td>Closed Sunday</td>
                  </tr>
                </tbody>
              </Table>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </div>
  );
}
