import { fetchImages } from './js/pixabay-api.js';
import { clearGallery, renderImages } from './js/render-functions.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');

let query = '';
let page = 1;
let lightbox;

form.addEventListener('submit', function(event) {
  event.preventDefault();

  query = form.elements.searchQuery.value.trim();
  if (!query) {
    iziToast.error({ title: 'Error', message: 'Please enter a search query!' });
    return;
  }

  page = 1;
  clearGallery(gallery);
  loader.classList.remove('is-hidden');

  fetchImages(query, page)
    .then(function(response) {
      loader.classList.add('is-hidden');
      if (response.hits.length === 0) {
        iziToast.warning({ title: 'No results', message: 'Sorry, no images found!' });
        return;
      }
      renderImages(response.hits, gallery);
      lightbox = new SimpleLightbox('.gallery a');
      lightbox.refresh();
    })
    .catch(function(error) {
      iziToast.error({ title: 'Error', message: error.message });
      loader.classList.add('is-hidden');
    });
});

window.addEventListener('scroll', function() {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
    page += 1;
    loader.classList.remove('is-hidden');

    fetchImages(query, page)
      .then(function(response) {
        loader.classList.add('is-hidden');
        renderImages(response.hits, gallery);
        lightbox.refresh();
      })
      .catch(function(error) {
        iziToast.error({ title: 'Error', message: error.message });
        loader.classList.add('is-hidden');
      });
  }
});