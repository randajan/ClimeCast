import React, {useState} from 'react';


import SelectPlace from "./../SelectPlace/SelectPlace";
import Display from "./../Display/Display";


import './App.css';


const DEFAULT_COUNTRY = {"value":"CZ","label":"Česká republika"};
const DEFAULT_CITY = {"label":"Prague","lon":14.42076,"lat":50.088039};

function App() {

  const [place, setPlace] = useState({
    country:DEFAULT_COUNTRY,
    city:DEFAULT_CITY
  });

  return (<div className="App"> 
    <nav>
      <SelectPlace place={place} setPlace={setPlace} />
  
    </nav>

    <Display place={place} />

    
  </div>)
}

export default App;
