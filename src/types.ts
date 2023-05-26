export enum OutgoingEvents {
    CREATE_NEW_GAME = 'CREATE_NEW_GAME',
    JOIN_GAME = 'JOIN_GAME',
    START_GAME = 'START_GAME',
    SEND_UNITS = 'SEND_UNITS',
}

export enum IncomingEvents {
    PLAYER_JOINED = 'PLAYER_JOINED',
    GAME_STARTED = 'GAME_STARTED',
    SEND_UNITS = 'GAME_STARTED',
    WON = 'WON',
    LOST = 'LOST'
}

export interface GameDetails {
    gameId: string;
    player1: string;
    player2: string;
}