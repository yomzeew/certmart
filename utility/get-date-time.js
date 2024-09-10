// Get the current date
export const date = new Date();

// Get year, month, day
export const year = date.getFullYear();
export const month = date.getMonth() + 1; // Months are zero-indexed
export const day = date.getDate();

// Create formatted date string
export const currentDate = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

// Get hour, minute, second
export const hour = date.getHours();
export const minute = date.getMinutes();
export const second = date.getSeconds();

// Create formatted time string
export const currentTime = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}:${second.toString().padStart(2, "0")}`;
