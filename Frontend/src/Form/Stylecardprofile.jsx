export default function Stylecardprofile({ style, updateStylesList }) {
  const api_detele_style = `http://localhost:5000/api/v1/styles/${style.id}`;

  const handleSubmitDelete = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(api_detele_style, {
        method: "DELETE",
      });
      if (response.ok) {
        console.log("Delete style successful");
        updateStylesList();
      } else {
        const errorData = await response.json(); // Parse JSON response for error details
        console.error("Delete style failed", errorData);
      }
    } catch (error) {}
  };

  return (
    <div className="card p-0">
      <div className="d-grid gap-2 d-md-block pt-2">
        <h5 className="card-title m-0 ps-4">{style.style_name}</h5>
        <p className="card-text ps-4">Price : {style.price} $</p>
        <div className="d-flex w-100 justify-content-center ">
          <a onClick={handleSubmitDelete} className="btn btn-danger ">
            Delete
          </a>
        </div>
      </div>
    </div>
  );
}
