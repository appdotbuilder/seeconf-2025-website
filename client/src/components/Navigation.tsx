interface NavigationProps {
  activeSection: string;
}

export function Navigation({ activeSection }: NavigationProps) {
  const navItems = [
    { id: 'about', label: '关于大会', href: '#about' },
    { id: 'speakers', label: '嘉宾阵容', href: '#speakers' },
    { id: 'agenda', label: '大会议程', href: '#agenda' },
    { id: 'tech-zone', label: '技术展区', href: '#tech-zone' },
    { id: 'registration', label: '报名参会', href: '#registration' }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            className="text-2xl font-bold font-orbitron text-cyan-400 glow-text cursor-pointer hover-particles"
            onClick={() => scrollToSection('hero')}
          >
            SEE CONF 2025
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`font-rajdhani text-lg transition-all duration-300 nav-glow ${
                  activeSection === item.id ? 'active' : ''
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-cyan-400 hover:text-cyan-300 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}