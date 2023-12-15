export const typeColors = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dark: "#705848",
  dragon: "#7038F8",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
};

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function getTypeColor(pokemonType) {
  // Convert the input to lowercase to ensure case-insensitivity
  const lowerCaseType = pokemonType.toLowerCase();

  // Check if the type exists in the JSON object, return the color or a default color if not found
  return typeColors[lowerCaseType] || "#000000";
}

export function padWithZeros(number) {
  return String(number).padStart(3, "0");
}
