import * as React from "react";
import Link from "next/link";
import { Instagram, Twitter, Music, Linkedin } from "lucide-react";
import { BodyText, SectionHeader } from "@/components/atoms/Typography";

export const Footer: React.FC = () => {
  const footerSections = [
    {
      title: "Discover",
      links: [
        { label: "Events", href: "/gvteway/events" },
        { label: "Music", href: "/gvteway/music" },
        { label: "Artists", href: "/gvteway/music" },
        { label: "Brands", href: "/gvteway/brands" },
        { label: "Membership", href: "/gvteway/memberships" },
      ],
    },
    {
      title: "Experience",
      links: [
        { label: "Music", href: "/gvteway/music" },
        { label: "Brands", href: "/gvteway/brands" },
        { label: "Destinations", href: "/gvteway/destinations" },
        { label: "Adventures", href: "/gvteway/adventures" },
        { label: "My Tickets", href: "/gvteway/tickets" },
      ],
    },
    {
      title: "Community",
      links: [
        { label: "Social Feed", href: "/gvteway/feed" },
        { label: "Marketplace", href: "/gvteway/marketplace" },
        { label: "Opportunities", href: "/gvteway/opportunities" },
        { label: "Directory", href: "/gvteway/social" },
        { label: "Member Hub", href: "/gvteway/social" },
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
          <SectionHeader className="text-display mb-2 tracking-tight">GVTEWAY</SectionHeader>
          <BodyText className="-tech text-body text-grey-400">
            Discover Live Experiences
          </BodyText>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 tracking-wide">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="-tech text-body-sm text-grey-400 hover:text-ghxst-accent transition-colors"
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
        <div className="pt-8 border-t border-grey-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Legal */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              {legalLinks.map((link, idx) => (
                <React.Fragment key={link.href}>
                  <Link
                    href={link.href}
                    className="-tech text-body-sm text-grey-400 hover:text-ghxst-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                  {idx < legalLinks.length - 1 && (
                    <span className="text-grey-600">•</span>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Copyright */}
            <BodyText className="-tech-mono text-body-sm text-grey-500">
              © 2025 GHXSTSHIP INDUSTRIES
            </BodyText>

            {/* Social */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-grey-400 hover:text-ghxst-accent transition-colors"
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
