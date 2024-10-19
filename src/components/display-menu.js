const DisplayMenu = ({ suggestedMenu }) => {
  return (
    <div className="display-container">
      <div className="display-img-container">
        <img src={suggestedMenu.image} alt={suggestedMenu.name} />
      </div>
      <div>
        <b>Name: </b>
        {suggestedMenu.name}
      </div>
      <div>
        <b>Cuisine: </b>
        {suggestedMenu.cuisine}
      </div>
      <div>
        <b>Difficulty: </b>
        {suggestedMenu.difficulty}
      </div>
      <div>
        <b>Rating: </b>
        {suggestedMenu.rating}
      </div>
    </div>
  );
};

export default DisplayMenu;
