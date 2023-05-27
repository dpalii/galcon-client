import './App.css'
import { ConnectModal } from './components/ConnectModal/ConnectModal'
import { Game } from './components/Game/Game'
import { useContext, useEffect, useState } from 'react'
import { SocketContext } from './contexts/SocketContext'
import { GameDetails, IncomingEvents, OutgoingEvents } from './types'

function App() {
    const socket = useContext(SocketContext)
    const [gameId, setGameId] = useState<string | null>(null)
    const [players, setPlayers] = useState<string[]>([])
    const handleConnect = (gameId: string) => {
        socket.emit(
            OutgoingEvents.JOIN_GAME,
            gameId,
            (response: GameDetails) => {
                console.log(response.gameId)
                setGameId(response.gameId)
                setPlayers([response.player1, response.player2])
            }
        )
    }
    const handleNewGame = () => {
        socket.emit(OutgoingEvents.CREATE_NEW_GAME, (gameId: string) => {
            console.log(gameId)
            setGameId(gameId)
            setPlayers([socket.id])
        })
    }

    const handleGameFinished = () => {
        setGameId(null)
    }

    useEffect(() => {
        socket.on(IncomingEvents.PLAYER_JOINED, (players: string) => {
            console.log(players)
            setPlayers([socket.id, players])
        })

        return () => {
            socket.off(IncomingEvents.PLAYER_JOINED)
        }
    }, [])

    return (
        <div className="App">
            {gameId ? (
                <Game
                    gameId={gameId}
                    players={players}
                    gameFinished={handleGameFinished}
                />
            ) : (
                <ConnectModal
                    onConnect={handleConnect}
                    onCreateNewGame={handleNewGame}
                />
            )}
        </div>
    )
}

export default App
