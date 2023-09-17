import { useState, useEffect } from 'react';
import { TextInput, Button, View, Text, StyleSheet } from 'react-native'; 
import * as Location from 'expo-location';

const Home = () => {

    const [address, setAddress] = useState(); 
    const [weatherData, setWeatherData] = useState(); 
    

    useEffect(() => {
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

                  // fetch weather data based on city
                  try {
                    
                    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${data.results[0].address_components[3].long_name}&appid=1ea1024f7bfa9bdeb4698e2cbefa3060`, {
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
                } else {
                  console.error('Failed to fetch data');
                }
              } catch (error) {
                console.error(error);
              }
        };

        
   
        getCityLocation(); 

        
    }, []);



   
    return (
        <View style={styles.container}>
            <TextInput placeholder='Address' value={address} onChangeText={setAddress}/>

            <Text>{city}</Text>
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