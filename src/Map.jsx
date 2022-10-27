import React, { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";
import LocationPin from "./LocationPin";
import "./map.css";

const Map = ({ stores, zoomLevel, apiKey }) => {
  const [locationPinsProps, setLocationPinsProps] = useState([]);
  useEffect(() => {
    const fetchLocationPinsProps = async (store) => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${store.Address}&key=${apiKey}`
        );
        const json = await response.json();
        const location = json.results[0].geometry.location;
        return { text: store.Name, lat: location.lat, lng: location.lng };
      } catch (e) {
        return { text: "Not Found", lat: 0, lng: 0 };
      }
    };
    const loadLocations = async () =>
      setLocationPinsProps(
        await Promise.all(stores.map(fetchLocationPinsProps))
      );
    loadLocations();
  }, []);
  return (
    <div className="map">
      <h2 className="map-h2">Mapa de la CDMX</h2>

      <div className="google-map">
        <GoogleMapReact
          bootstrapURLKeys={{ key: apiKey }}
          yesIWantToUseGoogleMapApiInternals
          defaultCenter={{ lat: 19.432608, lng: -99.133209 }}
          defaultZoom={zoomLevel}
        >
          {locationPinsProps
            .filter((props) => props.lat !== 0 && props.lng !== 0)
            .map((props) => (
              <LocationPin
                key={`${props.lat}|${props.lng}`}
                lat={props.lat}
                lng={props.lng}
                text={props.text}
              />
            ))}
        </GoogleMapReact>
      </div>
    </div>
  );
};
export default Map;
