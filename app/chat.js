import { FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useEffect, useState,useRef } from "react";
import { FlashList } from "@shopify/flash-list";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";

export default function chat() {
  const item = useLocalSearchParams();

  const [getMessage, setMessage] = useState("");
  const [getChatArray, setChatArray] = useState([]);

  const flashListRef = useRef(null);

  useEffect(() => {
    async function fetchChatArray() {
      let userJson = await AsyncStorage.getItem("user");

      let user = JSON.parse(userJson);
      let response = await fetch(
        "https://composed-relevant-bird.ngrok-free.app/Talky/LoadChat?logged_user_id=" +
          user.id +
          "&other_user_id=" +
          item.other_user_id
      );

      if (response.ok) {
        let chatArray = await response.json();
        setChatArray(chatArray);
      }
    }
    fetchChatArray();
    setInterval(() => {
      fetchChatArray();
    }, 2000);
  }, []);

  return (
    <LinearGradient colors={["white", "#FF69B4"]} style={styles.background}>
      <View style={styles.view1}>
        <Image source={require("../assets/dp.png")} style={styles.image1} />
        <View style={styles.view2}>
          <Text style={styles.text1}>{item.other_user_name}</Text>
          <Text style={styles.text2}>
            {item.other_user_status == 1 ? "Online" : "Offline"}
          </Text>
        </View>
      </View>
      <View style={styles.centerView}>
        <FlashList
          data={getChatArray}
          renderItem={({ item }) => (
            <View
              style={[
                styles.view4,
                item.side === "right" ? styles.alignRight : styles.alignLeft,
              ]}
            >
              <Text style={styles.message}>{item.message}</Text>
              <View style={styles.view5}>
                <Text style={styles.datetime}>{item.datetime}</Text>
                {item.side == "right" ? (
                  <FontAwesome6
                    name={"check"}
                    color={item.status == 1 ? "green" : "white"}
                    size={14}
                  />
                ) : null}
              </View>
            </View>
          )}
          estimatedItemSize={200}
        />
        <View style={styles.view3}>
          <TextInput
            placeholder="Type Your Message"
            cursorColor={"#F677A2"}
            style={styles.input1}
            value={getMessage}
            onChangeText={(text) => {
              setMessage(text);
            }}
          />
          <Pressable
            onPress={async () => {
              if (getMessage.length == 0) {
                Alert.alert("Error", "Message can not be empty");
              } else {
                let userJson = await AsyncStorage.getItem("user");

                let user = JSON.parse(userJson);
                let response = await fetch(
                  "https://composed-relevant-bird.ngrok-free.app/Talky/SendMessage?logged_user_id=" +
                    user.id +
                    "&other_user_id=" +
                    item.other_user_id +
                    "&message=" +
                    getMessage
                );

                if (response.ok) {
                  let json = await response.json();
                  if (json.success) {
                    setMessage("");
                    setTimeout(() => {
                      if (flashListRef.current && getChatArray.length > 0) {
                        flashListRef.current.scrollToIndex({
                          index: getChatArray.length - 1,
                          animated: true,
                        });
                      }
                    }, 100);
                  }
                }
              }
            }}
          >
            <MaterialIcons name={"send"} size={24} color={"green"} />
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    paddingHorizontal: 30,
  },
  image1: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    backgroundColor: "white",
    alignSelf: "center",
    contentFit: "cover",
  },
  view1: {
    flexDirection: "row",
    columnGap: 20,
    marginTop: 20,
    backgroundColor: "#DBCBD8",
    padding: 10,
    borderRadius: 50,
    alignItems: "center",
  },
  text1: {
    fontSize: 30,
    color: "white",
  },
  text2: {
    color: "green",
  },
  centerView: {
    flex: 1,
    marginVertical: 20,
  },
  input1: {
    flex: 1,
    paddingVertical: 10,
    paddingRight: 40,
    color: "#000",
    fontSize: 20,
  },
  view3: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 25,
    marginVertical: 10,
    marginBottom: 40,
    paddingHorizontal: 10,
    backgroundColor: "white",
  },
  view2: {
    alignItems: "flex-start",
    justifyContent: "center",
  },
  view4: {
    maxWidth: "80%",
    backgroundColor: "#d1ecff",
    borderRadius: 20,
    padding: 10,
    borderColor: "#3da7e0",
    borderWidth: 2,
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  message: {
    fontSize: 19,
    color: "#1b262c",
    marginBottom: 5,
  },
  datetime: {
    fontSize: 12,
    color: "#3da7e0",
    alignSelf: "flex-end",
  },
  alignLeft: {
    alignSelf: "flex-start",
    backgroundColor: "#d1ecff",
  },
  alignRight: {
    alignSelf: "flex-end",
    backgroundColor: "#a8e6cf",
  },
  view5: {
    flexDirection: "row",
    columnGap: 10,
  },
});
