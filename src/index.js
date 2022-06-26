// Import of styles
import './sass/index.scss';

// Import the function that executes the query to the server for the searched images
import { getImg } from './js/fetch';

// Import of Notiflix library
import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.5.min.css';

// Import of simpleLightbox library
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';


// Optimizing function (shortening the record) for searching for elements on the page
const qs = (selector) => document.querySelector(selector);

// Search for input and output elements
const searchForm = qs(".search-form");
const searchFormInput = qs(".search-form__input");
const loadMore = qs(".load-more");
const gallery = qs(".gallery");

let pagination;
let displayedImages;
let totalOfHits;
let lightbox;


searchForm.addEventListener("submit", newSearch);


loadMore.addEventListener("click", loadMoreImg);

function newSearch(e) {
  e.preventDefault();
  loadMore.style.display = "none"
  pagination = 1;
  displayedImages = 0;
  searchingImages();
  gallery.innerHTML = "";
}


function loadMoreImg() {
  pagination += 1;
  searchingImages();
}

function searchingImages() {
    getImg(searchFormInput.value, pagination)
    .then(images => {
      renderImages(images);
    })
    .catch(error => console.log(error));
}


function renderImages({hits, totalHits}) {
  totalOfHits = totalHits;

  const markups = hits.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => `
  <div class="gallery__item">
    <a class="gallery__link" href="${largeImageURL}"><img class="gallery__img" src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
    <div class="gallery__info">
      <p class="info__item">
        <b class="info__label">Likes</b>
        <span class="info__data">${likes}</span>
      </p>
      <p class="info__item">
        <b class="info__label">Views</b>
        <span class="info__data">${views}</span>
      </p>
      <p class="info__item">
        <b class="info__label">Comments</b>
        <span class="info__data">${comments}</span>
      </p>
      <p class="info__item">
        <b class="info__label">Downloads</b>
        <span class="info__data">${downloads}</span>
      </p>
    </div>
  </div>
  `)
  .join("");

  gallery.insertAdjacentHTML("beforeend", markups);

  if (typeof lightbox === "object") {
  lightbox.destroy();
  }

  lightbox = new SimpleLightbox(".gallery__item a");

  displayedImages += hits.length;
  imgLeft();

  if (displayedImages === 0) {
    Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
  } else if (displayedImages > 0 && displayedImages === totalOfHits) {
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
  }

  if (pagination > 1) {
    const { height: cardHeight } = document
    .querySelector('.gallery .gallery__item').getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
}

function imgLeft() {
  if (totalOfHits === displayedImages) {
    loadMore.style.display = "none";
  } else {
    loadMore.style.display = "block";
  }
}