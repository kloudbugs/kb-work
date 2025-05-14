import { Card, CardContent } from '@/components/ui/card';
import { FaTwitter, FaLinkedinIn, FaGithub, FaInstagram, FaDiscord, FaTelegramPlane } from 'react-icons/fa';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  socials: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    instagram?: string;
    discord?: string;
    telegram?: string;
  };
}

export function Team() {
  const team: TeamMember[] = [
    {
      name: "John Crypto",
      role: "Founder & CEO",
      bio: "Former Binance executive with 8+ years in cryptocurrency development.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      socials: {
        twitter: "#",
        linkedin: "#",
        github: "#"
      }
    },
    {
      name: "Sarah Blockchain",
      role: "CTO",
      bio: "Solidity expert with experience developing at Ethereum Foundation.",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      socials: {
        twitter: "#",
        linkedin: "#",
        github: "#"
      }
    },
    {
      name: "Mike Token",
      role: "Marketing Director",
      bio: "Growth hacker who led campaigns for several top 20 cryptocurrencies.",
      image: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      socials: {
        twitter: "#",
        linkedin: "#",
        instagram: "#"
      }
    },
    {
      name: "Emma Meme",
      role: "Community Manager",
      bio: "Social media expert who built communities for DeFi projects worldwide.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      socials: {
        twitter: "#",
        discord: "#",
        telegram: "#"
      }
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-lightbg" id="team">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4 text-dark">
            Our <span className="text-primary">Team</span>
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-lightgray max-w-2xl mx-auto">
            Meet the passionate people behind MoonMeme's success
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {team.map((member, index) => (
            <Card 
              key={index} 
              className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="h-48 overflow-hidden">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
              </div>
              <CardContent className="p-5">
                <h3 className="font-heading font-semibold text-lg text-dark">{member.name}</h3>
                <p className="text-primary text-sm mb-3">{member.role}</p>
                <p className="text-lightgray text-sm mb-4">{member.bio}</p>
                <div className="flex space-x-3">
                  {member.socials.twitter && (
                    <a href={member.socials.twitter} className="text-lightgray hover:text-primary transition">
                      <FaTwitter />
                    </a>
                  )}
                  {member.socials.linkedin && (
                    <a href={member.socials.linkedin} className="text-lightgray hover:text-primary transition">
                      <FaLinkedinIn />
                    </a>
                  )}
                  {member.socials.github && (
                    <a href={member.socials.github} className="text-lightgray hover:text-primary transition">
                      <FaGithub />
                    </a>
                  )}
                  {member.socials.instagram && (
                    <a href={member.socials.instagram} className="text-lightgray hover:text-primary transition">
                      <FaInstagram />
                    </a>
                  )}
                  {member.socials.discord && (
                    <a href={member.socials.discord} className="text-lightgray hover:text-primary transition">
                      <FaDiscord />
                    </a>
                  )}
                  {member.socials.telegram && (
                    <a href={member.socials.telegram} className="text-lightgray hover:text-primary transition">
                      <FaTelegramPlane />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
