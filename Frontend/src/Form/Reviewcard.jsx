import { MDBCard, MDBCardBody, MDBCardText } from "mdb-react-ui-kit";

export default function Reviewcard({ review }) {
  return (
    <MDBCard>
      <MDBCardBody>
        <div className="d-flex align-items-center">
          <img
            src="https://mdbootstrap.com/img/new/avatars/8.jpg"
            alt=""
            style={{ width: "60px", height: "60px" }}
            className="rounded-circle"
          />
          <div className="ms-4">
            <p className="fw-bold mb-1">{review.name}</p>
            <p className="text-muted mb-0">{review.email}</p>
          </div>
        </div>
        <MDBCardText> {review.comment} </MDBCardText>
      </MDBCardBody>
    </MDBCard>
  );
}
