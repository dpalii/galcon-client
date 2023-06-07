export interface User {
    id: string
    name: string
    color: string
    isHost: boolean
}

export enum OutgoingEvents {
    CREATE_NEW_GAME = 'CREATE_NEW_GAME',
    JOIN_GAME = 'JOIN_GAME',
    START_GAME = 'START_GAME',
    SEND_UNITS = 'SEND_UNITS',
    GET_LOBBY_LIST = 'GET_LOBBY_LIST',
}

export enum IncomingEvents {
    PLAYER_JOINED = 'PLAYER_JOINED',
    GAME_STARTED = 'GAME_STARTED',
    SEND_UNITS = 'SEND_UNITS',
    GAME_END = 'GAME_END',
    SYNC = 'SYNC',
    GAME_CREATED = 'GAME_CREATED',
    WON = 'WON',
    LOST = 'LOST',
}

export interface GameDetails {
    gameId: string
    players: User[]
}

export interface Coordinates {
    x: number
    y: number
}

export interface PlanetData {
    coords: Coordinates
    fleet: number
    fleetGenSpeed: number
    id: number
    owner: User | null
    radius: number
}

export interface MapData {
    w: number
    h: number
    planetArray: PlanetData[]
}

export interface GameState {
    id: string
    players: User[]
    map: MapData
}

export interface FleetData {
    destinationPlanetId: number;
    sourcePlanetId: number;
    sender: string;
    timeToReachInSec: number;
    unitsAmount: number;
}

export interface InputUser {
    name: string;
    color: string;
}

export interface Lobby {
    id: string,
    usersAmount: number
}
