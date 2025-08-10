import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Mail,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from 'lucide-react';

/**
 * @returns {JSX.Element}
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = {
    platform: [
      { name: 'About Us', path: '/about' },
      { name: 'Our Projects', path: '/blog' },
      { name: 'Members', path: '/members' },
      { name: 'Share Achievement', path: '/media-upload' },
    ],
    resources: [
      { name: 'Club Activities', path: '#' },
      { name: 'Success Stories', path: '/blog?category=Success Stories' },
      { name: 'Skills Portfolio', path: '/blog?category=Portfolio' },
      { name: 'Join Club', path: '#' },
    ],
    legal: [
      { name: 'Terms of Service', path: '#' },
      { name: 'Privacy Policy', path: '#' },
      { name: 'Cookie Policy', path: '#' },
      { name: 'Disclaimer', path: '#' },
    ],
  };

  const socialLinks = [
    { icon: <Facebook size={20} />, href: 'https://facebook.com/ajiradigital' },
    { icon: <Twitter size={20} />, href: 'https://twitter.com/ajiradigital' },
    {
      icon: <Instagram size={20} />,
      href: 'https://instagram.com/ajiradigital',
    },
    { icon: <Youtube size={20} />, href: 'https://youtube.com/ajiradigital' },
  ];

  return (
    <footer className='bg-ajira-primary text-ajira-light'>
      <div className='container-custom py-12'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {/* Brand and Description */}
          <div>
            <Link to='/' className='flex items-center space-x-4 mb-4'>
              <img
                src='/logo.jpeg'
                alt='Club Logo'
                className='h-12 w-auto rounded-lg'
              />
              <div>
                <h3 className='text-xl font-bold'>Ajira Digital</h3>
                <p className='text-sm text-white/80'>KiNaP Club</p>
              </div>
            </Link>
            <p className='text-sm text-white/80 mb-6'>
              Empowering youth through digital skills and online work
              opportunities at Kiambu National Polytechnic.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className='text-lg font-semibold mb-4'>Quick Links</h4>
            <ul className='space-y-2'>
              <li>
                <Link
                  to='/marketplace'
                  className='text-sm text-white/80 hover:text-white'
                >
                  Marketplace
                </Link>
              </li>
              <li>
                <Link
                  to='/videos'
                  className='text-sm text-white/80 hover:text-white'
                >
                  Video Tutorials
                </Link>
              </li>
              <li>
                <Link
                  to='/stories'
                  className='text-sm text-white/80 hover:text-white'
                >
                  Success Stories
                </Link>
              </li>
              <li>
                <a
                  href='https://ajiradigital.go.ke'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-sm text-white/80 hover:text-white'
                >
                  Official Portal
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className='text-lg font-semibold mb-4'>Contact Us</h4>
            <ul className='space-y-4'>
              <li className='flex items-start space-x-3'>
                <MapPin className='w-5 h-5 text-ajira-accent mt-1' />
                <p className='text-sm text-white/80'>
                  Kiambu National Polytechnic
                  <br />
                  P.O. Box 414-00900
                  <br />
                  Kiambu, Kenya
                </p>
              </li>
              <li className='flex items-center space-x-3'>
                <Mail className='w-5 h-5 text-ajira-accent' />
                <a
                  href='mailto:kinapajira@gmail.com'
                  className='text-sm text-white/80 hover:text-white'
                >
                  kinapajira@gmail.com
                </a>
              </li>
              <li className='flex items-center space-x-3'>
                <Phone className='w-5 h-5 text-ajira-accent' />
                <a
                  href='tel:+254792343958'
                  className='text-sm text-white/80 hover:text-white'
                >
                  +254 792 343 958
                </a>
              </li>
            </ul>
          </div>

          {/* Location Map */}
          <div>
            <h4 className='text-lg font-semibold mb-4'>Find Us</h4>
            <div className='rounded-lg overflow-hidden h-48'>
              <iframe
                title='KiNaP Location'
                src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.0176604666584!2d36.8206!3d-1.1722!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwMTAnMTkuMiJTIDM2wrA0OSczNC4yIkU!5e0!3m2!1sen!2ske!4v1620000000000!5m2!1sen!2ske'
                width='100%'
                height='100%'
                style={{ border: 0 }}
                allowFullScreen=''
                loading='lazy'
                referrerPolicy='no-referrer-when-downgrade'
              />
            </div>
          </div>
        </div>

        {/* Social Links and Copyright */}
        <div className='mt-12 pt-8 border-t border-white/10'>
          <div className='flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0'>
            <div className='flex items-center space-x-6'>
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-white/80 hover:text-white'
                >
                  {link.icon}
                </a>
              ))}
            </div>
            <p className='text-sm text-white/80'>
              © {currentYear} Ajira Digital KiNaP Club. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
