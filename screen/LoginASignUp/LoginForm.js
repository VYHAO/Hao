import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts } from "expo-font";
import { DynamoDB } from "aws-sdk";
import { ACCESS_KEY_ID, SECRET_ACCESS_KEY, REGION } from "@env";

const LoginForm = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    "keaniaone-regular": require("../../assets/fonts/KeaniaOne-Regular.ttf"),
  });


  const [soDienThoai, setSoDienThoai] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      if (!soDienThoai || !matKhau) {
        alert("Vui lòng điền số điện thoại và mật khẩu");
        return;
      }

      // Kiểm tra số điện thoại có 10 số và bắt đầu bằng số 0
      if (!soDienThoai.match(/^(0)[0-9]{9}$/)) {
        alert("Số điện thoại không hợp lệ");
        return;
      }

      const dynamoDB = new DynamoDB.DocumentClient({
        region: REGION,
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY,
      });

      const params = {
        TableName: "Users",
        Key: {
          soDienThoai: soDienThoai,
        },
      };

      const userData = await dynamoDB.get(params).promise();

      if (!userData.Item) {
        // User not found
        alert("Số điện thoại hoặc mật khẩu không tồn tại");
        return;
      }

      // Check if password matches
      if (userData.Item.matKhau !== matKhau) {
        alert("Mật khẩu không chính xác");
        return;
      }

      // Authentication successful
      navigation.navigate("HomeScreen", { user: userData.Item });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  if (!fontsLoaded) {
    return undefined;
  }

  return (
    <LinearGradient
      colors={["#4AD8C7", "#B728A9"]}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.logo}>
          <Text style={styles.txtLogo}>4MChat</Text>
        </View>

        <TextInput
          style={{ ...styles.inputSdt, color: "#000" }}
          placeholder="Số điện thoại"
          onChangeText={(text) => setSoDienThoai(text)}
          value={soDienThoai}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={{ ...styles.inputPass, color: "#000" }}
            placeholder="Mật khẩu"
            secureTextEntry={!showPassword}
            onChangeText={(text) => setMatKhau(text)}
            value={matKhau}
          />
          <Pressable
            style={styles.togglePassword}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text style={styles.togglePasswordText}>
              {showPassword ? "Ẩn" : "Hiện"}
            </Text>
          </Pressable>
        </View>
        <Text
          style={{ color: "#0B0B0B", fontSize: 14, marginTop: 20 }}
          onPress={() => {
            // Implement the logic for handling forgotten password
            alert("Forgot Password", "Feature coming soon");
          }}
        >
          Quên mật khẩu?
        </Text>
        <Pressable onPress={handleLogin} style={styles.btnLogin}>
          <Text style={styles.txtLogin}>Đăng Nhập</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
};

export default LoginForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    position: "absolute",
    height: "100%",
    width: "100%",
  },
  txtLogo: {
    color: "#fff",
    fontSize: 64,
    fontFamily: "keaniaone-regular",
  },
  logo: {
    width: 243,
    alignItems: "center",
    height: 84,
    borderRadius: 10,
    backgroundColor: "rgba(217, 217, 217, 0.50)",
    marginTop: 48,
  },
  inputSdt: {
    width: 318,
    height: 46,
    backgroundColor: "rgba(255, 255, 255, 0.80)",
    color: "#BCB2B2",
    fontSize: 16,
    borderRadius: 10,
    paddingLeft: 10,
    marginTop: 36,
  },
  inputPass: {
    flex: 1,
    height: 46,
    backgroundColor: "rgba(255, 255, 255, 0.80)",
    color: "#BCB2B2",
    fontSize: 16,
    borderRadius: 10,
    paddingLeft: 10,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: 318,
    height: 46,
    backgroundColor: "rgba(255, 255, 255, 0.80)",
    borderRadius: 10,
    paddingLeft: 10,
    marginTop: 36,
  },
  togglePassword: {
    paddingHorizontal: 10,
    borderLeftWidth: 1,
    borderColor: "#BCB2B2",
  },
  togglePasswordText: {
    color: "#BCB2B2",
  },
  btnLogin: {
    width: 200,
    height: 50,
    borderRadius: 13,
    backgroundColor: "rgba(117, 40, 215, 0.47)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  txtLogin: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
  },
});
