import { useState, useEffect } from 'react';
import { Image, View, Text, StyleSheet } from 'react-native'; 
import { Video, ResizeMode } from 'expo-av';
import React from 'react';
import * as Location from 'expo-location';

const Home = () => {
    let [loading, setLoading] = useState(true); 
    const [city, setCity] = useState(""); 
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

   
    return (
        <View style={styles.container}>
         {!loading ? (
            <View>
                {weatherData && (
                    <View>
                              <Video
                           
                                style={styles.video}
                                source={{
                                uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
                                }}
               
                            />
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
        height: '100%',
        width: '100%',
        backgroundColor: '#fff',

    },
    video: {
        position: 'absolute', 
        width: '100%',
        height: '100%',
        zIndex: '-1',
    }
})


export default Home; 