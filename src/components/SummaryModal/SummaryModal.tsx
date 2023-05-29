import './SummaryModal.css'
import { User } from '../../types'

export interface SummaryModalProps {
    winner: User
    close: () => void
}

export function SummaryModal({ winner, close }: SummaryModalProps) {
    return (
        <div className="backdrop" onClick={() => close()}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2 className="heading">
                    {`${winner.name} WON`}
                </h2>
                <button className="btn" onClick={() => close()}>
                    CLOSE
                </button>
            </div>
        </div>
    )
}
