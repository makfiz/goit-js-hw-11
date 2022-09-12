import { Notify } from "notiflix";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import ImgApiService from './js/img-service';

const imgApiService = new ImgApiService()

const searchForm = document.querySelector(".search-form")
const loadMoreBtn = document.querySelector(".load-more")
const containerGallery = document.querySelector(".gallery")

searchForm.addEventListener("submit", onSearch)
// loadMoreBtn.addEventListener("click", loadMore)
window.addEventListener('scroll', throttle(checkPosition, 400))
window.addEventListener('resize', throttle(checkPosition, 400))

async function onSearch(e) {
    e.preventDefault()

    imgApiService.query = e.currentTarget.elements.searchQuery.value
    imgApiService.page = 1
    
    const response = await imgApiService.fetchIMG()
    const searchResults = response.data.hits
       
    if (searchResults.length == 0) {
        Notify.failure("Sorry, there are no images matching your search query. Please try again.")
        return
    }
    Notify.success(`Hooray! We found ${response.data.totalHits} images.`)
    window.scrollTo(0,0)
    containerGallery.innerHTML = ''
    renderGallery(searchResults)
    
    
}

// async function loadMore() {
// }

async function renderGallery(searchResults) {
    let temp = await searchResults.map((img) => 
    `<a class="gallery__item" href="${img.largeImageURL}"><div class="photo-card">
    <img src="${img.webformatURL}" alt="${img.tags}" loading="lazy" />
    <div class="info">
        <p class="info-item">
            <b>Likes</b>
            <span>${img.likes}</span> 
        </p>
        <p class="info-item">
            <b>Views</b>  
            <span>${img.views}</span> 
            </p>
        <p class="info-item">
            <b>Comments</b>  
            <span>${img.comments}</span> 
        </p>
        <p class="info-item">
            <b>Downloads</b>  
            <span>${img.downloads}</span> 
        </p>
    </div>
    </div></a>`
    ).join('')
    containerGallery.insertAdjacentHTML('beforeend', temp)
    gallery.refresh()
    
}

// gallery
containerGallery.addEventListener("click", onClickShowSimplelightbox)

let gallery = new SimpleLightbox('.gallery a', {
    captionsData: "alt",
    captionDelay: 250,  
});  

function onClickShowSimplelightbox(evt) {
    evt.preventDefault();

    if (evt.target.nodeName !== 'IMG') {
        return
    }

    gallery.on('show.simplelightbox');   
}
// end gallery

// window.addEventListener('scroll', () => {
//     const docRect = document.documentElement.getBoundingClientRect();
//     if (docRect.bottom < document.documentElement.clientHeight + 150) {
//          console.log('done');
//     }
// })



async function checkPosition() {

  const height = document.body.offsetHeight
  const screenHeight = window.innerHeight
  const scrolled = window.scrollY
  const threshold = height - screenHeight / 4
  const position = scrolled + screenHeight

  if (position >= threshold) {
    const response = await imgApiService.fetchIMG()

    if (Math.sign(response.data.totalHits - 40 * (imgApiService.getpage - 1)) == -1) {
        Notify.failure("We're sorry, but you've reached the end of search results.")
        return 
    }
    const searchResults = response.data.hits
    renderGallery(searchResults)
  }
}

function throttle(callee, timeout) {
  let timer = null

  return function perform(...args) {
    if (timer) return

    timer = setTimeout(() => {
      callee(...args)

      clearTimeout(timer)
      timer = null
    }, timeout)
  }
}