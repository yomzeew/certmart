import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    allavailablecourse,
    loginstudent,
    registerstudent,
    coursescategories,
    studentdetails,
    conversion,
    topTrainers,
    applyAdmission,
    popularcourses,
    coursescategoriesfilter,
    allTrainers,
    BaseURi,
    classes,
    getCourseStatus,
    updatedetails,
    updateProfilePic,
    trainerByIdUrl,
    forgotpassword,
    couponUrl,
    appliedCouponUrl,
    ratingUrl,
    feedbackUrl,
    endClassUrl,
} from "../settings/endpoint";

export const fetchCourses = async (course) => {
    try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get(allavailablecourse, {
            headers: { Authorization: `Bearer ${token}` },
        });

        // Filter and remove duplicates
        const filteredCourses = response.data.filter(
            (item) => item.courses === course
        );

        const uniqueCourses = filteredCourses.filter(
            (item, index, self) =>
                index === self.findIndex((c) =>
                    c.id
                        ? c.id === item.id
                        : (
                            c.courses === item.courses &&
                            c.tfirstname === item.tfirstname &&
                            c.tsurname === item.tsurname &&
                            c.classType === item.classType &&
                            c.duration === item.duration
                        )
                )
        );

        return uniqueCourses;
    } catch (error) {
        console.error("Error fetching courses:", error);
        throw error;
    }
};

export const loginUser = async (email, password) => {
    try {
        const data = { email, password };

        const response = await axios.post(loginstudent, data, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            timeout: 10000, // Timeout in milliseconds (10 seconds)
        });

        return response.data; // Return the response data
    } catch (error) {
        if (error.message === "Network Timeout") {
            throw new Error("The request timed out. Please try again.");
        } else if (error.response) {
            throw new Error(error.response.data.error || "An error occurred.");
        } else if (error.request) {
            throw new Error("No response from server. Please try again.");
        } else {
            throw new Error("An error occurred. Please try again.");
        }
    }
};

export const registerUser = async (data) => {
    try {
        const response = await axios.post(registerstudent, data, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });

        return response.data; // Return the response data
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || "An error occurred.");
        } else if (error.request) {
            throw new Error("No response from server. Please try again.");
        } else {
            throw new Error("An error occurred. Please try again.");
        }
    }
};

export const fetchCategories = async () => {
    try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get(coursescategories, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data.categories; // Return the categories data
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || "An error occurred.");
        } else if (error.request) {
            throw new Error("No response from server. Please try again.");
        } else {
            throw new Error("An error occurred. Please try again.");
        }
    }
};

export const fetchStudentDetails = async (dispatch, loginAction) => {
    try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get(studentdetails, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 200) {
            dispatch(loginAction(response.data));
            await AsyncStorage.setItem("studentid", response.data.studentid);
        }
    } catch (error) {
        handleApiError(error);
    }
};

export const fetchStudentProfile = async () => {
    try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get(studentdetails, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const updateStudentProfile = async (id, updatedData) => {
    try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.put(`${updatedetails}/${id}`, updatedData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const uploadProfilePicture = async (imageUri, studentId) => {
    try {
        const formData = new FormData();
        formData.append("file", {
            uri: imageUri,
            type: "image/jpeg",
            name: `${studentId}.jpg`,
        });

        const token = await AsyncStorage.getItem("token");
        const response = await axios.post(updateProfilePic, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const convertCurrency = async (amount_ngn, convert_to) => {
    try {
        const token = await AsyncStorage.getItem("token");
        const data = { amount_ngn, convert_to };

        const response = await axios.post(conversion, data, {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 10000, // Timeout in milliseconds (10 seconds)
        });

        return response.data.amount_to; // Return the converted amount
    } catch (error) {
        if (error.message === "Network Timeout") {
            throw new Error("The request timed out. Please try again.");
        } else if (error.response) {
            throw new Error(error.response.data.error || "An error occurred.");
        } else if (error.request) {
            throw new Error("No response from server. Please try again.");
        } else {
            throw new Error("An error occurred. Please try again.");
        }
    }
};

export const fetchTopTrainers = async () => {
    try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get(topTrainers, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data; // Return the trainers data
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || "An error occurred.");
        } else if (error.request) {
            throw new Error("No response from server. Please try again.");
        } else {
            throw new Error("An error occurred. Please try again.");
        }
    }
};

export const fetchAvailableCourses = async () => {
    try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get(allavailablecourse, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const submitApplication = async (formData) => {
    try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.post(applyAdmission, formData, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        handleApiError(error);
    }
};

export const fetchPopularCourses = async () => {
    try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get(popularcourses, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const fetchCoursesByCategory = async (category) => {
    try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get(`${coursescategoriesfilter}category=${category}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

// Make sure these are imported at top of the file:
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";
// import { getCourseStatus, classes, allTrainers, BaseURi } from "your/endpoints/path";

export const fetchStudentClasses = async () => {
    try {
      // --- 1) get token + studentId ---
      const token = await AsyncStorage.getItem("token");
      const studentId = await AsyncStorage.getItem("studentid");
  
      if (!token || !studentId) {
        throw new Error("Missing token or student ID");
      }
  
      const headers = { Authorization: `Bearer ${token}` };
  
      // --- 2) fetch approvedCourses, paidCourses, trainers in parallel ---
      const [
        approvedRes,
        paidRes,
        trainersRes
      ] = await Promise.all([
        axios.get(`${getCourseStatus}/approved`, { params: { studentid: studentId }, headers }),
        axios.get(`${classes}/students`, { params: { id: studentId }, headers }),
        axios.get(allTrainers, { headers })
      ]);
  
      const approvedCourses = approvedRes?.data || [];
      const paidCourses = paidRes?.data || [];
      console.log(trainersRes.data.data,'trainersRes')
      const trainers = trainersRes?.data.data || [];
  
      console.log("approvedCourses.length:", approvedCourses.length);
      console.log("paidCourses.length:", paidCourses);
      console.log("trainers.length:", trainers.length);
  
      // --- 3) fetch availability per approved course and store in a map keyed by courseid ---
      const availabilityMap = {}; // { [courseid]: [availabilities] }
  
      await Promise.all(
        approvedCourses.map(async (course) => {
          try {
            // use orderBy param if API expects it (adjust if API expects a different query param)
            const orderBy = course.classtype || course.classType || "";
            const url = `${BaseURi}/traineravailabilites/${course.courseid}`;
            const res = await axios.get(url, { params: orderBy ? { orderBy } : {}, headers });
            availabilityMap[course.courseid] = res?.data || [];
          } catch (err) {
            console.error(`Failed to get availability for course ${course.courseid}:`, err?.message || err);
            availabilityMap[course.courseid] = []; // fallback to empty
          }
        })
      );
  
      // Optionally inspect availabilityMap keys:
      console.log("availabilityMap keys:", Object.keys(availabilityMap).slice(0, 10));
  
      // --- 4) build combinedData by mapping paidCourses and looking up matching availability & trainer ---
      const combinedData = paidCourses.map((classItem) => {
        // Determine courseid for lookup — try multiple possible property names
        const courseIdForLookup = classItem.courseid || classItem.courseId || classItem.course_id || null;
  
        // get the availability list for that course
        const availList = (courseIdForLookup && availabilityMap[courseIdForLookup]) ? availabilityMap[courseIdForLookup] : [];
  
        // find exact matching availability by eventcode
        const matchingAvailability = availList.find((a) => String(a.eventcode) === String(classItem.eventid)) || null;
  
        // find trainer from trainers array (trainers is already array of trainer objects)
        const matchingTrainer = trainers.find((t) => String(t.trainerid) === String(classItem.t_id)) || null;
  
        return {
          course: classItem.course,
          amount: classItem.amountpaid,
          eventId: classItem.eventid,
          registrationid: classItem.registrationid,
          endclasstrainer: classItem.endclasstrainer,
          endclassstudent: classItem.endclassstudent,
          endclasscentre: classItem.endclasscentre,
          trainerSurname: classItem.t_surname,
          trainerFirstname: classItem.t_firstname,
          trainerId: classItem.t_id,
          hubaddress: classItem.c_address,
          city: classItem.c_city,
          country: classItem.c_country,
          hub: classItem.c_name,
          state: classItem.c_state,
          startdate: classItem.startdate,
          canceled: classItem.canceled,
          duration: matchingAvailability?.duration ?? classItem.duration ?? null,
          days: matchingAvailability?.days ?? classItem.days ?? null,
          classType: matchingAvailability?.classType ?? classItem.classtype ?? classItem.classType ?? null,
          trainerName: matchingTrainer?.name ?? null,
          trainerDp: matchingTrainer?.dp ?? null,
          trainerEmail: matchingTrainer?.email ?? null,
          trainerPhone: matchingTrainer?.phone ?? null,
        };
      });
  
      console.log("combinedData length:", combinedData.length);
      // debug: show first item for quick inspection
      console.log("combinedData sample:", combinedData[0] || null);
  
      return combinedData;
    } catch (error) {
      // normalize error message for caller
      console.error("fetchStudentClasses error:", error?.message || error);
      if (error.response) {
        throw new Error(error.response.data?.error || error.response.data || "An API error occurred.");
      } else if (error.request) {
        throw new Error("No response from server. Please try again.");
      } else {
        throw new Error(error.message || "An error occurred. Please try again.");
      }
    }
  };
  

export const fetchTrainerProfile = async (trainerId) => {
    try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get(`${trainerByIdUrl}?trainerid=${trainerId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const fetchCourseStatus = async () => {
    try {
        const token = await AsyncStorage.getItem("token");
        const studentId = await AsyncStorage.getItem("studentid");
        const response = await axios.get(`${getCourseStatus}/all?studentid=${studentId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const sumbitForgotPassword = async (email) => {
    try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.post(`${forgotpassword}`,{email}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

const handleApiError = (error) => {
    if (error.response) {
        throw new Error(error.response.data.error || "An error occurred.");
    } else if (error.request) {
        throw new Error("No response from server. Please try again.");
    } else {
        throw new Error("An error occurred. Please try again.");
    }
};

export const fetchCoupon = async (couponCode) => {
    try {
        // Validate input parameters
        if (!couponCode || typeof couponCode !== 'string') {
            throw new Error('Coupon code is required and must be a valid string');
        }

        if (couponCode.trim().length === 0) {
            throw new Error('Coupon code cannot be empty');
        }

        // Check if token exists
        const token = await AsyncStorage.getItem("token");
        if (!token) {
            throw new Error('Authentication token not found. Please login again.');
        }

        // Make the API request with timeout
        const response = await axios.get(`${couponUrl}/${couponCode.trim()}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            timeout: 10000, // 10 second timeout
        });

        // Validate response structure
        if (!response || !response.data) {
            throw new Error('Invalid response received from server');
        }

        return response.data;
    } catch (error) {
        // Handle different types of errors
        if (error.response) {
            // Server responded with error status
            const status = error.response.status;
            const serverMessage = error.response.data?.message || error.response.data?.error;

            switch (status) {
                case 400:
                    throw new Error(serverMessage || 'Invalid coupon code format');
                case 401:
                    throw new Error('Authentication failed. Please login again.');
                case 403:
                    throw new Error('Access denied. Insufficient permissions.');
                case 404:
                    throw new Error('Coupon not found or expired');
                case 429:
                    throw new Error('Too many requests. Please try again later.');
                case 500:
                    throw new Error('Server error. Please try again later.');
                default:
                    throw new Error(serverMessage || `Server error (${status})`);
            }
        } else if (error.request) {
            // Network error - no response received
            if (error.code === 'ECONNABORTED') {
                throw new Error('Request timeout. Please check your connection and try again.');
            } else {
                throw new Error('Network error. Please check your internet connection.');
            }
        } else if (error.message) {
            // Custom errors thrown above
            throw error;
        } else {
            // Unknown errors
            console.error('Unknown error in fetchCoupon:', error);
            throw new Error('An unexpected error occurred. Please try again.');
        }
    }
};  


export const appliedCouponFn = async (couponCode) => {
  try {
    const token = await AsyncStorage.getItem("token");

    const response = await axios.post(
      `${appliedCouponUrl}/${couponCode}`, // ✅ endpoint
      {}, // ✅ empty body (since no request payload)
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Coupon applied response:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("❌ Coupon API error:", error.response.data);
      console.error("❌ Status:", error.response.status);
      return { error: error.response.data?.message || "Coupon validation failed" };
    } else if (error.request) {
      console.error("❌ No response received:", error.request);
      return { error: "No response from server" };
    } else {
      console.error("❌ Unexpected error:", error.message);
      return { error: error.message };
    }
  }
};

export const endClassFn = async (registrationid) => {
  try {
    const token = await AsyncStorage.getItem("token");

    const response = await axios.post(
      `${endClassUrl}/${registrationid}`, // ✅ endpoint
      {}, // ✅ empty body (since no request payload)
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ End class response:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("❌ End class API error:", error.response.data);
      console.error("❌ Status:", error.response.status);
      return { error: error.response.data?.message || "End class failed" };
    } else if (error.request) {
      console.error("❌ No response received:", error.request);
      return { error: "No response from server" };
    } else {
      console.error("❌ Unexpected error:", error.message);
      return { error: error.message };
    }
  }
};

export const ratingFn = async (data) => {
  try {
    const token = await AsyncStorage.getItem("token");

    const response = await axios.post(
      `${ratingUrl}`, // ✅ endpoint
      data, // ✅ empty body (since no request payload)
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Rating response:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("❌ Rating API error:", error.response.data);
      console.error("❌ Status:", error.response.status);
      return { error: error.response.data?.message || "Rating failed" };
    } else if (error.request) {
      console.error("❌ No response received:", error.request);
      return { error: "No response from server" };
    } else {
      console.error("❌ Unexpected error:", error.message);
      return { error: error.message };
    }
  }
};

export const reviewFn = async (data) => {
  try {
    const token = await AsyncStorage.getItem("token");

    const response = await axios.post(
      `${feedbackUrl}`, // ✅ endpoint
      data, // ✅ empty body (since no request payload)
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Review response:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("❌ Review API error:", error.response.data);
      console.error("❌ Status:", error.response.status);
      return { error: error.response.data?.message || "Review failed" };
    } else if (error.request) {
      console.error("❌ No response received:", error.request);
      return { error: "No response from server" };
    } else {
      console.error("❌ Unexpected error:", error.message);
      return { error: error.message };
    }
  }
};