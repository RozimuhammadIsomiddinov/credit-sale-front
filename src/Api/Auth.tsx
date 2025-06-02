import axios from "axios";
import { BASE_URL } from "../config";

export const login = async (data: { username: string; password: string }) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, data);

    const token = response.data?.token;
    const user = response.data?.user; // Assuming user info is returned in the response.

    if (token && user) {
      // Save token and minimal user info to local storage
      localStorage.setItem("token", token);
      // .setItem(
      //   "user",
      //   JSON.stringify({
      //     id: user.id,
      //     name: user.name,
      //     email: user.email,
      //     role: user.role,
      //   })
      // );
      window.location.href = "/";
      console.log("Token and user info saved to localStorage:", token, user);

      return response.data;
    } else {
      throw new Error("Invalid login response: Token or user data missing.");
    }
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

export const register = async (data: {
  username: string;
  surname: string;
  password: string;
  email: string;
  birthDate: string;
  phoneNumber: string;
  address: string;
  passportSeries: string;
  role: string;
  balance: number;
}) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, data);

    const token = response.data?.token;
    const user = response.data?.user;

    if (token && user) {
      // Save token and user data to localStorage
      localStorage.setItem("token", token);
      // localStorage.setItem("user", JSON.stringify(user));

      console.log("User registered and logged in successfully:", user);

      // Navigate to home page
      window.location.href = "/"; // Or use React Router's `useNavigate` for navigation
      return response.data;
    } else {
      throw new Error("Token or user data not found in response.");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error during registration:", error.response?.data);
    } else {
      console.error("Unexpected error during registration:", error);
    }
    throw error;
  }
};
