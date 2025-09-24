import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  allavailablecourse,
  BaseURi,
  certificateUrl,
  eresourcesUrl,
  issuesURL,
  trainerByIdUrl,
} from "../../../settings/endpoint";

// Get token utility
const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// Fetch all available courses
export const fetchallavailablecourse = async (setshowpreloader) => {
  try {
    setshowpreloader(true);
    const headers = await getAuthHeaders();
    const response = await axios.get(allavailablecourse, { headers });

    const getdata = response.data;
    const getcourse = [...new Set(getdata.map((item) => item.course))];

    return getcourse;
  } catch (error) {
    // Axios specific error handling
    if (error.response) {
      // Server responded with a status outside 2xx
      console.error("📌 Server Error while fetching courses:");
      console.error("Status:", error.response.status);
      console.error("Headers:", error.response.headers);
      console.error("Data:", error.response.data);
    } else if (error.request) {
      // No response from server
      console.error("📌 Network Error: No response received from server.");
      console.error("Request:", error.request);
    } else {
      // Error during request setup
      console.error("📌 Request Setup Error:", error.message);
    }

    // Catch-all for stack trace
    console.error("📌 Full Error Object:", error);

    throw error; // rethrow so caller can handle (UI, retry, etc.)
  } finally {
    setshowpreloader(false);
  }
};


// Get all issues
export const getIssuesByemail = async (email) => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(`${issuesURL}?email=${email}`, { headers });
    console.log(response.data,'response.data')
    return response.data;
  } catch (error) {
    console.error("Error fetching issues:", error);
    throw error;
  }
};

// Get issue by ID
export const getIssueById = async (id) => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(`${issuesURL}/${id}`, { headers });
    return response.data;
  } catch (error) {
    console.error("Error fetching issue:", error);
    throw error;
  }
};

// Create an issue
export const createIssue = async (issueData) => {
  try {
    const headers = await getAuthHeaders();
    const safeData = JSON.parse(JSON.stringify(issueData));
    const response = await axios.post(issuesURL, safeData, { headers });

    return [201, 202, 203].includes(response.status);
  } catch (error) {
    console.error("Error creating issue:", error);
    return false;
  }
};

// Update an issue
export const updateIssue = async (id, updateData, setPreloader) => {
  setPreloader(true);
  try {
    const headers = await getAuthHeaders();
    const response = await axios.put(`${issuesURL}/${id}`, updateData, { headers });
    return response.data;
  } catch (error) {
    console.error("Error updating issue:", error);
    throw error;
  } finally {
    setPreloader(false);
  }
};

// Get course registrations by student ID
export const getCourseRegsByStudent = async (studentId) => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(`${BaseURi}/courseregs/students`, {
      params: { id: studentId },
      headers,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching course registrations:", error);
    throw error;
  }
};

// Get course registration details by event ID
export const getCourseRegDetails = async (eventId, setPreloader) => {
  setPreloader(true);
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(`${BaseURi}/coursereg/details/${eventId}`, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching course registration details:", error);
    throw error;
  } finally {
    setPreloader(false);
  }
};

// Get e-resource
export const getEresource = async (students) => {
  const studentId = encodeURIComponent(students);
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(`${eresourcesUrl}/students?id=${studentId}`, { headers });
    return response.data;
  } catch (error) {
    console.error("Error fetching e-resource:", error);
    throw error;
  }
};

// Get certificate
export const getCertificate = async (students) => {
  const studentId = encodeURIComponent(students);
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(`${certificateUrl}/students?id=${studentId}`, { headers });
    console.log(response.data,'response.data')
    return response.data;
  } catch (error) {
    console.error("Error fetching certificate:", error);
    throw error;
  }
};

// Get trainer
export const getTrainer = async (trainerid, setPreloader) => {
  setPreloader(true);
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(`${trainerByIdUrl}?trainerid=${trainerid}`, { headers });
    return response.data;
  } catch (error) {
    console.error("Error fetching trainer:", error);
    throw error;
  } finally {
    setPreloader(false);
  }
};
