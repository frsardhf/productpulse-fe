import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  exp: number; // Define the expected properties of the decoded token
  // Add other properties if needed
}

export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true; // Return true if the token is null or undefined

  const decoded = jwtDecode<DecodedToken>(token); // Specify the type of the decoded token
  const currentTime = Date.now() / 1000; // Current time in seconds

  return decoded.exp ? decoded.exp < currentTime : true; // Check if the token is expired, default to true if exp is undefined
};