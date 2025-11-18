import * as React from "react";
import Link from "next/link";
import { Instagram, Twitter, Music, Linkedin } from "lucide-react";

export const Footer: React.FC = () => {
  const footerSections = [
    {
      title: "Discover",
      links: [
        { label: "Events", href: "/events" },
        { label: "Music", href: "/music" },
        { label: "Artists", href: "/music/artists" },
        { label: "Brands", href: "/brands" },
        { label: "Membership", href: "/membership" },
      ],
    },
    {
      title: "Experience",
      links: [
        { label: "Music", href: "/music" },
        { label: "Brands", href: "/brands" },
        { label: "Destinations", href: "/destinations" },
        { label: "Adventures", href: "/adventures" },
        { label: "My Tickets", href: "/tickets" },
      ],
    },
    {
      title: "Community",
      links: [
        { label: "Social Feed", href: "/feed" },
        { label: "Marketplace", href: "/marketplace" },
        { label: "Opportunities", href: "/opportunities" },
        { label: "Directory", href: "/community/directory" },
        { label: "Member Hub", href: "/community" },
      ],
    },
    {
      title: "Creators",
      links: [
        { label: "ATLVS", href: "/atlvs" },
        { label: "Platform", href: "/atlvs/platform" },
        { label: "Event Mgmt", href: "/atlvs/events" },
        { label: "Production", href: "/atlvs/production" },
        { label: "Resources", href: "/atlvs/resources" },
      ],
    },
    {
      title: "Collab",
      links: [
        { label: "COMPVSS", href: "/compvss" },
        { label: "Platform", href: "/compvss/platform" },
        { label: "Collaborate", href: "/compvss/collaborate" },
        { label: "Staff Hub", href: "/compvss/staff" },
        { label: "Partner Network", href: "/compvss/partners" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Careers", href: "/careers" },
        { label: "Press", href: "/press" },
        { label: "Blog", href: "/blog" },
        { label: "Contact", href: "/contact" },
      ],
    },
  ];

  const legalLinks = [
    { label: "Terms", href: "/legal/terms" },
    { label: "Privacy", href: "/legal/privacy" },
    { label: "Cookies", href: "/legal/cookies" },
    { label: "Accessibility", href: "/legal/accessibility" },
  ];

  const socialLinks = [
    { icon: <Instagram className="w-5 h-5" />, href: "https://instagram.com/gvteway", label: "Instagram" },
    { icon: <Twitter className="w-5 h-5" />, href: "https://twitter.com/gvteway", label: "Twitter" },
    { icon: <Music className="w-5 h-5" />, href: "https://open.spotify.com/user/gvteway", label: "Spotify" },
    { icon: <Linkedin className="w-5 h-5" />, href: "https://linkedin.com/company/gvteway", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-ghxst-black text-ghxst-white">
      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* Brand */}
        <div className="mb-12">
          <h2 className="font-anton text-h1 mb-2">GVTEWAY</h2>
          <p className="font-share-tech-mono text-gray-400">
            Discover Live Experiences
          </p>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-bebas text-h5 mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-share-tech text-body-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Legal */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              {legalLinks.map((link, idx) => (
                <React.Fragment key={link.href}>
                  <Link
                    href={link.href}
                    className="font-share-tech text-body-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                  {idx < legalLinks.length - 1 && (
                    <span className="text-gray-600">•</span>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Copyright */}
            <p className="font-share-tech-mono text-body-sm text-gray-500">
              © 2025 GHXSTSHIP INDUSTRIES
            </p>

            {/* Social */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

Footer.displayName = "Footer";
