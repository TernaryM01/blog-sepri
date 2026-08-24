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
      className={`w-[371px] bg-[#ffdb74] shadow-[6px_6px_0px_2px_rgba(0,0,0,0.25)] flex flex-col-reverse items-start justify-start gap-[24px] pt-[42px] px-[32px] pb-[36px] cursor-pointer transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-[10px_12px_0px_2px_rgba(0,0,0,0.28)] hover:scale-[1.015] active:translate-y-0 active:scale-[0.98] active:shadow-[4px_4px_0px_2px_rgba(0,0,0,0.25)] group select-none ${rotationClass}`}
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
          onClick={(e) => e.preventDefault()}
          className="w-full font-['Solitreo'] text-[20px] font-normal leading-[1.2] text-[#3f2007] text-right no-underline select-none transition-all duration-200 group-hover:text-[#8a3500] flex items-center justify-end gap-1"
        >
          <span>Read more</span>
          <span className="inline-block transition-transform duration-200 group-hover:translate-x-1.5">&gt;</span>
        </a>

        {/* Body Snippet */}
        <p
          id="Body-Snippet"
          className="w-full m-0 font-['Solway'] text-[16px] font-normal leading-[1.2] text-black text-center select-none transition-opacity duration-200 group-hover:opacity-90"
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
        className="w-full m-0 font-['Solway'] text-[32px] font-bold leading-[1.2] text-[#3f2007] text-center select-none transition-colors duration-300 group-hover:text-[#8a3500]"
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
        className="relative z-10 flex flex-col-reverse items-center justify-start self-stretch mt-0 animate-sign-sway group cursor-pointer"
      >
        {/* Blog Header Board */}
        <div
          id="Blog-Header-Board"
          className="relative w-[239px] h-[75px] bg-white border-[4px] border-[#3f2007] shadow-[6px_6px_0px_2px_rgba(0,0,0,0.25)] flex items-center justify-center shrink-0 -mt-[6px] transition-all duration-300 group-hover:scale-105 group-active:scale-95 group-hover:shadow-[8px_8px_0px_2px_rgba(0,0,0,0.3)] px-[16px]"
        >
          {/* Blog Text */}
          <h2
            id="Blog-Title"
            className="m-0 font-['Solway'] text-[48px] font-bold leading-[1.2] text-[#3f2007] text-center select-none transition-colors duration-300 group-hover:text-[#8a3500]"
          >
            Blog
          </h2>
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
          rotationClass="-rotate-[2deg] hover:rotate-0 active:rotate-0"
        />
        <BlogCard
          id="Blog-Card-2"
          title="Suhu dan Semen"
          rotationClass="rotate-[2deg] hover:rotate-0 active:rotate-0"
        />
        <BlogCard
          id="Blog-Card-3"
          title="Keajaiban Petir"
          rotationClass="-rotate-[2deg] hover:rotate-0 active:rotate-0"
        />
      </div>
    </section>
  )
}
