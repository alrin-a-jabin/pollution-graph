import { fetchCall, requestMethod } from "../utils/ajax";


const getAllCityList = () =>
    fetchCall("https://docs.openaq.org/v2/cities?limit=100&page=1&offset=0&sort=asc&country_id=IN&order_by=city", requestMethod.GET, {});

    const getPolutionData = (city,defaultDate) =>
    fetchCall(`https://u50g7n0cbj.execute-api.us-east-1.amazonaws.com/v2/measurements?date_to=${defaultDate}&limit=100&page=1&offset=0&sort=desc&parameter=pm25&radius=1000&country_id=IN&city=${city}&order_by=datetime`, requestMethod.GET, {});

const dashboardService = {
    getAllCityList,
    getPolutionData


};

export { dashboardService };


