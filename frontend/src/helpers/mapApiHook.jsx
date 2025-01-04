import { useEffect, useState } from "react";

const apiKey = import.meta.env.VITE_API_KEY; 

const useGeoData = (name) => {
  const [location, setData] = useState(null); 
  const [error, setError] = useState(null); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    if (!name) return; 

    const getData = async () => {
      try {
        setLoading(true); 
        const response = await fetch(
          `http://api.openweathermap.org/geo/1.0/direct?q=${name}&limit=1&appid=${apiKey}`
        );
        const result = await response.json();

        if (response.ok && result.length > 0) {
          setData(result[0]); 
        } else {
          throw new Error("Location not found or invalid response.");
        }
      } catch (err) {
        setError(err.message); 
      } finally {
        setLoading(false); 
      }
    };

    getData();
  }, [name]); 

  return { location, error, loading }; 
};

export default useGeoData;
