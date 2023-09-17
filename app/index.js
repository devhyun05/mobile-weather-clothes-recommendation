import { useState, useEffect } from 'react';
import { Image, View, Text, StyleSheet } from 'react-native'; 
import * as Location from 'expo-location';

const Home = () => {
    let [loading, setLoading] = useState(true); 
    let [weatherDataFlag, setWeatherDataFlag] = useState(false); 
    const [city, setCity] = useState(""); 
    const [address, setAddress] = useState(); 
    const [weatherData, setWeatherData] = useState(); 

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

    useEffect(() => {
        getCityLocation(); 
        if (!loading) {
            getWeatherInfo();   
        }
     
    }, [loading]);



   
    return (
        <View style={styles.container}>
         {!loading ? (
            <View>
                {weatherData && (
                    <View>
                        <Image 
                        source={{ uri: `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`,}}
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