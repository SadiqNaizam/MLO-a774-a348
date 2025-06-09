import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Home, ShoppingBag, Info } from 'lucide-react'; // Example icons

interface FooterLink {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface FooterProps {
  companyName?: string;
  socialLinks?: { platform: string; href: string; icon: React.ReactNode }[];
  linkSections?: { title: string; links: FooterLink[] }[];
}

const defaultSocialLinks = [
  { platform: 'Twitter', href: '#', icon: <Twitter className="h-5 w-5" /> },
  { platform: 'LinkedIn', href: '#', icon: <Linkedin className="h-5 w-5" /> },
  { platform: 'GitHub', href: '#', icon: <Github className="h-5 w-5" /> },
];

const defaultLinkSections = [
  {
    title: 'Quick Links',
    links: [
      { label: 'Home', href: '/', icon: <Home className="h-4 w-4 mr-1" /> },
      { label: 'All Restaurants', href: '/restaurants', icon: <ShoppingBag className="h-4 w-4 mr-1" /> },
      { label: 'About Us', href: '/about', icon: <Info className="h-4 w-4 mr-1" /> },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Contact Us', href: '/contact' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
];


const Footer: React.FC<FooterProps> = ({
  companyName = "FoodApp Inc.",
  socialLinks = defaultSocialLinks,
  linkSections = defaultLinkSections,
}) => {
  console.log("Rendering Footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-12">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info / Logo */}
          <div className="mb-6 md:mb-0">
            <Link to="/" className="text-2xl font-bold text-orange-500 hover:text-orange-600">
              {companyName.split(' ')[0]} {/* Assuming first word is main logo */}
            </Link>
            <p className="mt-2 text-sm text-gray-600">
              Your favorite food, delivered fast.
            </p>
            <div className="mt-4 flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.platform}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                  aria-label={`Visit our ${social.platform} page`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link Sections */}
          {linkSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-gray-600 hover:text-orange-500 transition-colors flex items-center"
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-8 text-center">
          <p className="text-xs text-gray-500">
            &copy; {currentYear} {companyName}. All rights reserved.
          </p>
          {/* Optional: Add links to privacy policy, terms, etc. here */}
        </div>
      </div>
    </footer>
  );
};
export default Footer;