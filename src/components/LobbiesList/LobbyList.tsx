import { useContext, useEffect, useState } from 'react'
import { SocketContext } from '../../contexts/SocketContext'
import './LobbyList.css'
import { IncomingEvents, Lobby, OutgoingEvents } from '../../types'

export interface LobbyListProps {
    joinLobby: (gameId: string) => void
    close: () => void
}

export function LobbyList({ joinLobby, close }: LobbyListProps) {
    const PAGE_SIZE = 5
    const socket = useContext(SocketContext)
    const [lobbies, setLobbies] = useState<Lobby[]>([])
    const [page, setPage] = useState(0)

    const getLobbies = () => {
        socket.emit(OutgoingEvents.GET_LOBBY_LIST, (lobbyList: Lobby[]) => {
            setLobbies(lobbyList)
        })
    }
    
    const getLastPage = () => {
        return Math.floor(lobbies.length / PAGE_SIZE)
    }

    useEffect(getLobbies, [socket])

    useEffect(() => {
        socket.on(IncomingEvents.GAME_CREATED, getLobbies)

        return () => {
            socket.off(IncomingEvents.GAME_CREATED, getLobbies)
        }
    })

    return (
        <div className="backdrop" onClick={() => close()}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2 className="heading">LOBBIES:</h2>
                <div className='lobbies-wrapper'>
                    <table className='lobbies'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>User Amount</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                lobbies.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE).map((lobby) => (
                                    <tr>
                                        <td>{lobby.id}</td>
                                        <td>{lobby.usersAmount}</td>
                                        <td>
                                            <button className='btn btn-sm' onClick={() => joinLobby(lobby.id)}>JOIN</button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                <div className='pagination'>
                    <button disabled={page === 0} onClick={() => setPage(page - 1)} className='btn btn-sm'>{'<'}</button>
                    <div className='page'>{page + 1}</div>
                    <button disabled={page === getLastPage()} onClick={() => setPage(page + 1)} className='btn btn-sm'>{'>'}</button>
                </div>
                <button className="btn w-100" onClick={() => close()}>
                    CLOSE
                </button>
            </div>
        </div>
    )
}
