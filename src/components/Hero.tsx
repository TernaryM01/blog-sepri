import logoIcon from '../assets/logo-icon.svg'
import balloonSvg from '../assets/balloon.svg'
import charPicture from '../assets/char-picture.png'

export function Hero() {
  return (
    <div
      id="Hero"
      className="relative w-full flex flex-row items-center justify-between py-[36px] min-h-[697px] self-stretch"
    >
      {/* Hero Left */}
      <div
        id="Hero-Left"
        className="relative h-full flex flex-col items-center justify-start flex-1 self-stretch"
      >
        {/* Logo */}
        <div
          id="Logo"
          className="flex flex-row items-center gap-[25px]"
        >
          <img
            id="Logo-Icon"
            src={logoIcon}
            alt="Logo Icon"
            className="w-[105px] h-[105px] shrink-0"
          />
          <span
            id="Logo-Text"
            className="font-['Solway'] text-[40px] font-normal leading-[1.2] text-black text-center select-none"
          >
            Sepri’s Lab
          </span>
        </div>

        {/* Hero Char */}
        <div
          id="Hero-Char"
          className="relative w-[284px] h-[499px] shrink-0 self-stretch mx-auto mt-0"
        >
          {/* Char Picture */}
          <img
            id="Char-Picture"
            src={charPicture}
            alt="Char Picture"
            className="absolute left-[0.5px] top-0 w-[284px] h-[380px] object-cover pointer-events-none"
          />

          {/* Hero Balloon */}
          <div
            id="Hero-Balloon"
            className="absolute left-[16px] top-[321px] w-[252px] h-[178px]"
          >
            {/* Balloon */}
            <img
              id="Balloon"
              src={balloonSvg}
              alt="Balloon"
              className="absolute left-0 top-0 w-[252px] h-[178px] pointer-events-none"
            />
            {/* Hero Text */}
            <p
              id="Hero-Text"
              className="absolute left-[7px] top-[70px] w-[238px] h-[92px] m-0 font-['Solway'] text-[24px] font-normal leading-[1.2] text-black text-center select-none"
            >
              Hello! Let’s explore the wonders of the universe together!
            </p>
          </div>
        </div>
      </div>

      {/* Hero Right */}
      <div
        id="Hero-Right"
        className="relative w-[815px] flex flex-col items-end justify-start gap-[55px] shrink-0 self-stretch"
      >
        {/* Nav */}
        <nav
          id="Nav"
          className="relative flex flex-row items-center gap-[48px] pr-[64px] self-end"
        >
          <a
            id="Nav-Link-1"
            href="#blog"
            className="font-['Solway'] text-[20px] font-normal leading-[1.2] text-black h-[24px] no-underline select-none"
          >
            Blog
          </a>
          <a
            id="Nav-Link-2"
            href="#class"
            className="font-['Solway'] text-[20px] font-normal leading-[1.2] text-black h-[24px] no-underline select-none"
          >
            Class
          </a>
          <a
            id="Nav-Link-3"
            href="#my-journey"
            className="font-['Solway'] text-[20px] font-normal leading-[1.2] text-black h-[24px] no-underline select-none"
          >
            My Journey
          </a>
          <a
            id="Nav-Link-4"
            href="#contact-me"
            className="font-['Solway'] text-[20px] font-normal leading-[1.2] text-black h-[24px] no-underline select-none"
          >
            Contact Me
          </a>
        </nav>

        {/* Playground Wrapper */}
        <div
          id="Playground-Wrapper"
          className="relative w-[815px] min-h-[546px] rounded-l-[30px] overflow-hidden hazard-stripes-bg shrink-0 self-stretch"
        >
          {/* Playground */}
          <div
            id="Playground"
            className="absolute left-[25px] top-[20px] w-[766px] h-[506px] bg-[#00d9ff] shadow-[inset_6px_6px_0px_2px_rgba(0,0,0,0.25)] overflow-hidden"
          >
            {/* Object 1 (Newton's Cradle swinging orange ball) */}
            <div
              id="Object-1"
              className="absolute left-0 top-0 w-full h-full pointer-events-none"
            >
              {/* String 1 */}
              <svg
                id="String-1"
                className="absolute left-[178.07px] top-0 w-[65.93px] h-[180.32px]"
                viewBox="0 0 65.931 180.325"
                fill="none"
              >
                <line
                  x1="65.931"
                  y1="0"
                  x2="0"
                  y2="180.325"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
              </svg>
              {/* Circle 1 */}
              <div
                id="Circle-1"
                className="absolute left-[101.49px] top-[176.86px] w-[114px] h-[114px] rounded-full bg-[#fd7e1c] border border-black rotate-[20.08deg]"
              />
            </div>

            {/* Object 2 */}
            <div
              id="Object-2"
              className="absolute left-[301px] top-0 w-[114px] h-[306px]"
            >
              {/* String 2 */}
              <div
                id="String-2"
                className="absolute left-[57px] top-0 w-[2px] h-[192px] bg-white"
              />
              {/* Circle 2 */}
              <div
                id="Circle-2"
                className="absolute left-0 top-[192px] w-[114px] h-[114px] rounded-full bg-[#d82b78] border border-black"
              />
            </div>

            {/* Object 3 */}
            <div
              id="Object-3"
              className="absolute left-[415px] top-0 w-[114px] h-[306px]"
            >
              {/* String 3 */}
              <div
                id="String-3"
                className="absolute left-[57px] top-0 w-[2px] h-[192px] bg-white"
              />
              {/* Circle 3 */}
              <div
                id="Circle-3"
                className="absolute left-0 top-[192px] w-[114px] h-[114px] rounded-full bg-[#00ac14] border border-black"
              />
            </div>

            {/* Object 7 (Yellow block) */}
            <div
              id="Object-7"
              className="absolute left-[592px] top-[110px] w-[100px] h-[99px] bg-[#ffdb74] border border-black"
            />

            {/* Object 6 (Dark grey block) */}
            <div
              id="Object-6"
              className="absolute left-[623px] top-[209px] w-[100px] h-[99px] bg-[#2e2e2e] border border-black"
            />

            {/* Object 5 (Red block) */}
            <div
              id="Object-5"
              className="absolute left-[604px] top-[308px] w-[100px] h-[99px] bg-[#9f2222] border border-black"
            />

            {/* Object 4 (Light grey block) */}
            <div
              id="Object-4"
              className="absolute left-[632px] top-[407px] w-[100px] h-[99px] bg-[#d9d9d9] border border-black"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
