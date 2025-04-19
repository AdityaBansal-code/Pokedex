let currentPokemonId = null;

const typeColors = {
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
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
};

document.addEventListener("DOMContentLoaded", () => {
  const MAX_POKEMONS = 649;
  const pokemonID = new URLSearchParams(window.location.search).get("id");
  const id = parseInt(pokemonID, 10);

  if (id < 1 || id > MAX_POKEMONS || isNaN(id)) {
    window.location.href = "./index.html";
  }

  currentPokemonId = id;
  loadPokemon(id);

  document.getElementById("prevPokemon").addEventListener("click", (e) => {
    e.preventDefault();
    if (currentPokemonId > 1) navigatePokemon(currentPokemonId - 1);
  });

  document.getElementById("nextPokemon").addEventListener("click", (e) => {
    e.preventDefault();
    if (currentPokemonId < MAX_POKEMONS) navigatePokemon(currentPokemonId + 1);
  });
});

async function loadPokemon(id) {
  try {
    const [pokemon, species] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => res.json()),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) => res.json()),
    ]);

    if (currentPokemonId === id) {
      displayPokemonDetails(pokemon);
      document.getElementById("pokemonDescription").textContent = getEnglishFlavorText(species);
      window.history.pushState({}, "", `./details.html?id=${id}`);
    }
  } catch (error) {
    console.error("Failed to load Pokémon:", error);
  }
}

async function navigatePokemon(id) {
  currentPokemonId = id;
  await loadPokemon(id);
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function getEnglishFlavorText(species) {
  const entry = species.flavor_text_entries.find((e) => e.language.name === "en");
  return entry ? entry.flavor_text.replace(/\f/g, " ") : "";
}

function setTypeBackgroundColor(mainType) {
  const normalizedType = mainType.toLowerCase().trim();
  const color = typeColors[normalizedType];

  if (!color) {
    console.warn(`No color found for type: ${normalizedType}`);
    return;
  }

  document.querySelector("main").style.backgroundColor = color;
  document.querySelector("main").style.transition="all 0.3s" 
}

function displayPokemonDetails(pokemon) {
  const { name, id, types, weight, height, abilities, stats } = pokemon;
  const displayName = capitalizeFirstLetter(name);

  document.title = displayName;
  document.getElementById("pokemonName").textContent = displayName;
  document.getElementById("pokemonID").textContent = `#${String(id).padStart(3, "0")}`;

  const image = document.getElementById("pokemonImage");
  image.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`;
  image.alt = `Image of ${displayName}`;

  const type1 = document.getElementById("type1");
  const type2 = document.getElementById("type2");

  // Clear previous type labels
  type1.textContent = "";
  type2.textContent = "";
  type2.style.display = "none"; // Hide second type by default

  if (types.length > 0) {
    const type1Name = types[0].type.name.toLowerCase();
    type1.textContent = capitalizeFirstLetter(type1Name);
    type1.style.backgroundColor = typeColors[type1Name] || "#ddd"; // Default gray if missing
    setTypeBackgroundColor(type1Name);
  }

  if (types.length > 1) {
    const type2Name = types[1].type.name.toLowerCase();
    type2.textContent = capitalizeFirstLetter(type2Name);
    type2.style.display = "inline-block";
    type2.style.backgroundColor = typeColors[type2Name] || "#ddd"; // Default gray if missing
  }

  document.getElementById("pokemonWeight").textContent = `${weight / 10}kg`;
  document.getElementById("pokemonHeight").textContent = `${height / 10}m`;

  const movesEl = document.getElementById("pokemonMoves");
  movesEl.innerHTML = "";
  abilities.forEach(({ ability }) => {
    const move = document.createElement("p");
    move.textContent = capitalizeFirstLetter(ability.name);
    movesEl.appendChild(move);
  });

  const statMap = {
    hp: "statHP",
    attack: "statATK",
    defense: "statDEF",
    "special-attack": "statSATK",
  };

  const progressMap = {
    hp: "progressHP",
    attack: "progressATK",
    defense: "progressDEF",
    "special-attack": "progressSATK",
  };

  stats.forEach(({ stat, base_stat }) => {
    const statName = stat.name;
    if (statMap[statName]) {
      document.getElementById(statMap[statName]).textContent = base_stat;
      document.getElementById(progressMap[statName]).value = base_stat;
    }
  });
}
document.addEventListener("DOMContentLoaded", function() {
  document.body.style.opacity = "0";
  setTimeout(() => {
    document.body.style.opacity = "1";
    document.body.style.transition = "opacity 0.3s ease-in-out";
  }, 100);
});
