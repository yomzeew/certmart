export const convertDate=(dateString) =>{
    
    // Parse the date string into a Date object
    const date = new Date(dateString);
  
    // Extract day, month, and year
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-based in JavaScript
    const year = String(Math.abs(date.getUTCFullYear())).padStart(4, '0'); // Use Math.abs() to handle negative year
    console.log(`${day}-${month}-${year}`)
    // Return in dd-mm-yyyy format
    return `${day}-${month}-${year}`;

  }