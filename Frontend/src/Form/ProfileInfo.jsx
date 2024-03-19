import { useEffect, useRef, useState } from "react";
import { useAuth } from "../AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { MDBFile } from "mdb-react-ui-kit";

export default function ProfileInfo() {
  const { user, setUser, logout } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [location, setLocation] = useState(user?.location || "");
  const [successMessage, setSuccessMessage] = useState("");

  const [picture, setPicture] = useState(null);

  const postImage = (image_api, imageName, image) => {
    console.log(image);
    // Check if image is valid
    if (!image) {
      console.error("Invalid image data");
      return;
    }

    // Create a new file object with the modified name
    const newImage = new File([image], imageName, { type: image.type });

    const formData = new FormData();
    formData.append("image", newImage);

    fetch(image_api, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success image storage:", data);
      })
      .catch((error) => {
        console.error("Error sending POST request:", error);
      });
  };

  const putData = async () => {
    if (user) {
      const api_put_user = `http://localhost:5000/api/v1/users/${user.id}`;
      const api_post_image = `http://localhost:5000/api/v1/users_pictures/${user.id}`;

      const Data = {
        name: name,
        email: email,
        phone: phone,
        location: location,
      };
      try {
        const response = await fetch(api_put_user, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(Data),
        });
        if (response.ok) {
          const userData = await response.json();
          console.log(JSON.stringify(userData));
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
          postImage(api_post_image, `user_${user.id}_pic`, picture);
          setSuccessMessage("Profile updated successfully");
          setTimeout(() => {
            setSuccessMessage("");
          }, 3000);
        } else {
          // Other error
          const errorData = await response.json();
          console.error("Error sending Put request:", errorData);
          alert("put requesr failed. Please try again.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An unexpected error occurred. Please try again later.");
      }
    }
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (event) {
      setPicture(file);
      console.log("PICTURE", picture);
    };
    reader.readAsDataURL(file);
  };

  const fetchImage = async () => {
    console.log("XXXXXX", user);
    if (user) {
      console.log(user.id);
      try {
        const response = await fetch(
          `http://localhost:5000/api/v1/image/${user.id}`
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
      }
    } else {
      console.log("ZZZZZZ");
    }
  };

  useEffect(() => {
    // Simulate API call to fetch data

    fetchImage();

    setName(user?.name);
    setEmail(user?.email);
    setPhone(user?.phone);
    setLocation(user?.location);
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    putData();
  };

  const handleLogout = () => {
    // Remove user data from local storage
    logout();
  };

  return (
    <div className="card ">
      <div className="row p-3">
        {successMessage && (
          <div className="alert alert-success mt-2" role="alert">
            {successMessage}
          </div>
        )}
        {user && (
          <div className="col-md-8">
            <div>
              <div className="row pt-2 pb-2">
                <div className="col-lg-5 form-floating   ">
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-control "
                  />
                  <label>Name </label>
                </div>
                <div className="col-lg-7 form-floating   ">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control "
                  />
                  <label>Enter Email</label>
                </div>
              </div>
            </div>
            <div>
              <div className="row pb-2">
                <div className="col-lg-5 form-floating   ">
                  <input
                    type="phone"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-control "
                  />
                  <label>Phone </label>
                </div>
                <div className="col-lg-7 form-floating  ">
                  <input
                    type="text"
                    id="address"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="form-control "
                  />
                  <label>Enter address</label>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="col-md-4 ">
          <div className="d-flex flex-column mb-3">
            <div className="d-flex flex-row-reverse">
              <Link to="/home">
                <button className="btn btn-secondary" onClick={handleLogout}>
                  Logout
                </button>
              </Link>
            </div>

            <img
              src={
                picture
                  ? URL.createObjectURL(picture)
                  : "src/Image/icons8-user-50.png"
              }
              style={{ width: "60px", height: "60px" }}
              className="rounded-circle"
              alt="Profile"
            />
            <MDBFile
              size="sm"
              id="formFileLg"
              accept="image/*"
              onChange={handleImageSelect}
              style={{ marginBottom: 10 }}
            />
          </div>

          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <button className="btn btn-secondary" onClick={handleSubmit}>
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
