import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Alert, ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";



export default function profile() {
  const [getUser, setUser] = useState(null);
  const [getProfileImage, setProfileImage] = useState(
    require("../../assets/dp.png")
  );

  useEffect(() => {
    async function fetchUserData() {
      try {
        const userJson = await AsyncStorage.getItem("user");
        if (userJson !== null) {
          const userData = JSON.parse(userJson);
          setUser(userData);

          const imageUrl =
            "https://composed-relevant-bird.ngrok-free.app/Talky/ProfileImages/" +
            userData.mobile +
            ".png";
          setProfileImage(imageUrl);

          const img = new Image();
          img.src = imageUrl;
          img.onload = () => {
            setProfileImage(imageUrl);
          };
          img.onerror = () => {
            setProfileImage(require("../../assets/dp.png"));
          };
        }
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    }

    fetchUserData();
  }, []);
  if (!getUser) {
    return <Text>Your Data is Loading...</Text>;
  }
  return (
    <ImageBackground source={require("../../assets/back1.jpg")}  style={styles.background}>
      <View style={styles.view1}>
        <Text style={styles.text2}>My Profile</Text>
        <Image
          source={getProfileImage}
          style={styles.profileImage}
          contentFit={"contain"}
        />
        <Text style={styles.name}>
          {getUser.first_name} {getUser.last_name}
        </Text>
        <Text style={styles.mobile}>{getUser.mobile}</Text>
        <Text style={styles.bio}>{getUser.bio}</Text>
        <Pressable
          style={styles.pressable1}
          onPress={async () => {
            try {
              await AsyncStorage.removeItem("user");
              router.replace("/");
            } catch (error) {
              console.error("Error logging out", error);
            }
          }}
        >
          <Text style={styles.text1}>Logout</Text>
        </Pressable>
        <Pressable
          style={styles.pressable2}
          onPress={async () => {
            try {
              const userJson = await AsyncStorage.getItem("user");
              if (userJson !== null) {
                const user = JSON.parse(userJson);

                const response = await fetch(
                  "https://composed-relevant-bird.ngrok-free.app/Talky/DeleteUser?id=" +
                    user.id,
                  {
                    method: "GET",
                  }
                );

                if (response.ok) {
                  let json = await response.json();
                  if (json.success) {
                    await AsyncStorage.removeItem("user");
                    router.replace("/");
                  }
                } else {
                  Alert.alert(
                    "Error",
                    "Failed to delete account. Please try again."
                  );
                }
              }
            } catch (error) {
              Alert.alert("Error", "Something went wrong. Please try again.");
            }
          }}
        >
          <Text style={styles.text1}>Delete Account</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    paddingHorizontal: 30,
  },
  view1: {
    
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    rowGap: 10,
  },
  text2: {
    fontSize: 30,
    marginBottom: 50,
  },
  profileImage: {
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
  name: {
    fontSize: 35,
    fontWeight: "bold",
  },
  mobile: {
    fontSize: 28,
  },
  bio: {
    fontSize: 20,
    color: "gray",
  },
  pressable1: {
    marginTop: 80,
    backgroundColor: "orange",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 50,
    borderRadius: 25,
  },
  pressable2: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 50,
    borderRadius: 25,
  },
  text1: {
    color: "white",
    fontSize: 26,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
});
