import './ConnectModal.css'
import { FormEvent, useState } from 'react'

export interface ConnectModalProps {
    onConnect: (gameId: string) => void
    onClose: () => void
}

export function ConnectModal({ onConnect, onClose }: ConnectModalProps) {
    const [gameId, setGameId] = useState('')

    const onClick = (e: FormEvent) => {
        e.preventDefault()
        onConnect(gameId)
    }

    return (
        <div className="backdrop">
            <div className="modal">
                <h2 className="heading">ENTER GAME ID:</h2>
                <form className='connect-form'>
                    <input
                        value={gameId}
                        onChange={(e) => setGameId(e.target.value)}
                    />
                    <button id="submit" type="submit" onClick={onClick}>
                        JOIN
                    </button>
                </form>
                <button className="btn w-100" onClick={onClose}>
                    BACK
                </button>
            </div>
        </div>
    )
}
