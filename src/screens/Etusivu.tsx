import React from "react";
import { View, SafeAreaView, StyleSheet, ScrollView, Image } from "react-native";
import { NativeStackScreenProps }  from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navigationTypes';
import { PaperProvider, Button, Text, List, Icon, MD3Theme, } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { AloitaUusiKilpailu, Kilpailija, Kilpailu } from "../redux/kilpailutSlice";
import { useTheme } from 'react-native-paper';

type NavigointiPropsit = NativeStackScreenProps<RootStackParamList, 'Etusivu'>;

const Etusivu : React.FC<NavigointiPropsit> = ({ navigation }) : React.ReactElement => {

    const dispatch : AppDispatch = useDispatch();

    const kilpailut : Kilpailu[] = useSelector((state : RootState) => state.kilpailuLista.kilpailut);

    const luoUusiKilpailu = () : void => {
        dispatch(AloitaUusiKilpailu());
        navigation.navigate('KilpailijaLisays');
    };

    const theme : MD3Theme = useTheme();
        
    return (
        <PaperProvider>
            <SafeAreaProvider>
                <SafeAreaView style={styles.container}>
                    <ScrollView style={{width: '100%'}}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 5 }}>
                            <Icon source='bullseye-arrow' size={100} color={theme.colors.primary} />
   
                            <Button
                                mode="contained"
                                onPress={luoUusiKilpailu}
                                style={{marginVertical: 10, width: '90%'}} 
                            >
                                Aloita uusi kilpailu
                            </Button>
                        </View>
                        <View style={{width: '90%', marginHorizontal: 'auto'}}>
                            <Text variant='titleMedium' style={{marginVertical: 10}}>Kilpailut</Text>
                            {kilpailut?.map((kilpailu: Kilpailu, idx: number) => (
                                <List.AccordionGroup key={idx}>
                                    <List.Accordion id={idx} title={kilpailu.nimi} titleStyle={{ fontSize: 14, flexWrap: 'wrap' }}>
                                        <View style={{paddingLeft: 15, backgroundColor: theme.colors.background}}>

                                            <Text variant="titleSmall">
                                                {kilpailu.voittajat.length > 1 ? 'Voittajat' : 'Voittaja'}
                                            </Text>
                                            {kilpailu.voittajat.map((voittaja : Kilpailija, idx : number) => (
                                                <Text key={idx} style={{paddingLeft: 5}}>{voittaja.nimi}</Text>
                                            ))}

                                            {kilpailu.tulokset.map((kilpailija: Kilpailija, kilpailijaIdx : number) => (
                                                <View key={kilpailijaIdx} style={styles.kilpailijaContainer}>
                                                    <Text variant="titleSmall">
                                                        {kilpailija.nimi} - Yhteensä: {kilpailija.pisteetYhteensa}
                                                    </Text>
                                                    
                                                    {kilpailija.pisteet.map((pisteet, roundIdx) => (
                                                        <Text key={roundIdx} variant="bodyMedium" style={{paddingLeft: 5}}>
                                                            Kierros {roundIdx + 1}: {pisteet} pistettä
                                                        </Text>
                                                    ))}
                                                </View>
                                            ))}
                                        </View>
                                    </List.Accordion>
                                </List.AccordionGroup>
                            ))}  
                        </View>
                    </ScrollView>
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
    kilpailijaContainer : {
        marginVertical: 10,
    }
});

export default Etusivu;