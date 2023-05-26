import './App.css';
import { ConnectModal } from './components/ConnectModal/ConnectModal';
import { Game } from './components/Game/Game';
import { useContext, useState } from 'react';
import { SocketContext } from './contexts/SocketContext';
import { GameDetails, IncomingEvents, OutgoingEvents } from './types';

function App() {
  const socket = useContext(SocketContext);
  const [gameId, setGameId] = useState<string | null>(null);
  // const [players, setPlayers] = useState<string[]>([]);
  const handleConnect = (gameId: string) => {
    socket.emit(OutgoingEvents.JOIN_GAME, gameId, (response: GameDetails) => {
      console.log(response.gameId);
      setGameId(response.gameId);
      // setPlayers([response.player1, response.player2]);
    });
  }
  const handleNewGame = () => {
    socket.emit(OutgoingEvents.CREATE_NEW_GAME, (response: string) => {
      console.log(response);
      setGameId(response);
      // setPlayers([]);
    });
  }
  socket.on(IncomingEvents.PLAYER_JOINED, (...args) => {
    console.log(args);
  });

  return (
    <div className="App">
      {
        gameId
          ? <Game gameId={gameId} /> 
          : <ConnectModal onConnect={handleConnect} onCreateNewGame={handleNewGame} />
      }
    </div>
  );
}

export default App;
