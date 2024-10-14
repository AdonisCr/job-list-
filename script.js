let content = document.querySelector(".main_content");
let selectedFilters = document.querySelector(".selected-filters");
let selectedFiltersSet = new Set();
let allItems = []; // Pour stocker tous les éléments récupérés

if (content) {
  fetch("data.json")
    .then((res) => res.json())
    .then((result) => {
      allItems = result; // Stocke tous les éléments récupérés
      renderItems(allItems);

      // Utiliser delegation d'événement pour s'assurer que tous les <a> sont capturés, même ceux ajoutés plus tard
      content.addEventListener("click", function(e) {
        if (e.target.tagName === "A" && (e.target.classList.contains("language") || e.target.classList.contains("tool"))) {
          let filterText = e.target.textContent.trim();
          if (!selectedFiltersSet.has(filterText)) {
            selectedFiltersSet.add(filterText);
            updateSelectedFilters();
          }
        }
      });
    });
}

function renderItems(items) {
  content.innerHTML = '';
  items.forEach((item) => {
    let languagesHTML = item.languages.map(lang => `<a class="language">${lang}</a>`).join(" ");
    let toolsHTML = item.tools.map(tool => `<a class="tool">${tool}</a>`).join(" ");
    content.innerHTML += `
      <div class="item">
        <div class="content">
          <img src="${item.logo}" alt="">
          <div>
            <div class="item_content1">
              <a> ${item.company} </a>
              <div class="item_content11">
                ${item.new ? " <a>  New! </a>" : ""}
                ${item.featured ? " <a style=\"background-color:#000000e8\">  Featured </a>" : ""}
              </div>            
            </div>
            <h4> ${item.position}</h4>
            <ul class="item_content2">
              <li>  ${item.postedAt}  </li>
              <li> .  ${item.contract} </li>
              <li> . ${item.location} </li>
            </ul>    
          </div>
        </div>
        <div class="item_content">
          <a href="">${item.role}</a>
          <a href="">${item.level}</a>                
          <div>${languagesHTML}</div>
          <div> ${toolsHTML} </div>
        </div>
      </div>`;
  });
}

function updateSelectedFilters() {
  selectedFilters.innerHTML = '';
  selectedFiltersSet.forEach(filter => {
    let filterElement = document.createElement('div');
    filterElement.className = 'filter';
    filterElement.innerHTML = `${filter} <span class="remove">x</span>`;
    filterElement.querySelector('.remove').addEventListener('click', () => {
      selectedFiltersSet.delete(filter);
      updateSelectedFilters();
    });
    selectedFilters.appendChild(filterElement);
  });
  filterItems(); // Filtre les éléments affichés après la mise à jour des filtres
}

function filterItems() {
  if (selectedFiltersSet.size === 0) {
    renderItems(allItems); // Si aucun filtre n'est sélectionné, afficher tous les éléments
  } else {
    let filteredItems = allItems.filter(item => {
      let languages = new Set(item.languages);
      let tools = new Set(item.tools);

      // Vérifie que chaque filtre sélectionné est présent dans les langages, les outils, le rôle ou le niveau
      return Array.from(selectedFiltersSet).every(filter => {
        return languages.has(filter) || tools.has(filter) || item.role === filter || item.level === filter;
      });
    });
    renderItems(filteredItems);
  }
}