// components/Hero.js
import Image from 'next/image'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="title">
          Get your <span className="highlight">ecom</span> brand ranked by
        </h1>

        <div className="hero-logo">
          {/* bump logo up to 48×48 (feel free to tweak to 56×56 if you want it even bigger) */}
          <Image
            src="/chatgpt-logo.svg"
            alt="ChatGPT"
            width={80}
            height={80}
          />
          <span className="logo-text">ChatGPT</span>
        </div>

        <p className="hero-sub">
          Reach millions of buyers who are using AI to buy
        </p>

        <Link href="/demo" className="btn">
          Get a Demo
        </Link>

      </div>
    </section>
  )
}
