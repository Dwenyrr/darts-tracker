import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import uuid from 'react-native-uuid';

export interface Kilpailija {
    id : string,
    nimi : string,
    pisteet : number[],
    pisteetYhteensa: number
}

export interface Kilpailu {
    id : string,
    nimi : string,
    paivays : string,
    kilpailijat: Kilpailija[],
    kierrokset: number,
    nykyinenKierros: number,
    tulokset: Kilpailija[]
    voittajat: Kilpailija[]
}

interface State {
    kilpailut : Kilpailu[],
    nykyinenKilpailu? : Kilpailu
}

const kilpailut : Kilpailu[] = [];

export const kilpailuListaSlice = createSlice({
    name: 'kilpailuLista',
    initialState: {
        kilpailut : [...kilpailut],
    } as State,
    reducers: {
        //Luodaan uusi kilpailu ja asetetaan se nykyiseksi kilpailuksi
        AloitaUusiKilpailu: ( state : State ) => {
            state.nykyinenKilpailu = {
                id : uuid.v4(),
                nimi : `Mökkitikka ${new Date().toLocaleDateString()} klo ${new Date().toLocaleTimeString()}`,
                paivays : new Date().toISOString(),
                kilpailijat : [],
                kierrokset : 0,
                nykyinenKierros: 1,
                tulokset : [],
                voittajat: []
            };
        },
        //Lisätään kilpailija nykyiseen kilpailuun
        lisaaKilpailija: (state : State, action : PayloadAction<{nimi: string}>) => {
            if(state.nykyinenKilpailu) {
                state.nykyinenKilpailu.kilpailijat = [...state.nykyinenKilpailu.kilpailijat, {
                    id: uuid.v4(),
                    nimi: action.payload.nimi,
                    pisteet: [],
                    pisteetYhteensa: 0
                }];
            }
        },
        //Lisätään nykyiseen kilpailuun kierrosmäärä
        lisaaKierrokset: (state : State, action : PayloadAction<number>) => {
            if (state.nykyinenKilpailu) state.nykyinenKilpailu.kierrokset = action.payload;
        },
        //Seurataan mikä kierros on menossa
        seuraavaKierros: (state: State) => {
            if (state.nykyinenKilpailu) {
                if (state.nykyinenKilpailu.nykyinenKierros < state.nykyinenKilpailu.kierrokset) {
                    state.nykyinenKilpailu.nykyinenKierros += 1;
                }
            }
        },
        //Lisätään kilpailijalle pisteet tiettyyn kierrokseen
        lisaaKierroksenPisteet: (state : State, action: PayloadAction<{kilpailijaId: string; kierrosIdx: number; pisteet: number}>) => {
            if (state.nykyinenKilpailu) {

                const kilpailija : Kilpailija | undefined = state.nykyinenKilpailu.kilpailijat.find(k => k.id === action.payload.kilpailijaId);
                if (kilpailija) {
                    kilpailija.pisteet= [
                        ...kilpailija.pisteet.slice(0, action.payload.kierrosIdx),
                        action.payload.pisteet,
                        ...kilpailija.pisteet.slice(action.payload.kierrosIdx + 1)
                    ]
                }
            }
        },
        //Lasketaan kilpailun tulokset ja järjestetään kilpailijat pisteiden mukaan
        naytaTulokset: (state : State) => {

            if (state.nykyinenKilpailu) {
                const kilpailu : Kilpailu = state.nykyinenKilpailu;

                kilpailu.kilpailijat.forEach(kilpailija => {
                    kilpailija.pisteetYhteensa = kilpailija.pisteet.reduce((summa, tulos) => summa + tulos, 0);
                });

                kilpailu.tulokset = [...kilpailu.kilpailijat].sort((a, b) => 
                    b.pisteetYhteensa - a.pisteetYhteensa
                );

                kilpailu.voittajat = kilpailu.tulokset.filter(kilpailija => kilpailija.pisteetYhteensa === kilpailu.tulokset[0].pisteetYhteensa);

            }
        },
        //Lopetetaan kilpailu siirtämällä se kilpailu-listaan ja järjestetään kilpailut päivämäärän mukaan laskevasti
        lopetaKilpailu: (state: State) => {
            if (state.nykyinenKilpailu) {
                state.kilpailut = [...state.kilpailut, state.nykyinenKilpailu];
                state.nykyinenKilpailu = undefined;
                state.kilpailut.sort((a,b) => new Date(b.paivays).getTime() - new Date(a.paivays).getTime());
            }
        },

    }
});

export const { 
    AloitaUusiKilpailu, 
    lisaaKilpailija, 
    lisaaKierrokset, 
    lisaaKierroksenPisteet, 
    lopetaKilpailu, 
    seuraavaKierros, 
    naytaTulokset 
} = kilpailuListaSlice.actions;

export default kilpailuListaSlice.reducer;

