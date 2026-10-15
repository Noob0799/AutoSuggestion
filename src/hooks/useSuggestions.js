import { useEffect, useRef, useState } from "react";
import { searchRecipes } from "../services/recipes";

const IDLE = { suggestions: [], status: "idle", error: null };

/**
 * Fetches suggestions for `query`. An empty query resets to idle.
 * - in-flight requests are aborted when the query changes (no stale responses)
 * - results are cached per query for the lifetime of the component
 */
export function useSuggestions(query) {
  const cacheRef = useRef(new Map());
  const [state, setState] = useState(IDLE);

  useEffect(() => {
    if (!query) {
      setState(IDLE);
      return;
    }
    const cached = cacheRef.current.get(query);
    if (cached) {
      setState({ suggestions: cached, status: "success", error: null });
      return;
    }

    const controller = new AbortController();
    setState((prev) => ({ ...prev, status: "loading", error: null }));

    searchRecipes(query, controller.signal)
      .then((suggestions) => {
        cacheRef.current.set(query, suggestions);
        setState({ suggestions, status: "success", error: null });
      })
      .catch((error) => {
        if (error.name === "AbortError") return;
        setState({ suggestions: [], status: "error", error });
      });

    return () => controller.abort();
  }, [query]);

  return state;
}
