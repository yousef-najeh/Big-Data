import Chart from '../components/Chart';
// import Map from '../components/Map';
import {  useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import * as chartHelper from "../helpers/chartHelper";
// import useGeoData from '../helpers/mapApiHook';


const Search = () => {
    const [search, setSearch] = useState("");
    const [start,setStart]=useState("");
    const [end,setEnd]=useState("");
    const [query, setQuery] = useState(false);
    // const [country,setCountry]=useState("")
    // const {location,loading,error}=useGeoData(country)

    // let coordinates;

    // if (!loading && !error && location) {
    //     coordinates = {
    //         lat: location.lat,
    //         lon: location.lon,
    //     };
    // } else {
    //     coordinates = null; 
    // }
    // const coordinates_data=JSON.stringify(coordinates)
    // console.log(coordinates?.lat,coordinates?.lon)

    console.log("search",search)
    console.log("start",start)
    console.log("end",end)
    // console.log("country",country)

    const { data, isLoading, isError } = useQuery({
        queryKey: ["tweets", { query }],
        queryFn: async () => {
            console.log("query", query);

            const response = await fetch(
                    `http://127.0.0.1:3000/api/tweets/search?keyword=${search.trim()}&startTime=${start}&endTime=${end}`
            );
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        },
        enabled: query,
        refetchInterval: 10000,
    });

    const chartData = data
        ? chartHelper.prepareChartData(data.chart)
        : [];

        console.log(data)

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (search.trim() !== "" || start !== "" || end !== "") {
            setQuery(true);
        }

        
    };


    if(isLoading){
        return <div>Loading...</div>
    }
    
    return (
        <div>
            <form onSubmit={handleSearchSubmit}>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search"
                />
                <input type="date" 
                        value ={start}
                        placeholder="start date"
                        onChange={(e)=>setStart(e.target.value)}/>
                <input type="date"
                        value={end}
                        placeholder="end date"
                        onChange={(e)=>setEnd(e.target.value)}/>
                {/* <input type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="city name"/> */}
                <button type="submit">Search</button>
            </form>

            {isError && <p>Error occurred while fetching data!</p>}

            {data && (
                <div>
                    <h1>Search Results</h1>
                    <Chart chartData={chartData} />
                    <br />
                    <br />
                    {/* <Map tweets={data.hits.hits} /> */}
                </div>
            )}
        </div>
    );
};

export default Search;
