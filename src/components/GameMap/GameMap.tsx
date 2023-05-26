import { MapData, PlanetData } from '../../types'
import { MouseEvent, useContext, useState } from 'react'
import './GameMap.css'
import { useRef } from 'react'
import { useEffect } from 'react'
import { SocketContext } from '../../contexts/SocketContext'

export interface GameMapProps {
    mapData: MapData
}

export function GameMap({ mapData }: GameMapProps) {
    const [selected, setSelected] = useState<PlanetData[]>([])
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const socket = useContext(SocketContext)

    const handleClick = (e: MouseEvent<HTMLCanvasElement>) => {
        console.log('click!')

        if (!canvasRef.current) {
            return
        }

        const scale = mapData.w / (canvasRef.current.offsetWidth - 60)
        const clickX = Math.floor(e.nativeEvent.offsetX * scale)
        const clickY = Math.floor(e.nativeEvent.offsetY * scale)

        const selectedPlanet = mapData.planetArray.find(
            ({ coords: { x, y }, radius }) =>
                Math.pow(x - clickX, 2) + Math.pow(y - clickY, 2) <
                Math.pow(radius, 2)
        )

        if (!selectedPlanet) {
            setSelected([])
            return
        }
        const selectedIndex = selected.findIndex(
            ({ id }) => id === selectedPlanet.id
        )

        if (selectedIndex >= 0) {
            setSelected([
                ...selected.slice(0, selectedIndex),
                ...selected.slice(selectedIndex + 1),
            ])
            return
        }

        if (selectedPlanet.ownerId !== socket.id) {
            return
        }

        setSelected([...selected, selectedPlanet])
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
            context.arc(x - r, y, r, 0, 2 * Math.PI)
            context.fill()
            context.font = `${fontSize}px sans`
            context.textAlign = 'center'
            context.fillStyle = '#ffffff'
            context.fillText(`${planet.fleet}`, x - r, y + fontSize / 2)
        })

        selected.forEach((planet) => {
            const { x, y } = planet.coords
            const r = planet.radius
            const offset = 1

            context.strokeStyle = '#ffffff'
            context.beginPath()
            context.arc(x - r, y, r + offset * 2, 0, 2 * Math.PI)
            context.stroke()
        })
    }, [mapData, selected, socket])

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
