import { useNavigate } from "react-router-dom";

function SavedPage({ saved, dispatch }) {
  const navigate = useNavigate();

  if (saved.length === 0) {
    return <p>No saved items</p>;
  }

  return (
    <div>
      <h2>Saved Items</h2>
      {saved.map((item) => (
        <div key={item.code}>
          <h3>{item.product_name}</h3>
          <button onClick={() => navigate(`/product/${item.code}`)}>
            View
          </button>
          <button onClick={() => dispatch({ type: "REMOVE", code: item.code })}>
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

export default SavedPage;
