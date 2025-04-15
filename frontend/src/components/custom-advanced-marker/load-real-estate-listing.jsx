import frontImage from './data/images/model3-4.png';
import bedroomImage from './data/images/model3-5.jpg';
import backImage from './data/images/model3-3.jpg';

export async function loadRealEstateListing() {
    const url = new URL('./data/car-info.json', import.meta.url);

    const listing = await fetch(url)
        .then((res) => res.json());

    listing.images = [ bedroomImage, frontImage,backImage];

    return listing;
}