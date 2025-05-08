import Routes from "./Routes"
import { UserContextProvider } from './UserContext';
import {APIProvider} from '@vis.gl/react-google-maps';
import { LoadScript } from "@react-google-maps/api";

const API_KEY =
    globalThis.GOOGLE_MAPS_API_KEY ?? import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
function App() {

    return (
        <LoadScript
            googleMapsApiKey={API_KEY}
            libraries={["places"]}
        >
            <APIProvider apiKey={API_KEY} onLoad={() => console.log('Maps API has loaded.')}>
                <UserContextProvider>
                    <Routes />
                </UserContextProvider>
            </APIProvider>
        </LoadScript>
    );
}

export default App;
