import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import { addItem, removeItem } from "../store/savedSlice";

function DetailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const savedItems = useSelector((state) => state.saved.items);

  const product = location.state?.product;
  if (!product) return <div>No product</div>;

  const isSaved = savedItems.some((p) => p.id === product.id);

  const handleClick = () => {
    if (isSaved) {
      dispatch(removeItem(product.id));
    } else {
      dispatch(addItem(product));
    }
  };

  return (
    <Container>
      <Typography variant="h5">{product.product_name}</Typography>
      <Typography>{product.brands}</Typography>
      <Button variant="contained" onClick={handleClick}>
        {isSaved ? "Remove" : "Save"}
      </Button>
      <Button onClick={() => navigate(-1)}>Back</Button>
    </Container>
  );
}
export default DetailPage;
