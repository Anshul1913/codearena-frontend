import axios from 'axios';
import Cookies from 'js-cookie';

// URLs to exclude from adding the headers
const excludedUrls = [
    '/auth/login',
    '/signup',
    '/forgot-password',
    '/send-otp',
    '/verify-otp'
];

// Create an Axios instance
const apiInterceptor = axios.create({
    baseURL: 'http://localhost:8080/api', // Your API base URL
    withCredentials: true, // Allow credentials to be sent (including cookies)
});

// Add a request interceptor
apiInterceptor.interceptors.request.use(
    (config) => {
        // Check if the URL is in the excluded list
        const shouldExclude = excludedUrls.some(url => config.url.includes(url));
        if (!shouldExclude) {
            // Get jwtToken and loginDetailsId from cookies
            const jwtToken = Cookies.get('jwtToken');
            console.log("JWT Token from cookies:", jwtToken);
            
            // const loginDetailsId = Cookies.get('loginDetailsId');
            // If tokens are available, set them in the headers
            if (jwtToken) {
                config.headers['Authorization'] = `Bearer ${jwtToken}`;
            }
            // if (loginDetailsId) {
            //     config.headers['loginDetailsId'] = loginDetailsId;
            // }
        }
        return config;
    },
    (error) => {
        // Handle request error
        return Promise.reject(error);
    }
);

// Add a response interceptor
apiInterceptor.interceptors.response.use(
    response => response,

    error => {
        if (error.response) {
            const { status, message } = error.response;

            if (status === 401) {
                // Handle 401 Unauthorized
                console.error('Unauthorized access - possibly redirect to login.', message);
            } else if (status === 511) {
                // Handle 511 Network Authentication Required
                console.error('Network Authentication Required.', message);
                // Optionally, show a modal or a specific error message
                // Optionally, redirect to login page
                Cookies.remove("jwtToken");
                Cookies.remove("refreshJwtToken");
                // window.location.href = '/';
            }else if(status === 415){
                console.error('Unsupported media type error.', message);
            }else if(status === 409){
                console.error('Conflict.', message);
            }
        }

        return Promise.reject(error);
    }
);


export default apiInterceptor;
