import Routes from "./Routes"
import { UserContextProvider } from './UserContext';

function App() {
  return (
    <UserContextProvider>
      <Routes />
    </UserContextProvider>
  );
}

export default App;
