import React, { useEffect } from 'react';
import { APILoader } from 'https://ajax.googleapis.com/ajax/libs/@googlemaps/extended-component-library/0.6.11/index.min.js';
import '../assets/LocationCSS.css'; // 之前给你的样式文件

const CONFIGURATION = {
    ctaTitle: "Checkout",
    mapOptions: {
        center: { lat: 37.4221, lng: -122.0841 },
        fullscreenControl: true,
        mapTypeControl: false,
        streetViewControl: true,
        zoom: 11,
        zoomControl: true,
        maxZoom: 22,
        mapId: "",
    },
    mapsApiKey: "AIzaSyAK5sOuhbu2YLq7Y7lswOC1R7lRzMnPBVk",
    capabilities: {
        addressAutocompleteControl: true,
        mapDisplayControl: true,
        ctaControl: true,
    },
};

const SHORT_NAME_ADDRESS_COMPONENT_TYPES = new Set([
    "street_number",
    "administrative_area_level_1",
    "postal_code",
]);

const ADDRESS_COMPONENT_TYPES_IN_FORM = [
    "location",
    "locality",
    "administrative_area_level_1",
    "postal_code",
    "country",
];

function getFormInputElement(componentType) {
    return document.getElementById(`${componentType}-input`);
}

function fillInAddress(place) {
    function getComponentName(componentType) {
        for (const component of place.address_components || []) {
            if (component.types[0] === componentType) {
                return SHORT_NAME_ADDRESS_COMPONENT_TYPES.has(componentType)
                    ? component.short_name
                    : component.long_name;
            }
        }
        return "";
    }

    function getComponentText(componentType) {
        return componentType === "location"
            ? `${getComponentName("street_number")} ${getComponentName("route")}`
            : getComponentName(componentType);
    }

    for (const componentType of ADDRESS_COMPONENT_TYPES_IN_FORM) {
        const input = getFormInputElement(componentType);
        if (input) {
            input.value = getComponentText(componentType);
        }
    }
}

function renderAddress(place) {
    const mapEl = document.querySelector("gmp-map");
    const markerEl = document.querySelector("gmp-advanced-marker");

    if (place.geometry && place.geometry.location) {
        mapEl.center = place.geometry.location;
        markerEl.position = place.geometry.location;
    } else {
        markerEl.position = null;
    }
}

export default function AddressSelection() {
    useEffect(() => {
        async function initMap() {
            const { Autocomplete } = await APILoader.importLibrary("places");

            const mapOptions = { ...CONFIGURATION.mapOptions };
            mapOptions.mapId = mapOptions.mapId || "DEMO_MAP_ID";
            mapOptions.center = mapOptions.center || { lat: 37.4221, lng: -122.0841 };

            await customElements.whenDefined("gmp-map");
            document.querySelector("gmp-map").innerMap.setOptions(mapOptions);

            const autocomplete = new Autocomplete(getFormInputElement("location"), {
                fields: ["address_components", "geometry", "name"],
                types: ["address"],
            });

            autocomplete.addListener("place_changed", () => {
                const place = autocomplete.getPlace();
                if (!place.geometry) {
                    window.alert(`No details available for input: '${place.name}'`);
                    return;
                }
                renderAddress(place);
                fillInAddress(place);
            });
        }
        initMap();
    }, []);

    return (
        <>
            <gmpx-api-loader
                key={CONFIGURATION.mapsApiKey}
                solution-channel="GMP_QB_addressselection_v4_cABC"
            ></gmpx-api-loader>

            <gmpx-split-layout row-layout-min-width="600">
                <div className="panel" slot="fixed">
                    <div>
                        <img
                            className="sb-title-icon"
                            src="https://fonts.gstatic.com/s/i/googlematerialicons/location_pin/v5/24px.svg"
                            alt=""
                        />
                        <span className="sb-title">Address Selection</span>
                    </div>

                    <input type="text" placeholder="Address" id="location-input" />
                    <input type="text" placeholder="Apt, Suite, etc (optional)" />
                    <input type="text" placeholder="City" id="locality-input" />
                    <div className="half-input-container">
                        <input
                            type="text"
                            className="half-input"
                            placeholder="State/Province"
                            id="administrative_area_level_1-input"
                        />
                        <input
                            type="text"
                            className="half-input"
                            placeholder="Zip/Postal code"
                            id="postal_code-input"
                        />
                    </div>
                    <input type="text" placeholder="Country" id="country-input" />
                    <gmpx-icon-button variant="filled">{CONFIGURATION.ctaTitle}</gmpx-icon-button>
                </div>

                <gmp-map slot="main">
                    <gmp-advanced-marker></gmp-advanced-marker>
                </gmp-map>
            </gmpx-split-layout>
        </>
    );
}
