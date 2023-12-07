import { useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../config";

function Login ()  {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make a request to login endpoint
      const response = await fetch(`${config.baseURL}:3000/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      console.log(formData)
      
      const data = await response.json();

      // Check if login was successful
      if (response.ok) {
        // Make a request to validate endpoint
        const validateResponse = await fetch(`${config.baseURL}:3000/users/validate`, {
          method: 'GET',
          headers: {
            Authorization: `${data.token}`,
          },
        });

        const validateData = await validateResponse.json();
        console.log(validateData)
        // Check if the access level is admin
        if (validateResponse.ok && validateData.AccessLevel === 'admin') {
          // Store the token in local storage
          localStorage.setItem('jwtToken', data.token);
          
          navigate("/dashboard/users")
        } else {
          setLoginStatus('Invalid credentials');
        }
      } else {
        setLoginStatus('Invalid credentials');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setLoginStatus('Error during login');
    }
  };
  const [loginStatus, setLoginStatus] = useState(null);
    return (
        <>
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="data:image/png;base64,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"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            UFV - Admin Dashboard
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" action="#" method="POST" onSubmit={handleFormSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                Username
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="username"
                  autoComplete="username"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>
          {loginStatus && (
          <p className="mt-2 text-center text-sm text-red-500">
            {loginStatus}
          </p>
        )}
          <p className="mt-10 text-center text-sm text-gray-500">
            Admin Dashboard - Powered By 2 ING 3
          </p>
        </div>
      </div>
        </>
    );
}

export default Login;