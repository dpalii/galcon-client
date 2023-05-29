import './App.css'
import { ConnectModal } from './components/ConnectModal/ConnectModal'
import { UserModal } from './components/UserModal/UserModal'
import { Game } from './components/Game/Game'
import { useContext, useEffect, useState } from 'react'
import { SocketContext } from './contexts/SocketContext'
import { GameDetails, IncomingEvents, InputUser, OutgoingEvents, User } from './types'
import { LobbyList } from './components/LobbiesList/LobbyList'

function App() {
    const socket = useContext(SocketContext)
    const [user, setUser] = useState<InputUser>({
        name: '',
        color: '#0000ff'
    })
    const [lobbyListOpen, setLobbyListOpen] = useState<boolean>(false)
    const [joinByCodeOpen, setJoinByCodeOpen] = useState<boolean>(false)
    const [gameId, setGameId] = useState<string | null>(null)
    const [players, setPlayers] = useState<User[]>([])
    const handleConnect = (gameId: string) => {
        socket.emit(
            OutgoingEvents.JOIN_GAME,
            user,
            gameId,
            (response: GameDetails) => {
                setGameId(response.gameId)
                setPlayers(response.players)
                setJoinByCodeOpen(false)
            }
        )
    }
    const handleNewGame = (inputUser: InputUser) => {
        socket.emit(OutgoingEvents.CREATE_NEW_GAME, inputUser, (gameId: string) => {
            const newUser = {
                ...inputUser,
                id: socket.id,
                isHost: true
            }
            setUser(inputUser)
            setGameId(gameId)
            setPlayers([newUser])
            setJoinByCodeOpen(false)
            setLobbyListOpen(false)
        })
    }

    const handleJoinByCode = (inputUser: InputUser) => {
        setUser(inputUser)
        setJoinByCodeOpen(true)
        setLobbyListOpen(false)
    }

    const handleOpenLobbyList = (inputUser: InputUser) => {
        setUser(inputUser)
        setJoinByCodeOpen(false)
        setLobbyListOpen(true)
    }

    const handleGameFinished = () => {
        setGameId(null)
    }

    useEffect(() => {
        const onPlayerJoined = (player: User) => {
            setPlayers([...players, player])
        }
        socket.on(IncomingEvents.PLAYER_JOINED, onPlayerJoined)

        return () => {
            socket.off(IncomingEvents.PLAYER_JOINED, onPlayerJoined)
        }
    }, [socket, players])

    const showComponent = () => {
        if (gameId) {
            return (<Game
                gameId={gameId}
                players={players}
                gameFinished={handleGameFinished}
            />)
        }
        if (joinByCodeOpen) {
            return (<ConnectModal
                onConnect={handleConnect}
                onClose={() => setJoinByCodeOpen(false)}
            />)
        }
        if (lobbyListOpen) {
            return (<LobbyList
                close={() => setLobbyListOpen(false)}
                joinLobby={handleConnect}
            />)
        }
        return (<UserModal 
            inputUser={user}
            joinByCode={(inputUser) => handleJoinByCode(inputUser)}
            openLobbyList={(inputUser) => handleOpenLobbyList(inputUser)}
            createGame={(inputUser) => handleNewGame(inputUser)}
        />)
    }

    return (
        <div className="App">
            {showComponent()}
        </div>
    )
}

export default App
