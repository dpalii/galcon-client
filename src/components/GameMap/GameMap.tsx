import {
    Coordinates,
    FleetData,
    IncomingEvents,
    MapData,
    OutgoingEvents,
    PlanetData,
} from '../../types'
import { MouseEvent, useContext, useState } from 'react'
import './GameMap.css'
import { useRef } from 'react'
import { useEffect } from 'react'
import { SocketContext } from '../../contexts/SocketContext'

export interface GameMapProps {
    mapData: MapData
    gameId: string
}

interface Fleet {
    fleetData: FleetData
    startTime: number
    position: Coordinates
    startPlanet: PlanetData
    targetPlanet: PlanetData
}

function getTimeInSec() {
    return new Date().getTime() / 1000
}

export function GameMap({ mapData, gameId }: GameMapProps) {
    const [fleets, setFleets] = useState<Fleet[]>([])
    const [selected, setSelected] = useState<PlanetData | null>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const socket = useContext(SocketContext)

    const handleClick = (e: MouseEvent<HTMLCanvasElement>) => {
        if (!canvasRef.current) {
            return
        }

        const CANVAS_PADDING = 30;
        const scale = mapData.w / (canvasRef.current.offsetWidth - 2 * CANVAS_PADDING)
        const clickX = (e.nativeEvent.offsetX - CANVAS_PADDING) * scale
        const clickY = (e.nativeEvent.offsetY) * scale

        const targetPlanet = mapData.planetArray.find(
            ({ coords: { x, y }, radius }) =>
                Math.pow(x - clickX, 2) + Math.pow(y - clickY, 2) <
                Math.pow(radius, 2)
        )

        if (!targetPlanet || targetPlanet.id === selected?.id) {
            setSelected(null)
            return
        }

        if (targetPlanet.ownerId === socket.id) {
            setSelected(targetPlanet)
            return
        }

        if (selected) {
            socket.emit(
                OutgoingEvents.SEND_UNITS,
                gameId,
                selected.id,
                targetPlanet.id
            )
            setSelected(null)
        }

        setSelected(null)
    }

    useEffect(() => {
        console.log('render!')

        const canvas = canvasRef.current
        if (!canvas) {
            return
        }
        const context = canvas.getContext('2d')
        if (!context) {
            return
        }
        context.fillStyle = '#000000'
        context.fillRect(0, 0, context.canvas.width, context.canvas.height)

        fleets.forEach((fleet) => {
            if (!fleet.fleetData.sender) {
                context.fillStyle = '#444444'
            } else if (fleet.fleetData.sender === socket.id) {
                context.fillStyle = '#0000ff'
            } else {
                context.fillStyle = '#ff0000'
            }
            const { x, y } = fleet.position
            
            // context.strokeStyle = '#ffffff'
            // context.beginPath();
            // context.moveTo(fleet.startPlanet.coords.x, fleet.startPlanet.coords.y);
            // context.lineTo(fleet.targetPlanet.coords.x, fleet.targetPlanet.coords.y);
            // context.stroke();

            const scale = 10
            const vectorX = (fleet.targetPlanet.coords.x - fleet.startPlanet.coords.x)
            const vectorY = (fleet.targetPlanet.coords.y - fleet.startPlanet.coords.y)
            const vectorLength = Math.sqrt(Math.pow(vectorX, 2) + Math.pow(vectorY, 2))
            const vectorXNorm = vectorX / vectorLength
            const vectorYNorm = vectorY / vectorLength
            const vectorXOrt = -vectorYNorm
            const vectorYOrt = vectorXNorm

            context.beginPath();
            context.moveTo(x + scale * vectorXNorm, y + scale * vectorYNorm);
            context.lineTo(x - scale * (vectorXNorm - vectorXOrt), y - scale * (vectorYNorm - vectorYOrt));
            context.lineTo(x - scale / 2 * vectorXNorm, y - scale / 2 * vectorYNorm);
            context.lineTo(x - scale * (vectorXNorm + vectorXOrt), y - scale * (vectorYNorm + vectorYOrt));

            context.fill()
        })

        mapData.planetArray.forEach((planet) => {
            if (!planet.ownerId) {
                context.fillStyle = '#444444'
            } else if (planet.ownerId === socket.id) {
                context.fillStyle = '#0000ff'
            } else {
                context.fillStyle = '#ff0000'
            }
            const { x, y } = planet.coords
            const r = planet.radius
            const fontSize = Math.floor(r / 2)
            context.beginPath()
            context.arc(x, y, r, 0, 2 * Math.PI)
            context.fill()
            context.font = `${fontSize}px sans`
            context.textAlign = 'center'
            context.fillStyle = '#ffffff'
            context.fillText(`${planet.fleet}`, x, y + fontSize / 2)
        })

        if (selected) {
            const { x, y } = selected.coords
            const r = selected.radius
            const offset = 1

            context.strokeStyle = '#ffffff'
            context.beginPath()
            context.arc(x, y, r + offset * 2, 0, 2 * Math.PI)
            context.stroke()
        }
    }, [mapData, selected, socket, fleets])

    useEffect(() => {
        socket.on(IncomingEvents.SEND_UNITS, (unitData: FleetData) => {
            const startPlanet = mapData.planetArray.find(({id}) => id === unitData.sourcePlanetId)
            const targetPlanet = mapData.planetArray.find(({id}) => id === unitData.destinationPlanetId)

            if (!startPlanet || !targetPlanet) {
                return
            }
            const newFleet: Fleet = {
                fleetData: unitData,
                startTime: getTimeInSec(),
                position: {...startPlanet.coords},
                startPlanet,
                targetPlanet
            }
            setFleets([...fleets, newFleet])
        })

        return () => {
            socket.off(IncomingEvents.SEND_UNITS)
        }
    }, [socket, fleets, mapData])

    useEffect(() => {
        const timer = setTimeout(() => {
            const currTime = getTimeInSec()
            const updatedFleets: Fleet[] = fleets
                .filter((fleet) => currTime - fleet.startTime < fleet.fleetData.timeToReachInSec)
                .map((fleet) => {
                    const startPlanet = fleet.startPlanet
                    const targetPlanet = fleet.targetPlanet
                    const progress = (currTime - fleet.startTime) / fleet.fleetData.timeToReachInSec
                    const x = startPlanet.coords.x + ((targetPlanet.coords.x - startPlanet.coords.x) * progress)
                    const y = startPlanet.coords.y + ((targetPlanet.coords.y - startPlanet.coords.y) * progress)
                    return {
                        ...fleet,
                        position: {x, y}
                    }
                })

            setFleets(updatedFleets)
        }, 16)

        return () => {
            clearTimeout(timer)
        }
    }, [mapData, fleets])

    return (
        <canvas
            className="canvas"
            ref={canvasRef}
            height={mapData.h}
            width={mapData.w}
            onClick={handleClick}
        ></canvas>
    )
}
