import { fetchImages } from './js/pixabay-api';
import { renderGallery, clearGallery } from './js/render-functions';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.search-form');
const loader = document.querySelector('.loader');

let currentPage = 1;
let currentQuery = '';
const perPage = 12;

form.addEventListener('submit', onSearch);

async function onSearch(e) {
  e.preventDefault();
  const query = e.currentTarget.elements.search.value.trim();

  if (!query) {
    iziToast.warning({
      title: 'Warning',
      message: 'Search query cannot be empty!',
      position: 'topRight',
    });
    return;
  }

  currentQuery = query;
  currentPage = 1;
  clearGallery();
  toggleLoader(true);

  try {
    const data = await fetchImages(currentQuery, currentPage, perPage);

    if (data.hits.length === 0) {
      iziToast.error({
        title: 'Error',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      return;
    }
    renderGallery(data.hits);
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: `Something went wrong: ${error.message}`,
      position: 'topRight',
    });
  } finally {
    toggleLoader(false);
  }
}

const toggleLoader = isLoading =>
  (loader.style.display = isLoading ? 'inline-block' : 'none');
