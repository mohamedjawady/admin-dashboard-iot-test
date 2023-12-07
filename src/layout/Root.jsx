import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import config from "../config";

export default function Root() {
  const navigate = useNavigate()

  useEffect(() => {
    console.log("Checking token ...")
    // Check localStorage for JWT token
    const jwtToken = localStorage.getItem('jwtToken');

    // If token is present, validate it
    if (jwtToken) {
      fetch(`${config.baseURL}:3000/users/validate`, {
        method: 'GET',
        headers: {
          Authorization: `${jwtToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data && data.ID && data.Username && data.ConnectionInfo && data.AccessLevel) {
            navigate('/dashboard/users');
          } else {
            // If validation fails, redirect to /login
            navigate('/');
          }
        })
        .catch((error) => {
          console.error('Error validating token:', error);
          // If there's an error, redirect to /login
          navigate('/login');
        });
    } else {
      console.log("Token does not exist")
      // If token is not present, redirect to /login
      navigate('/login');
    }
  }, []);

  return (
    <>Token Validation, please wait ...</>
  );
}