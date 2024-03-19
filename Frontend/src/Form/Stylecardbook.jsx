import AddAppoint from "./AddAppoint";

export default function Stylecardbook({ style, barber_id }) {
  return (
    <div className="card p-0">
      <div className="d-grid gap-2 d-md-block pt-2">
        <h5 className="card-title m-0 ps-4">{style.style_name}</h5>
        <p className="card-text ps-4">Price : {style.price} $</p>
        <div className="d-flex w-100 justify-content-center ">
          <AddAppoint data={barber_id} />
        </div>
      </div>
    </div>
  );
}
