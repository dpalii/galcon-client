import { User } from '../../types'
import './LobbyModal.css'

export interface LobbyModalProps {
    players: User[]
    close: () => void
}

export function LobbyModal({ players, close }: LobbyModalProps) {
    return (
        <div className="backdrop" onClick={() => close()}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2 className="heading">PLAYERS:</h2>
                {players.map((player) => (
                    <div key={player.id} className="player-entry">
                        <span className='player-color' style={{backgroundColor: player.color}}></span>
                        <b>{player.name} {player.isHost ? '(host)' : ''}</b>
                    </div>
                ))}
                <button className="btn w-100" onClick={() => close()}>
                    CLOSE
                </button>
            </div>
        </div>
    )
}
