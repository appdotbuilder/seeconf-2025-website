import { useState } from 'react';

export function Footer() {
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);

  const socialLinks = [
    { 
      name: 'Twitter', 
      icon: '🐦', 
      url: 'https://twitter.com/seeconf', 
      handle: '@seeconf' 
    },
    { 
      name: 'GitHub', 
      icon: '🐙', 
      url: 'https://github.com/seeconf', 
      handle: '@seeconf' 
    },
    { 
      name: 'LinkedIn', 
      icon: '💼', 
      url: 'https://linkedin.com/company/seeconf', 
      handle: 'See Conf' 
    },
    { 
      name: 'WeChat', 
      icon: '💬', 
      url: '#', 
      handle: 'seeconf2025' 
    }
  ];

  const quickLinks = [
    { label: '关于大会', href: '#about' },
    { label: '嘉宾阵容', href: '#speakers' },
    { label: '大会议程', href: '#agenda' },
    { label: '技术展区', href: '#tech-zone' },
    { label: '报名参会', href: '#registration' }
  ];

  return (
    <footer className="relative py-16 bg-black/50 backdrop-blur-sm border-t border-white/10">
      {/* Extremely faint starry particle effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-10 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="mb-6">
              <h3 className="text-3xl font-bold font-orbitron bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
                SEE CONF 2025
              </h3>
              <p className="text-lg font-rajdhani text-gray-300 mb-4">
                预见未来前端
              </p>
              <p className="font-rajdhani text-gray-400 leading-relaxed max-w-md">
                汇聚全球顶尖前端专家，共同探讨技术趋势与用户体验创新。让每一位开发者在这里预见未来，收获成长。
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-cyan-400">📧</span>
                <a 
                  href="mailto:contact@seeconf.org"
                  className="font-rajdhani text-gray-300 hover:text-cyan-400 transition-colors duration-300"
                >
                  contact@seeconf.org
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-purple-400">📅</span>
                <span className="font-rajdhani text-gray-300">
                  2025年11月22日
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-400">📍</span>
                <span className="font-rajdhani text-gray-300">
                  中国 • 上海
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold font-orbitron text-white mb-6">
              快速导航
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="font-rajdhani text-gray-400 hover:text-cyan-400 transition-colors duration-300 hover:glow-text"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(link.href.substring(1))?.scrollIntoView({ 
                        behavior: 'smooth' 
                      });
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-xl font-bold font-orbitron text-white mb-6">
              关注我们
            </h4>
            <div className="space-y-4">
              {socialLinks.map((social) => (
                <div
                  key={social.name}
                  className="relative"
                  onMouseEnter={() => setHoveredSocial(social.name)}
                  onMouseLeave={() => setHoveredSocial(null)}
                >
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 font-rajdhani text-gray-400 hover:text-cyan-400 transition-all duration-300 hover-particles p-2 rounded-lg hover:bg-white/5"
                  >
                    <span className="text-2xl">{social.icon}</span>
                    <span>{social.name}</span>
                  </a>
                  
                  {/* Platform handle tooltip */}
                  {hoveredSocial === social.name && (
                    <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-3 z-20 fade-in">
                      <div className="bg-black/90 backdrop-blur-sm border border-cyan-400/30 rounded-lg px-3 py-2 whitespace-nowrap">
                        <span className="text-sm font-rajdhani text-cyan-400">
                          {social.handle}
                        </span>
                        {/* Arrow */}
                        <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-2 h-2 bg-black/90 border-l border-b border-cyan-400/30 rotate-45"></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-rajdhani text-gray-400 text-sm">
            © 2025 See Conf 技术大会. All rights reserved.
          </div>
          
          <div className="flex items-center gap-6 font-rajdhani text-gray-400 text-sm">
            <a href="#" className="hover:text-cyan-400 transition-colors duration-300">
              隐私政策
            </a>
            <a href="#" className="hover:text-cyan-400 transition-colors duration-300">
              使用条款
            </a>
            <a href="#" className="hover:text-cyan-400 transition-colors duration-300">
              联系我们
            </a>
          </div>
        </div>

        {/* Powered by */}
        <div className="text-center mt-8 pt-8 border-t border-white/5">
          <p className="font-rajdhani text-gray-500 text-xs">
            Powered by <span className="text-cyan-400">React</span> • 
            <span className="text-purple-400"> TypeScript</span> • 
            <span className="text-green-400"> tRPC</span> • 
            <span className="text-orange-400"> Tailwind CSS</span>
          </p>
        </div>
      </div>

      {/* Bottom glow effect */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-64 h-32 bg-gradient-to-t from-cyan-500/5 to-transparent filter blur-3xl pointer-events-none"></div>
    </footer>
  );
}