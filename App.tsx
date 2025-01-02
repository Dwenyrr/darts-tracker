import React from 'react';
import MainNavigator from './src/navigation/MainNavigator';
import { store } from './src/redux/store';
import { Provider } from 'react-redux';

const App : React.FC = () : React.ReactElement => {

  return (
    <Provider store={store}>
      <MainNavigator/>
    </Provider>
  );
  
};

export default App;