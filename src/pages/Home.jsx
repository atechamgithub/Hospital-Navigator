import { useState, useEffect, useRef } from "react";
import { GoogleMap, InfoWindow, LoadScript, Marker } from "@react-google-maps/api";
import { toast } from "react-toastify";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

const API_KEY = import.meta.env.VITE_GOOGLE_MAP_API_KEY;

const Home = () => {
  const { user, isAuthenticated } = useAuth0();
  const [location, setLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const mapRef = useRef(null);

  const url = "https://places.googleapis.com/v1/places:searchNearby";

  useEffect(() => {
    if (location) {
      const requestBody = {
        includedTypes: ["hospital"],
        maxResultCount: 10,
        locationRestriction: {
          circle: {
            center: { latitude: location.lat, longitude: location.lng },
            radius: 5000.0,
          },
        },
      };
      fetchData(requestBody);
    }
  }, [location]);

  const fetchData = async (requestBody) => {
    try {
      const response = await axios.post(
        url,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": API_KEY,
            "X-Goog-FieldMask": "*",
          },
        }
      );
      setHospitals(response.data.places || []);
    } catch (error) {
      console.error("Error fetching nearby places:", error);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      const toastId = toast.info("Fetching location...", { autoClose: false });

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });

          toast.update(toastId, {
            render: "Location fetched successfully!",
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });
        },
        (error) => {
          toast.update(toastId, {
            render: "Error fetching location. Please enable location services.",
            type: "error",
            isLoading: false,
            autoClose: 5000,
          });
          console.error("Error fetching location:", error);
        },
        { enableHighAccuracy: true }
      );
    } else {
      toast.warning("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          {!isAuthenticated ? (
            <div>
              <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
                Welcome to <span className="text-indigo-600">Hospital Navigator</span>
              </h1>
              <div className="flex justify-center mt-4">
                <img
                  className="rounded-sm shadow-xl"
                  src="https://www.shutterstock.com/image-photo/blue-location-pin-symbol-on-260nw-2492918963.jpg"
                  alt="Hospital Navigator"
                />
              </div>
            </div>
          ) : (
            <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              Welcome {user.name}
            </h2>
          )}
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            See your Nearest Hospital.
          </p>
        </div>
        {isAuthenticated && (
          <LoadScript googleMapsApiKey={API_KEY} libraries={["places"]}>
            {location ? (
              <GoogleMap
                center={location}
                zoom={14}
                mapContainerClassName="w-full h-96 rounded-lg shadow-lg border border-gray-300"
                onLoad={(map) => {
                  mapRef.current = map;
                }}
              >
                <Marker position={location} label="You" />

                {hospitals.map((hospital, index) => (
                  <Marker
                    key={index}
                    onClick={() => setSelectedHospital(hospital)}
                    position={{
                      lat: hospital.location.latitude,
                      lng: hospital.location.longitude,
                    }}
                  />
                ))}

                {selectedHospital && (
                  <InfoWindow
                    position={{
                      lat: selectedHospital.location.latitude,
                      lng: selectedHospital.location.longitude,
                    }}
                    onCloseClick={() => setSelectedHospital(null)}
                  >
                    <div className="bg-white shadow-lg p-4 rounded-lg text-sm border border-gray-200 w-52">
                      <h4 className="font-semibold text-gray-800">
                        {selectedHospital.displayName?.text || "Unknown Hospital"}
                      </h4>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            ) : (
              <div className="flex justify-center items-center h-96 text-gray-500">
                <p className="text-lg font-medium animate-pulse">Loading map...</p>
              </div>
            )}
          </LoadScript>
        )}
      </div>
    </div>
  );
};

export default Home;