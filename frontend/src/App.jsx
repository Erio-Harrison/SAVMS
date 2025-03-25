import Routes from "./Routes"
import { UserContextProvider } from './UserContext';
import {APIProvider} from '@vis.gl/react-google-maps';

function App() {
  return (
      <APIProvider apiKey={'AIzaSyBKDDK8WW_VH96hpM7kMWE2wzE2akrFaEo'} onLoad={() => console.log('Maps API has loaded.')}>
          <UserContextProvider>
              <Routes />
          </UserContextProvider>
      </APIProvider>

  );
}

export default App;
