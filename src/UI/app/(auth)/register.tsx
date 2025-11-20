import { StyleSheet, View, Text, Image, Pressable, Dimensions, FlatList, Switch, Platform, Alert } from "react-native";
import { ReactNode, useState } from "react";
import { router, useNavigation } from "expo-router";
import Constants from "expo-constants";

// Local module/constants imports
import AuthContainer from "@/components/ui/auth/AuthContainer";
import { CLR_LIGHT, CLR_SECONDARY } from "@/assets/styles/global";
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import FormField from "@/components/ui/auth/FormField";
import { useAuth } from '@/contexts/AuthContext';

// Local image imports
import GoogleIcon from '@/assets/images/google-logo.svg';
import OutlookIcon from '@/assets/images/outlook-logo.svg';


// Local constants
const BODY_OVERLAP = 30;
const BANNER_HEIGHT = 68 + 16 + 16 + Constants.statusBarHeight;

function googleRegister() {
  console.log("Google sign up");
}

function outlookRegister() {
  console.log("Outlook sign up");
}

function handleInvalidReg() {
  // WIP
  return;
}

// Components
const RegisterPage = () => {
  // useState variables for fetching data from text fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login: authLogin } = useAuth();

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Expo router/react navigation path routing
  const nav = useNavigation();

  // Remember me switch state
  const [isRemembered, setIsRemembered] = useState(false);
  const toggleSwitch = () => {
      setIsRemembered(!isRemembered);
  };

  // Handle register with backend (same as login - Milkshake auto-creates account)
  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    if (password !== passwordConfirm) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      // Use same login API - server will create account if first time
      await authLogin(email, password);
      router.push("/(tabs)");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Sign up failed. Please try again.";
      Alert.alert("Sign Up Failed", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Data to dynamically create form fieldbox elements
  const fieldInfo = [
    {
      id: 'reg-name',
      title: 'Name',
      placeholder: 'Enter your full name',
      fieldType: 'name',
      setData: setName
    },
    {
      id: 'reg-email',
      title: 'Email',
      placeholder: 'Enter your email address',
      fieldType: 'email',
      setData: setEmail
    },
    {
      id: 'reg-pass',
      title: 'Password',
      placeholder: 'Enter your password',
      fieldType: 'password',
      setData: setPassword
    },
    {
      id: 'reg-confirm-pass',
      title: 'Confirm Password',
      placeholder: 'Enter your password again',
      fieldType: 'password',
      setData: setPasswordConfirm
    }
  ];

  return(
    // Note: Cannot use flatlists in authcontainer, since 
    <AuthContainer>
      {/* Text headers */}
      <View style={styles.headerWrapper}>
        <Text style={styles.header}>
          Welcome back!
        </Text>
        <Text style={styles.subheader}>
          Please sign in to continue to your account.
        </Text>
      </View>

      {/* Forms Section */}
      <View style={styles.fieldWrapper}>
        {fieldInfo.map((item, index) => {
          return(
            <FormField 
              key={item.id}
              title={item.title}
              placeholder={item.placeholder}
              fieldType={item.fieldType}
              setDataVar={item.setData}
            />
          )
        })}
      </View>

      {/* Remember me button */}
      <View style={styles.rememberWrapper}>
        <Text style={styles.textRemember}>Remember me</Text>
        <Switch
          style={styles.switch}
          trackColor={{
              false: "#9A9A9A",
              true: "#6C8F9D"
          }}            
          thumbColor={CLR_LIGHT}
          ios_backgroundColor="#dedede"
          onValueChange={toggleSwitch}
          value={isRemembered}
        />
      </View>      


      {/* Button Section */}
      <View style={styles.sectionBtn}>
        {/* Login button */}
        <Pressable
          style={styles.loginBtn}
          onPress={handleRegister}
          disabled={isLoading}
        >
            <Text style={styles.loginBtnText}>
              {isLoading ? 'Signing up...' : 'Sign in'}
            </Text>
        </Pressable>
        
        {/* Divider element */}
        <View style={styles.divider}>
          <View style={styles.dividerTextWrapper}>
            <Text style={styles.dividerText}>or continue with</Text>
          </View>
        </View>

        {/* OAuth login buttons */}
        <View style={styles.oAuthWrapper}>
          <Pressable style={styles.oAuthBtn} onPress={googleRegister}>
            <GoogleIcon style={styles.btnIcon} />
          </Pressable>
          <Pressable style={styles.oAuthBtn} onPress={outlookRegister}>
            <OutlookIcon style={styles.btnIcon} />
          </Pressable>
        </View>
      </View>
      <View style={styles.regTextWrapper}>
        <Text style={styles.regText}>Already a user?</Text>
        <Text 
          style={styles.regTextLink}
          onPress={() => {
            const routes = nav.getState()?.routes;

            if (routes && routes.length > 1) {
              const prevRoute = routes[routes.length - 2];
              console.log(prevRoute.name)
              if (prevRoute.name === "login") {
                router.back();
                return;
              }
            }

            router.push('/(auth)/login');
            return;
          }}
        >
          Sign in to your account
        </Text>
      </View>
    </AuthContainer>
  );
};

const styles = StyleSheet.create({
  bg: {

  },

  // Banner element stylings
  banner: {
    paddingHorizontal: 20,
    paddingTop: 16 + Constants.statusBarHeight,
    paddingBottom: 16 + BODY_OVERLAP,
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: Colors["light"].primaryButton
  },
  bannerLogo: {
    width: 135,
    height: 68
  },
  formContainer: {
    backgroundColor: Colors["light"].background,
    marginTop: -BODY_OVERLAP,
    borderRadius: BODY_OVERLAP,
    width: "100%",
    height: Dimensions.get("window").height - BANNER_HEIGHT
  },
  faqBtnWrapper: {
    width: 40,
    height: 40,
    columnGap: 8,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: "rgba(0, 0, 0, 0.18)" 
  },
  faqIconWrapper: {
    width: "80%",
    height: "80%",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },

  // Header text stylings
  headerWrapper: {
    width: "100%",
    gap: 7
  },
  header: {
    fontSize: 25,
    fontFamily: "Poppins",
    color: Colors['light'].text,
    fontWeight: 700,
  },
  subheader: {
    fontSize: 14,
    fontFamily: "Poppins",
    color: Colors['light'].text,
    fontWeight: 300
  },

  // Form fields stylings
  fieldWrapper: {
    width: "100%",
    height: "auto",
    paddingTop: 40,
    gap: 24
  },
  rememberWrapper:{
    width: "100%",
    height: "auto",
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
    paddingTop: Platform.OS === 'ios' ? 20 : 12
  },
  textRemember: {
    fontSize: 16,
    fontFamily: "Poppins",
    color: "#636363",
    fontWeight: 500,
    // letterSpacing: -0.28
  },
  switch: {
    transform: Platform.OS === 'ios' ? [
        { scaleX: 0.85 }, 
        { scaleY: 0.85 }
    ] : [
        { scaleX: 1.1 }, 
        { scaleY: 1.1 }
    ]
  },

  // Button section stylings
  sectionBtn: {
    gap: 35,
    paddingTop: 30

  },
  loginBtn: {
    width: "100%",
    height: "auto",
    minHeight: 44,
    backgroundColor: CLR_SECONDARY,
    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.30)",
    borderRadius: 10,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
  },
  loginBtnText: {
    fontSize: 18,
    fontFamily: "Poppins",
    color: Colors['light'].textLight,
    fontWeight: Platform.OS === 'ios' ? 600 : 700,
    letterSpacing: -0.14
  },
  divider: {
    width: "100%",
    borderWidth: Platform.OS === 'ios' ? 1 : 0.75,
    borderColor: Platform.OS === 'ios' ? "#D9D9D9" : "#c7c7c7",
    height: 1,
    alignItems: "center"
  },
  dividerTextWrapper: {
    position: "absolute",
    top: Platform.OS == 'ios' ? -11 : -13 ,
    width: "auto",
    paddingHorizontal: 12,
    backgroundColor: Colors['light'].background
    
  },
  dividerText: {
    fontSize: 16,
    fontFamily: "Poppins",
    color: "#636363",
    fontWeight: 500,
    textAlign: "center"
  },
  oAuthWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  oAuthBtn: {
    width: Platform.OS === 'ios' ? 160 : 170,
    minHeight: 44,
    backgroundColor: Colors['light'].textLight,
    borderColor: "#6c8f9d",
    borderWidth: 1.5,
    borderRadius: 10,
    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.30)",
    justifyContent: "center",
    alignItems: "center"
  },
  btnIcon: {
    width: 30,
    height: 30
  },
  
  // Registration text
  regTextWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    paddingTop: 45,
    paddingBottom: 116,
  },
  regText: {
    fontSize: 16,
    fontFamily: "Poppins",
    color: "#6c6c6c",
    fontWeight: 400,
    fontStyle: 'normal'
  },
  regTextLink: {
    color: Colors['light'].secondaryButton,
    textAlign: 'center',
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: Platform.OS ==='ios' ? 600 : 700,
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
  }
});

export default RegisterPage;