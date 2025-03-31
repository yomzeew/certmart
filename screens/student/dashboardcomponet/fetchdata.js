import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { allavailablecourse, issuesURL } from "../../../settings/endpoint";

export const fetchallavailablecourse = async (setshowpreloader) => {
  try {
    setshowpreloader(true);
    const token = await AsyncStorage.getItem("token");

    const response = await axios.get(allavailablecourse, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const getdata = response.data;
    console.log(getdata);

    const getcourse = [...new Set(getdata.map((item) => `${item.course}`))];

    return Promise.resolve(getcourse);
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data);
      console.error("Error status:", error.response.status);
      console.error("Error headers:", error.response.headers);
    } else if (error.request) {
      console.error("Error request:", error.request);
    } else {
      console.error("Error message:", error.message);
    }
    return Promise.reject(error);
  } finally {
    setshowpreloader(false);
  }
};

const BASE_URL = "your_base_url_here";


const setPreloader = (state) => {
    console.log("Preloader:", state ? "Loading..." : "Done");
};

// Get all issues
export const getIssuesByemail = async (email) => {
    setPreloader(true);
    try {
        const response = await axios.get(`${issuesURL}/${email}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching issues:", error);
    } finally {
        setPreloader(false);
    }
};

// Get issue by ID
export const getIssueById = async (id) => {
    setPreloader(true);
    try {
        const response = await axios.get(`${issuesURL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching issue:", error);
    } finally {
        setPreloader(false);
    }
};

// Create an issue
export const createIssue = async (issueData) => {
    try {
        // Convert to JSON to catch circular references before sending
        const safeData = JSON.parse(JSON.stringify(issueData));

        const response = await axios.post(issuesURL, safeData, {
            headers: { "Content-Type": "application/json" },
        });

        // Check if response status is successful
        if (response.status === 201 || response.status === 202 || response.status === 203) {
            return true;
        }
        return false; // Explicitly return false if not a successful status

    } catch (error) {
        console.error("Error creating issue:", error);
        return false; // Return false on error
    }
};


// Update an issue
export const updateIssue = async (id, updateData) => {
    setPreloader(true);
    try {
        const response = await axios.put(`${issuesURL}/${id}`, updateData, {
            headers: { "Content-Type": "application/json" },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating issue:", error);
    } finally {
        setPreloader(false);
    }
};

// Get course registrations by student ID
export const getCourseRegsByStudent = async (studentId) => {
    setPreloader(true);
    try {
        const response = await axios.get(`${BASE_URL}/courseregs/students`, {
            params: { id: studentId },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching course registrations:", error);
    } finally {
        setPreloader(false);
    }
};

// Get course registration details by event ID
export const getCourseRegDetails = async (eventId) => {
    setPreloader(true);
    try {
        const response = await axios.get(`${BASE_URL}/coursereg/details/${eventId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching course registration details:", error);
    } finally {
        setPreloader(false);
    }
};
