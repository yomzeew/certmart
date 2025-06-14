export const BaseURi = `https://certmart.org/backend/api/v1`;
export const registerstudent = `${BaseURi}/students`;
export const loginstudent = `${BaseURi}/students/login`;
export const updatedetails = `${BaseURi}/students`;
export const updateProfilePic = `${BaseURi}/upload`;
export const uploadcvurl = `${BaseURi}/upload_cv`;
export const getotp = `${BaseURi}/password/get_otp`;
export const verifyotp = `${BaseURi}/password/verify_otp`;
export const resetpassword = `${BaseURi}/password/reset`;
export const studentdetails = `${BaseURi}/students/me`;

export const applyAdmission = `${BaseURi}/admissions`;
export const getCourseStatus = `${BaseURi}/admissions`;
export const getallcourseregdetails=`${BaseURi}/`
//https://certmart.org/backend/api/v1/admissions/registrations/approved?studentid=JIT/S/08

export const coursescategories = `${BaseURi}/courses/categories`;
export const coursescategoriesfilter = `${BaseURi}/traineravailabilities?`;
export const coursesall = `${BaseURi}/courses`;
export const popularcourses = `${BaseURi}/courses?filter=popular&count=6`;
export const allcourses = `${BaseURi}/courses?field=coursecode,course`;
//list availablibities courses
export const allavailablecourse=`${BaseURi}/traineravailabilities`

export const topTrainers = `${BaseURi}/trainers?filter=popular&count=6`;
export const allTrainers=`${BaseURi}/trainers`

export const countrieslist = `${BaseURi}/countries`
export const statelist = `${BaseURi}/states`
export const studycenter = `${BaseURi}/studycentres`

export const conversion=`${BaseURi}/currency/convert_to`

export const payreg=`${BaseURi}/courseregs`
export const classes=`${BaseURi}/courseregs`

export const issuesURL=`${BaseURi}/issues`
export const eresourcesUrl=`${BaseURi}/eresources`
export const certificateUrl=`${BaseURi}/certificates`

//get trainer by id
export const trainerByIdUrl=`${BaseURi}/trainer/profile`



