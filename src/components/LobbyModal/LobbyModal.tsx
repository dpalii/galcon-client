import './LobbyModal.css';

export interface LobbyModalProps {
    players: string[];
    close: () => void;
}

export function LobbyModal({players, close}: LobbyModalProps) {

    return (
        <div className='backdrop' onClick={() => close()}>
            <div className='modal' onClick={(e) => e.stopPropagation()}>
                <h2 className='heading'>PLAYERS:</h2>
                <button className='close-btn' onClick={() => close()}>CLOSE</button>
            </div>
        </div>
    )
}