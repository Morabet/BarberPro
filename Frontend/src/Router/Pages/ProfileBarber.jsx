import { useEffect, useState } from "react";
import { useAuth } from "../../AuthContext";
import ProfileInfo from "../../Form/ProfileInfo";
import AddStyle from "../../Form/AddStyle";
import Stylecardprofile from "../../Form/Stylecardprofile";
import TableAppoitBarber from "../../Form/TableAppoitBarber";

export default function ProfileBarber() {
  const [stylesList, setstylesList] = useState([]);

  const { user } = useAuth();

  const updateStylesList = async () => {
    try {
      const api_styles = `http://localhost:5000/api/v1/barbers/${user.id}/styles`;
      const response = await fetch(api_styles);
      if (response.ok) {
        const newStylesList = await response.json();
        setstylesList(newStylesList);
      } else {
        console.error("Network response was not ok");
      }
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const displayStyles = () => {
    if (stylesList.length > 0) {
      return (
        <div className="row ">
          {stylesList.map((style, key) => (
            <div className="col-md-4 col-lg-3 pb-4" key={key}>
              <Stylecardprofile
                style={style}
                updateStylesList={updateStylesList}
              />
            </div>
          ))}
        </div>
      );
    }
    return <h1>NO Style hair</h1>;
  };

  useEffect(() => {
    updateStylesList();
  }, [user]);

  return (
    <div>
      <ProfileInfo />
      <TableAppoitBarber />
      <AddStyle updateStylesList={updateStylesList} />
      <div className="container-fluid">{displayStyles()}</div>
    </div>
  );
}
