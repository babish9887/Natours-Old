const bookBtn = document.getElementById('book-tour');
import { bookTour } from './stripe';



if (bookBtn)
console.log('book tour present')
bookBtn.addEventListener('click', e => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
});


const mapBox = document.getElementById('map');



if(mapBox){
    const locations= JSON.parse(mapBox.dataset.locations);
    displayMap(locations);
}

export const displayMap = (locations) => {
    mapboxgl.accessToken =
    'pk.eyJ1Ijoiam9uYXNzY2htZWR0bWFubiIsImEiOiJjam54ZmM5N3gwNjAzM3dtZDNxYTVlMnd2In0.ytpI7V7w7cyT1Kq5rT9Z1A';
    
    
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        scrollZoom: false
        // center: [-118.113491,34.111745],
        // zoom: 10,
        // interactive: false
    })
    
    const bounds=new mapboxgl.LngLatBounds();
    
    locations.forEach(loc=>{
        const el = document.createElement('div');
        el.className='marker';
    
        new mapboxgl.Marker({
            element: el,
            anchor: 'bottom'
        }).setLngLat(loc.coordinates).addTo(map);
    
        new mapboxgl.Popup({
            offset: 30
        }).setLngLat(loc.coordinates).setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`).addTo(map)
    
        bounds.extend(loc.coordinates);
    })
    
    map.fitBounds(bounds, {
        padding:{
            top: 200,
            bottom:120,
            left: 100,
            right: 100
    
        }
    });
}

