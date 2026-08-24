import arrowIcon from '../assets/arrow-icon.svg'

interface BlogCardProps {
  id: string
  title: string
  rotationClass: string
  style?: React.CSSProperties
}

function BlogCard({ id, title, rotationClass, style }: BlogCardProps) {
  return (
    <div
      id={id}
      className={`w-[371px] bg-[#ffdb74] shadow-[6px_6px_0px_2px_rgba(0,0,0,0.25)] flex flex-col-reverse items-start justify-start gap-[24px] pt-[42px] px-[32px] pb-[36px] ${rotationClass}`}
      style={style}
    >
      {/* Content */}
      <div
        id="Content"
        className="w-full flex flex-col-reverse items-start justify-start gap-[20px]"
      >
        {/* Read more > */}
        <a
          id="Read-more"
          href="#"
          className="w-full font-['Solitreo'] text-[20px] font-normal leading-[1.2] text-[#3f2007] text-right no-underline hover:underline select-none"
        >
          Read more &gt;
        </a>

        {/* Body Snippet */}
        <p
          id="Body-Snippet"
          className="w-full m-0 font-['Solway'] text-[16px] font-normal leading-[1.2] text-black text-center select-none"
        >
          Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          Lorem Ipsum has been the industry's standard dummy text ever since the
          1500s, when an unknown printer took a galley of type and scrambled it to
          make a type specimen . . .
        </p>
      </div>

      {/* Title */}
      <h3
        id="Title"
        className="w-full m-0 font-['Solway'] text-[32px] font-bold leading-[1.2] text-[#3f2007] text-center select-none"
      >
        {title}
      </h3>
    </div>
  )
}

export function Blog() {
  return (
    <section
      id="Blog"
      className="relative w-full flex-1 bg-[#fd7e1c] rounded-t-[42px] shadow-[inset_2px_6px_0px_4px_rgba(0,0,0,0.25)] flex flex-col items-center justify-start gap-[28px] self-stretch pt-0 pb-[48px] overflow-hidden"
    >
      {/* Background Pattern of Circles (Brick Layout) */}
      <svg
        id="Blog-Background-Pattern"
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://w3.org"
      >
        <defs>
          <pattern
            id="brick-circle-pattern"
            x="0"
            y="0"
            width="46.29"
            height="69.44"
            patternUnits="userSpaceOnUse"
          >
            {/* Corners / Grid points for odd rows */}
            <circle cx="0" cy="0" r="9.37" fill="none" stroke="#000000" strokeWidth="6" strokeOpacity="0.1" />
            <circle cx="46.29" cy="0" r="9.37" fill="none" stroke="#000000" strokeWidth="6" strokeOpacity="0.1" />
            <circle cx="0" cy="69.44" r="9.37" fill="none" stroke="#000000" strokeWidth="6" strokeOpacity="0.1" />
            <circle cx="46.29" cy="69.44" r="9.37" fill="none" stroke="#000000" strokeWidth="6" strokeOpacity="0.1" />
            {/* Shifted halfway for even rows (brick pattern) */}
            <circle cx="23.145" cy="34.72" r="9.37" fill="none" stroke="#000000" strokeWidth="6" strokeOpacity="0.1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#brick-circle-pattern)" />
      </svg>

      {/* Blog Header */}
      <div
        id="Blog-Header"
        className="relative z-10 flex flex-col-reverse items-center justify-start self-stretch mt-0"
      >
        {/* Blog Header Board */}
        <div
          id="Blog-Header-Board"
          className="relative w-[239px] h-[75px] bg-white border-[4px] border-[#3f2007] shadow-[6px_6px_0px_2px_rgba(0,0,0,0.25)] rotate-[4deg] flex items-center justify-center shrink-0 -mt-[6px]"
        >
          {/* Frame 12 */}
          <div
            id="Frame-12"
            className="flex flex-row-reverse items-center justify-center gap-[32px] w-full h-full px-[16px]"
          >
            {/* Vector */}
            <img
              id="Vector"
              src={arrowIcon}
              alt="Arrow Icon"
              className="w-[48.82px] h-[43.46px] shrink-0 pointer-events-none"
            />
            {/* Blog Text */}
            <h2
              id="Blog-Title"
              className="m-0 font-['Solway'] text-[48px] font-bold leading-[1.2] text-[#3f2007] text-center select-none"
            >
              Blog
            </h2>
          </div>
        </div>

        {/* Blog Header String */}
        <div
          id="Blog-Header-String"
          className="w-[2px] h-[49px] bg-white shrink-0"
        />
      </div>

      {/* Blog Cards */}
      <div
        id="Blog-Cards"
        className="relative z-10 w-full flex flex-row items-start justify-center gap-[24px] px-[20px] flex-wrap"
      >
        <BlogCard
          id="Blog-Card-1"
          title="Dialog Pagi “Belajar Peduli”"
          rotationClass="-rotate-[2deg]"
        />
        <BlogCard
          id="Blog-Card-2"
          title="Suhu dan Semen"
          rotationClass="rotate-[2deg]"
        />
        <BlogCard
          id="Blog-Card-3"
          title="Keajaiban Petir"
          rotationClass="-rotate-[2deg]"
        />
      </div>
    </section>
  )
}
