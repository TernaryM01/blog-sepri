import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)
  
  return (
    <div className="bg-brand">
      <h1 className="text-3xl font-bold underline text-red-600">
        Hello world!
      </h1>
      <button
        type="button"
        className="counter"
        onClick={() => setCount((count) => count + 1)}
      >
        Count is {count}
      </button>
    </div>
  )
}

export default App
