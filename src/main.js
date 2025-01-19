import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.getElementById('search-form');
const input = document.getElementById('search-input');
const gallery = document.getElementById('gallery');
const loader = document.getElementById('loader');

const API_KEY = 'YOUR_PIXABAY_API_KEY';
const API_URL = 'https://pixabay.com/api/';

let lightbox = new SimpleLightbox('#gallery a');

form.addEventListener('submit', async event => {
  event.preventDefault();
  const query = input.value.trim();

  if (!query) {
    iziToast.warning({ title: 'Warning', message: 'Search field is empty!' });
    return;
  }

  loader.classList.remove('hidden');
  gallery.innerHTML = '';

  try {
    const response = await axios.get(API_URL, {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      },
    });

    if (response.data.hits.length === 0) {
      iziToast.error({
        title: 'Error',
        message: 'Sorry, there are no images matching your search query.',
      });
    } else {
      const imagesMarkup = response.data.hits
        .map(
          ({
            webformatURL,
            largeImageURL,
            tags,
            likes,
            views,
            comments,
            downloads,
          }) =>
            `<li>
              <a href="${largeImageURL}">
                <img src="${webformatURL}" alt="${tags}" />
              </a>
              <div class="info">
                <p>Likes: ${likes}</p>
                <p>Views: ${views}</p>
                <p>Comments: ${comments}</p>
                <p>Downloads: ${downloads}</p>
              </div>
            </li>`
        )
        .join('');
      gallery.innerHTML = imagesMarkup;
      lightbox.refresh();
    }
  } catch (error) {
    iziToast.error({ title: 'Error', message: 'Failed to fetch images.' });
  } finally {
    loader.classList.add('hidden');
  }
});
