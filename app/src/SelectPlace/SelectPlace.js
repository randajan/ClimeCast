import React from 'react';
import Select from 'react-select';


import countries from "./../countries.json";
import cities from "./../cities.json";

//select place
//@place
//@setPlace
function SelectPlace(props) {
    return ( 
        <div className="selectPlace">
            <Select
                value={props.place.country}
                onChange={country => {
                    props.setPlace({
                        country:country,
                        city:cities[country.value][0]
                    })
                }}
                options={countries}
                placeholder="Vyber zemi..."
                isSearchable={true}
            />
            <Select
                value={props.place.city}
                onChange={city => {
                    props.setPlace({
                        country:props.place.country,
                        city:city
                    })
                }}
                options={cities[props.place.country.value]}
                placeholder="Vyber město..."
                isSearchable={true}
            />
        </div>
    )
}

export default SelectPlace;
