import Routes from "./Routes"
import { UserContextProvider } from './UserContext';
import react from 'react';
import {Button, Toast} from '@douyinfe/semi-ui';


function App() {
  return (
      <UserContextProvider>
          <Routes/>
          <div style={{padding: '20px', textAlign: 'center'}}>
          </div>
      </UserContextProvider>
  );
}

export default App;
