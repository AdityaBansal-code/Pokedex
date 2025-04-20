const MAX_POKEMON = 649;

// Get HTML elements
const pokemonListContainer = document.querySelector("#pokemonList");
const searchInput = document.querySelector("#searchInput");
const notFoundMessage = document.querySelector("#notFoundMessage");
const clearSearchButton = document.querySelector("#clearSearch");

let allPokemons = [];

// Fetch Pokémon list from API
fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`)
  .then((response) => response.json())
  .then((data) => {
    allPokemons = data.results;
    showPokemonList(allPokemons);
  });

// Render Pokémon on the page
function showPokemonList(pokemonArray) {
  pokemonListContainer.innerHTML = "";

  pokemonArray.forEach((pokemon) => {
    const pokemonID = getPokemonIDFromURL(pokemon.url);

    const card = document.createElement("div");
    card.className = "pokemon-list-item";

    card.innerHTML = `
      <div class="pokemon-number"><p>#${pokemonID}</p></div>
      <div class="pokemon-image">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg" alt="${pokemon.name}" />
      </div>
      <div class="pokemon-name"><p>${capitalizeFirstLetter(pokemon.name)}</p></div>
    `;

    card.addEventListener("click", () => {
      window.location.href = `./detail.html?id=${pokemonID}`;
    });

    pokemonListContainer.appendChild(card);
  });
}

// Helper function to capitalize only the first letter
function capitalizeFirstLetter(name) {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

// Get ID from Pokémon API URL
function getPokemonIDFromURL(url) {
  const parts = url.split("/");
  return parts[6];
}

// Search Pokémon by name only
searchInput.addEventListener("keyup", () => {
  const searchTerm = searchInput.value.toLowerCase();

  const filteredList = allPokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().startsWith(searchTerm)
  );

  showPokemonList(filteredList);

  notFoundMessage.style.display = filteredList.length === 0 ? "block" : "none";
});

const clearSearch = document.getElementById("clearSearch");

// Ensure cross icon appears/disappears dynamically
searchInput.addEventListener("input", () => {
    clearSearch.style.display = searchInput.value.length > 0 ? "block" : "none";
});

// When the cross icon is clicked, clear the input and restore full Pokémon list
clearSearch.addEventListener("click", () => {
    searchInput.value = "";
    clearSearch.style.display = "none";
    searchInput.focus(); // Keeps cursor in the input field after clearing
    showPokemonList(allPokemons); // Restore full list
    notFoundMessage.style.display = "none";
});
// Clear the search box
clearSearchButton.addEventListener("click", () => {
  searchInput.value = "";
  showPokemonList(allPokemons);
  notFoundMessage.style.display = "none";
});
document.querySelectorAll(".pokemon-list-item").forEach(item => {
  item.addEventListener("click", function() {
    document.body.style.opacity = "0";
    document.body.style.transition = "opacity 0.4s ease-in-out";
    setTimeout(() => {
      window.location.href = "details.html"; // Smooth transition to details page
    }, 300);
  });
});
