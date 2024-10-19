import { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import DisplayMenu from "./display-menu";
import SuggestionsList from "./suggestions-list";

const AutoSuggestion = () => {
  const [suggestedMenu, setSuggestedMenu] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [autoSuggestions, setAutoSuggestions] = useState([]);
  const [isAutoSuggest, setIsAutoSuggest] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const inputRef = useRef();
  const handleInputChange = (event) => {
    setSuggestedMenu(null);
    setInputValue(event.target.value.toLowerCase());
  };
  const debounceInputChange = useCallback(debounce(handleInputChange, 300), []);
  const handleAutoSuggestion = (inputValue) => {
    setIsLoading(true);
    fetch(`https://dummyjson.com/recipes/search?q=${inputValue}`)
      .then((res) => res.json())
      .then((res) => {
        const recipes = res.recipes.filter(
          (recipe) => !recipe.name.includes("(")
        );
        setAutoSuggestions(recipes);
        setIsLoading(false);
      });
  };
  const handleSuggestionClick = (oSuggestion) => {
    setSuggestedMenu(oSuggestion);
    setIsAutoSuggest(false);
    setInputValue(oSuggestion.name.toLowerCase());
  };
  useEffect(() => {
    inputRef.current.value = inputValue;
    setFocusedIndex(0);
    if (isAutoSuggest && inputValue.length) {
        handleAutoSuggestion(inputValue);
    } else {
      setAutoSuggestions([]);
      setIsAutoSuggest(true);
    }
  }, [inputValue.length]);
  useEffect(() => {
    const parentRect = document
      .querySelector(".suggestions-container")
      .getBoundingClientRect();
    const elem = document.querySelector(`.option-${focusedIndex}`);
    if (elem) {
      const rect = elem.getBoundingClientRect();
      if (rect.top < parentRect.top || rect.bottom > parentRect.bottom)
        elem.scrollIntoView();
    }
  }, [focusedIndex]);
  const handleClear = () => {
    setSuggestedMenu(null);
    setInputValue("");
    setIsLoading(false);
  };
  const handleKeyDown = (event) => {
    const { key } = event;
    switch (key) {
      case "ArrowDown":
        setFocusedIndex((previousIndex) => {
          if (previousIndex + 1 <= autoSuggestions.length - 1) {
            return previousIndex + 1;
          }
          return 0;
        });
        break;
      case "ArrowUp":
        setFocusedIndex((previousIndex) => {
          if (previousIndex - 1 >= 0) {
            return previousIndex - 1;
          }
          return autoSuggestions.length - 1;
        });
        break;
      case "Enter":
        handleSuggestionClick(autoSuggestions[focusedIndex]);
        break;
    }
  };
  return (
    <div className="main-container" onKeyDown={handleKeyDown}>
      <div className="input-container">
        <input type="text" placeholder="Enter recipe name to search" ref={inputRef} onChange={debounceInputChange} />
        <button onClick={handleClear}>Clear</button>
      </div>
      <div className="suggestions-container">
        {isLoading ? (
          <p className="suggestion">Loading...</p>
        ) : (
          <SuggestionsList
            autoSuggestions={autoSuggestions}
            focusedIndex={focusedIndex}
            inputValue={inputValue}
            handleSuggestionClick={handleSuggestionClick}
          />
        )}
      </div>
      {suggestedMenu && <DisplayMenu suggestedMenu={suggestedMenu} />}
    </div>
  );
};

export default AutoSuggestion;
