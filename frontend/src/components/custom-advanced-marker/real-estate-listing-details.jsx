import React from 'react';
import './real-estate-listing-details.css';

const RealEstateListingDetails = ({ details }) => {
    const {
        property_address,
        property_price,
        listing_title,
        property_bedrooms,
        property_bathrooms,
        property_square_feet,
        listing_description
    } = details;

    return (
        <div className="details-container">
            <div className="listing-content">
                <h2>{listing_title}</h2>
                <p>{property_address}</p>
                <div className="details">
                    <div className="detail_item">
                         {property_square_feet.replace('sq ft', 'ft²')}
                    </div>
                    <div className="detail_item">
                         {property_bathrooms}
                    </div>
                    <div className="detail_item">
                         {property_bedrooms}
                    </div>
                </div>

                <p className="description">{listing_description}</p>

                <p className="price">{property_price}</p>
            </div>
        </div>
    );
};

export default RealEstateListingDetails;