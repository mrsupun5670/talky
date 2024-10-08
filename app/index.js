import {
  Alert,
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
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

const logoPath = require("../assets/logo2.png");
const backgrounImage = require("../assets/back1.jpg");

export default function index() {
  const [showPassword, setShowPasswordVisible] = useState(false);

  const [getFirstName, setFirstName] = useState("");
  const [getLastName, setLastName] = useState("");
  const [getMobile, setMobile] = useState("");
  const [getPassword, setPassword] = useState("");

  const [loaded, error] = useFonts({
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
  });

  useEffect(() => {
    async function checkUser() {
      try {
        let userJson = await AsyncStorage.getItem("user");

        if (userJson != null) {
          router.replace("/home");
        }
      } catch (e) {
        console.log(Hi);
      }
    }
    checkUser();
  });

  useEffect(() => {
    if (loaded | error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <View style={styles.view1}>
      <ImageBackground source={backgrounImage} style={styles.image}>
        <Image source={logoPath} style={styles.logo} contentFit={"contain"} />
        <Text style={styles.text1}>Hello !</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>

        <TextInput
          placeholder="Mobile Number"
          cursorColor={"#F677A2"}
          style={styles.input1}
          inputMode={"tel"}
          maxLength={10}
          onChangeText={(text) => {
            setMobile(text);
          }}
        />

        <View style={styles.view4}>
          <TextInput
            placeholder="Password"
            cursorColor={"#F677A2"}
            style={styles.input3}
            secureTextEntry={!showPassword}
            maxLength={15}
            onChangeText={(text) => {
              setPassword(text);
            }}
          />
          <Pressable onPress={() => setShowPasswordVisible(!showPassword)}>
            <MaterialCommunityIcons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={24}
              color="black"
            />
          </Pressable>
        </View>

        <Pressable
          style={styles.pressable2}
          onPress={async () => {
            let data = {
              mobile: getMobile,
              password: getPassword,
            };
            let response = await fetch(
              "https://composed-relevant-bird.ngrok-free.app/Talky/SignIn",
              {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            if (response.ok) {
              let json = await response.json();

              if (json.success) {
                let user = json.user;

                try {
                  await AsyncStorage.setItem("user", JSON.stringify(user));
                  if (json.avatar_image_found) {
                    router.replace("/home");
                  } else {
                    router.replace({
                      pathname: "/addProfileImage",
                      params: {
                        fname: user.first_name,
                        lname: user.last_name,
                        mobile: getMobile,
                      },
                    });
                  }
                } catch (error) {
                  Alert.alert("Error", "Unable to process your request");
                }
              } else {
                Alert.alert("Error", json.message);
              }
            } else {
              Alert.alert("Error", "Something went wrong");
            }
          }}
        >
          <Text style={styles.text4}>Sign In</Text>
        </Pressable>

        <View style={styles.view3}>
          <Text style={styles.text2}>Don't have an account?</Text>
          <Pressable
            onPress={() => {
              router.push("/signup");
            }}
          >
            <Text style={styles.text3}>Create</Text>
          </Pressable>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  view1: {
    flex: 1,
    flexDirection: "column",
  },
  text1: {
    fontSize: 50,
    fontFamily: "Poppins-SemiBold",
  },
  logo: {
    width: "100%",
    height: 100,
  },
  subtitle: {
    fontSize: 18,
    color: "gray",
    marginBottom: 50,
  },
  input1: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 25,
    padding: 15,
    marginVertical: 10,
    fontSize: 20,
  },
  input3: {
    flex: 1,
    paddingVertical: 10,
    paddingRight: 40,
    color: "#000",
    fontSize: 20,
  },
  view4: {
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
    flexDirection: "row",
    alignItems: "center",
    columnGap: 20,
    alignSelf: "flex-end",
    marginTop: 15,
  },
  signinText: {
    fontSize: 28,
    fontFamily: "Poppins-SemiBold",
  },
  pressable1: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 80,
    width: 50,
    height: 30,
  },
  view3: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
    marginTop: 15,
  },
  text2: {
    fontSize: 18,
    color: "gray",
  },
  text3: {
    fontSize: 18,
    color: "blue",
  },

  pressable2: {
    backgroundColor: "#6449b7",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 50,  
    borderRadius: 25,
  },
  text4: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
  },
});
