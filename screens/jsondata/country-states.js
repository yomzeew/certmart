import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { citylist, countrieslist, statelist, studycenter } from "../../settings/endpoint";

// ✅ Helper: Get token for headers
const getAuthHeaders = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  } catch (err) {
    console.error("Error getting token:", err);
    return { "Content-Type": "application/json" };
  }
};

export const getallcountries = async () => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(countrieslist, { headers });
    const newarraycountries = response.data || [];
    return newarraycountries.map((item) => item.name);
  } catch (error) {
    console.error("Error fetching countries:", error.message);
    return [];
  }
};

// country by id
export const getcountrybyid = async (countryid = 160) => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(`${countrieslist}`, { headers });
    const list = response?.data?.data ?? response?.data ?? [];
    const idNum = Number(countryid);
    const match = Array.isArray(list)
      ? list.find((item) => Number(item?.id) === idNum)
      : null;
    return match || null;
  } catch (error) {
    console.error("Error fetching countries:", error.message);
    return null;
  }
};

export const getstatebyid = async (stateid,countryid) => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(`${statelist}/${countryid}`, { headers });
    const list = response?.data?.data ?? response?.data ?? [];
    const idNum = Number(stateid);
    const match = Array.isArray(list)
      ? list.find((item) => Number(item?.id) === idNum)
      : null;
    return match || null;
  } catch (error) {
    console.error("Error fetching states:", error.message);
    return null;
  }
};


export const getallstates = async (country) => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(countrieslist, { headers });
    const newarraycountries = response.data || [];

    const newarray = newarraycountries.filter((item) => item.name === country);
    if (newarray.length === 0) throw new Error(`Country '${country}' not found`);

    const countryid = newarray[0].id;
    const allastates = await axios.get(`${statelist}/${countryid}`, { headers });
    const statedata = allastates.data || [];

    return statedata.map((item) => item.name);
  } catch (error) {
    console.error("Error fetching states:", error.message);
    return [];
  }
};

export const getcities = async (state, country) => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(countrieslist, { headers });
    const newarraycountries = response.data || [];

    const newarray = newarraycountries.filter((item) => item.name === country);
    if (newarray.length === 0) throw new Error(`Country '${country}' not found`);

    const countryid = newarray[0].id;
    const allastates = await axios.get(`${statelist}/${countryid}`, { headers });
    const statedata = allastates.data || [];

    const newarraystate = statedata.filter((item) => item.name === state);
    if (newarraystate.length === 0) throw new Error(`State '${state}' not found`);

    const stateid = newarraystate[0].id;
    const getcitydata = await axios.get(`${citylist}/${stateid}`, { headers });
    const datacity = getcitydata.data || [];

    const newdata = datacity.map((item) => `${item.name.toUpperCase()}`);
    return [newdata, newarraystate];
  } catch (error) {
    console.error("Error fetching cities:", error.message);
    return [[], []];
  }
};

export const getstudycenter = async (country, state, city, course) => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(countrieslist, { headers });
    const newarraycountries = response.data || [];

    const newarray = newarraycountries.filter((item) => item.name === country);
    if (newarray.length === 0) throw new Error(`Country '${country}' not found`);

    const countryid = newarray[0].id;
    const allastates = await axios.get(`${statelist}/${countryid}`, { headers });
    const statedata = allastates.data || [];

    const newarraystate = statedata.filter((item) => item.name === state);
    if (newarraystate.length === 0) throw new Error(`State '${state}' not found`);

    const stateid = newarraystate[0].id;
    const allcities = await axios.get(`${citylist}/${stateid}`, { headers });
    const citiesdata = allcities.data || [];

    const newarraycity = citiesdata.filter((item) => item.name.toLowerCase() === city.toLowerCase());
    if (newarraycity.length === 0) throw new Error(`City '${city}' not found`);

    const cityid = newarraycity[0].id;
    const getstudydata = await axios.get(
      `${studycenter}?country=${countryid}&state=${stateid}&city=${cityid}&course=${course}`,
      { headers }
    );

    const datastudy = getstudydata.data.data || [];
    console.log( getstudydata.data.data,'datastudy');
    return datastudy.map((item) => `${item.name.toUpperCase()}-${item.address}`);

  } catch (error) {
    console.error("Error fetching study centers:", error.message);
    return [];
  }
};
