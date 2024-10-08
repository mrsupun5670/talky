import {
    ImageBackground,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
  } from "react-native";
  import * as SplashScreen from "expo-splash-screen";
  import { useFonts } from "expo-font";
  import { useEffect, useState } from "react";
  import { Image } from "expo-image";
  import {
    Feather,
    FontAwesome6,
    MaterialCommunityIcons,
  } from "@expo/vector-icons";
  import { router } from "expo-router";
  import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlashList } from "@shopify/flash-list";
  
  SplashScreen.preventAutoHideAsync();
  
  const logoPath = require("../../assets/logo2.png");
  const backgrounImage = require("../../assets/back1.jpg");
  
  export default function App() {
    const [getSearchText, setSearchText] = useState("");
    const [getUserArray, setUserArray] = useState([]);

    const [loaded, error] = useFonts({
      "Poppins-Bold": require("../../assets/fonts/Poppins-Bold.ttf"),
      "Poppins-ExtraLight": require("../../assets/fonts/Poppins-ExtraLight.ttf"),
      "Poppins-Light": require("../../assets/fonts/Poppins-Light.ttf"),
      "Poppins-Regular": require("../../assets/fonts/Poppins-Regular.ttf"),
      "Poppins-SemiBold": require("../../assets/fonts/Poppins-SemiBold.ttf"),
    });

    useEffect(() => {
      async function fetchUserData() {
        let userJson = await AsyncStorage.getItem("user");
  
        let user = JSON.parse(userJson);
  
        let response = await fetch(
          "https://composed-relevant-bird.ngrok-free.app/Talky/LoadFriends?id="+user.id
        );
  
        if (response.ok) {
          let json = await response.json();
          if (json.success) {
            let userArray = json.jsonUserArray;
            setUserArray(userArray);
          }
        } else {
          console.log("Network request failed with status:", response.status);
        }
      }
      fetchUserData();
    }, []);

    useEffect(() => {
      if (loaded | error) {
        SplashScreen.hideAsync();
      }
    }, [loaded, error]);
  
    if (!loaded && !error) {
      return null;
    }
  
    const filteredUsers = getUserArray.filter(
      (user) =>user.other_user_name.toLowerCase().includes(getSearchText.toLowerCase())
    );

    return (
      <LinearGradient colors={["white", "#FF69B4"]} style={styles.background}>
        <View style={styles.view1}>
          <TextInput
            placeholder="Search Friends"
            cursorColor={"#F677A2"}
            style={styles.input1}
            maxLength={15}
            onChangeText={(text) => {
              setSearchText(text);
            }}
          />
          <Pressable style={styles.pressable1}>
            <Feather name="search" size={30} color="gray" />
          </Pressable>
        </View>
  
        <View style={styles.view5}>
        <FlashList
        data={filteredUsers}
        renderItem={({ item }) => (
          <Pressable
            style={styles.view2}
            onPress={() => {
              router.push({
                pathname: "/chat",
                params: item,
              });
            }}
          >
          
            {item.profile_image_found ? (
                <Image
                  source={
                    "https://composed-relevant-bird.ngrok-free.app/Talky/ProfileImages/"+item.other_user_mobile+".png"
                  }
                  style={styles.image1}
                  />
              ) : (
                <Image
                source={require("../../assets/dp.png")}
                style={styles.image1}
              />
              )}
            <View style={styles.view5}>
              <Text style={styles.text1}>{item.other_user_name}</Text>
            </View>
          </Pressable>
        )}
        estimatedItemSize={200}
      />
         
        </View>
      </LinearGradient>
    );
  }
  
  const styles = StyleSheet.create({
    background: {
      flex: 1,
      paddingHorizontal: 30,
    },
    view1: {
      flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 25,
    marginVertical: 10,
    marginBottom: 40,
    paddingHorizontal: 10,
    },
    view2: {
      backgroundColor: "red",
    },
    view5:{
      flex:1
    },
    input1: {
      flex: 1,
    paddingVertical: 10,
    paddingRight: 40,
    color: "#000",
    fontSize: 20,
    },
    pressable1: {
      width: "10%",
    },
    view2: {
      flexDirection: "row",
      columnGap: 20,
      alignItems: "center",
      marginTop: 20,
      borderBottomColor: "gray",
      borderBottomWidth: 0.5,
      paddingBottom: 10,
    },
    image1: {
      width: 70,
      height: 70,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 35,
      backgroundColor: "white",
      alignSelf: "center",
      contentFit: "cover",
    },
    text1: {
      fontSize: 28,
    },
  });
  