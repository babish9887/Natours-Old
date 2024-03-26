const bookBtn = document.getElementById('book-tour');
import { bookTour } from './stripe';



if(bookBtn){
bookBtn.addEventListener('click', e => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
});
}
