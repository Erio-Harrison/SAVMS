import Routes from "./Routes"
import { UserContextProvider } from './UserContext';
import {APIProvider} from '@vis.gl/react-google-maps';

const API_KEY =
    globalThis.GOOGLE_MAPS_API_KEY ?? import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
function App() {

    return (
            <APIProvider apiKey={API_KEY} onLoad={() => console.log('Maps API has loaded.')}>
                <UserContextProvider>
                    <Routes />
                </UserContextProvider>
            </APIProvider>
    );
}

export default App;
