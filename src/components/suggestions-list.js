const SuggestionsList = ({
  autoSuggestions,
  focusedIndex,
  inputValue,
  handleSuggestionClick,
}) => {
  return (
    <>
      {autoSuggestions.map((suggestion, index) => (
        <div
          className={`suggestion option-${index} ${
            index == focusedIndex ? "focused-suggestion" : ""
          }`}
          key={index}
          onClick={() => handleSuggestionClick(suggestion)}
        >
          {suggestion.name
            .toLowerCase()
            .replace(
              new RegExp(inputValue.toLowerCase(), "g"),
              `*${inputValue.toLowerCase()}*`
            )
            .split("*")
            .map((val, idx) => (
              <span key={idx}>
                {val.toLowerCase() === inputValue.toLowerCase() ? (
                  <b>{val}</b>
                ) : (
                  val
                )}
              </span>
            ))}
        </div>
      ))}
    </>
  );
};

export default SuggestionsList;
