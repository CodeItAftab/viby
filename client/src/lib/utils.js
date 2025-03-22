import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// function makeLinksUppercase(inputString) {
//   // Define a regex to match all kinds of URLs
//   const urlRegex = /(https?:\/\/\S+|www\.\S+|ftp:\/\/\S+|\S+\.\S+)/g;

//   // Replace matched links with their uppercase equivalents
//   const resultString = inputString.replace(urlRegex, (match) =>
//     match.toUpperCase()
//   );

//   return resultString;
// }

// Example usage
// const input =
//   "Here is a link: https://example.com, an FTP link ftp://example.com, and another one www.test.com. hello.com";
// console.log(makeLinksUppercase(input));

// function makeLinksHyperlinks(inputString) {
//   // Define a regex to match all kinds of URLs
//   const urlRegex = /(https?:\/\/\S+|www\.\S+|ftp:\/\/\S+|\S+\.\S+)/g;

//   // Replace matched links with their hyperlink equivalents
//   const resultString = inputString.replace(urlRegex, (match) => {
//     // Ensure proper protocol for links without one
//     const url =
//       match.startsWith("http://") ||
//       match.startsWith("https://") ||
//       match.startsWith("ftp://")
//         ? match
//         : `http://${match}`;
//     return `<a href="${url}" target="_blank">${match}</a>`;
//   });

//   return resultString;
// }

// Example usage
// const input =
//   "Here is a link: https://example.com, an FTP link ftp://example.com, and another one test.com.";
// console.log(makeLinksHyperlinks(input));
