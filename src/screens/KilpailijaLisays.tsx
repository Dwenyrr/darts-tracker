import { View, SafeAreaView, StyleSheet } from "react-native"
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { lisaaKilpailija } from "../redux/kilpailutSlice";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Button, TextInput, Text, useTheme, PaperProvider, MD3Theme } from "react-native-paper";
import { NativeStackScreenProps }  from '@react-navigation/native-stack';
import { RootStackParamList } from "../navigation/navigationTypes";
import { useState } from "react";
import { Kilpailija } from "../redux/kilpailutSlice";


type NavigointiPropsit = NativeStackScreenProps<RootStackParamList, 'KilpailijaLisays'>;

const KilpailijaLisays : React.FC<NavigointiPropsit> = ({ navigation }) : React.ReactElement => {

    const dispatch : AppDispatch = useDispatch();

    const kilpailijat : Kilpailija[] = useSelector((state : RootState) => state.kilpailuLista.nykyinenKilpailu?.kilpailijat ?? []);
    
    const [kilpailijaNimi, setKilpailijaNimi] = useState<string>('');

    const lisaaKilpailijanNimi = () : void => {
        if(kilpailijaNimi === '') return;

        dispatch(lisaaKilpailija({nimi : kilpailijaNimi}));
        setKilpailijaNimi('');
    }

    const theme : MD3Theme = useTheme();
    
    return (
        <PaperProvider theme={theme}>
            <SafeAreaProvider>
                <SafeAreaView style={styles.container}>
                    <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>

                        <Text variant="titleLarge" style={{marginVertical: 15}}>
                            Lisää kilpailijat
                        </Text>

                        <View style={{ width: 300}}>
                            <TextInput
                                label="Kilpailijan nimi"
                                value={kilpailijaNimi}
                                mode="outlined"
                                onChangeText={setKilpailijaNimi}
                                style={{marginHorizontal: 10, marginBottom: 10 }}
                            />

                            <Button
                                mode="contained"
                                onPress={lisaaKilpailijanNimi}
                                style={{margin: 5}}
                                buttonColor="#6750A4" 
                            >
                                Lisää kilpailija
                            </Button>

                            <Button
                                mode="outlined"
                                disabled={Boolean(kilpailijat.length < 2)} 
                                onPress={() => navigation.navigate('KierrosValinta')}
                                style={{margin: 5}} 
                            >
                                Aloita kilpailu
                            </Button>

                            <Text variant="titleMedium" style={{margin: 10}}>Lisätyt kilpailijat:</Text>

                            {kilpailijat?.map((kilpailija, idx) => (
                                <Text key={idx} variant="bodyLarge" style={{paddingHorizontal: 10}}>{kilpailija.nimi}</Text>
                            ))}

                        </View>
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
    inputContainer : {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});


export default KilpailijaLisays;