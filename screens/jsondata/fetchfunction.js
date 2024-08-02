import AsyncStorage from "@react-native-async-storage/async-storage"

export const fetchData=async(country,state)=> {
    try{
   const data =await AsyncStorage.getItem('datacountry')
   const dataAll=JSON.parse(data)|| []
   if (!country) {
    return dataAll.map(item => item.name);
}

// Fetch state data
if (country && !state) {
    const countryData = dataAll.find(item => item.name === country);
    return countryData ? countryData.states.map(item => item.name) : [];
}

// Fetch city data
if (country && state) {
    const countryData = dataAll.find(item => item.name === country);
    const stateData = countryData ? countryData.states.find(item => item.name === state) : null;
    return stateData ? stateData.cities.map(item => item.name) : [];
}

} catch (error) {
console.error('There has been a problem with your fetch operation:', error);
return []; // Return an empty array or appropriate fallback data
}
  }