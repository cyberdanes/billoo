/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React, { useState }from 'react';
 import type {Node} from 'react';
 import {
   Button,
   SafeAreaView,
   ScrollView,
   StatusBar,
   StyleSheet,
   Text,
   useColorScheme,
   View,
   TouchableOpacity,
   Image
 } from 'react-native';
 
 import {
   Colors,
   DebugInstructions,
   Header,
   LearnMoreLinks,
   ReloadInstructions,
 } from 'react-native/Libraries/NewAppScreen';
 
 import { launchCamera, launchImageLibrary } from "react-native-image-picker";
 import RNTextDetector from "rn-text-detector";
 

 const Section = ({children, title}): Node => {
   const isDarkMode = useColorScheme() === 'dark';
   return (
     <View style={styles.sectionContainer}>
       <Text
         style={[
           styles.sectionTitle,
           {
             color: isDarkMode ? Colors.white : Colors.black,
           },
         ]}>
         {title}
       </Text>
       <Text
         style={[
           styles.sectionDescription,
           {
             color: isDarkMode ? Colors.light : Colors.dark,
           },
         ]}>
         {children}
       </Text>
     </View>
   );
 };
 
 let x=0;

 
 addBill = () => {
   console.log('in add bill', x);
   x++;
   _launchCameraRollAsync();
 }
 
  
 const App: () => Node = () => {

  const [state, setState] = useState<{
    loading: boolean;
    image: string | null;
    toast: { 
     message: string;
     isVisible: boolean;
    };
    textRecognition: [] | null; 
   }>({
    loading: false,
    image: null,
    textRecognition: null,
    toast: {
    message: "",
    isVisible: false,
    },
   });

   function onPress(type: "capture" | "library") {
    setState({ ...state, loading: true });
    type === "capture"
     ? launchCamera({ mediaType: "image" }, onImageSelect)
     : launchImageLibrary({ mediaType: "image" }, onImageSelect);
   }
   async function onImageSelect(media: { assets: [{ uri: string }] }) {
    if (!media) {
     setState({ ...state, loading: false });
     return;
    }
    if (!!media && media.assets) {
     const file = media.assets[0].uri; 
     const textRecognition = await RNTextDetector.detectFromUri(file);
     const INFLIGHT_IT = "Inflight IT";
     //if match toast will appear 
     const matchText = textRecognition.findIndex((item: { text: string      
     }) => item.text.match(INFLIGHT_IT));
     setState({
      ...state,
      textRecognition,
      image: file,
      toast: {
      message: matchText > -1 ? "Ohhh i love this company!!" : "",
      isVisible: matchText > -1, 
      },
      loading: false,
     });
   }}
 
   
   const isDarkMode = useColorScheme() === 'dark';
 
   const backgroundStyle = {
     backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
   };
 
   return (
     <SafeAreaView style={styles.container}>
      <View style={styles.content}>
       <Text style={styles.title}>RN OCR SAMPLE</Text>
      <View >
       <TouchableOpacity style={[styles.button, styles.shadow]}
       onPress={() => onPress("capture")}>
        <Text>Take Photo</Text>
       </TouchableOpacity>
      <View > 
       <TouchableOpacity
        style={[styles.button, styles.shadow]}
        onPress={() => onPress("library")}
       >
        <Text>Pick a Photo</Text>
       </TouchableOpacity>
      </View>
      <View >
        <View style={{ alignItems: "center" }}>
         <Image style={[styles.image, styles.shadow]}
          source={{ uri: state.image }} />
        </View> 
      {!!state.textRecognition && 
       state.textRecognition.map(
        (item: { text: string }, i: number) => (
         <Text key={i} >
          {item.text}
         </Text>
        ))}
       </View>
      </View>
      {state.toast.isVisible &&
       ToastAndroid.showWithGravityAndOffset(
         state.toast.message,
         ToastAndroid.LONG,
         ToastAndroid.BOTTOM,
         25,
         50
       )}
      </View>
     </SafeAreaView>
   );
 };
 
 const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionContainer: {
     marginTop: 32,
     paddingHorizontal: 24,
   },
   sectionTitle: {
     fontSize: 24,
     fontWeight: '600',
   },
   sectionDescription: {
     marginTop: 8,
     fontSize: 18,
     fontWeight: '400',
   },
   highlight: {
     fontWeight: '700',
   },
   content: {
     fontWeight: '333',
   },
   button: {
     fontWeight: '222',
   },
   shadow: {
     
   },
 });
 
 export default App;
 