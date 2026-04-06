import "./index.css";

import { useState } from "react";

import SearchBar from "./components/SearchBar";
import FoodList from "./components/FoodList";

function App() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const handleSearch = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const url = `https://world.openfoodfacts.org/api/v2/search?categories_tags=${encodeURIComponent(query)}&page_size=10`;
      const response = await fetch(url, { mode: "cors" });

      const data = await response.json();
      console.log("DATA:", data);
      const products = data.products || [];
      const filtered = products.filter(
        (p) => p.product_name && p.product_name.trim() !== "",
      );
      setResults(filtered);
    } catch (err) {
      console.error("ERROR:", err);
      setError("Unable to fetch food data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <h1> FoodFacts</h1>
      <SearchBar onSearch={handleSearch} />
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">Encountered an error: {error}</p>
      ) : results.length === 0 ? (
        <p>Search for a food to begin</p>
      ) : (
        <FoodList products={results} />
      )}
    </div>
  );
}
export default App;
