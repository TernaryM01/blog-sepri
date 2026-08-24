import { Hero } from './components/Hero'
import { Blog } from './components/Blog'

function App() {
  return (
    <div
      id="Desktop"
      className="min-h-screen w-full bg-[#8f8f8f] flex flex-row justify-center items-stretch overflow-x-hidden"
    >
      <div
        id="Body"
        className="w-full max-w-[1280px] min-h-screen bg-[#cbefe6] outline-[4px] outline-black/25 flex flex-col items-center justify-start relative flex-1 self-stretch overflow-x-clip"
      >
        <Hero />
        <Blog />
      </div>
    </div>
  )
}

export default App
