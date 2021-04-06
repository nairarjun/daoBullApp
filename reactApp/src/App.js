import { UALProvider, withUAL } from 'ual-reactjs-renderer';
import { Anchor } from 'ual-anchor';
import { JsonRpc } from 'eosjs';
import React from 'react';
import './css/font-awesome.css';
import { REACT_APP_EOSIO_HOST, REACT_APP_EOSIO_CHAIN_ID, REACT_APP_EOSIO_PROTOCOL ,REACT_APP_EOSIO_PORT} from "../src/common/config";
// import './css/fontawesome.min.css';
import DecentralizeApp from './components/Main/DecentralizeApp.js';

const ourNetwork = {
  chainId: REACT_APP_EOSIO_CHAIN_ID,
  rpcEndpoints: [{ protocol: REACT_APP_EOSIO_PROTOCOL, host: REACT_APP_EOSIO_HOST, port:REACT_APP_EOSIO_PORT}]
}

const anchor = new Anchor([ourNetwork], {
  appName: 'Decentralize.io',
  rpc: new JsonRpc(`${ourNetwork.rpcEndpoints[0].protocol}://${ourNetwork.rpcEndpoints[0].host}${ourNetwork.rpcEndpoints[0].port !== "" ? ":" : ""}${ourNetwork.rpcEndpoints[0].port}`),
  service: 'https://cb.anchor.link',
  disableGreymassFuel: false,
  requestStatus: false
})

const DecentralizeAppConsumer = withUAL(DecentralizeApp)

function App() {
  return (
    <UALProvider chains={[ourNetwork]} authenticators={[anchor]} appName={"Decentralize.io"}>
      <DecentralizeAppConsumer />
    </UALProvider>
  );
}

export default App;
