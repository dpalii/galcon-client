import { useContext } from 'react'
import './SummaryModal.css'
import { SocketContext } from '../../contexts/SocketContext'

export interface SummaryModalProps {
    winner: string
    close: () => void
}

export function SummaryModal({ winner, close }: SummaryModalProps) {
    const socket = useContext(SocketContext)
    return (
        <div className="backdrop" onClick={() => close()}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2 className="heading">
                    {socket.id === winner ? 'YOU WON' : 'YOU LOST'}
                </h2>
                <button className="close-btn" onClick={() => close()}>
                    CLOSE
                </button>
            </div>
        </div>
    )
}
