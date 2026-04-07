import { useSelector, useDispatch } from "react-redux";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

import { removeItem } from "../store/savedSlice";

function SavedPage() {
  const dispatch = useDispatch();
  const savedItems = useSelector((state) => state.saved.items);

  return (
    <Container>
      <Grid container spacing={2}>
        {savedItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <div>
              <h3>{item.product_name}</h3>
              <Button onClick={() => dispatch(removeItem(item.id))}>
                Remove
              </Button>
            </div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
export default SavedPage;
