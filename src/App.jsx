import React, { useRef, useState, useEffect, useCallback } from "react";
import { sortPlacesByDistance } from "./loc.js";
import Places from "./components/Places.jsx";
import { AVAILABLE_PLACES } from "./data.js";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";

function App() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const selectedPlace = useRef(null);
  const [pickedPlaces, setPickedPlaces] = useState([]);
  const [availablePlaces, setAvailablePlaces] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES,
        position.coords.latitude,
        position.coords.longitude
      );
      setAvailablePlaces(sortedPlaces);
    });
  }, [AVAILABLE_PLACES]);

  useEffect(() => {
    const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
    const storedPlaces = storedIds
      .map((id) => AVAILABLE_PLACES.find((place) => place.id === id))
      .filter((place) => place !== undefined);
    setPickedPlaces(storedPlaces);
  }, []);

  function handleStartRemovePlace(id) {
    setModalIsOpen(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });

    const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
    if (storedIds.indexOf(id) === -1) {
      localStorage.setItem(
        "selectedPlaces",
        JSON.stringify([id, ...storedIds])
      );
    }
  }

  const handleRemovePlace = useCallback(
    function handleRemovePlace() {
      setPickedPlaces((prevPickedPlaces) =>
        prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
      );
      // setModalIsOpen(false);

      const storedIds = JSON.parse(
        localStorage.getItem("selectedPlaces") || []
      );
      localStorage.setItem(
        "selectedPlaces",
        JSON.stringify(storedIds.filter((id) => id !== selectedPlace.current))
      );
    },
    [selectedPlace]
  ); // Include selectedPlace in the dependencies array

  return (
    <>
      <Modal open={modalIsOpen}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
  <img src={logoImg} alt="Stylized globe" className="logo" />
  <h1 className="title">PlacePicker</h1>
  <p className="description">
    Create your personal collection of places you would like to visit or
    you have visited.
  </p>
</header>

<main>
  <Places
    title="I'd like to visit ..."
    fallbackText={"Select the places you would like to visit below."}
    places={pickedPlaces}
    onSelectPlace={handleStartRemovePlace}
  />
  <Places
    title="Available Places"
    fallbackText="Sorting places by distance.."
    places={availablePlaces}
    onSelectPlace={handleSelectPlace}
  />
</main>


      {/* <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={"Select the places you would like to visit below."}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          fallbackText="Sorting places by distance.."
          places={availablePlaces}
          onSelectPlace={handleSelectPlace}
        />
      </main> */}
    </>
  );
}

export default App;
