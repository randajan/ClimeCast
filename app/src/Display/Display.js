import React from 'react';

import "./Display.css";

import clearday from './../img/icons/022-sun.svg';
import clearnight from './../img/icons/008-moon.svg';
import rain from './../img/icons/002-rain.svg';
import snow from './../img/icons/015-snow.svg';
import sleet from './../img/icons/013-snow.svg';
import wind from './../img/icons/034-wind.svg';
import fog from './../img/icons/038-fog.svg';
import cloudy from './../img/icons/001-cloudy.svg';
import partlycloudyday from './../img/icons/044-cloud.svg';
import partlycloudynight from './../img/icons/009-cloudy.svg';

import error from './../img/icons/045-eclipse.svg';
import loading from "./../img/loading.gif";

//create alias for Icon component
const THEMES = {
    "clear-day":{ico:clearday, bg:"#FFFFFF"},
    "clear-night":{ico:clearnight, bg:"#FFFFFF"},
    "rain":{ico:rain, bg:"#FFFFFF"},
    "snow":{ico:snow, bg:"#FFFFFF"},
    "sleet":{ico:sleet, bg:"#FFFFFF"},
    "wind":{ico:wind, bg:"#FFFFFF"},
    "fog":{ico:fog, bg:"#FFFFFF"},
    "cloudy":{ico:cloudy, bg:"#FFFFFF"},
    "partly-cloudy-day":{ico:partlycloudyday, bg:"#FFFFFF"},
    "partly-cloudy-night":{ico:partlycloudynight, bg:"#777777"},
    "loading":{ico:loading},
    "error":{ico:error}
}

//set page title
//@ title
const setTitle = title => document.title = [process.env.REACT_APP_NAME, title].join(" - ");

//function for change units
const fahrenheitToCelsius = value => Math.round(((value - 32) * (5/9))*10)/10;
const milesToKm = value => Math.round(value/1.6*10)/10;

//list of modifications in Row component
const VALUE_MODIFICATIONS = {
    percent:value => value*100,
    degree:fahrenheitToCelsius,
    distance:milesToKm,
    speed:milesToKm
};

//display icon
//@id
function Icon(props) {
    const theme = THEMES[props.id];
    return <img src={theme? theme.ico : ""} className="icon" alt={props.id} />
}

//display row in table
//@mod
//@label
//@value
function Row(props) {
    const value = VALUE_MODIFICATIONS[props.mod] ? VALUE_MODIFICATIONS[props.mod](props.value) : props.value; //modificate value
    return <tr><td>{props.label}</td><td><div className={props.mod}>{value}</div></td></tr>
}

//display loading
function Loading() {
    return <div className="display loading">
        <Icon id="loading"/>
        <div>Prohledávám oblohu...</div>
    </div>
}

//display error
//@message
function Error(props) {
    return <div className="display error">
        <Icon id="error"/>
        <div>{props.message || "Neznámá chyba"}</div>
    </div>
}


//display details of current state of weather
//expectiong currently object from darksky api response
//@value
function Details(props) {
    const curr = props.value;
    return (<table className="details">
        <tbody>
            <Row label="Pocitová teplota" mod="degree" value={curr.apparentTemperature} />
            <Row label="Rosný bod" mod="degree" value={curr.dewPoint} />
            <Row label="Pravděpodobnost srážek" mod="percent" value={curr.precipProbability}/>
            <Row label="Viditelnost" mod="distance" value={curr.visibility}/>
            <Row label="Vlhkost" mod="percent" value={curr.humidity}/>
            <Row label="Oblačnost" mod="percent" value={curr.cloudCover} />
            <Row label="Tlak" mod="milibar" value={curr.pressure}/>
            <Row label="Rychlost větru" mod="speed" value={curr.windSpeed}/>
            <Row label="Nárazový vítr" mod="speed" value={curr.windGust}/>
            <Row label="Ozón" mod="dobson" value={curr.ozone}/>
            <Row label="UV index" value={curr.uvIndex}/>
        </tbody>
    </table>)
}

async function fetchCityWeather(city) {
    const uri = `${process.env.REACT_APP_API_DOMAIN}?lat=${city.lat}&lon=${city.lon}`;
    return fetch(uri).then(response => response.json())
}

//aktuálně zobrazené informace
let displayedPlace;

//fetch data for selected city
//handle loading and error
//@place
function Display(props) {
    const [ state, setState] = React.useState({
        status:"loading",
        error:null,
        details:null
    });

    //fetch new data
    if (props.place !== displayedPlace) {
        displayedPlace = props.place;
        const city = props.place ? props.place.city : null

        setState({
            status:city ? "loading" : "error",
            error:city ? "" : "Město nenalezeno"
        });

        if (city) {
            fetchCityWeather(city)
            .then(data => setState({
                status:"done",
                details:data
            }))
            .catch(e => {
                console.log("error", e); 
                setState({
                    status:"error",
                    error:"Chyba stažení dat"
                });
            })
        }
    }

    if (state.status === "loading") {
        setTitle("Loading...");
        return <Loading/>;
    };

    const details = state.details;
    const curr = details ? details.currently : null;

    if (state.status.error || !curr) {
        setTitle("Error");
        return <Error message={state.error}/>;
    };

    setTitle(`${props.place.city.label} (${props.place.country.value})`);
    return <div className="display">
        <Icon id={curr.icon} />
        <div className="maindegree">{fahrenheitToCelsius(curr.temperature)}</div>
        <div className="summary">{curr.summary}</div>
        <Details value={curr}/>
    </div>
    
}

export default Display;