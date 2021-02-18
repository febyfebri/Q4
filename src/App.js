import React, { useState } from "react";
import "./App.css";
import GitHubLogin from "./GithubLogin";

function App() {
  const [name, setName] = useState("");

  return (
    <div className="App">
      <header className="App-header">
        {name && <h2>Hai {name}</h2>}
        <GitHubLogin
        //Menambah ClientId
        //Menambah ClientSecret
          clientId="070eea0c41ca4db76e3a"
          clientSecret="d7baa1b10f087bc6b84f912ad7b66eed0b343017"
          redirectUri="http://localhost:3000/"
          onSuccess={(name) => setName(name)}
          onFailure={(resp) => console.log(resp)}
        />
      </header>
    </div>
  );
}

export default App;