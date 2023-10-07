const formEl = document.getElementById('form');
const inputEl = document.getElementById('movie-input');
const exploreEl = document.getElementById('explore');
const watchlistEl = document.getElementById('watchlist');
const movieListEl = document.getElementById('movie-list');
const errorMessage = document.getElementById('message');

const myWatchlist = [];
let moviesArr;

// Fetch movies from api
async function fetchMoviesFromAPI(movie) {
  const API_URL = 'https://api.themoviedb.org/3/';
  const API_KEY = '05e1c39526cfcad16d30aae45602a17f';

  const response = await fetch(
    `${API_URL}/search/movie?api_key=${API_KEY}&query=${movie}`
  );

  const data = await response.json();
  const movies = data.results;

  return movies;
}

// Search movies

async function searchMovies(e) {
  e.preventDefault();

  const movie = inputEl.value;
  moviesArr = await fetchMoviesFromAPI(movie);

  if (inputEl.value === '') {
    errorMessage.style.display = 'block';
  } else {
    exploreEl.style.display = 'none';

    if (moviesArr.length === 0 || moviesArr.length === null) {
      console.log(movieListEl);
      exploreEl.style.display = 'block';
      exploreEl.textContent =
        'Unable to find what you’re looking for. Please try another search.';
      console.log(movieListEl.textContent);
    }

    errorMessage.style.display = 'none';

    renderMovies(moviesArr);
  }

  inputEl.value = '';
}

// Render movies
function renderMovies(movies) {
  movieListEl.innerHTML = '';

  movies.forEach((movie) => {
    const { title, vote_average, overview, genre_ids, poster_path, id } = movie;

    const genres = {
      28: 'Action',
      12: 'Adventure',
      16: 'Animation',
      35: 'Comedy',
      80: 'Crime',
      99: 'Documentary',
      18: 'Drama',
      10751: 'Family',
      14: 'Fantasy',
      36: 'History',
      27: 'Horror',
      10402: 'Music',
      9648: 'Mystery',
      10749: 'Romance',
      878: 'Science Fiction',
      10770: 'TV Movie',
      53: 'Thriller',
      10752: 'War',
      37: 'Western',
    };

    const strings = genre_ids.map((number) => genres[number]);
    const displayString = strings.join(', ');

    console.log(strings);
    const imageUrl = poster_path
      ? `https://image.tmdb.org/t/p/w500${poster_path}`
      : 'https://via.placeholder.com/500x750?text=No+Image';

    const div = document.createElement('div');
    div.classList.add('card');
    div.setAttribute('data-id', id);

    div.innerHTML = `
        <img src='${imageUrl}' alt="illustration of movie">
        <div class="card-content">
        <div class="card-header">
            <h2>${title}</h2>
            <div>
                <i class="fas fa-star text-warning" style="color:#FEC654;"></i>
                <small>${vote_average.toFixed(1)}</small>
            </div>
        </div>
            <div class="movie-info">
                <div class="genres">${displayString}</div>
                <div class="watchlist" id="watchlist" data-id="${id}">
                    <img src="assets/Icon.svg" class="plus-icon"></img>
                    <small>Watchlist</small>
                </div>
            </div>
            <p class="overview">${overview}</p>
        </div>
    `;

    movieListEl.appendChild(div);
  });
}

// Add a movie to the watchlist
function addMovieToWatchList(e) {
  console.log(e.target.parentElement);

  console.log(moviesArr);

  if (e.target.parentElement.classList.contains('watchlist')) {
    const id = e.target.parentElement.getAttribute('data-id');
    const selectedMovie = moviesArr.filter((movie) => {
      return movie.id === parseInt(id);
    });

    const movieObject = selectedMovie[0];

    if (!myWatchlist.includes(movieObject)) {
      myWatchlist.push(movieObject);
      addToLocalStorage(movieObject);
    }
  }

  renderWatchlist();
}

// Add to local Storage
function addToLocalStorage(item) {
  let items = getFromLocalStorage();

  items.push(item);

  localStorage.setItem('items', JSON.stringify(items));
}

// getFromLocalStorage
function getFromLocalStorage() {
  let items;

  if (localStorage.getItem('items') === null) {
    items = [];
  } else {
    items = JSON.parse(localStorage.getItem('items'));
  }

  return items;
}

// Add Eventlistener
formEl.addEventListener('submit', searchMovies);

movieListEl.addEventListener('click', addMovieToWatchList);
