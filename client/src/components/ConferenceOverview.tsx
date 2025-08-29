import { useState } from 'react';

export function ConferenceOverview() {
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);

  const tags = [
    {
      id: 'depth',
      tag: '#技术深度',
      description: '深入探讨前端技术的核心原理与最新发展，从底层实现到架构设计',
      color: 'from-cyan-400 to-blue-500'
    },
    {
      id: 'innovation',
      tag: '#体验创新',
      description: '探索用户体验设计的创新思路，结合技术实现打造极致体验',
      color: 'from-purple-400 to-pink-500'
    },
    {
      id: 'global',
      tag: '#国际视野',
      description: '汇聚全球顶尖技术专家，分享国际前沿技术趋势与最佳实践',
      color: 'from-green-400 to-emerald-500'
    }
  ];

  return (
    <section id="about" className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center fade-in">
          {/* Section Title */}
          <h2 className="text-5xl font-bold font-orbitron bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-8">
            探索前端未来边界
          </h2>

          {/* Description */}
          <div className="text-xl font-rajdhani text-gray-300 leading-relaxed mb-12 fade-in" style={{ animationDelay: '0.2s' }}>
            <p className="mb-6">
              See Conf 2025 汇聚全球顶尖前端专家，共同探讨技术趋势与用户体验创新。
            </p>
            <p>
              三天深度交流，助力每一位开发者预见未来。
            </p>
          </div>

          {/* Interactive Tags */}
          <div className="flex flex-wrap justify-center gap-6 mb-16 fade-in" style={{ animationDelay: '0.4s' }}>
            {tags.map((item) => (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => setHoveredTag(item.id)}
                onMouseLeave={() => setHoveredTag(null)}
              >
                <div className={`
                  px-6 py-3 rounded-full cursor-pointer transition-all duration-300 transform hover:scale-110
                  bg-gradient-to-r ${item.color} text-white font-bold font-rajdhani text-lg
                  hover-particles glow-border
                `}>
                  {item.tag}
                </div>
                
                {/* Tooltip */}
                {hoveredTag === item.id && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 z-20 fade-in">
                    <div className="bg-black/90 backdrop-blur-sm border border-cyan-400/30 rounded-lg p-4 max-w-xs">
                      <div className="text-sm text-gray-300 font-rajdhani">
                        {item.description}
                      </div>
                      {/* Arrow */}
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-black/90 border-l border-t border-cyan-400/30 rotate-45"></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Conference Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="text-center card-3d hover-particles glow-border rounded-lg p-6 bg-black/30 backdrop-blur-sm">
              <div className="text-4xl font-bold font-orbitron text-cyan-400 glow-text mb-2">50+</div>
              <div className="text-lg font-rajdhani text-gray-300">技术专家</div>
            </div>
            <div className="text-center card-3d hover-particles glow-border rounded-lg p-6 bg-black/30 backdrop-blur-sm">
              <div className="text-4xl font-bold font-orbitron text-purple-400 glow-text mb-2">1000+</div>
              <div className="text-lg font-rajdhani text-gray-300">参会开发者</div>
            </div>
            <div className="text-center card-3d hover-particles glow-border rounded-lg p-6 bg-black/30 backdrop-blur-sm">
              <div className="text-4xl font-bold font-orbitron text-green-400 glow-text mb-2">72小时</div>
              <div className="text-lg font-rajdhani text-gray-300">深度交流</div>
            </div>
          </div>
        </div>
      </div>

      {/* Data stream effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="data-stream absolute top-1/4 left-0 w-full h-0.5 opacity-30"></div>
        <div className="data-stream absolute top-2/4 left-0 w-full h-0.5 opacity-30" style={{ animationDelay: '1s' }}></div>
        <div className="data-stream absolute top-3/4 left-0 w-full h-0.5 opacity-30" style={{ animationDelay: '2s' }}></div>
      </div>
    </section>
  );
}