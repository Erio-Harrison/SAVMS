import React from 'react';
import './real-estate-listing-details.css';

const RealEstateListingDetails = ({ details }) => {
    const carData = {
        LicencePlate: details.licensePlate,
        CarModel: details.carModel,
        CarType: details.energyType,
        CarYear: details.year,
        Length: details.length,
        Width: details.width,
        Height: details.height
    };

    return (
        <div className="details-container">
            <div className="listing-content">
                <h2>{carData.LicencePlate}</h2>
                <p>{carData.CarModel}</p>
                <div className="details">
                    <div className="detail_item">
                         {carData.Length}
                    </div>
                    <div className="detail_item">
                         {carData.Width}
                    </div>
                    <div className="detail_item">
                         {carData.Height}
                    </div>
                </div>

                <p className="description">{carData.CarType}</p>

                <p className="price">{carData.CarYear}</p>
            </div>
        </div>
    );
};

export default RealEstateListingDetails;