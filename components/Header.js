// components/Header.js
import Link from "next/link";

export default function Header() {
  return (
    <header className="header">
      <div className="container">
        <Link href="/" className="logo">
          ecom.ai
        </Link>
        <nav className="nav">
          <Link href="/features">Features</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </div>
    </header>
  );
}
