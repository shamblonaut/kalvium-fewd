import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function DetailPage({ saved, dispatch }) {
  const { barcode } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`,
        );
        setProduct(res.data.product);
      } catch {
        console.log("error");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [barcode]);

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>No product found</p>;

  const isSaved = saved.some((p) => p.code === barcode);
  const handleSave = () => {
    if (isSaved) {
      dispatch({ type: "REMOVE", code: barcode });
    } else {
      dispatch({ type: "ADD", product });
    }
  };

  return (
    <div>
      <button onClick={() => navigate(-1)}>Back</button>
      <h2>{product.product_name}</h2>
      <button onClick={handleSave}>{isSaved ? "Remove" : "Save"}</button>
    </div>
  );
}
export default DetailPage;
