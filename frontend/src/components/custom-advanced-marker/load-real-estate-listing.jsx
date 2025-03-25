import frontImage from './data/images/front.jpg';
import bedroomImage from './data/images/bedroom.jpg';
import backImage from './data/images/back.jpg';

export async function loadRealEstateListing() {
    const url = new URL('./data/real-estate-listing.json', import.meta.url);

    const listing = await fetch(url)
        .then((res) => res.json());

    listing.images = [frontImage, bedroomImage, backImage];

    return listing;
}