import { useState, useEffect } from 'react';
import { Image, View, Text, StyleSheet } from 'react-native'; 
import * as Location from 'expo-location';

const Home = () => {
    let [loading, setLoading] = useState(true); 
    let [weatherDataFlag, setWeatherDataFlag] = useState(false); 
    const [city, setCity] = useState(""); 
    const [address, setAddress] = useState(); 
    const [weatherData, setWeatherData] = useState(); 

    useEffect(() => {
        getCityLocation(); 
        if (!loading) {
            getWeatherInfo();   
        }
     
    }, [loading]);

    const getCityLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
            console.log("Please grant location permissions");
            return;
        }

        let currentLocation = await Location.getCurrentPositionAsync({});
        const googleGeocodeAPI = 'https://google-maps-geocoding.p.rapidapi.com/geocode/json';
        
        try {
            const response = await fetch(`${googleGeocodeAPI}?latlng=${currentLocation.coords.latitude},${currentLocation.coords.longitude}&types=(cities)&language=en`, {
              method: 'GET',
              headers: {
                'X-RapidAPI-Key': '4edb1629a6msh5e88b54594bb4bfp1882d0jsn9db89acc20de',
                'X-RapidAPI-Host': 'google-maps-geocoding.p.rapidapi.com',
              }
            });

            if (response.ok) {
              const data = await response.json();
              setCity(data.results[0].address_components[3].long_name); 
              if (city !== undefined) {
                setLoading(false); 
              }
            } else {
              console.error('Failed to fetch data');
            }
          } catch (error) {
            console.error(error);
          }
    };

    const getWeatherInfo = async () => {
        try {
            console.log(city);
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=1ea1024f7bfa9bdeb4698e2cbefa3060`, {
                method: 'GET'
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setWeatherData(data);
            } else {
                console.error('Failed to fetch weather data');
            }
        } catch (error) {
            console.error(error); 
        }
    }

    const backgroundVideo = () => {
        let bgVideo; 
        console.log(weatherData);
        if (weatherData != null) {
        if (weatherData.weather[0].description === "clear sky") {
            console.log(`Weather Data : ${weatherData.weather[0].description}`);
                bgVideo = (
                    <>
                        <video src={"/video/clear-sky.mp4"} autoPlay loop muted
                                                style={{position: 'absolute', 
                                                        objectFit: 'cover', 
                                                        width: '100vw', 
                                                        height: '100vh',
                                                        zIndex: '-1'}}>
                        </video>
                    </>
                )
            } else if (weatherData.weather[0].description === "few clouds" || weatherData.weather[0].description === "broken clouds") {
                bgVideo = (
                    <>
                        <video src={"/video/few-clouds.mp4"} autoPlay loop muted
                                                style={{position: 'absolute', 
                                                        objectFit: 'cover', 
                                                        width: '100vw', 
                                                        height: '100vh',
                                                        zIndex: '-1'}}>
                        </video>                    
                    </>
                )
            } else if (weatherData.weather[0].description === "scattered clouds" || weatherData.weather[0].description === "overcast clouds") {
                bgVideo = (
                    <>
                        <video src={"/video/scattered-clouds.mp4"} autoPlay loop muted
                                                style={{position: 'absolute', 
                                                        objectFit: 'cover', 
                                                        width: '100vw', 
                                                        height: '100vh',
                                                        zIndex: '-1'}}>
                        </video>                      
                    </>
                )
            } else if (weatherData.weather[0].description === "broken clouds") {
                bgVideo = (
                    <>
                        <video src={"/video/broken-cluds.mp4"} autoPlay loop muted
                                                style={{position: 'absolute', 
                                                        objectFit: 'cover', 
                                                        width: '100vw', 
                                                        height: '100vh',
                                                        zIndex: '-1'}}>
                        </video>                        
                    </>
                )
            } else if (weatherData.weather[0].id === 500 || weatherData.weather[0].id === 501) {
                bgVideo = (
                    <>
                        <video src={"/video/shower-rain.mp4"} autoPlay loop muted
                                                style={{position: 'absolute', 
                                                        objectFit: 'cover', 
                                                        width: '100vw', 
                                                        height: '100vh',
                                                        zIndex: '-1'}}>
                        </video>                        
                    </>
                )
            } else if (weatherData.weather[0].main === "Rain") {
                bgVideo = (
                    <>
                        <video src={"/video/rain.mp4"} autoPlay loop muted
                                                style={{position: 'absolute', 
                                                        objectFit: 'cover', 
                                                        width: '100vw', 
                                                        height: '100vh',
                                                        zIndex: '-1'}}>
                        </video>                        
                    </>
                )
            } else if (weatherData.weather[0].main === "Thunderstorm") {
                bgVideo = (
                    <>
                        <video src={"/video/thunderstorm.mp4"} autoPlay loop muted
                                                style={{position: 'absolute', 
                                                        objectFit: 'cover', 
                                                        width: '100vw', 
                                                        height: '100vh',
                                                        zIndex: '-1'}}>
                        </video>                        
                    </>
                )
            } else if (weatherData.weather[0].main === "Snow") {
                bgVideo = (
                    <>
                        <video src={"/video/snow.mp4"} autoPlay loop muted
                                                style={{position: 'absolute', 
                                                        objectFit: 'cover', 
                                                        width: '100vw', 
                                                        height: '100vh',
                                                        zIndex: '-1'}}>
                        </video>                        
                    </>
                )
            } else if (weatherData.weather[0].main === "Mist") {
                bgVideo = (
                    <>
                        <video src={"/video/mist.mp4"} autoPlay loop muted
                                                style={{position: 'absolute', 
                                                        objectFit: 'cover', 
                                                        width: '100vw', 
                                                        height: '100vh',
                                                        zIndex: '-1'}}>
                        </video>                        
                    </>
                )
            }
        } else {
            console.log(`Weather Data : ${weatherData}`);
        }
        return bgVideo;
    }

   
    return (
        <View style={styles.container}>
         {!loading ? (
            <View>
                {weatherData && (
                    <View>
                        {backgroundVideo()}
                        <Image 
                        source={{ uri: `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`,}}
                        style={{height: 80, width: 80}}
                        onError={(error) => console.error(error)}
                        />
                        <Text>{weatherData.name}, {weatherData.sys.country}</Text>
                        <Text>Temperature: {Math.round(weatherData.main.temp - 273.15)}°C</Text>
                    </View>
                )}
            </View>
         ) : (
            <Text>Loading...</Text>
         )}
 
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center', 
    }
})
export default Home; 