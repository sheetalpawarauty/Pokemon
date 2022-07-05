//IIFE
let pokemonRepository = (function () {
  
  let pokemonList = [];
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
  
  //Search functionality
  let search = document.getElementById("poke-search");
  search.addEventListener("input", searchList);

  function searchList() {
    let searchInput = document.getElementById("poke-search").value;
    searchInput = searchInput.toLowerCase();
    let listItem = $("li");
    listItem.each(function () {
      let item = $(this);
      let name = item.text();
      if (name.includes(searchInput)) {
        item.show();
      } else {
        item.hide();
      }
    });
  }

  //this function is executed when a user clicks the Pokemon
  function showDetails(pokemon) {
    loadDetails(pokemon).then(function () {
      showModal(pokemon);
    });
  }

  function add(pokemon) {
    if (
      typeof pokemon === "object" &&
      "name" in pokemon
    ) {
    pokemonList.push(pokemon);
    } else {
      console.log("pokemon is not correct!");
    }
  }

  function getAll() {
    return pokemonList;
  }
  
  function addListItem(pokemon) {
    let pokemonList = document.querySelector(".list-group");
    let listItem = document.createElement("li");
    let button = document.createElement('button');
    button.innerText = pokemon.name;
    button.classList.add("btn","btn-primary");
    listItem.classList.add("group-list-item");
    button.setAttribute("data-target", "#poke-modal");
    button.setAttribute("data-toggle", "modal");
    listItem.appendChild(button);
    pokemonList.appendChild(listItem);
    clickEvent(button,pokemon); 
  }

  function clickEvent(button, pokemon) {
    button.addEventListener('click', function() {
      showDetails(pokemon);
    });
  }

  //this function will fetch data from API, then add each pokemon in the fetched data to pokemonList
  function loadList() {
    return fetch(apiUrl).then(function (response) {//sends a message to the specified API, requesting the list of Pokemon
      return response.json();// This returns a promise!
    }).then(function (json) {
      json.results.forEach(function (item) {
        let pokemon = {
          name: item.name,
          detailsUrl: item.url
        }
        add(pokemon);
      });
    }).catch(function(e) {
      console.error(e);// Error
    })
  }

  function loadDetails(item) {
    let url = item.detailsUrl;
    return fetch(url).then(function (response) {
      return response.json();
    }).then(function (details) {
      // Now we add the details to the item
      item.imageUrl = details.sprites.other.dream_world.front_default;
      item.id = details.id;
      item.height = details.height;
      item.weight = details.weight;
      let types = [];
      details.types.forEach((item) => types.push(item.type.name));
      item.types = types;
    }).catch(function(e) {
      console.error(e);
    });
  }

  function showModal(pokemon) {
    let modalBody = document.querySelector("#poke-modal-body");
    let modalTitle = document.querySelector("#poke-modal-title");

    modalTitle.innerHTML = '';
    modalBody.innerHTML = '';

    let pokemonName = document.createElement('h1');
    pokemonName.innerText = pokemon.name;

    let pokemonId = document.createElement("h2");
    pokemonId.innerText = "#" + pokemon.id.toString().padStart(3, 0);

    let imageElement = document.createElement('img');
    imageElement.src = pokemon.imageUrl;
    imageElement.classList.add("pokemon-img");

    let pokemonType = document.createElement("p");
    pokemonType.innerText = "Type: " + pokemon.types.join(", ");
    pokemonType.classList.add("pokemon-type");

    let pokemonHeight = document.createElement('p');
    pokemonHeight.innerText = "Height: "+pokemon.height;

    let pokemonWeight = document.createElement("p");
    pokemonWeight.innerText = "Weight: " + pokemon.weight.toFixed(1) + " lbs";
    
    modalTitle.appendChild(pokemonName);
    modalTitle.appendChild(pokemonId);
    modalBody.appendChild(imageElement);
    modalBody.appendChild(pokemonType);
    modalBody.appendChild(pokemonHeight);
    modalBody.appendChild(pokemonWeight);
  }

  //this function is executed when a user clicks the Pokemon
  function showDetails(pokemon) {
    loadDetails(pokemon).then(function () {
      showModal(pokemon);
    });
  }

  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    clickEvent: clickEvent,
    loadList: loadList,
    loadDetails: loadDetails,
    showDetails: showDetails,
    showModal: showModal
  };
})();

pokemonRepository.loadList().then(function() {
  // Now the data is loaded!
  pokemonRepository.getAll().forEach(function (pokemon) {
      pokemonRepository.addListItem(pokemon);
  });
});