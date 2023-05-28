import { useContext } from 'react'
import './SummaryModal.css'
import { SocketContext } from '../../contexts/SocketContext'
import { User } from '../../types'

export interface SummaryModalProps {
    winner: User
    close: () => void
}

export function SummaryModal({ winner, close }: SummaryModalProps) {
    const socket = useContext(SocketContext)
    return (
        <div className="backdrop" onClick={() => close()}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2 className="heading">
                    {socket.id === winner.id ? 'YOU WON' : 'YOU LOST'}
                </h2>
                <button className="btn" onClick={() => close()}>
                    CLOSE
                </button>
            </div>
        </div>
    )
}
