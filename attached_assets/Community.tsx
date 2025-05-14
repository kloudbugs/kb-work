import { 
  FaTwitter, 
  FaDiscord, 
  FaTelegramPlane, 
  FaRedditAlien, 
  FaGithub, 
  FaYoutube 
} from 'react-icons/fa';

interface SocialLink {
  name: string;
  icon: JSX.Element;
  color: string;
  url: string;
}

export function Community() {
  const socialLinks: SocialLink[] = [
    {
      name: "Twitter",
      icon: <FaTwitter className="text-xl mr-3" />,
      color: "#1DA1F2",
      url: "#"
    },
    {
      name: "Discord",
      icon: <FaDiscord className="text-xl mr-3" />,
      color: "#7289DA",
      url: "#"
    },
    {
      name: "Telegram",
      icon: <FaTelegramPlane className="text-xl mr-3" />,
      color: "#0088cc",
      url: "#"
    },
    {
      name: "Reddit",
      icon: <FaRedditAlien className="text-xl mr-3" />,
      color: "#ff4500",
      url: "#"
    },
    {
      name: "GitHub",
      icon: <FaGithub className="text-xl mr-3" />,
      color: "#6e5494",
      url: "#"
    },
    {
      name: "YouTube",
      icon: <FaYoutube className="text-xl mr-3" />,
      color: "#FF0000",
      url: "#"
    }
  ];

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-8">
          <h2 className="font-heading font-bold text-2xl md:text-3xl mb-4 text-dark">
            Join Our <span className="text-primary">Community</span>
          </h2>
          <p className="text-lightgray">
            Connect with us on social media and be part of our growing community
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {socialLinks.map((link, index) => (
            <a 
              key={index}
              href={link.url} 
              className={`flex items-center bg-opacity-10 hover:bg-opacity-20 px-5 py-3 rounded-lg transition`}
              style={{ 
                backgroundColor: `${link.color}10`,
                color: link.color,
                ['&:hover' as any]: { backgroundColor: `${link.color}20` }
              }}
            >
              {link.icon}
              <span>{link.name}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
