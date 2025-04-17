import React, { useState } from 'react';
import { AdvancedMarker } from '@vis.gl/react-google-maps';

import RealEstateListingDetails from './real-estate-listing-details';
import RealEstateGallery from './real-estate-gallery';

import './custom-advanced-marker.css';
import classNames from 'classnames';

const CustomAdvancedMarker = ({ realEstateListing, onMarkerClick }) => {
    const [clicked, setClicked] = useState(false);
    const [hovered, setHovered] = useState(false);
    const position = {
        lat: realEstateListing.location.latitude,
        lng: realEstateListing.location.longitude
    };

    const handleClick = () => {
        setClicked(!clicked);
        onMarkerClick(position); // 传出坐标
    };

    const renderCustomPin = () => {
        return (
            <>
                <div className="custom-pin">
                    <button className="close-button">
                        <span className="material-symbols-outlined"> close </span>
                    </button>

                    <div className="image-container">
                        <RealEstateGallery
                            images={realEstateListing.images}
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