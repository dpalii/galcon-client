import { useState } from 'react'
import { InputUser } from '../../types'
import './UserModal.css'

export interface UserModalProps {
    inputUser: InputUser
    createGame: (user: InputUser) => void
    joinByCode: (user: InputUser) => void
    openLobbyList: (user: InputUser) => void
}

export function UserModal({ inputUser, createGame, joinByCode, openLobbyList }: UserModalProps) {
    const [error, setError] = useState('')
    const [user, setUser] = useState<InputUser>(inputUser);

    const isFormValid = () => {
        if (!user.name || !user.color) {
            setError('Please fill out the fields')
            return false
        }
        setError('')
        return true
    }

    const handleCreateGame = () => {
        if (!isFormValid()) {
            return
        }
        createGame(user)
    }

    const handleJoinByCode = () => {
        if (!isFormValid()) {
            return
        }
        joinByCode(user)

    }

    const handleOpenLobbyList = () => {
        if (!isFormValid()) {
            return
        }
        openLobbyList(user)
    }

    return (
        <div className="backdrop">
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2 className="heading">USER CONFIGURATION</h2>
                <form>
                    <div className='input-wrapper'>
                        <label htmlFor="name">Name</label>
                        <input
                            id="name"
                            name="name"
                            value={user.name}
                            onChange={(e) =>
                                setUser({ ...user, name: e.target.value })
                            }
                        />
                    </div>
                    <div className='input-wrapper'>
                        <label htmlFor="color">Color</label>
                        <input
                            id="color"
                            name="color"
                            type="color"
                            value={user.color}
                            onChange={(e) =>
                                setUser({ ...user, color: e.target.value })
                            }
                        />
                    </div>
                </form>
                <p className='error'>{error}</p>
                <button
                    className="btn mb w-100"
                    onClick={() => handleCreateGame()}
                >
                    CREATE GAME
                </button>
                <button
                    className="btn mb w-100"
                    onClick={() => handleJoinByCode()}
                >
                    JOIN BY CODE
                </button>
                <button
                    className="btn mb w-100"
                    onClick={() => handleOpenLobbyList()}
                >
                    OPEN LOBBY LIST
                </button>
            </div>
        </div>
    )
}