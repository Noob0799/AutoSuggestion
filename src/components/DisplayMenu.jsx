const DisplayMenu = ({ recipe }) => (
  <div className="display-container">
    <div className="display-img-container">
      <img src={recipe.image} alt={recipe.name} />
    </div>
    <div>
      <b>Name: </b>
      {recipe.name}
    </div>
    <div>
      <b>Cuisine: </b>
      {recipe.cuisine}
    </div>
    <div>
      <b>Difficulty: </b>
      {recipe.difficulty}
    </div>
    <div>
      <b>Rating: </b>
      {recipe.rating}
    </div>
  </div>
);

export default DisplayMenu;
