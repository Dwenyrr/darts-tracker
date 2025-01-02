import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { View, SafeAreaView, StyleSheet } from "react-native"
import { Button, PaperProvider, RadioButton, Text, } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RootStackParamList } from "../navigation/navigationTypes";
import { useDispatch } from "react-redux";
import { lisaaKierrokset } from "../redux/kilpailutSlice";
import { AppDispatch } from "../redux/store";

type NavigointiPropsit = NativeStackScreenProps<RootStackParamList, 'KierrosValinta'>;

const KierrosValinta : React.FC<NavigointiPropsit> = ({ navigation }) : React.ReactElement => {

    const dispatch : AppDispatch = useDispatch();
    
    const [valinta, setValinta] = useState<string>('1');

    const valitseKierrostenMaara = () : void => {
        dispatch(lisaaKierrokset(Number(valinta)));
        navigation.navigate('Kierrokset');
    };

    return (
        <PaperProvider>
            <SafeAreaProvider>
                <SafeAreaView style={styles.container}>
                    <View>
                        <Text variant="titleLarge" style={{marginVertical: 10}}>Valitse kierrosten määrä</Text>

                        <RadioButton.Group onValueChange={uusiValinta => setValinta(uusiValinta)} value={valinta}>
                            {[...Array(10)].map((_, i) => (
                                <RadioButton.Item
                                    key={i + 1}
                                    label={`${i + 1} kierrosta`}
                                    value={`${i + 1}`}
                                    style={styles.radioItem}
                                />
                            ))}
                        </RadioButton.Group>
                        <Button 
                            mode='contained'
                            onPress={() => valitseKierrostenMaara()}
                            buttonColor="#6750A4"
                            style={{marginVertical: 15, width: 300}} 
                        >
                            Aloita kierros 1
                        </Button>
                    </View>
                </SafeAreaView>
            </SafeAreaProvider>
        </PaperProvider>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center', 
      justifyContent: 'flex-start',
    },
    radioItem: {
        marginVertical: -5
    }
});

export default KierrosValinta;