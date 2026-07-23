import axios from "axios";

let baseUrl = localStorage.getItem("apiUrl") || import.meta.env.VITE_API_URL;
let baseUrlAppart = import.meta.env.VITE_API_URL_APPART;

const axiosClient = axios.create({
    baseURL: baseUrl,
    headers: {
      'Content-Type': 'application/json',
    },
    // timeout: 17000
});

export const axiosClientAppart = axios.create({
    baseURL: baseUrlAppart,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 17000
});

export const updateAxiosBaseUrl = (newUrl) => {
    baseUrl = newUrl;
    axiosClient.defaults.baseURL = newUrl;
    localStorage.setItem("apiUrl", newUrl);
    console.log(`Nouvelle URL de l'API configurée : ${newUrl}`);
};

axiosClient.interceptors.request.use((config)=>{
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosClient.interceptors.response.use((response)=> {
    return response;
    }, 
    (error) => {
        try {
            const {response} = error;
            if (response.status === 401) {
                localStorage.removeItem('access_token');
            }
        } catch (error) {
            console.error(error);
        }

        throw error;
    }
);


export default axiosClient;