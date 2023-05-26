import './LobbyModal.css'

export interface LobbyModalProps {
    players: string[]
    close: () => void
}

export function LobbyModal({ players, close }: LobbyModalProps) {
    return (
        <div className="backdrop" onClick={() => close()}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2 className="heading">PLAYERS:</h2>
                <div className="player-entry">
                    <b>Player 1: </b>
                    {players[0]}
                </div>
                <div className="player-entry">
                    <b>Player 2: </b>
                    {players[1] || 'not joined'}
                </div>
                <button className="close-btn" onClick={() => close()}>
                    CLOSE
                </button>
            </div>
        </div>
    )
}
