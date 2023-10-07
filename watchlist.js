const watchListEl = document.getElementById('item-list');
const itemListEl = document.getElementById('item-list');

getFromLocalStorage();
renderWatchlist();

function getFromLocalStorage() {
  let items;

  if (localStorage.getItem('items') === null) {
    items = [];
  } else {
    items = JSON.parse(localStorage.getItem('items'));
  }

  return items;
}

function renderWatchlist() {
  const items = getFromLocalStorage();

  watchListEl.innerHTML = '';

  items.forEach((movie) => {
    const { title, vote_average, overview, genre_ids, poster_path, id } = movie;

    const div = document.createElement('div');
    div.classList.add('card');
    div.setAttribute('data-id', id);

    div.innerHTML = `
          <img src='https://image.tmdb.org/t/p/w500${poster_path}' alt="illustration of movie">
          <div class="card-content">
          <div class="card-header">
              <h2>${title}</h2>
              <div>
                  <i class="fas fa-star text-warning" style="color:#FEC654;"></i>
                  <small>${vote_average.toFixed(1)}</small>
              </div>
          </div>
              <div class="movie-info">
                  <div class="genres">Action, Drama</div>
                  <div class="watchlist" id="remove" data-id="${id}">
                      <img src="assets/minus-icon.svg" class="minus-icon"></img>
                      <small>remove</small>
                  </div>
              </div>
              <p class="overview">${overview}</p>
          </div>
      `;

    watchListEl.appendChild(div);
  });
}

// Remove movie from watchlist
function removeMovie(e) {
  let items = getFromLocalStorage();

  console.log(items);

  if (e.target.parentElement.classList.contains('watchlist')) {
    const id = e.target.parentElement.getAttribute('data-id');

    console.log(id);
    items.forEach((movie, index) => {
      if (parseInt(id) === movie.id) {
        items.splice(index, 1);
      }
    });
  }

  localStorage.setItem('items', JSON.stringify(items));
  renderWatchlist();
}

// add Eventlistener

itemListEl.addEventListener('click', removeMovie);
