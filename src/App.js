import {useEffect, useState} from 'react';
import './App.scss';
import Species from './Species';

const API_URL = 'https://swapi.dev/api/films/2/';
const SPECIES_IMAGES = {
  droid:
    'https://static.wikia.nocookie.net/starwars/images/f/fb/Droid_Trio_TLJ_alt.png',
  human:
    'https://static.wikia.nocookie.net/starwars/images/3/3f/HumansInTheResistance-TROS.jpg',
  trandoshan:
    'https://static.wikia.nocookie.net/starwars/images/7/72/Bossk_full_body.png',
  wookie:
    'https://static.wikia.nocookie.net/starwars/images/1/1e/Chewbacca-Fathead.png',
  yoda: 'https://static.wikia.nocookie.net/starwars/images/d/d6/Yoda_SWSB.png',
};
const CM_TO_IN_CONVERSION_RATIO = 2.54;

const fetchSpecies = (addToState, suscribe) => {
  fetch(API_URL)
    .then(response => response.json())
    .then(mainJson => {
      mainJson.species.forEach(specieUrl => {
        fetch(specieUrl)
          .then(response => response.json())
          .then(json => {
            if (suscribe) addToState(json);
          });
      });
    });
};

const getImageFromName = classification => {
  switch (classification.toLowerCase()) {
    case "yoda's species":
      return SPECIES_IMAGES.yoda;
    case 'trandoshan':
      return SPECIES_IMAGES.trandoshan;
    case 'wookie':
      return SPECIES_IMAGES.wookie;
    case 'human':
      return SPECIES_IMAGES.human;
    case 'droid':
      return SPECIES_IMAGES.droid;
    default:
      //In here we should put an error log if it's a required image.
      return '';
  }
};

function App() {
  const [speciesData, setSpeciesData] = useState([]);

  const addToState = specie => {
    let data = speciesData;
    data.push(specie);
    setSpeciesData(data);
  };

  useEffect(() => {
    let suscribe = true;
    fetchSpecies(addToState, suscribe);
    return () => {
      suscribe = false;
    };
  }, []);

  return (
    <div className="App">
      <h1>Empire Strikes Back - Species Listing</h1>
      <div className="App-species">
        {speciesData.map((specieData, i) => (
          <Species
            key={`${i}-${speciesData.name}`}
            name={specieData.name}
            classification={specieData.classification}
            designation={specieData.designation}
            height={`${
              specieData.average_height / CM_TO_IN_CONVERSION_RATIO
            }''`}
            image={getImageFromName(specieData.name)}
            language={specieData.language}
            numFilms={specieData.films.length}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
