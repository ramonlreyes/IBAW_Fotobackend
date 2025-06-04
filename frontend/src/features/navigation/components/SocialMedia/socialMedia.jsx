import { Instagram, Facebook, Share2 } from 'lucide-react';

const SOCIAL_MEDIA_LINKS = [
  { 
    name: 'Instagram', 
    icon: Instagram,
    url: '#',
    ariaLabel: 'Follow on Instagram',
    external: true
  },
  { 
    name: 'Facebook', 
    icon: Facebook,
    url: '#',
    ariaLabel: 'Follow on Facebook',
    external: true
  },
  { 
    name: 'Share', 
    icon: Share2,
    url: '#',
    ariaLabel: 'Share page',
    external: false
  }
];

export const SocialMedia = ({ isMobile = false }) => {
  const containerClasses = isMobile 
    ? 'flex justify-center space-x-6 mb-4' 
    : 'flex space-x-4 mt-8';

  return (
    <div className={containerClasses}>
      {SOCIAL_MEDIA_LINKS.map((social) => {
        const IconComponent = social.icon;
        return (
          <a 
            key={social.name}
            href={social.url} 
            target={social.external ? '_blank' : undefined}
            rel={social.external ? 'noopener noreferrer' : undefined}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={social.ariaLabel}
          >
            <IconComponent size={20} />
          </a>
        );
      })}
    </div>
  );
};

export default SocialMedia;