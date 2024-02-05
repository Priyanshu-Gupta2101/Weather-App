import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Colors } from "../constants/index";

import { Badge, Caption, Paragraph, Surface, Title } from "react-native-paper";

import Feather from "react-native-vector-icons/Feather";
import Entypo from "react-native-vector-icons/Entypo";
import ProfileImage from "../../assets/images/user_boy.png";

const IconSize = 24;
const dummy_text =
  "I am a undergrad in my TE pursuing B. E. in Computer Engineering. My tech stack includes MERN, NextJs, Django and Flask. I have gained experience in these stacks through hackathons and personal projects. If given a chance, I will definitely prove myself and my skills. Thank you for your time and consideration.";
const Profile = () => {
  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.imgContainer}>
          <Image style={styles.image} source={ProfileImage} />
          <TouchableOpacity style={{ alignItems: "flex-end", top: -10 }}>
            <Entypo name="pencil" size={20} color={Colors.green} />
          </TouchableOpacity>
        </View>
        <View style={styles.textContainer}>
          <Title>Priyanshu Gupta</Title>
          <Caption>github/PriyanshuGupta-2101</Caption>
        </View>
      </View>
      <View style={styles.userInfo}>
        <Surface style={styles.bio}>
          <Title>Bio</Title>
          <Paragraph numberOfLines={4}>{dummy_text}</Paragraph>
        </Surface>
        <Surface style={styles.bio}>
          <Title>Notes</Title>
          <TextInput
            placeholder="write here"
            underlineColorAndroid={Colors.green}
          />
        </Surface>
      </View>
    </View>
  );
};

export default Profile;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileContainer: {
    flex: 0.8,
    justifyContent: "center",
    alignItems: "center",
  },
  imgContainer: {},
  textContainer: {
    alignItems: "center",
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderColor: Colors.black,
    borderWidth: 3,
  },
  userInfo: {
    flex: 1,
  },
  bio: {
    borderRadius: 10,
    padding: 16,
    margin: 16,
  },
  header: {
    height: 50,
    elevation: 4,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: Colors.black,
  },
  titleView: {
    flex: 1,
  },
  rightView: {
    justifyContent: "flex-end",
  },
  rowView: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
});
