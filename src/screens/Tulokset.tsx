import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View, SafeAreaView, StyleSheet } from "react-native"
import { Button, PaperProvider, Text} from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RootStackParamList } from "../navigation/navigationTypes";
import { useDispatch, useSelector } from "react-redux";
import { Kilpailija, Kilpailu, lopetaKilpailu } from "../redux/kilpailutSlice";
import { AppDispatch, RootState } from "../redux/store";

type NavigointiPropsit = NativeStackScreenProps<RootStackParamList, 'Tulokset'>;

const Tulokset : React.FC<NavigointiPropsit> = ({ navigation }) : React.ReactElement => {

    const dispatch : AppDispatch = useDispatch();

    const nykyinenKilpailu : Kilpailu | undefined = useSelector((state : RootState) => state.kilpailuLista.nykyinenKilpailu);
    const voittajat : Kilpailija[] = nykyinenKilpailu?.voittajat ?? [];

    const lopeta = () : void => {
        dispatch(lopetaKilpailu());
        navigation.popToTop();
    };

    return (
        <PaperProvider>
            <SafeAreaProvider>
                <SafeAreaView style={styles.container}>
                    <View style={styles.resultContainer}>
                        <Text variant="titleLarge" style={{marginVertical: 10}}>Tulokset</Text>

                        <Text variant="titleMedium">
                            Onneksi olkoon! {voittajat.length > 1 ? "Voittajat ovat" : "Voittaja on"}
                        </Text>
                        {voittajat.map((voittaja, idx) => (<Text key={idx} variant="titleSmall">{voittaja.nimi}</Text>))}

                        {nykyinenKilpailu?.tulokset.map((kilpailija, idx) => (
                            <View key={idx} style={styles.kilpailijaContainer}>
                                <Text variant="titleSmall">
                                    {kilpailija.nimi} - Yhteensä: {kilpailija.pisteetYhteensa}
                                </Text>
                                {kilpailija.pisteet.map((pisteet, roundIdx) => (
                                    <Text key={roundIdx} variant="bodyMedium" style={{marginHorizontal: 5}}>
                                        Kierros {roundIdx + 1}: {pisteet} pistettä
                                    </Text>
                                ))}
                            </View>
                        ))}
                    </View>
                    
                    <Button 
                        mode="contained" 
                        onPress={lopeta}
                        buttonColor="#6750A4"
                        style={{margin: 10, width: '90%'}}
                    >
                        Siirry etusivulle
                    </Button>

                </SafeAreaView>
            </SafeAreaProvider>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
    },
    resultContainer: {
        marginVertical: 10,
        width: '100%',
        padding: 10,
    },
    kilpailijaContainer: {
        marginVertical: 5,
        padding: 10,
        borderRadius: 5,
    }
});

export default Tulokset;

