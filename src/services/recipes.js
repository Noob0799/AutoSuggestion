const BASE_URL = "https://dummyjson.com/recipes/search";

export async function searchRecipes(query, signal) {
  const res = await fetch(`${BASE_URL}?q=${encodeURIComponent(query)}`, { signal });
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  const { recipes } = await res.json();
  return recipes.filter((recipe) => !recipe.name.includes("("));
}
