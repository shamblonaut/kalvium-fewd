import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { useNavigate } from "react-router-dom";

function FoodCard({ product }) {
  const navigate = useNavigate();
  return (
    <Card>
      <CardActionArea
        onClick={() =>
          navigate(`/product/${product.id}`, { state: { product } })
        }
      >
        <CardContent>
          <Typography variant="h6">{product.product_name}</Typography>
          <Typography>{product.brands}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
export default FoodCard;
