import React, { useState } from 'react';
import { AdvancedMarker } from '@vis.gl/react-google-maps';

import RealEstateListingDetails from './real-estate-listing-details';
import RealEstateGallery from './real-estate-gallery';

import './custom-advanced-marker.css';
import classNames from 'classnames';

import frontImage from './data/images/model3-4.png';
import sideImage from './data/images/model3-5.jpg';
import backImage from './data/images/model3-3.jpg';

const CustomAdvancedMarker = ({ realEstateListing, onMarkerClick }) => {
    const [clicked, setClicked] = useState(false);
    const [hovered, setHovered] = useState(false);
    const position = {
        lat: realEstateListing.latitude,
        lng: realEstateListing.longitude
    };
    console.log("position");

    const handleClick = () => {
        setClicked(!clicked);
        onMarkerClick(position); // Pass out coordinates
    };

    const staticImages = [sideImage, frontImage, backImage];

    const renderCustomPin = () => {
        console.log("position");
        return (
            <>
                <div className="custom-pin">
                    <button className="close-button">
                        <span className="material-symbols-outlined"> close </span>
                    </button>

                    <div className="image-container">
                        <RealEstateGallery
                            images={staticImages}
                            isExtended={clicked}
                        />
                        <span className="icon">

            </span>
                    </div>

                    <RealEstateListingDetails details={realEstateListing} />
                </div>

                <div className="tip" />
            </>
        );
    };

    return (
        <>
            <AdvancedMarker
                position={position}
                title={'AdvancedMarker with custom html content.'}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className={classNames('real-estate-marker', { clicked, hovered })}
                onClick={handleClick}
            >
                {renderCustomPin()}
            </AdvancedMarker>
        </>
    );
};

export default CustomAdvancedMarker;