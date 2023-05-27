import { useContext, useEffect, useState } from 'react'
import './Game.css'
import { SocketContext } from '../../contexts/SocketContext'
import { GameState, IncomingEvents, MapData, OutgoingEvents } from '../../types'
import { GameMap } from '../GameMap/GameMap'
import { LobbyModal } from '../LobbyModal/LobbyModal'
import { SummaryModal } from '../SummaryModal/SummaryModal'

export interface GameProps {
    gameId: string
    players: string[]
    gameFinished: () => void
}

export function Game({ gameId, players, gameFinished }: GameProps) {
    const socket = useContext(SocketContext)
    const [winner, setWinner] = useState<string | null>(null)
    const [gameStarted, setGameStarted] = useState(false)
    const [mapData, setMapData] = useState<MapData | null>(null)
    const [lobbyOpen, setLobbyOpen] = useState(false)

    useEffect(() => {
        socket.on(IncomingEvents.GAME_STARTED, (response: GameState) => {
            console.log(response)
            setMapData(response.map)
            setGameStarted(true)
        })

        socket.on(IncomingEvents.WON, (...args) => {
            console.log(args)
            setWinner(socket.id === players[0] ? players[0] : players[1])
        })

        socket.on(IncomingEvents.LOST, (...args) => {
            console.log(args)
            setWinner(socket.id !== players[0] ? players[0] : players[1])
        })

        return () => {
            socket.off(IncomingEvents.GAME_STARTED)
            socket.off(IncomingEvents.WON)
            socket.off(IncomingEvents.LOST)
        }
    }, [socket, players])

    const startGame = () => {
        if (!gameStarted) {
            setGameStarted(true)
            socket.emit(OutgoingEvents.START_GAME, gameId)
        }
    }

    return (
        <>
            <div className="game">
                <header className="header">
                    <div className="game-id">
                        <b>Game ID: </b>
                        {gameId}
                    </div>
                    <button
                        className="button"
                        disabled={gameStarted || players.length < 2}
                        onClick={() => startGame()}
                    >
                        START GAME {players.length} / 2
                    </button>
                    <button
                        className="button"
                        onClick={() => setLobbyOpen(true)}
                    >
                        LOBBY
                    </button>
                </header>
                <div className='game-map'>
                    {gameStarted && mapData && <GameMap mapData={mapData} gameId={gameId} />}
                </div>
            </div>
            {lobbyOpen && (
                <LobbyModal
                    players={players}
                    close={() => setLobbyOpen(false)}
                />
            )}
            {winner && (
                <SummaryModal
                    winner={winner}
                    close={() => gameFinished()}
                />
            )}
        </>
    )
}
