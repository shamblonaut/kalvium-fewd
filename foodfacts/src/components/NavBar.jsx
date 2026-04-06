import { NavLink } from "react-router-dom";

function NavBar({ savedCount }) {
  return (
    <nav>
      <h2> FoodFacts</h2>
      <NavLink to="/">Search</NavLink>
      <NavLink to="/saved">Saved {savedCount > 0 && `(${savedCount})`}</NavLink>
    </nav>
  );
}

export default NavBar;
