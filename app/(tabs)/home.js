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

export default function home() {
  const [getChatArray, setChatArray] = useState([]);

  const [loaded, error] = useFonts({
    "Poppins-Bold": require("../../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraLight": require("../../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Regular": require("../../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../../assets/fonts/Poppins-SemiBold.ttf"),
    "Pacifico": require("../../assets/fonts/Pacifico-Regular.ttf"),

  });

  useEffect(() => {
    async function fetchHomeData() {
      let userJson = await AsyncStorage.getItem("user");

      let user = JSON.parse(userJson);

      let response = await fetch(
        "https://composed-relevant-bird.ngrok-free.app/Talky/LoadHomeData?id=" +
          user.id
      );

      if (response.ok) {
        let json = await response.json();
        if (json.success) {
          let chatArray = json.jsonChatArray;
          setChatArray(chatArray);
        }
      } else {
        console.log("Network request failed with status:", response.status);
      }
    }
    fetchHomeData();
  }, []);

  useEffect(() => {
    if (loaded | error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <LinearGradient colors={["white", "#FF69B4"]} style={styles.background}>
      <View style={styles.view1}>
        <Text style={styles.text1}>Talky</Text>
      </View>

      <FlashList
        data={getChatArray}
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
            <View style={styles.view4}>
              <Text style={styles.text2}>{item.other_user_name}</Text>
              <Text style={styles.text3} numberOfLines={1}>
                {item.message}
              </Text>
              <View style={styles.view3}>
                <Text>{item.dateTime}</Text>
                <FontAwesome6
                  name={"check"}
                  color={(item.chat_status_id == 1) == 1 ? "green" : "white"}
                  size={14}
                />
              </View>
            </View>
          </Pressable>
        )}
        estimatedItemSize={200}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    paddingHorizontal: 30,
  },
  view1: {
    marginTop: 20,
    alignItems: "flex-start",
    justifyContent: "center",
    columnGap: 20,
    marginBottom: 20,
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
    fontSize: 40,
    fontFamily:"Pacifico",
  },
  text2: {
    fontSize: 24,
  },
  text3: {
    fontSize: 18,
  },
  view3: {
    flexDirection: "row",
    columnGap: 10,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  view4: {
    flex: 1,
  },
});
