import Link from 'next/link';
import { Wrench, Mail, Phone, MapPin } from 'lucide-react';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';

const quickLinks = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'About', href: '/about' },
];

const categories = ['Plumbing', 'Electrical', 'Home Cleaning', 'AC Repair'];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Logo & Tagline */}
          <div>
            <Link href="/" className="mb-4 inline-flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                <Wrench size={21} />
              </span>

              <span className="text-2xl font-bold tracking-tight">
                Fix<span className="text-blue-600">Mate</span>
              </span>
            </Link>

            <p className="max-w-xs text-sm leading-6 text-muted-foreground">
              Your trusted partner for reliable home services. Making everyday
              repairs simple and stress-free.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-semibold">Quick Links</h3>

            <ul className="space-y-3 text-sm text-muted-foreground">
              {quickLinks.map(link => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-blue-600"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h3 className="mb-4 font-semibold">Popular Categories</h3>

            <ul className="space-y-3 text-sm text-muted-foreground">
              {categories.map(category => (
                <li key={category}>
                  <Link
                    href="/services"
                    className="transition-colors hover:text-blue-600"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="mb-4 font-semibold">Contact Us</h3>

            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-3">
                <Mail size={17} className="shrink-0 text-blue-600" />
                <span>support@fixmate.com</span>
              </li>

              <li className="flex items-center gap-3">
                <Phone size={17} className="shrink-0 text-blue-600" />
                <span>+880 1XXX-XXXXXX</span>
              </li>

              <li className="flex items-center gap-3">
                <MapPin size={17} className="shrink-0 text-blue-600" />
                <span>Bangladesh</span>
              </li>
            </ul>

            {/* Social Links */}
            <div className="mt-5 flex items-center gap-3">
              <Link
                href="#"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition-colors hover:bg-blue-600 hover:text-white"
              >
                <FaFacebookF size={17} />
              </Link>

              <Link
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition-colors hover:bg-blue-600 hover:text-white"
              >
                <FaInstagram size={17} />
              </Link>

              {/* X Logo */}
              <Link
                href="#"
                aria-label="X"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition-colors hover:bg-blue-600 hover:text-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 fill-current"
                  aria-hidden="true"
                >
                  <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.1l-4.8-6.3L6.8 22H3.6l7.3-8.4L2.8 2h6.3l4.4 5.9L18.9 2Zm-1.1 18h1.7L8.1 3.9H6.3L17.8 20Z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-border pt-6">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} FixMate. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
