import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { View, SafeAreaView, StyleSheet } from "react-native"
import { Button, List, PaperProvider, Text, TextInput, } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RootStackParamList } from "../navigation/navigationTypes";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { Kilpailu, lisaaKierroksenPisteet, naytaTulokset, seuraavaKierros } from "../redux/kilpailutSlice";

type NavigointiPropsit = NativeStackScreenProps<RootStackParamList, 'Kierrokset'>;

const Kierrokset : React.FC<NavigointiPropsit> = ({ navigation }) : React.ReactElement => {

    const dispatch : AppDispatch = useDispatch();
    const nykyinenKilpailu : Kilpailu | undefined = useSelector((state : RootState) => state.kilpailuLista.nykyinenKilpailu);
    const [kierroksenTulokset, setKierroksenTulokset] = useState<{ [kilpailijaId: string]: number }>({});
    const [seuraavaKierrosNum, setSeuraavaKierrosNum] = useState<number>(2);
    const [virheilmoitus, setVirheilmoitus] = useState<string>('');

    const handleTuloksenMuutos = (id : string, tulos : number) : void => {
        if (tulos < 0 || tulos > 50) {
            setVirheilmoitus('Anna pistemäärä väliltä 0-50.');
        } else {
            setKierroksenTulokset({ ...kierroksenTulokset, [id]: tulos });
            setVirheilmoitus('');
        }
    };

    const handleSeuraavaKierros = () : void => {
        // Tarkistetaan, että kaikille kilpailijoille on annettu pisteet
        if (virheilmoitus !== '') return;
        
        if (nykyinenKilpailu) {
            // Lisätään kilpailijoiden pisteet nykyiseen kierrokseen
            nykyinenKilpailu.kilpailijat.forEach((kilpailija) => {
                const pisteet : number = kierroksenTulokset[kilpailija.id] ?? 0;
                dispatch(lisaaKierroksenPisteet({ 
                    kilpailijaId : kilpailija.id, 
                    kierrosIdx: nykyinenKilpailu.nykyinenKierros - 1, 
                    pisteet, 
                }));
            });

            // Siirrytään seuraavaan kierrokseen tai tuloksiin
            if (nykyinenKilpailu.nykyinenKierros < nykyinenKilpailu.kierrokset) {
                dispatch(seuraavaKierros());
                setSeuraavaKierrosNum(nykyinenKilpailu.nykyinenKierros + 1);
                setKierroksenTulokset({});
            } else if (nykyinenKilpailu.nykyinenKierros >= nykyinenKilpailu.kierrokset) {
                dispatch(naytaTulokset());
                navigation.navigate('Tulokset');
            }
        }
    } 


    return (
        <PaperProvider>
            <SafeAreaProvider>
                <SafeAreaView style={styles.container}>
                    <View>
                        <Text variant="titleLarge" style={{marginVertical: 10}}>
                            Kierros {nykyinenKilpailu?.nykyinenKierros}/{nykyinenKilpailu?.kierrokset}
                        </Text>
                    </View>
                    {nykyinenKilpailu?.kilpailijat.map((kilpailija) => (
                        <List.Item 
                            key={kilpailija.id} 
                            title={kilpailija.nimi}
                            titleStyle={{ marginVertical: 5, marginHorizontal: 5}}
                            description={() => (
                                <TextInput
                                  label="Pisteet"
                                  value={kierroksenTulokset[kilpailija.id]?.toString() || ''}
                                  onChangeText={(tulos) => handleTuloksenMuutos(kilpailija.id, Number(tulos))}
                                  keyboardType="numeric"
                                />
                              )}
                        />
                    ))}

                    {virheilmoitus !== '' && <Text variant="bodyMedium" style={{color: 'red'}}>{virheilmoitus}</Text>}

                    {nykyinenKilpailu?.nykyinenKierros === nykyinenKilpailu?.kierrokset 
                        ? <Button 
                            mode="contained"
                            onPress={handleSeuraavaKierros}
                            buttonColor="#6750A4"
                            style={{marginVertical: 10, width: 300}}
                        >
                            Näytä tulokset
                        </Button> 
                        : <Button 
                            mode="contained"
                            onPress={handleSeuraavaKierros}
                            buttonColor="#6750A4"
                            style={{marginVertical: 10, width: 300}}
                        >
                            Siirry kierrokseen {seuraavaKierrosNum}/{nykyinenKilpailu?.kierrokset}
                        </Button>
                    }
                    
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
      marginHorizontal: 5
    },
});

export default Kierrokset;