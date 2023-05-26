import { useContext } from 'react';
import './Game.css';
import { SocketContext } from '../../contexts/SocketContext';
import { IncomingEvents } from '../../types';
// import { LobbyModal } from '../LobbyModal/LobbyModal';

export interface GameProps {
    gameId: string;
    // players: string[];
}

export function Game({ gameId }: GameProps) {
    const socket = useContext(SocketContext);
    // const [lobbyOpen, setLobbyOpen] = useState(false);

    socket.on(IncomingEvents.GAME_STARTED, (...args) => {
      console.log(args);
    });
  
    socket.on(IncomingEvents.WON, (...args) => {
      console.log(args);
    });
  
    socket.on(IncomingEvents.LOST, (...args) => {
      console.log(args);
    });

    return (
        <>
            <div className='game'>
                <header className='header'>
                    <div className='game-id'>Game ID: {gameId}</div>
                    {/* <button className='lobby' onClick={() => setLobbyOpen(true)}>LOBBY</button> */}
                </header>
            </div>
            {/* {lobbyOpen && <LobbyModal players={players} close={() => setLobbyOpen(false)}/>} */}
        </>
    )
}