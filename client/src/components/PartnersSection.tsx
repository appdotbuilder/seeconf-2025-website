import { useState } from 'react';
import type { Partner } from '../../../server/src/schema';

interface PartnersSectionProps {
  partners: Partner[];
}

export function PartnersSection({ partners }: PartnersSectionProps) {
  const [hoveredPartner, setHoveredPartner] = useState<number | null>(null);

  const getTierLabel = (tier: string) => {
    switch (tier) {
      case 'title': return '冠名赞助';
      case 'platinum': return '白金赞助';
      case 'gold': return '黄金赞助';
      case 'silver': return '白银赞助';
      case 'community': return '社区支持';
      default: return tier;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'title': return 'from-yellow-400 to-orange-500';
      case 'platinum': return 'from-gray-300 to-gray-100';
      case 'gold': return 'from-yellow-400 to-yellow-600';
      case 'silver': return 'from-gray-400 to-gray-300';
      case 'community': return 'from-green-400 to-emerald-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  // Group partners by tier
  const groupedPartners = partners.reduce((acc, partner) => {
    if (!acc[partner.tier]) {
      acc[partner.tier] = [];
    }
    acc[partner.tier].push(partner);
    return acc;
  }, {} as Record<string, Partner[]>);

  const tierOrder = ['title', 'platinum', 'gold', 'silver', 'community'];

  return (
    <section id="partners" className="py-20 relative">
      <div className="container mx-auto px-6">
        {/* Section Title */}
        <div className="text-center mb-16 fade-in">
          <h2 className="text-5xl font-bold font-orbitron bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-4">
            合作伙伴
          </h2>
          <p className="text-xl font-rajdhani text-gray-300">
            感谢以下企业对See Conf 2025的大力支持
          </p>
        </div>

        {/* Partners by Tier */}
        {tierOrder.map(tier => {
          const tiersPartners = groupedPartners[tier];
          if (!tiersPartners || tiersPartners.length === 0) return null;

          return (
            <div key={tier} className="mb-16 fade-in">
              {/* Tier Title */}
              <div className="text-center mb-8">
                <div className={`inline-block px-6 py-2 rounded-full bg-gradient-to-r ${getTierColor(tier)} text-black font-bold font-rajdhani text-lg`}>
                  {getTierLabel(tier)}
                </div>
              </div>

              {/* Partners Grid */}
              <div className={`
                grid gap-8 justify-items-center
                ${tier === 'title' ? 'grid-cols-1 md:grid-cols-2' : ''}
                ${tier === 'platinum' ? 'grid-cols-2 md:grid-cols-3' : ''}
                ${['gold', 'silver', 'community'].includes(tier) ? 'grid-cols-3 md:grid-cols-4 lg:grid-cols-6' : ''}
              `}>
                {tiersPartners.map((partner, index) => (
                  <div
                    key={partner.id}
                    className={`
                      group card-3d hover-particles cursor-pointer transition-all duration-300
                      ${tier === 'title' ? 'w-64 h-32' : ''}
                      ${tier === 'platinum' ? 'w-48 h-24' : ''}
                      ${['gold', 'silver', 'community'].includes(tier) ? 'w-32 h-16' : ''}
                    `}
                    onMouseEnter={() => setHoveredPartner(partner.id)}
                    onMouseLeave={() => setHoveredPartner(null)}
                    onClick={() => partner.website_url && window.open(partner.website_url, '_blank')}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Partner Logo Container */}
                    <div className="relative w-full h-full bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 group-hover:border-cyan-400/50 flex items-center justify-center overflow-hidden">
                      {/* Logo */}
                      <img
                        src={partner.logo_url}
                        alt={partner.name}
                        className="max-w-full max-h-full object-contain p-4 transition-all duration-300 group-hover:scale-110 filter grayscale group-hover:grayscale-0"
                        style={{
                          filter: hoveredPartner === partner.id ? 'none' : 'grayscale(1)',
                        }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://via.placeholder.com/200x100/333/fff?text=${encodeURIComponent(partner.name)}`;
                        }}
                      />

                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/10 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Partner name on hover */}
                      {hoveredPartner === partner.id && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-2 text-center fade-in">
                          <p className="text-sm font-rajdhani text-white font-medium">
                            {partner.name}
                          </p>
                          {partner.description && (
                            <p className="text-xs font-rajdhani text-gray-300 mt-1">
                              {partner.description}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Empty state */}
        {partners.length === 0 && (
          <div className="text-center py-16 fade-in">
            <div className="text-6xl mb-4">🤝</div>
            <p className="text-xl font-rajdhani text-gray-400 mb-8">
              更多合作伙伴即将公布，敬请期待...
            </p>
            <div className="text-gray-500 font-rajdhani">
              <p>如果您希望成为See Conf 2025的合作伙伴</p>
              <p>请联系我们：<span className="text-cyan-400">sponsor@seeconf.org</span></p>
            </div>
          </div>
        )}

        {/* Partnership Call to Action */}
        {partners.length > 0 && (
          <div className="text-center mt-16 fade-in">
            <div className="max-w-2xl mx-auto bg-gradient-to-r from-purple-900/30 to-cyan-900/30 rounded-lg p-8 border border-white/10">
              <h3 className="text-2xl font-bold font-orbitron text-white mb-4">
                成为合作伙伴
              </h3>
              <p className="font-rajdhani text-gray-300 mb-6">
                与See Conf 2025携手，向全球前端开发者展示您的品牌影响力
              </p>
              <a
                href="mailto:sponsor@seeconf.org"
                className="inline-block px-8 py-3 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full text-white font-bold font-rajdhani hover:scale-105 transform transition-all duration-300"
              >
                联系合作
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Background starlight flow effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent animate-pulse"></div>
        <div className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-30"></div>
        <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-purple-400 rounded-full animate-ping opacity-30" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-30" style={{ animationDelay: '1s' }}></div>
      </div>
    </section>
  );
}