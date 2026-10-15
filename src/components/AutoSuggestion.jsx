import { useEffect, useRef, useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { useSuggestions } from "../hooks/useSuggestions";
import DisplayMenu from "./DisplayMenu";
import SuggestionsList, { getOptionId } from "./SuggestionsList";

const DEBOUNCE_MS = 300;
const LISTBOX_ID = "suggestions-listbox";

const AutoSuggestion = () => {
  const [inputValue, setInputValue] = useState("");
  const [selected, setSelected] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const trimmed = inputValue.trim();
  const debounced = useDebounce(trimmed, DEBOUNCE_MS);
  // no fetching after a selection, or once the input has been cleared
  const query = selected || !trimmed ? "" : debounced;
  const { suggestions, status, error } = useSuggestions(query);

  const showDropdown = isOpen && !selected && trimmed.length > 0;

  useEffect(() => {
    setActiveIndex(0);
  }, [suggestions]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!containerRef.current?.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleChange = (event) => {
    setInputValue(event.target.value);
    setSelected(null);
    setIsOpen(true);
  };

  const handleSelect = (recipe) => {
    setSelected(recipe);
    setInputValue(recipe.name);
    setIsOpen(false);
  };

  const handleClear = () => {
    setInputValue("");
    setSelected(null);
    setIsOpen(false);
  };

  const handleKeyDown = (event) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setIsOpen(true);
        if (suggestions.length) setActiveIndex((i) => (i + 1) % suggestions.length);
        break;
      case "ArrowUp":
        event.preventDefault();
        if (suggestions.length)
          setActiveIndex((i) => (i - 1 + suggestions.length) % suggestions.length);
        break;
      case "Enter":
        if (showDropdown && suggestions[activeIndex]) {
          event.preventDefault();
          handleSelect(suggestions[activeIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
      default:
    }
  };

  const hasOptions = showDropdown && status === "success" && suggestions.length > 0;

  return (
    <div className="main-container">
      <div className="search-wrapper" ref={containerRef}>
        <div className="input-container">
          <input
            type="text"
            placeholder="Enter recipe name to search"
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsOpen(true)}
            role="combobox"
            aria-expanded={showDropdown}
            aria-controls={LISTBOX_ID}
            aria-autocomplete="list"
            aria-activedescendant={hasOptions ? getOptionId(activeIndex) : undefined}
          />
          <button type="button" onClick={handleClear}>
            Clear
          </button>
        </div>

        {showDropdown && (
          <div className="suggestions-container">
            {status === "loading" && <p className="suggestion-message">Loading...</p>}
            {status === "error" && (
              <p className="suggestion-message error">Something went wrong: {error.message}</p>
            )}
            {status === "success" && suggestions.length === 0 && (
              <p className="suggestion-message">No results found</p>
            )}
            {hasOptions && (
              <SuggestionsList
                id={LISTBOX_ID}
                suggestions={suggestions}
                activeIndex={activeIndex}
                query={query}
                onSelect={handleSelect}
              />
            )}
          </div>
        )}
      </div>

      {selected && <DisplayMenu recipe={selected} />}
    </div>
  );
};

export default AutoSuggestion;
