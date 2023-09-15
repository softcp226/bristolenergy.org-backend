let currentdate = new Date();
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

let datetime = `${
  monthNames[currentdate.getMonth()]
} ${currentdate.getDate()} ${currentdate.getFullYear()} - ${currentdate.getHours()}: ${currentdate.getMinutes()} : ${currentdate.getSeconds()}`;

  let date = new Date();

  date.setDate(date.getDate() + 7);

   let expiring_date_string = `${
     monthNames[date.getMonth()]
   } ${date.getDate()} ${date.getFullYear()} - ${date.getHours()}: ${currentdate.getMinutes()} : ${currentdate.getSeconds()}`;


  let date2 = new Date();
  date2.setDate(date2.getDate());
  let coded_date = date2.getTime();

  

module.exports={datetime,expiring_date_string,coded_date}