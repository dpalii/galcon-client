import './ConnectModal.css'
import { FormEvent, useState } from 'react'

export interface ConnectModalProps {
    onConnect: (gameId: string) => void
    onCreateNewGame: () => void
}

export function ConnectModal({
    onConnect,
    onCreateNewGame,
}: ConnectModalProps) {
    const [gameId, setGameId] = useState('')

    const onClick = (e: FormEvent) => {
        e.preventDefault()
        onConnect(gameId)
    }

    return (
        <div className="backdrop">
            <div className="form">
                <form>
                    <legend>ENTER GAME ID:</legend>
                    <input
                        value={gameId}
                        onChange={(e) => setGameId(e.target.value)}
                    />
                    <button type="submit" onClick={onClick}>
                        JOIN
                    </button>
                </form>
                <button className="create-new" onClick={onCreateNewGame}>
                    CREATE NEW GAME
                </button>
            </div>
        </div>
    )
}
