import {
  Alert,
  Button,
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
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";

SplashScreen.preventAutoHideAsync();

const logoPath = require("../assets/logo2.png");
const backgrounImage = require("../assets/back1.jpg");

export default function App() {
  const parameters = useLocalSearchParams();

  const [getImage, setImage] = useState(null);
  const [getBio, setBio] = useState("");

  const [loaded, error] = useFonts({
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
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
        <Text style={styles.text1}>Hello !</Text>

        <Text style={styles.text2}>
          {parameters.fname} {parameters.lname}
        </Text>
        <Pressable
          style={styles.avatar1}
          onPress={async () => {
            let result = await ImagePicker.launchImageLibraryAsync();

            if (!result.canceled) {
              setImage(result.assets[0].uri);
            }
          }}
        >
          <Image
            source={getImage ? { uri: getImage } : require("../assets/dp.png")}
            style={styles.profile}
          />
          {!getImage && (
            <View style={styles.cameraIcon}>
              <MaterialIcons name="camera-alt" size={24} color="white" />
            </View>
          )}
        </Pressable>

        <TextInput
          placeholder="Add a Bio"
          cursorColor={"#F677A2"}
          style={styles.input1}
          inputMode={"text"}
          multiline={true}
          numberOfLines={4}
          onChangeText={(text) => {
            setBio(text);
          }}
        />

        <Pressable
          style={styles.pressable2}
          onPress={async () => {
            let form = new FormData();
            form.append("mobile", parameters.mobile);
            form.append("bio", getBio);

            if (getImage != null) {
              form.append("profileImage", {
                name: "profile.png",
                type: "image/png",
                uri: getImage,
              });
            }

            let response = await fetch(
              "https://composed-relevant-bird.ngrok-free.app/Talky/AddProfileImage",
              {
                method: "POST",
                body: form,
              }
            );

            if (response.ok) {
              let json = await response.json();

              if (json.success) {
                router.replace("/home");
              } else {
                Alert.alert("Error", json.message);
              }
            } else {
              Alert.alert("Error", "Something went wrong");
            }
          }}
        >
          <Text style={styles.text4}>Continue</Text>
        </Pressable>
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
  text2: {
    fontSize: 30,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 20,
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
    height: 100,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 25,
    padding: 15,
    marginVertical: 20,
    fontSize: 20,
    textAlignVertical: "top",
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
  avatar1: {
    width: 130,
    height: 130,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 65,
    backgroundColor: "white",
    position: "relative",
    alignSelf: "center",
    contentFit: "cover",
    padding: 10,
    marginBottom: 40,
  },
  profile: {
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 60,
    alignSelf: "center",
    contentFit: "cover",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "grey",
    borderRadius: 15,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
  },
});
