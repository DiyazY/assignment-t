import "./App.css";
import Entries from "./components/Entries";
import { Container } from "@mui/material";

function App() {
  return (
    <div className="App">
      <Container maxWidth="sm">
        <Entries userName="diyaz" />
      </Container>
    </div>
  );
}

export default App;
