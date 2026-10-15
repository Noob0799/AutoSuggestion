import { useEffect, useRef } from "react";
import { getHighlightParts } from "../utils/highlight";

export const getOptionId = (index) => `suggestion-option-${index}`;

const SuggestionsList = ({ id, suggestions, activeIndex, query, onSelect }) => {
  const listRef = useRef(null);

  useEffect(() => {
    listRef.current?.children[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  return (
    <ul id={id} ref={listRef} role="listbox" className="suggestions-list">
      {suggestions.map((suggestion, index) => (
        <li
          key={suggestion.id}
          id={getOptionId(index)}
          role="option"
          aria-selected={index === activeIndex}
          className={`suggestion ${index === activeIndex ? "focused-suggestion" : ""}`}
          // keep focus in the input while clicking an option
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onSelect(suggestion)}
        >
          {getHighlightParts(suggestion.name, query).map((part, i) =>
            part.match ? <b key={i}>{part.text}</b> : <span key={i}>{part.text}</span>
          )}
        </li>
      ))}
    </ul>
  );
};

export default SuggestionsList;
