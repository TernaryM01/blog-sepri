import { useEffect, useRef } from 'react'
import Matter from 'matter-js'

const {
  Engine,
  Runner,
  Bodies,
  Composite,
  Constraint,
  Mouse,
  MouseConstraint,
} = Matter

interface PlaygroundPhysicsProps {
  className?: string
}

export function PlaygroundPhysics({ className }: PlaygroundPhysicsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const WIDTH = 753
    const HEIGHT = 506

    // Create engine
    const engine = Engine.create({
      gravity: { x: 0, y: 1, scale: 0.001 },
    })
    const world = engine.world

    // High-DPI Canvas setup
    const dpr = window.devicePixelRatio || 1
    canvas.width = WIDTH * dpr
    canvas.height = HEIGHT * dpr
    canvas.style.width = `${WIDTH}px`
    canvas.style.height = `${HEIGHT}px`

    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.scale(dpr, dpr)
    }

    // 1. Boundary Walls
    const wallThickness = 60
    const walls = [
      // Top wall
      Bodies.rectangle(WIDTH / 2, -wallThickness / 2, WIDTH + 200, wallThickness, {
        isStatic: true,
        restitution: 0.8,
        friction: 0.1,
      }),
      // Bottom floor
      Bodies.rectangle(WIDTH / 2, HEIGHT + wallThickness / 2, WIDTH + 200, wallThickness, {
        isStatic: true,
        restitution: 0.8,
        friction: 0.3,
      }),
      // Left wall
      Bodies.rectangle(-wallThickness / 2, HEIGHT / 2, wallThickness, HEIGHT + 200, {
        isStatic: true,
        restitution: 0.8,
        friction: 0.1,
      }),
      // Right wall
      Bodies.rectangle(WIDTH + wallThickness / 2, HEIGHT / 2, wallThickness, HEIGHT + 200, {
        isStatic: true,
        restitution: 0.8,
        friction: 0.1,
      }),
    ]
    Composite.add(world, walls)

    // 2. Newton's Cradle Balls (3 Balls)
    const BALL_RADIUS = 57
    const STRING_LENGTH = 250

    // Pivot points
    const pivot1 = { x: 244, y: 0 }
    const pivot2 = { x: 358, y: 0 }
    const pivot3 = { x: 472, y: 0 }

    // Ball 1 (Orange, pulled back initially)
    const startAngle = -0.38
    const ball1InitX = pivot1.x + Math.sin(startAngle) * STRING_LENGTH
    const ball1InitY = pivot1.y + Math.cos(startAngle) * STRING_LENGTH

    const ball1 = Bodies.circle(ball1InitX, ball1InitY, BALL_RADIUS, {
      restitution: 0.98,
      friction: 0.001,
      frictionAir: 0.0008,
      density: 0.004,
      slop: 0.05,
      label: 'ball-orange',
    })

    const constraint1 = Constraint.create({
      pointA: pivot1,
      bodyB: ball1,
      length: STRING_LENGTH,
      stiffness: 1,
      damping: 0.0001,
    })

    // Ball 2 (Magenta, middle)
    const ball2 = Bodies.circle(pivot2.x, STRING_LENGTH, BALL_RADIUS, {
      restitution: 0.98,
      friction: 0.001,
      frictionAir: 0.0008,
      density: 0.004,
      slop: 0.05,
      label: 'ball-magenta',
    })

    const constraint2 = Constraint.create({
      pointA: pivot2,
      bodyB: ball2,
      length: STRING_LENGTH,
      stiffness: 1,
      damping: 0.0001,
    })

    // Ball 3 (Green, right)
    const ball3 = Bodies.circle(pivot3.x, STRING_LENGTH, BALL_RADIUS, {
      restitution: 0.98,
      friction: 0.001,
      frictionAir: 0.0008,
      density: 0.004,
      slop: 0.05,
      label: 'ball-green',
    })

    const constraint3 = Constraint.create({
      pointA: pivot3,
      bodyB: ball3,
      length: STRING_LENGTH,
      stiffness: 1,
      damping: 0.0001,
    })

    Composite.add(world, [
      ball1,
      constraint1,
      ball2,
      constraint2,
      ball3,
      constraint3,
    ])

    // 3. Blocks (4 boxes)
    const BOX_W = 100
    const BOX_H = 99

    const boxYellow = Bodies.rectangle(642, 160, BOX_W, BOX_H, {
      restitution: 0.45,
      friction: 0.2,
      frictionAir: 0.002,
      density: 0.002,
      label: 'box-yellow',
    })

    const boxDarkGrey = Bodies.rectangle(673, 259, BOX_W, BOX_H, {
      restitution: 0.45,
      friction: 0.2,
      frictionAir: 0.002,
      density: 0.002,
      label: 'box-darkgrey',
    })

    const boxRed = Bodies.rectangle(654, 358, BOX_W, BOX_H, {
      restitution: 0.45,
      friction: 0.2,
      frictionAir: 0.002,
      density: 0.002,
      label: 'box-red',
    })

    const boxLightGrey = Bodies.rectangle(682, 457, BOX_W, BOX_H, {
      restitution: 0.45,
      friction: 0.3,
      frictionAir: 0.002,
      density: 0.002,
      label: 'box-lightgrey',
    })

    Composite.add(world, [boxYellow, boxDarkGrey, boxRed, boxLightGrey])

    // 4. Mouse / Touch Dragging & Throwing
    const mouse = Mouse.create(canvas)
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.25,
        damping: 0.1,
        render: { visible: false },
      },
    })
    Composite.add(world, mouseConstraint)

    // Unbind wheel listener on mouse to prevent scroll hijack warnings
    if ((mouse as unknown as { mousewheel?: (e: WheelEvent) => void }).mousewheel) {
      canvas.removeEventListener('wheel', (mouse as unknown as { mousewheel: (e: WheelEvent) => void }).mousewheel)
    }

    // Custom 60fps rendering loop
    let animationFrameId: number
    const runner = Runner.create()
    Runner.run(runner, engine)

    const render = () => {
      if (!ctx) return

      ctx.clearRect(0, 0, WIDTH, HEIGHT)

      // 1. Draw Strings
      ctx.lineWidth = 2
      ctx.strokeStyle = '#FFFFFF'

      // String 1
      ctx.beginPath()
      ctx.moveTo(pivot1.x, pivot1.y)
      ctx.lineTo(ball1.position.x, ball1.position.y)
      ctx.stroke()

      // String 2
      ctx.beginPath()
      ctx.moveTo(pivot2.x, pivot2.y)
      ctx.lineTo(ball2.position.x, ball2.position.y)
      ctx.stroke()

      // String 3
      ctx.beginPath()
      ctx.moveTo(pivot3.x, pivot3.y)
      ctx.lineTo(ball3.position.x, ball3.position.y)
      ctx.stroke()

      // 2. Draw Balls
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

      // 3. Draw Blocks
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

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      Runner.stop(runner)
      Engine.clear(engine)
      Composite.clear(world, false)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full select-none touch-none ${className || ''}`}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-grab active:cursor-grabbing"
      />
    </div>
  )
}
