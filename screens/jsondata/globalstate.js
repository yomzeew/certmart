import React, { createContext, useContext, useState, useEffect } from 'react';

const GlobalStateContext = createContext();

export const useGlobalState = () => {
    return useContext(GlobalStateContext);
};

export const GlobalStateProvider = ({ children }) => {
    const [allData, setAllData] = useState([]);
    const [countryData, setCountryData] = useState([]);
    const [stateData, setStateData] = useState([]);
    const [cityData, setCityData] = useState([]);
    // Fetch data function
    const fetchData = async () => {
        try {
            const response = await fetch('http://certmart.ng/countriesapi/data.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setAllData(data);

            const countries = data.map(item => item.name);
            setCountryData(countries);
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filterData = (country, state) => {
        if (!country) {
            return countryData;
        } else if (country && !state) {
            const countryInfo = allData.find(item => item.name === country);
            return countryInfo ? countryInfo.states.map(item => item.name) : [];
        } else if (country && state) {
            const countryInfo = allData.find(item => item.name === country);
            const stateInfo = countryInfo.states.find(item => item.name === state);
            return stateInfo ? stateInfo.cities.map(item => item.name) : [];
        }
        return [];
    };

    const value = {
        allData,
        countryData,
        stateData,
        cityData,
        filterData,
        setStateData,
        setCityData
    };

    return (
        <GlobalStateContext.Provider value={value}>
            {children}
        </GlobalStateContext.Provider>
    );
};
