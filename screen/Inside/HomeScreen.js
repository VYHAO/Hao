import React, { useState, useEffect } from "react";
import { Alert, Pressable, StyleSheet, Text, View, Image, TextInput, Modal } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from 'expo-image-picker';
import { DynamoDB } from 'aws-sdk';

const HomeScreen = ({ navigation, route }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [avatarUri, setAvatarUri] = useState(null);
  const [username, setUsername] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    if (route.params && route.params.userData) {
      const { userData } = route.params;
      setUsername(userData.username);
      setAvatarUri(userData.avatarUri);
      setBirthday(userData.birthday);
      setGender(userData.gender);
      setPhoneNumber(userData.phoneNumber);
    } else {
      fetchUserData(); // Lấy dữ liệu từ DynamoDB nếu không có từ route.params
    }
  }, [route.params]);

  const fetchUserData = async () => {
    try {
      const dynamoDB = new DynamoDB.DocumentClient({
        region: 'YOUR_REGION',
        accessKeyId: 'YOUR_ACCESS_KEY_ID',
        secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
      });

      const params = {
        TableName: 'Users',
        Key: {
          userId: 'YOUR_USER_ID',
        },
      };

      const response = await dynamoDB.get(params).promise();

      if (response.Item) {
        setUserData(response.Item);
        setUsername(response.Item.username);
        setAvatarUri(response.Item.avatarUri);
        setBirthday(response.Item.birthday);
        setGender(response.Item.gender);
        setPhoneNumber(response.Item.phoneNumber);
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu từ DynamoDB:', error);
    }
  };

  const selectAvatar = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setAvatarUri(result.uri);
    }
  };

  const updateProfile = async () => {
    setModalVisible(false);
  };

  return (
    <LinearGradient
      colors={["#4AD8C7", "#B728A9"]}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.tabBar}>
          <Pressable onPress={() => setModalVisible(true)}>
            <Image
              source={avatarUri ? { uri: avatarUri } : require('../../assets/img/iconHomeScreen/Avatar.png')}
              style={styles.imgUser}
            />
          </Pressable>
        </View>

        <View style={styles.Vertical} />

        <View style={styles.middle}>
          <View style={styles.tabMiddle}>
            <View style={styles.Input}>
              <Pressable>
                <Image source={require("../../assets/img/iconHomeScreen/search 1.png")} style={styles.imgSearch} />
              </Pressable>
              <TextInput
                style={styles.txtSearch}
                placeholder="Tìm kiếm"
              />
            </View>
          </View>
          <View style={styles.divider} />
        </View>
        <View style={styles.dividerVertical} />

        <View style={styles.chatScreen}>
          <Text style={styles.chatInfo}>Thông tin cuộc trò chuyện ở đây !!!</Text>
          <Text style={styles.chatInfo}>Nhấn vào một ai đó để xem cuộc trò chuyện</Text>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Pressable
              style={styles.closeButtonContainer}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>X</Text>
            </Pressable>
            <Text style={styles.modalText}>Thông tin cá nhân</Text>
            <Pressable onPress={selectAvatar}>
              <Image
                source={avatarUri ? { uri: avatarUri } : require('../../assets/img/iconHomeScreen/Avatar.png')}
                style={styles.userAvatar}
              />
            </Pressable>
            <View style={styles.userInfo}>
              <Text style={styles.infoTitle}>Tên tài khoản :</Text>
              <TextInput
                style={styles.inputField}
                placeholder="Tên tài khoản"
                value={username}
                onChangeText={text => setUsername(text)}
              />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.infoTitle}>Ngày Sinh   :</Text>
              <TextInput
                style={styles.inputField}
                placeholder="Ngày sinh"
                value={birthday}
                onChangeText={text => setBirthday(text)}
              />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.infoTitle}>Giới Tính   :</Text>
              <TextInput
                style={styles.inputField}
                placeholder="Giới tính"
                value={gender}
                onChangeText={text => setGender(text)}
              />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.infoTitle}>Số Điện Thoại :</Text>
              <TextInput
                style={styles.inputField}
                placeholder="Số điện thoại"
                value={phoneNumber}
                onChangeText={text => setPhoneNumber(text)}
              />
            </View>
            <Pressable
              style={[styles.button, styles.updateButton]}
              onPress={updateProfile}
            >
              <Text style={styles.textStyle}>Cập Nhật</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    height: 500,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  textStyle: {
    backgroundColor: 'white',
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  background: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  imgUser: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  Vertical: {
    width: 1,
    height: '100%',
    backgroundColor: 'gray',
    marginLeft: 15,
  },
  dividerVertical: {
    width: 1,
    height: '100%',
    backgroundColor: 'gray',
  },
  middle: {
    backgroundColor: 'white',
    width: 400,
  },
  chatScreen: {
    width: 900,
  },
  chatInfo: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 30,
  },
  userAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  imgSearch: {
    width: 20,
    height: 20,
    marginLeft: 10,
    marginTop: 15,
    alignItems: 'center',
  },
  txtSearch: {
    fontSize: 20,
  },
  Input: {
    width: 290,
    backgroundColor: '#D9D9D9',
    borderRadius: 10,
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-evenly',
    marginLeft: 15
  },
  tabMiddle: {
    flexDirection: 'row',
    marginTop: 20
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#8C8787',
    marginTop: 10,
  },
  inputField: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10,
    paddingLeft: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  infoTitle: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  updateButton: {
    backgroundColor: '#4AD8C7',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 20,
  },
});
