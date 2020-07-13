'use strict';

/*************************
 *      Global data      *
 *************************/
let user = {};
let avatarUrl = '';
let movieQuotes = '';

/*************************
 *   start welcome app   *
 *************************/
const startWelcomeApp = () => {
  getFromLocalStorage();
  console.log(user);
  console.log(user.lastLogin);
  if (user.lastLogin === whatDayIsToday()) {
    console.log('delete');
    takeToWebsite();
  } else if (user.name) {
    showWelcomePage();
  } else {
    getApiData(randomString()).then(() => {
      paintRequestInfo();
      listenNameInput();
      listenRefreshAvatar();
      listenAcceptNameAvatar();
    });
  }
};

const showWelcomePage = () => {
  paintWelcome();
  getApiQuotes();
  listenKeyEnd();
};

/*************************
 *        helpers        *
 *************************/

const randomizeAvatar = () => {
  const newAvatar = randomString();
  paintAvatar(newAvatar);
};

// start series app
const takeToWebsite = () => {
  setlastLogin();
  setInLocalStorage();
  startSeriesApp();
};

// welcome page fades
const fadeOut = () => {
  const page = document.querySelector('.welcome__area');
  page.classList.add('fade-out');
  const temp = setTimeout(takeToWebsite, 3000);
};

/*************************
 *     listen events     *
 *************************/

const listenNameInput = () => {
  const inputNameEl = document.querySelector('.request__info-name');
  inputNameEl.addEventListener('keyup', function () {
    const inputNameValue = inputNameEl.value;
    console.log(inputNameValue);
    user['name'] = inputNameValue;
    paintAvatar(inputNameValue);
    setInLocalStorage();
  });
};

const listenRefreshAvatar = () => {
  const refreshEl = document.querySelector('.refresh-avatar');
  refreshEl.addEventListener('click', randomizeAvatar);
};

const listenAcceptNameAvatar = () => {
  const happyEl = document.querySelector('.js-happy');
  happyEl.addEventListener('click', showWelcomePage);
};

// press any key to load series app
const listenKeyEnd = () => {
  document.addEventListener('keydown', fadeOut);
};

// generate a random string

const randomString = () => {
  return Math.random().toString(36).substr(2, 5);
};

// get today's date
const whatDayIsToday = () => {
  let today = new Date().toLocaleString().split(',')[0];
  return today;
};

// set last login
const setlastLogin = () => {
  const today = whatDayIsToday();
  user['lastLogin'] = today;
};

/*************************
 *         paint         *
 *************************/

// paints avatar

const paintAvatar = (username) => {
  let htmlCode = '';
  const avatarContainer = document.querySelector('.avatar__container');
  getApiData(username).then(() => {
    htmlCode += `<img src="${avatarUrl}" alt="avatar image" class="avatar">`;
    avatarContainer.innerHTML = htmlCode;
    user['avatar'] = avatarUrl;
    setInLocalStorage();
  });
};

// paints message that requests info (1st time)

const paintRequestInfo = () => {
  let requestInfocode = '';
  requestInfocode += getRequestInfoHtmlCode(avatarUrl);
  const requestInfoElement = document.querySelector('.welcome__area');
  requestInfoElement.innerHTML = requestInfocode;
};

const getRequestInfoHtmlCode = (url) => {
  let htmlCode = '';
  htmlCode += `<div class="welcome__container">`;
  htmlCode += `<h1 class="welcome-title welcome-request">Hello</h1>`;
  htmlCode += `<div class="request__info--area">`;
  htmlCode += `   <h2 class="request__info-title">What's your name?</h2>`;
  htmlCode += `     <input type="text" name="name" class="request__info-name js-user-name" autocomplete="off" placeholder="ELENA">`;
  htmlCode += `   <div class="input-highlight"></div>`;
  htmlCode += `   <div class="request__info--avatar">`;
  htmlCode += `       <div class="avatar__container">`;
  htmlCode += `           <img src="${url}" alt="avatar image" class="avatar request">`;
  htmlCode += `      </div>`;
  htmlCode += `      <p class="avatar-description">`;
  htmlCode += `           <span class="js-not-happy not-happy">Not happy ?</span>`;
  htmlCode += `           <i class="fas fa-sync-alt js-refresh-avatar refresh-avatar"></i>`;
  htmlCode += `           <span class="js-happy happy">Happy ?</span>`;
  htmlCode += `      </p>`;
  htmlCode += `   </div>`;
  htmlCode += `</div>`;
  htmlCode += `</div>`;
  return htmlCode;
};

// aints Welcome message

const paintWelcome = () => {
  let welcomeHtmlCode = '';
  welcomeHtmlCode += getWelcomeHtmlCode();
  const welcomeAreaEl = document.querySelector('.welcome__area');
  welcomeAreaEl.innerHTML = welcomeHtmlCode;
};

const getWelcomeHtmlCode = () => {
  let htmlCode = '';
  htmlCode += `<div class="welcome__container">`;
  htmlCode += `     <h1 class="welcome-title">Hello, <span class="name">${user.name}</span></h1>`;
  htmlCode += `     <div class="avatar__container">`;
  htmlCode += `           <img src="${user.avatar}" alt="" class="avatar welcome fade-in">`;
  htmlCode += `     </div>`;
  htmlCode += `     <p class="quote fade-in js-quote"></p>`;
  htmlCode += `</div>`;
  htmlCode += `<span class="enter-message">Press any key <i class="fas fa-chevron-circle-right"></i></span>`;
  return htmlCode;
};

/*************************
 *          API          *
 *************************/

// get avatars

const getApiData = (string) => {
  return fetch(
    `https://avatars.dicebear.com/api/avataaars/${string}.svg?options[mouth][]=smile`
  ).then((data) => (avatarUrl = data.url));
};

// get quotes (local api)
const getApiQuotes = () => {
  fetch('./public/api/data.json')
    .then((response) => response.json())
    .then((data) => {
      const movieQuotes = data;
      const randomQuoteEl = document.querySelector('.js-quote');
      randomQuoteEl.innerHTML = movieQuotes[randomNumber(movieQuotes.length)];
    });
};

/*************************
 *     local storage     *
 *************************/

const getFromLocalStorage = () => {
  const localStorageUser = localStorage.getItem('userDataLog');
  if (localStorageUser !== null) {
    user = JSON.parse(localStorageUser);
  }
};

const setInLocalStorage = () => {
  const stringifyUser = JSON.stringify(user);
  localStorage.setItem('userDataLog', stringifyUser);
};

/********************************************************/

/*************************
 *      HELPERS          *
 *************************/

// Calculate % of watched series / favorite items

const calculatePerctTotalSeries = (array) => {
  const totalNumber = 49146;
  const watchedNumber = array.length;
  const result = (watchedNumber * 100) / totalNumber;

  return result.toFixed(2);
};

// check if there is image (if not, replace)

function checkImage(result) {
  if (!result.image) {
    const avatar = JSON.parse(localStorage.getItem('userDataLog')).avatar;
    console.log(avatar);
    result.image = avatar.replace(
      'smile',
      'concerned&options[style]=circle&options[eyes][]=surprised&options[b]=%23900'
    );
  } else {
    result.image = result.image.medium;
  }
}

// get id of a clicked item

const getClickedMediaId = (ev) => {
  return ev.target.dataset.id;
};

// tells if an item is in a list

const isMediaInList = (id, list) => {
  return !!list.find((element) => element === id);
};

// filters by genre

const filterByGenres = (e) => {
  section = 'Series';
  const genreText = document.querySelector('.value.js-filter-genre');
  const genre = e.target.dataset.genre;
  console.log('Filter time ' + genre);
  genreText.innerHTML = genre;
  let genreSelection = [];
  let mediaSelection = [];
  let idSelection = [];
  getApiSeriesByGenre(genre).then((data) => {
    // Check by genre
    for (const item of data) {
      genreSelection.push(item);
    }
    console.log(genreSelection);
    for (const item of genreSelection) {
      if (item['genre'].findIndex((element) => element === genre) !== -1) {
        console.log('contains');
        idSelection.push(item.id);
      }
    }
    for (let i = 0; i < 20; i++) {
      getApiSeriesById(idSelection[i]).then((data) => {
        // Check availabily
        if (data.status !== 404) {
          mediaSelection.push(data);
          checkImage(data);
        }
        paintSelection(mediaSelection);
        listenMakeFavoriteHeart();
        listenMakeWatchedEye();
        applyClassIfInList('.make-watched-eye', watchedSeries, 'watched-eye');
        applyClassIfInList(
          '.make-favorite-heart',
          favoriteSeries,
          'favorite-heart'
        );
      });
    }
  });
  console.log(genreSelection);
};

// generate a random number

const randomNumber = (max) => {
  return Math.floor(Math.random() * max);
};

'use strict';

/*************************
 *      Global data      *
 *************************/

let section = ''; // tells us in which section we are
let idSelection = [];
let favoriteSeries = [];
let watchedSeries = [];

// list of genres from TV Maze api
const genreList = [
  'Action',
  'Adult',
  'Adventure',
  'Anime',
  'Children',
  'Comedy',
  'Crime',
  'Drama',
  'Espionage',
  'Family',
  'Fantasy',
  'Food',
  'History',
  'Horror',
  'Legal',
  'Medical',
  'Music',
  'Mystery',
  'Nature',
  'Romance',
  'Science-Fiction',
  'Sports',
  'Supernatural',
  'Thriller',
  'Travel',
  'War',
  'Western',
];

/*************************
 *   Starting the app    *
 *************************/

// Starting the app
const startSeriesApp = () => {
  removeWelcomePage();
  //   debugger;
  getFromLocalStorage();

  console.log(user);
  if (user.favoriteSeries) {
    console.log("It's not empty");
    favoriteSeries = user.favoriteSeries;
  }
  showRandomSelection();
  paintDropDownGenres(genreList);
  paintProfile();
  listenMenuBtns();
  listenDocument();
  listenErrorBtn();
};

const generateRandomSelection = (items) => {
  // Hay que asegurarse que no se repiten IDs
  for (let i = 0; i < items; i++) {
    const number = randomNumber(4916);
    // Make sure no ID is repeated
    if (idSelection.indexOf(number) === -1) {
      idSelection.push(number);
    }
  }
};

const searchMedia = () => {
  section = 'Series';
  const query = document.querySelector('.js-search').value;
  getApiSeriesByName(query).then((data) => {
    const results = data;
    let mediaSelection = [];
    for (const result of results) {
      checkImage(result.show);
      mediaSelection.push(result.show);
      console.log(mediaSelection);
    }
    paintSelection(mediaSelection);
    listenMakeFavoriteHeart();
    listenMakeWatchedEye();
    applyClassIfInList('.make-watched-eye', watchedSeries, 'watched-eye');
    applyClassIfInList(
      '.make-favorite-heart',
      favoriteSeries,
      'favorite-heart'
    );
  });
};

const showRandomSelection = () => {
  section = 'Series';
  idSelection = [];
  changeGenreToAll();
  generateRandomSelection(50);
  initializeLoadBar();
  let mediaSelection = [];
  for (const id of idSelection) {
    getApiSeriesById(id).then((data) => {
      // Check availabily
      if (data.status !== 404) {
        mediaSelection.push(data);
        checkImage(data);
      }
      paintSelection(mediaSelection);
      listenMakeFavoriteHeart();
      listenMakeWatchedEye();
    });
  }
  applyClassIfInList('.make-watched-eye', watchedSeries, 'watched-eye');

  applyClassIfInList('.make-favorite-heart', favoriteSeries, 'favorite-heart');
  listenMenuBtns();
  listenDocument();
};

const showDropMenu = () => {
  const genresBtn = document.querySelector('.dropdown-menu');
  genresBtn.classList.toggle('hidden');
};

const closeMenus = (e) => {
  const genresBtn = document.querySelector('.dropdown-menu');
  if (
    !e.target.classList.contains('js-filter-genre') &&
    !genresBtn.classList.contains('hidden')
  ) {
    genresBtn.classList.add('hidden');
  }
};

const initializeLoadBar = () => {
  const loadingBar = document.querySelector('.js-load-bar');
  loadingBar.classList.add('init-expand');
  setTimeout(function () {
    loadingBar.classList.remove('init-expand');
  }, 6500);
};

const removeWelcomePage = () => {
  const welcomePage = document.querySelector('.welcome__area');
  welcomePage.remove();
};

// change genre to All
const changeGenreToAll = () => {
  const genreText = document.querySelector('.value.js-filter-genre');
  genreText.innerHTML = 'All';
};

/*****************************
 *         LISTENERS         *
 ****************************/

// helper for multiple btns
const listenEvents = (selector, handler, eventType = 'click') => {
  const elements = document.querySelectorAll(selector);
  for (const element of elements) {
    element.addEventListener(eventType, handler);
  }
};

const listenMenuBtns = () => {
  listenSearchBar();
  listenFavoritesBtn();
  listenWatchedBtn();
  listenSeriesBtn();
  listenProfileBtn();
  listenGenresBtn();
  listenGenres();
};

const listenSearchBar = () => {
  const searchInputEl = document.querySelector('.js-search');
  searchInputEl.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      searchMedia();
      searchInputEl.value = '';
    }
  });
};

const listenGenres = () => {
  listenEvents('.js-genre-option', filterByGenres);
};

// listen favorites
const listenMakeFavoriteHeart = () => {
  listenEvents('.media__poster-favorite', addToFavorites);
};

const listenFavoritesBtn = () => {
  const favoriteBtnEl = document.querySelector('.user-favorites');
  const favoriteMenuEl = document.querySelector('.js-search__favorites');
  favoriteBtnEl.addEventListener('click', showFavorites);
  favoriteMenuEl.addEventListener('click', showFavorites);
};

// listen menu items
const listenSeriesBtn = () => {
  const seriesMenuEl = document.querySelector('.js-search__series');
  seriesMenuEl.addEventListener('click', showRandomSelection);
};

const listenProfileBtn = () => {
  const userMenuEl = document.querySelector('.js-user-profile');
  userMenuEl.addEventListener('click', showProfileMenu);
};

// Listen genre menu
const listenGenresBtn = () => {
  const genresBtn = document.querySelector('.filter.genres');
  genresBtn.addEventListener('click', showDropMenu);
};

// listens clicks on document --> for escaping drop-down menu
const listenDocument = () => {
  document.addEventListener('click', closeMenus);
};

/*****************************
 *        PAINT HTML         *
 ****************************/

// genres drop down menu

const paintDropDownGenres = (array) => {
  const dropDownEl = document.querySelector('.dropdown-menu');
  dropDownEl.innerHTML = '';
  for (const item of array) {
    dropDownEl.innerHTML += getDropDownHtmlCode(item);
  }
};

const getDropDownHtmlCode = (genre) => {
  let htmlCode = '';
  htmlCode += `<li>`;
  htmlCode += `<a href="#" data-genre=${genre} class="js-genre-option">${genre}</a>`;
  htmlCode += `</li>`;
  return htmlCode;
};

// a random selection

const paintSelection = (media) => {
  const selectionAreaEl = document.querySelector('.js-selection-area');
  selectionAreaEl.innerHTML = '';
  for (const item of media) {
    selectionAreaEl.innerHTML += getSelectionHtmlCode(item);
  }
};

const getSelectionHtmlCode = (media) => {
  let htmlCode = '';
  htmlCode += `<article class="media__container" data-id="${media.id}">`;
  htmlCode += `<div div class="cover" style="background-image: url('${media.image}')"> `;
  htmlCode += `<div class="cover-imgs" ></div>`;
  htmlCode += `<div class="cover-overlay cover-info-overlay">`;
  htmlCode += `<div class="media__poster-check">`;
  htmlCode += `<span class="media__poster-seen">`;
  htmlCode += `<i class="far fa-eye make-watched-eye" data-id="${media.id}"></i></span>`;
  htmlCode += `<span class="media__poster-favorite">`;
  htmlCode += `<i class="fas fa-heart  make-favorite-heart" data-id="${media.id}"></i>`;
  htmlCode += `</span>`;
  htmlCode += `</div>`;
  htmlCode += `<div class="media__poster-rating">`;
  htmlCode += `<span class="media__poster-stars">`;
  htmlCode += ` <i class="fas fa-star"></i>`;
  htmlCode += `<i class="fas fa-star"></i>`;
  htmlCode += `<i class="fas fa-star"></i>`;
  htmlCode += `<i class="fas fa-star"></i>`;
  htmlCode += `<i class="far fa-star"></i>`;
  htmlCode += `</span>`;
  htmlCode += `<span class="media__poster-score">${media.rating.average}</span>`;
  htmlCode += `</div>`;
  htmlCode += `</div>`;
  htmlCode += `</div>`;
  htmlCode += `<div class="media__simple-info">`;
  htmlCode += `<h4 class="media__poster-title">${media.name}</h4>`;
  htmlCode += `<p class="media__poster-year">${media.premiered}</p>`;
  htmlCode += `</div>`;
  htmlCode += `</article>`;
  return htmlCode;
};

/*************************
 *          API          *
 *************************/

const getApiSeriesById = (id) => {
  return fetch(`//api.tvmaze.com/shows/${id}`).then((response) =>
    response.json()
  );
};

const getApiSeriesByName = (query) => {
  return fetch(`//api.tvmaze.com/search/shows?q=${query}`).then((response) =>
    response.json()
  );
};

const getApiSeriesByGenre = () => {
  return fetch(`./public/api/genres.json`).then((response) => response.json());
};

// add / delete from favorites

const addToFavorites = (ev) => {
  console.log('ENter');
  const id = getClickedMediaId(ev);
  const heart = document.querySelector(`.make-favorite-heart[data-id="${id}"]`);
  // delete if already there

  if (section === 'Favorites') {
    console.log('FAvorites!');
    const mediaToDelete = document.querySelector(`[data-id="${id}"]`);
    const indexFound = favoriteSeries.findIndex((element) => element === id);
    favoriteSeries.splice(indexFound, 1);
    user['favoriteSeries'] = favoriteSeries;
    setInLocalStorage();
    heart.classList.remove('favorite-heart');
    mediaToDelete.style.display = 'none';

    console.log(mediaToDelete);
  } else {
    if (isMediaInList(id, favoriteSeries)) {
      const indexFound = favoriteSeries.findIndex((element) => element === id);
      favoriteSeries.splice(indexFound, 1);
      user['favoriteSeries'] = favoriteSeries;
      setInLocalStorage();
      heart.classList.remove('favorite-heart');
      // add to favorites
    } else {
      favoriteSeries.push(id);
      user['favoriteSeries'] = favoriteSeries;
      setInLocalStorage();
      heart.classList.add('favorite-heart');
    }
  }
  paintProfile();
  console.log(favoriteSeries);
};

// show favorites section
const showFavorites = () => {
  if (section !== 'Favorites' && favoriteSeries.length !== 0) {
    section = 'Favorites';
    changeGenreToAll();
    console.log('Section: ' + section);
    let mediaSelection = [];
    for (const id of favoriteSeries) {
      getApiSeriesById(id).then((data) => {
        // Check availabily
        if (data.status !== 404) {
          mediaSelection.push(data);
          checkImage(data);
        }
        paintSelection(mediaSelection);
        listenMakeFavoriteHeart();
        listenMakeWatchedEye();
        applyClassIfInList('.make-watched-eye', watchedSeries, 'watched-eye');
        applyClassIfInList(
          '.make-favorite-heart',
          favoriteSeries,
          'favorite-heart'
        );
        //   for (const heart of hearts) {
        //     heart.classList.add('favorite-heart');
        //   }
      });
    }
  }
};

/*****************************
 *       LISTEN EVENTS       *
 ****************************/

// btns add to watched

const listenMakeWatchedEye = () => {
  listenEvents('.media__poster-seen', addToWatched);
};

// btn show watched

const listenWatchedBtn = () => {
  const watchedBtnEl = document.querySelector('.js-watched-btn');
  watchedBtnEl.addEventListener('click', showWatched);
};

/*****************************
 *           HELPERS         *
 ****************************/

// add to watched

const addToWatched = (ev) => {
  const id = getClickedMediaId(ev);
  const eye = document.querySelector(`.make-watched-eye[data-id="${id}"]`);
  console.log(eye);
  // delete if already there

  if (section === 'Watched') {
    console.log('Watched!');
    const mediaToDelete = document.querySelector(`[data-id="${id}"]`);
    const indexFound = watchedSeries.findIndex((element) => element === id);
    watchedSeries.splice(indexFound, 1);
    user['watchedSeries'] = watchedSeries;
    setInLocalStorage();
    eye.classList.remove('watched-eye');
    mediaToDelete.style.display = 'none';
  } else {
    if (isMediaInList(id, watchedSeries)) {
      const indexFound = watchedSeries.findIndex((element) => element === id);
      watchedSeries.splice(indexFound, 1);
      user['watchedSeries'] = watchedSeries;
      setInLocalStorage();
      eye.classList.remove('watched-eye');
      // add to favorites
    } else {
      watchedSeries.push(id);
      user['watchedSeries'] = watchedSeries;
      setInLocalStorage();
      eye.classList.add('watched-eye');
    }
  }
  paintProfile();
  console.log(watchedSeries);
};

// show watched series

const showWatched = () => {
  if (section !== 'Watched' && watchedSeries.length !== 0) {
    section = 'Watched';
    changeGenreToAll();
    console.log('Section: ' + section);
    let mediaSelection = [];
    for (const id of watchedSeries) {
      getApiSeriesById(id).then((data) => {
        // Check availabily
        if (data.status !== 404) {
          mediaSelection.push(data);
          checkImage(data);
        }
        paintSelection(mediaSelection);
        listenMakeWatchedEye();
        listenMakeFavoriteHeart();
        applyClassIfInList('.make-watched-eye', watchedSeries, 'watched-eye');

        applyClassIfInList(
          '.make-favorite-heart',
          favoriteSeries,
          'favorite-heart'
        );

        //   const eyes = document.querySelectorAll('.make-watched-eye');
        //   for (const eye of eyes) {
        //     eye.classList.add('watched-eye');
        //   }
      });
    }
  }
};

// apply class if element is in a list
const applyClassIfInList = (selector, list, classToApply) => {
  const elements = document.querySelectorAll(selector);
  for (const element of elements) {
    const id = element.dataset.id;
    if (isMediaInList(id, list)) {
      element.classList.add(classToApply);
    }
  }
};

// show profile menu

const showProfileMenu = () => {
  const userMenuEl = document.querySelector('.profile__menu');
  userMenuEl.classList.toggle('expand');
  console.log('profile');
};

/*************************
 *     paint profile     *
 *************************/

const paintProfile = () => {
  const profileAreaEl = document.querySelector('.js-profile-menu');
  profileAreaEl.innerHTML = '';
  profileAreaEl.innerHTML = getProfileHtmlCode();
  const userMenuAvatarEl = document.querySelector('.user-profile');
  userMenuAvatarEl.style.backgroundImage = `url('${user.avatar}')`;
};

const getProfileHtmlCode = () => {
  let htmlCode = '';
  htmlCode += `<div class="avatar" style="background-image: url('${user.avatar}')"></div>`;
  htmlCode += `<h2 class="profile-name">${user.name}</h2>`;
  htmlCode += `<div class="">`;
  htmlCode += `  <ul class="profile__info">`;
  htmlCode += `    <li class="profile__section series">`;
  htmlCode += `      <span class="percentage">${calculatePerctTotalSeries(
    watchedSeries
  )}%</span>`;
  htmlCode += `      <span class="watched-info">Series watched: ${watchedSeries.length}</span>`;
  htmlCode += `   </li>`;
  //   htmlCode += `    <li class="profile__section movies">`;
  //   htmlCode += `      <span class="percentage">52%</span>`;
  //   htmlCode += `     <span class="watched-info">Movies watched: 23</span>`;
  //   htmlCode += `   </li>`;
  htmlCode += `   <li class="profile__section heart">`;
  htmlCode += `     <span class="percentage">${calculatePerctTotalSeries(
    favoriteSeries
  )}%</span>`;
  htmlCode += `     <span class="watched-info">Favorite series: ${favoriteSeries.length}</span>`;
  htmlCode += `    </li>`;
  htmlCode += `  </ul>`;
  htmlCode += `</div>`;

  htmlCode += `<div class="copyright">`;
  htmlCode += `<div class="creator-avatar"></div>`;
  htmlCode += `<h3 class="about-me">About me</h3>`;
  htmlCode += ` <p class="author-message">`;
  htmlCode += `   Apart from movies I also love`;
  htmlCode += `   <span class="keyword">programming</span> and`;
  htmlCode += `   <span class="keyword">learning languages!</span>`;
  htmlCode += ` </p>`;
  htmlCode += `  <p >`;
  htmlCode += `   Checkout my Github page for more:`;
  htmlCode += `</p>`;
  htmlCode += `<p class="github-info">`;
  htmlCode += `   <a class="github-link" href="https://github.com/elemarmar" target="_blank">`;
  htmlCode += `<i class="fab fa-github-alt"></i> Elemarmar 🦊`;
  htmlCode += `</a>`;
  htmlCode += `</p>`;
  htmlCode += `</div>`;

  return htmlCode;
};

// Mostrar mensaje de próxima feature

const listenErrorBtn = () => {
  const moviesBtnEl = document.querySelector('.search__movies');
  const listsBtnEl = document.querySelector('.user-lists');
  moviesBtnEl.addEventListener('click', showErrorMessage);
  listsBtnEl.addEventListener('click', showErrorMessage);
};

const showErrorMessage = () => {
  section = 'Error';
  const selectionArea = document.querySelector('.js-selection-area');
  selectionArea.innerHTML = '';
  let codeHTML = '';
  codeHTML += `<div class="error__container">`;
  codeHTML += '<h2 class="error-title">Ups ! </h2>';
  codeHTML +=
    '<p class="error-text">This feature is currently unavailable but will come out very soon. Stay tuned!</p>';
  codeHTML += `<div class="error-avatar" style="background-image: url('https://avatars.dicebear.com/api/avataaars/i1xim.svg?options[mouth][]=sad&options[style]=circle&options[eyes][]=roll&options[b]=%23900')"></div>`;
  codeHTML += `</div>`;
  selectionArea.innerHTML = codeHTML;
};

// start app

startWelcomeApp();


// Si el rating es null, no mostrarlo
// Mostrar número de stars en función de la nota

const checkRating = (result) => {
if (!result.rating.average)
};