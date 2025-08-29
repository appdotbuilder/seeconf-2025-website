
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import type { Speaker } from '../../../server/src/schema';

interface SpeakersSectionProps {
  speakers: Speaker[];
}

export function SpeakersSection({ speakers }: SpeakersSectionProps) {

  return (
    <section id="speakers" className="py-20 relative">
      <div className="container mx-auto px-6">
        {/* Section Title */}
        <div className="text-center mb-16 fade-in">
          <h2 className="text-5xl font-bold font-orbitron bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-4">
            星光嘉宾
          </h2>
          <p className="text-xl font-rajdhani text-gray-300">
            与全球顶尖前端专家面对面交流
          </p>
        </div>

        {/* Speakers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {speakers.map((speaker, index) => (
            <Dialog key={speaker.id}>
              <DialogTrigger asChild>
                <Card 
                  className="card-3d hover-particles glow-border bg-black/40 backdrop-blur-sm border-purple-500/30 cursor-pointer group transition-all duration-300 hover:scale-105 fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6 text-center">
                    {/* Avatar with 3D light sphere effect */}
                    <div className="relative mb-6 mx-auto w-32 h-32">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-500 animate-spin opacity-75 blur-md group-hover:opacity-100 transition-opacity duration-300"></div>
                      <img
                        src={speaker.avatar_url}
                        alt={speaker.name}
                        className="relative w-full h-full rounded-full object-cover border-4 border-white/20 group-hover:border-cyan-400/50 transition-all duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face';
                        }}
                      />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-transparent to-white/10 group-hover:to-cyan-400/20 transition-all duration-300"></div>
                    </div>

                    {/* Speaker Info */}
                    <h3 className="text-2xl font-bold font-orbitron text-white mb-2 group-hover:text-cyan-400 transition-colors duration-300">
                      {speaker.name}
                    </h3>
                    <p className="text-lg font-rajdhani text-purple-300 mb-1">
                      {speaker.position}
                    </p>
                    <p className="text-base font-rajdhani text-gray-400 mb-4">
                      {speaker.company}
                    </p>
                    
                    {/* Speech Topic Preview */}
                    <div className="bg-gradient-to-r from-purple-900/50 to-cyan-900/50 rounded-lg p-3 group-hover:from-purple-800/50 group-hover:to-cyan-800/50 transition-all duration-300">
                      <p className="text-sm font-rajdhani text-gray-300 group-hover:text-white transition-colors duration-300">
                        {speaker.speech_topic}
                      </p>
                    </div>

                    {/* Expand indicator */}
                    <div className="mt-4 text-cyan-400 text-sm font-rajdhani opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      点击查看详情 →
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>

              <DialogContent className="bg-black/90 backdrop-blur-md border-cyan-400/30 text-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-3xl font-orbitron text-cyan-400">
                    {speaker.name}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <img
                        src={speaker.avatar_url}
                        alt={speaker.name}
                        className="w-32 h-32 rounded-full object-cover border-4 border-cyan-400/50"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face';
                        }}
                      />
                    </div>
                    <div className="flex-grow">
                      <p className="text-xl font-rajdhani text-purple-300 mb-2">
                        {speaker.position}
                      </p>
                      <p className="text-lg font-rajdhani text-gray-400 mb-4">
                        {speaker.company}
                      </p>
                      <div className="bg-gradient-to-r from-purple-900/50 to-cyan-900/50 rounded-lg p-4">
                        <h4 className="font-bold font-rajdhani text-cyan-400 mb-2">演讲主题：</h4>
                        <p className="font-rajdhani text-white">
                          {speaker.speech_topic}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-bold font-rajdhani text-cyan-400 mb-2">个人简介：</h4>
                    <p className="font-rajdhani text-gray-300 leading-relaxed">
                      {speaker.bio}
                    </p>
                  </div>

                  {/* Social Links */}
                  {speaker.social_links && (
                    <div>
                      <h4 className="font-bold font-rajdhani text-cyan-400 mb-2">社交媒体：</h4>
                      <div className="flex gap-4">
                        {JSON.parse(speaker.social_links) && 
                          Object.entries(JSON.parse(speaker.social_links)).map(([platform, handle]) => (
                            <div key={platform} className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1">
                              <span className="text-sm font-rajdhani text-cyan-400">{platform}:</span>
                              <span className="text-sm font-rajdhani text-white">{handle as string}</span>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>

        {/* Empty state message */}
        {speakers.length === 0 && (
          <div className="text-center py-16 fade-in">
            <div className="text-6xl mb-4">🌟</div>
            <p className="text-xl font-rajdhani text-gray-400">
              星光嘉宾即将公布，敬请期待...
            </p>
          </div>
        )}
      </div>

      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
    </section>
  );
}