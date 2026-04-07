import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";

import SearchBar from "../components/SearchBar";
import FoodCard from "../components/FoodCard";
import useFoodSearch from "../hooks/useFoodSearch";

function HomePage() {
  const { results, loading, searchFood } = useFoodSearch();

  return (
    <Container>
      <SearchBar onSearch={searchFood} />
      {loading && <CircularProgress />}
      <Grid container spacing={2}>
        {results.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <FoodCard product={item} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
export default HomePage;
