import Link from "next/link"

const Hero = ({ countryCode }: { countryCode: string }) => {
  return (
    <section className="content-container py-5 small:py-8">
      <div className="relative isolate min-h-[360px] overflow-hidden rounded-3xl bg-[#6610c9] px-6 py-10 text-white small:min-h-[480px] small:px-14 small:py-16">
        <div className="absolute inset-y-0 right-0 hidden w-[51%] overflow-hidden small:block" aria-hidden="true">
          <div className="absolute -right-20 -top-16 h-80 w-80 rotate-12 rounded-[4rem] bg-[#f6ff2f]" />
          <div className="absolute right-12 top-16 h-36 w-36 -rotate-12 rounded-full bg-[#ff6c76]" />
          <div className="absolute -bottom-16 left-8 h-72 w-72 rotate-12 rounded-[4rem] border-[22px] border-[#b7f2ff]" />
          <div className="absolute bottom-16 right-20 h-32 w-52 -rotate-6 rounded-[2rem] bg-[#161616]" />
          <div className="absolute right-36 top-44 text-8xl font-black text-white/90">+</div>
        </div>
        <div className="relative z-10 flex max-w-xl flex-col items-start">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#e9ff43]">New season, new finds</p>
          <h1 className="max-w-lg text-4xl font-semibold leading-[0.98] tracking-[-0.045em] small:text-6xl">
            Everyday things, anything but ordinary.
          </h1>
          <p className="mt-5 max-w-md text-base leading-6 text-white/80 small:text-lg">
            Browse unique pieces, everyday essentials, and fresh arrivals picked for you.
          </p>
          <Link href={`/${countryCode}/store`} className="mt-8 rounded-full bg-white px-6 py-3 text-sm font-bold text-grey-90 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#e9ff43]">
            Shop new arrivals
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Hero;
