import React, {
  MouseEvent, useContext, useState, useRef, useEffect,
} from 'react';
import {
  Coordinates,
  FleetData,
  IncomingEvents,
  MapData,
  OutgoingEvents,
  PlanetData,
} from '../../types';
import './GameMap.css';
import { SocketContext } from '../../contexts/SocketContext';

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
  return new Date().getTime() / 1000;
}

function invertColor(hexColor: string): string {
  let hex = hexColor;
  if (hex.indexOf('#') === 0) {
    hex = hex.slice(1);
  }
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    throw new Error('Invalid HEX color.');
  }
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  // https://stackoverflow.com/a/3943023/112731
  return (r * 0.299 + g * 0.587 + b * 0.114) > 186
    ? '#000000'
    : '#FFFFFF';
}

export function GameMap({ mapData, gameId }: GameMapProps) {
  const [fleets, setFleets] = useState<Fleet[]>([]);
  const [selected, setSelected] = useState<PlanetData | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const socket = useContext(SocketContext);

  const handleClick = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) {
      return;
    }

    const CANVAS_PADDING = 30;
    const scale = mapData.w / (canvasRef.current.offsetWidth - 2 * CANVAS_PADDING);
    const clickX = (e.nativeEvent.offsetX - CANVAS_PADDING) * scale;
    const clickY = (e.nativeEvent.offsetY) * scale;

    const targetPlanet = mapData.planetArray.find(
      ({ coords: { x, y }, radius }) => (x - clickX) ** 2 + (y - clickY) ** 2
                < radius ** 2,
    );

    if (!targetPlanet || targetPlanet.id === selected?.id) {
      setSelected(null);
      return;
    }

    if (targetPlanet.owner?.id === socket.id) {
      setSelected(targetPlanet);
      return;
    }

    if (selected) {
      socket.emit(
        OutgoingEvents.SEND_UNITS,
        gameId,
        selected.id,
        targetPlanet.id,
      );
      setSelected(null);
    }

    setSelected(null);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }
    context.fillStyle = '#000000';
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    fleets.forEach((fleet) => {
      context.fillStyle = fleet.startPlanet.owner?.color || '#444444';
      const { x, y } = fleet.position;

      const scale = 10;
      const vectorX = (fleet.targetPlanet.coords.x - fleet.startPlanet.coords.x);
      const vectorY = (fleet.targetPlanet.coords.y - fleet.startPlanet.coords.y);
      const vectorLength = Math.sqrt(vectorX ** 2 + vectorY ** 2);
      const vectorXNorm = vectorX / vectorLength;
      const vectorYNorm = vectorY / vectorLength;
      const vectorXOrt = -vectorYNorm;
      const vectorYOrt = vectorXNorm;

      context.beginPath();
      context.moveTo(x + scale * vectorXNorm, y + scale * vectorYNorm);
      context.lineTo(
        x - scale * (vectorXNorm - vectorXOrt),
        y - scale * (vectorYNorm - vectorYOrt),
      );
      context.lineTo(x - (scale / 2) * vectorXNorm, y - (scale / 2) * vectorYNorm);
      context.lineTo(
        x - scale * (vectorXNorm + vectorXOrt),
        y - scale * (vectorYNorm + vectorYOrt),
      );

      context.fill();
    });

    mapData.planetArray.forEach((planet) => {
      const planetColor = planet.owner?.color || '#444444';
      context.fillStyle = planetColor;
      const { x, y } = planet.coords;
      const r = planet.radius;
      const fontSize = Math.floor(r / 2);
      context.beginPath();
      context.arc(x, y, r, 0, 2 * Math.PI);
      context.fill();
      context.font = `${fontSize}px sans`;
      context.textAlign = 'center';
      context.fillStyle = invertColor(planetColor);
      context.fillText(`ID: ${planet.id}`, x, y);
      context.fillText(`${planet.fleet}`, x, y + fontSize);
    });

    if (selected) {
      const { x, y } = selected.coords;
      const r = selected.radius;
      const offset = 1;

      context.strokeStyle = '#ffffff';
      context.beginPath();
      context.arc(x, y, r + offset * 2, 0, 2 * Math.PI);
      context.stroke();
    }
  }, [mapData, selected, socket, fleets]);

  useEffect(() => {
    const onSendUnits = (unitData: FleetData) => {
      const startPlanet = mapData.planetArray.find(({ id }) => id === unitData.sourcePlanetId);
      const targetPlanet = mapData.planetArray
        .find(({ id }) => id === unitData.destinationPlanetId);

      if (!startPlanet || !targetPlanet) {
        return;
      }
      const newFleet: Fleet = {
        fleetData: unitData,
        startTime: getTimeInSec(),
        position: { ...startPlanet.coords },
        startPlanet,
        targetPlanet,
      };
      setFleets([...fleets, newFleet]);
    };

    socket.on(IncomingEvents.SEND_UNITS, onSendUnits);

    return () => {
      socket.off(IncomingEvents.SEND_UNITS, onSendUnits);
    };
  }, [socket, fleets, mapData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const currTime = getTimeInSec();
      const updatedFleets: Fleet[] = fleets
        .filter((fleet) => currTime - fleet.startTime < fleet.fleetData.timeToReachInSec)
        .map((fleet) => {
          const { startPlanet } = fleet;
          const { targetPlanet } = fleet;
          const progress = (currTime - fleet.startTime) / fleet.fleetData.timeToReachInSec;
          const x = startPlanet.coords.x
            + ((targetPlanet.coords.x - startPlanet.coords.x) * progress);
          const y = startPlanet.coords.y
            + ((targetPlanet.coords.y - startPlanet.coords.y) * progress);
          return {
            ...fleet,
            position: { x, y },
          };
        });

      setFleets(updatedFleets);
    }, 16);

    return () => {
      clearTimeout(timer);
    };
  }, [mapData, fleets]);

  return (
    <canvas
      className="canvas"
      ref={canvasRef}
      height={mapData.h}
      width={mapData.w}
      onClick={handleClick}
    />
  );
}
