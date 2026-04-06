import FoodCard from "./FoodCard";

function FoodList({ products }) {
  if (products.length === 0) {
    return <p>No results found</p>;
  }
  return (
    <div className="food-list">
      {products.map((product) => (
        <FoodCard key={product.code} product={product} />
      ))}
    </div>
  );
}
export default FoodList;
