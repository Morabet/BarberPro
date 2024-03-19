import ProfileInfo from "../../Form/ProfileInfo";
import TableAppoitClient from "../../Form/TableAppoitClient";

export default function ProfileClient() {
  return (
    <div>
      <ProfileInfo />
      <h1 className="container d-flex w-100 justify-content-start mt-2 ">
        <span className="badge text-bg-secondary ">My Appointments : </span>{" "}
      </h1>
      <TableAppoitClient />
    </div>
  );
}
