import { useEffect, useRef } from 'react'
import Matter from 'matter-js'

const {
  Engine,
  Bodies,
  Body,
  Composite,
  Constraint,
} = Matter

/**
 * LENIS-STYLE DAMPING / LERP FACTOR:
 * - Formula: current += (target - current) * DAMPING_FACTOR
 * - Moves at the FASTEST rate immediately when target changes, then smoothly decelerates as it approaches the end.
 * - NEVER overshoots.
 * - Tunable range:
 *     0.06 = very smooth / floaty
 *     0.12 = balanced & organic (Recommended)
 *     0.25 = snappy & quick
 */
export const DEFAULT_DAMPING = 0.9

interface PlaygroundPhysicsProps {
  targetRef: React.RefObject<HTMLDivElement | null>
  containerRef?: React.RefObject<HTMLElement | null>
  damping?: number
}

export function PlaygroundPhysics({
  targetRef,
  containerRef,
  damping = DEFAULT_DAMPING,
}: PlaygroundPhysicsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const BOX_WIDTH = 753
    const BOX_HEIGHT = 506
    const WALL_THICKNESS = 1000

    // 1. Setup Matter.js Engine with optimized collision resolution
    const engine = Engine.create({
      gravity: { x: 0, y: 1, scale: 0.01 },
      positionIterations: 20,
      velocityIterations: 20,
    })
    const world = engine.world

    // Canvas sizing (full viewport)
    let screenWidth = window.innerWidth
    let screenHeight = window.innerHeight

    const updateCanvasSize = () => {
      screenWidth = window.innerWidth
      screenHeight = window.innerHeight
      const dpr = window.devicePixelRatio || 1
      canvas.width = screenWidth * dpr
      canvas.height = screenHeight * dpr
      canvas.style.width = `${screenWidth}px`
      canvas.style.height = `${screenHeight}px`
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.scale(dpr, dpr)
      }
    }
    updateCanvasSize()

    window.addEventListener('resize', updateCanvasSize)

    // Initial position based on target element
    let currentWallX = screenWidth / 2 - BOX_WIDTH / 2
    let currentWallY = screenHeight / 2 - BOX_HEIGHT / 2

    if (targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect()
      currentWallX = rect.left
      currentWallY = rect.top
    }

    // 2. 400px Solid Boundary Walls with Corner Overlaps
    // Floor and walls have low restitution (0.05) and natural friction so objects settle calmly without jitter
    const wallTop = Bodies.rectangle(
      currentWallX + BOX_WIDTH / 2,
      currentWallY - WALL_THICKNESS / 2,
      BOX_WIDTH,
      WALL_THICKNESS,
      {
        isStatic: true,
        restitution: 0.1,
        friction: 5,
      }
    )

    const wallBottom = Bodies.rectangle(
      currentWallX + BOX_WIDTH / 2,
      currentWallY + BOX_HEIGHT + WALL_THICKNESS / 2,
      BOX_WIDTH,
      WALL_THICKNESS,
      {
        isStatic: true,
        restitution: 0.1,
        friction: 5,
      }
    )

    const wallLeft = Bodies.rectangle(
      currentWallX - WALL_THICKNESS / 2,
      currentWallY + BOX_HEIGHT / 2,
      WALL_THICKNESS,
      BOX_HEIGHT + 2 * WALL_THICKNESS,
      {
        isStatic: true,
        restitution: 0.5,
        friction: 5,
      }
    )

    const wallRight = Bodies.rectangle(
      currentWallX + BOX_WIDTH + WALL_THICKNESS / 2,
      currentWallY + BOX_HEIGHT / 2,
      WALL_THICKNESS,
      BOX_HEIGHT + 2 * WALL_THICKNESS,
      {
        isStatic: true,
        restitution: 0.5,
        friction: 5,
      }
    )

    Composite.add(world, [wallTop, wallBottom, wallLeft, wallRight])

    // 3. Newton's Cradle Balls
    const BALL_RADIUS = 57
    const STRING_LENGTH = 250

    const pivotRel1 = { x: 244, y: 0 }
    const pivotRel2 = { x: 358, y: 0 }
    const pivotRel3 = { x: 472, y: 0 }

    // Ball 1 (Orange, pulled back initially)
    const startAngle = -0.38
    const ball1 = Bodies.circle(
      currentWallX + pivotRel1.x + Math.sin(startAngle) * STRING_LENGTH,
      currentWallY + pivotRel1.y + Math.cos(startAngle) * STRING_LENGTH,
      BALL_RADIUS,
      {
        restitution: 0.5,
        friction: 0.001,
        frictionAir: 0.0008,
        density: 0.005,
        slop: 0.05,
      }
    )

    const constraint1 = Constraint.create({
      pointA: { x: currentWallX + pivotRel1.x, y: currentWallY + pivotRel1.y },
      bodyB: ball1,
      length: STRING_LENGTH,
      stiffness: 0.01,
      damping: 0.001,
    })

    // Ball 2 (Magenta, middle)
    const ball2 = Bodies.circle(
      currentWallX + pivotRel2.x,
      currentWallY + STRING_LENGTH,
      BALL_RADIUS,
      {
        restitution: 0.5,
        friction: 0.001,
        frictionAir: 0.0008,
        density: 0.005,
        slop: 0.05,
      }
    )

    const constraint2 = Constraint.create({
      pointA: { x: currentWallX + pivotRel2.x, y: currentWallY + pivotRel2.y },
      bodyB: ball2,
      length: STRING_LENGTH,
      stiffness: 0.01,
      damping: 0.001,
    })

    // Ball 3 (Green, right)
    const ball3 = Bodies.circle(
      currentWallX + pivotRel3.x,
      currentWallY + STRING_LENGTH,
      BALL_RADIUS,
      {
        restitution: 0.5,
        friction: 0.001,
        frictionAir: 0.0008,
        density: 0.005,
        slop: 0.05,
      }
    )

    const constraint3 = Constraint.create({
      pointA: { x: currentWallX + pivotRel3.x, y: currentWallY + pivotRel3.y },
      bodyB: ball3,
      length: STRING_LENGTH,
      stiffness: 0.01,
      damping: 0.001,
    })

    Composite.add(world, [
      ball1,
      constraint1,
      ball2,
      constraint2,
      ball3,
      constraint3,
    ])

    // 4. Stackable Blocks (4 boxes)
    const BOX_W = 100
    const BOX_H = 99

    const boxYellow = Bodies.rectangle(
      currentWallX + 642,
      currentWallY + 160,
      BOX_W,
      BOX_H,
      {
        restitution: 0.1,
        friction: 5,
        frictionAir: 0.002,
        density: 0.03,
      }
    )

    const boxDarkGrey = Bodies.rectangle(
      currentWallX + 673,
      currentWallY + 259,
      BOX_W,
      BOX_H,
      {
        restitution: 0.1,
        friction: 5,
        frictionAir: 0.002,
        density: 0.03,
      }
    )

    const boxRed = Bodies.rectangle(
      currentWallX + 654,
      currentWallY + 358,
      BOX_W,
      BOX_H,
      {
        restitution: 0.1,
        friction: 5,
        frictionAir: 0.002,
        density: 0.03,
      }
    )

    const boxLightGrey = Bodies.rectangle(
      currentWallX + 682,
      currentWallY + 457,
      BOX_W,
      BOX_H,
      {
        restitution: 0.1,
        friction: 5,
        frictionAir: 0.002,
        density: 0.03,
      }
    )

    Composite.add(world, [boxYellow, boxDarkGrey, boxRed, boxLightGrey])

    // 5. Synchronous Physics & Smooth Damped Wall Follower Loop
    let animationFrameId: number

    const stepSimulation = () => {
      const ctx = canvas.getContext('2d')

      // 1. Measure target position from DOM reference
      let targetX = currentWallX
      let targetY = currentWallY

      if (targetRef.current) {
        const rect = targetRef.current.getBoundingClientRect()
        targetX = rect.left
        targetY = rect.top
      }

      // 2. Lenis Exponential Decay Easing (LERP)
      // Velocity is maximum at the start and smoothly decays to 0. Strictly monotonic with ZERO overshoot!
      const diffX = targetX - currentWallX
      const diffY = targetY - currentWallY

      const stepX = Math.abs(diffX) < 0.1 ? diffX : diffX * damping
      const stepY = Math.abs(diffY) < 0.1 ? diffY : diffY * damping

      currentWallX += stepX
      currentWallY += stepY

      const wallVx = stepX
      const wallVy = stepY

      // 3. Update Matter.js static boundary positions and kinematic velocities
      Body.setPosition(wallTop, {
        x: currentWallX + BOX_WIDTH / 2,
        y: currentWallY - WALL_THICKNESS / 2,
      })
      Body.setVelocity(wallTop, { x: wallVx, y: wallVy })

      Body.setPosition(wallBottom, {
        x: currentWallX + BOX_WIDTH / 2,
        y: currentWallY + BOX_HEIGHT + WALL_THICKNESS / 2,
      })
      Body.setVelocity(wallBottom, { x: wallVx, y: wallVy })

      Body.setPosition(wallLeft, {
        x: currentWallX - WALL_THICKNESS / 2,
        y: currentWallY + BOX_HEIGHT / 2,
      })
      Body.setVelocity(wallLeft, { x: wallVx, y: wallVy })

      Body.setPosition(wallRight, {
        x: currentWallX + BOX_WIDTH + WALL_THICKNESS / 2,
        y: currentWallY + BOX_HEIGHT / 2,
      })
      Body.setVelocity(wallRight, { x: wallVx, y: wallVy })

      // 4. Update string anchor pivots
      const p1x = currentWallX + pivotRel1.x
      const p1y = currentWallY + pivotRel1.y
      constraint1.pointA = { x: p1x, y: p1y }

      const p2x = currentWallX + pivotRel2.x
      const p2y = currentWallY + pivotRel2.y
      constraint2.pointA = { x: p2x, y: p2y }

      const p3x = currentWallX + pivotRel3.x
      const p3y = currentWallY + pivotRel3.y
      constraint3.pointA = { x: p3x, y: p3y }

      // 5. Advance Matter.js physics engine synchronously
      Engine.update(engine, 1000 / 60)

      // 6. Render onto fixed viewport canvas
      if (ctx) {
        ctx.clearRect(0, 0, screenWidth, screenHeight)

        ctx.save()

        // Clip rendering to the Body container bounds (matches Body overflow-x-clip)
        const containerEl =
          containerRef?.current ||
          targetRef.current?.closest('#Body') ||
          document.getElementById('Body')
        if (containerEl) {
          const containerRect = containerEl.getBoundingClientRect()
          ctx.beginPath()
          ctx.rect(containerRect.left, 0, containerRect.width, screenHeight)
          ctx.clip()
        }

        // Clip rendering to the playground container bounds
        ctx.beginPath()
        ctx.rect(currentWallX, currentWallY, BOX_WIDTH, BOX_HEIGHT)
        ctx.clip()

        // Draw Cyan Background & Inset Shadow
        ctx.fillStyle = '#00d9ff'
        ctx.fillRect(currentWallX, currentWallY, BOX_WIDTH, BOX_HEIGHT)

        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)'
        ctx.fillRect(currentWallX, currentWallY, 8, BOX_HEIGHT)
        ctx.fillRect(currentWallX, currentWallY, BOX_WIDTH, 8)

        // Draw Strings
        ctx.lineWidth = 2
        ctx.strokeStyle = '#FFFFFF'

        ctx.beginPath()
        ctx.moveTo(p1x, p1y)
        ctx.lineTo(ball1.position.x, ball1.position.y)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(p2x, p2y)
        ctx.lineTo(ball2.position.x, ball2.position.y)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(p3x, p3y)
        ctx.lineTo(ball3.position.x, ball3.position.y)
        ctx.stroke()

        // Draw Balls
        const drawBall = (body: Matter.Body, color: string) => {
          ctx.save()
          ctx.translate(body.position.x, body.position.y)
          ctx.rotate(body.angle)

          ctx.beginPath()
          ctx.arc(0, 0, BALL_RADIUS, 0, Math.PI * 2)
          ctx.fillStyle = color
          ctx.fill()
          ctx.lineWidth = 1.5
          ctx.strokeStyle = '#000000'
          ctx.stroke()

          ctx.restore()
        }

        drawBall(ball1, '#fd7e1c')
        drawBall(ball2, '#d82b78')
        drawBall(ball3, '#00ac14')

        // Draw Blocks
        const drawBox = (body: Matter.Body, color: string) => {
          ctx.save()
          ctx.translate(body.position.x, body.position.y)
          ctx.rotate(body.angle)

          ctx.beginPath()
          ctx.rect(-BOX_W / 2, -BOX_H / 2, BOX_W, BOX_H)
          ctx.fillStyle = color
          ctx.fill()
          ctx.lineWidth = 1.5
          ctx.strokeStyle = '#000000'
          ctx.stroke()

          ctx.restore()
        }

        drawBox(boxLightGrey, '#d9d9d9')
        drawBox(boxRed, '#9f2222')
        drawBox(boxDarkGrey, '#2e2e2e')
        drawBox(boxYellow, '#ffdb74')

        ctx.restore()
      }

      animationFrameId = requestAnimationFrame(stepSimulation)
    }

    stepSimulation()

    return () => {
      window.removeEventListener('resize', updateCanvasSize)
      cancelAnimationFrame(animationFrameId)
      Engine.clear(engine)
      Composite.clear(world, false)
    }
  }, [targetRef, containerRef, damping])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30 w-full h-full"
    />
  )
}
