import React from 'react'
import { Graph } from 'perfect-graph'
import { Position } from 'colay/type'
import * as PIXI from 'pixi.js'
import  Vector from 'victor'
import  { Container } from '@inlet/react-pixi'
import Color from 'color'

export type MouseArrowProps = { 
  user: {id: string;};
  color: number;
  position: Position;
  label: string;
}

const SPEED = 5

export const MouseArrow: React.FC<MouseArrowProps> = ({ user, position, label }) => {
  const localDataRef = React.useRef({
    targetPosition: position,
  })
  const containerRef = React.useRef()
  const color = React.useMemo(() => {
    var randomColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
    console.log('a', randomColor, Color(randomColor).rgbNumber())
    return Color(randomColor).rgbNumber()
  },  [user.id])
  const draw = React.useCallback(g => {
    // g.clear()
    // g.beginFill(color)
    // g.lineStyle(4, color, 1)
    // g.moveTo(50, 50)
    // g.endFill()
    drawArrowHead({
      graphics: g,
      fill: color,
      to: {x: 0, y: 0},
      unitVector: { x: -2, y: -2 },
    })
  }, [color])
  React.useMemo(() => {
    localDataRef.current.targetPosition = position
  }, [position])
  React.useEffect(() => {
    containerRef.current.x = position.x
    containerRef.current.y = position.y
    const tickerFunc = () => {
      const container = containerRef.current
      if (!container) {
        return
      }
      const targetPosition = Vector.fromObject(localDataRef.current.targetPosition)
      const currentPosition = Vector.fromObject(container)
      const distance = targetPosition.clone().subtract(currentPosition)
      const distanceLength = distance.length()
      if (distanceLength < SPEED) {
        container.x = targetPosition.x
        container.y = targetPosition.y
      } else {
        const unitVector = distance.clone().normalize()
        const newPosition = currentPosition.clone().add(unitVector.clone().multiplyScalar(SPEED))
        container.x = newPosition.x
        container.y = newPosition.y
      }
    }
    PIXI.Ticker.shared.add(tickerFunc)
    return () => {
      PIXI.Ticker.shared.remove(tickerFunc)
    }
  }, [])
  
  return (
    <Container
      ref={containerRef}
      x={0}
      y={0}
    >
      <Graph.Graphics draw={draw}/>
      <Graph.Text text={label} />
    </Container>
  )
}

const drawArrowHead = ({
  graphics,
  to,
  radius = 10,
  unitVector,
  fill,
}: {
  graphics: PIXI.Graphics;
  unitVector: Position;
  to: Position;
  radius?: number;
  fill: number;
}) => {
  const bottomCenter = Vector.fromObject(to)
  const unitDistanceVec = Vector.fromObject(unitVector).multiplyScalar(radius)
  const perpendicularUnitDistanceVec = unitDistanceVec.clone().rotate(-Math.PI / 2)
  const leftControlPoint = perpendicularUnitDistanceVec
    .clone()
    .multiplyScalar(-1)
    .add(bottomCenter)
  const rightControlPoint = perpendicularUnitDistanceVec.clone().add(bottomCenter)
  const topControlPoint = bottomCenter.clone().add(unitDistanceVec)
  graphics.beginFill(fill)
  graphics.drawPolygon(
    new PIXI.Point(leftControlPoint.x, leftControlPoint.y),
    new PIXI.Point(rightControlPoint.x, rightControlPoint.y),
    new PIXI.Point(topControlPoint.x, topControlPoint.y),
  )
  // TODO: Dont remove the endFill
  graphics.endFill()
  // TODO: Check the performance effect of this later
  // graphics.isSprite = true
}
