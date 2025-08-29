
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import type { Agenda, Speaker } from '../../../server/src/schema';

interface AgendaSectionProps {
  agenda: Agenda[];
  speakers: Speaker[];
}

export function AgendaSection({ agenda, speakers }: AgendaSectionProps) {

  const getAgendaTypeLabel = (type: string) => {
    switch (type) {
      case 'main_forum': return '技术主论坛';
      case 'design_forum': return '体验设计分论坛';
      case 'engineering_forum': return '工程实践专题';
      case 'workshop': return '动手实践工作坊';
      default: return type;
    }
  };

  const getAgendaTypeColor = (type: string) => {
    switch (type) {
      case 'main_forum': return 'from-cyan-400 to-blue-500';
      case 'design_forum': return 'from-purple-400 to-pink-500';
      case 'engineering_forum': return 'from-green-400 to-emerald-500';
      case 'workshop': return 'from-orange-400 to-red-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getSpeakerById = (speakerId: number | null) => {
    if (!speakerId) return null;
    return speakers.find(speaker => speaker.id === speakerId);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <section id="agenda" className="py-20 relative">
      <div className="container mx-auto px-6">
        {/* Section Title */}
        <div className="text-center mb-16 fade-in">
          <h2 className="text-5xl font-bold font-orbitron bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-4">
            前沿议程
          </h2>
          <p className="text-xl font-rajdhani text-gray-300">
            精心策划的技术盛宴，每个环节都是知识的碰撞
          </p>
        </div>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Timeline line */}
          <div className="absolute left-8 md:left-1/2 transform md:-translate-x-0.5 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 via-purple-500 to-green-400 opacity-50"></div>

          {/* Agenda Items */}
          <div className="space-y-12">
            {agenda.map((item, index) => {
              const speaker = getSpeakerById(item.speaker_id);
              const isLeft = index % 2 === 0;
              
              return (
                <Dialog key={item.id}>
                  <DialogTrigger asChild>
                    <div 
                      className={`relative fade-in cursor-pointer ${isLeft ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left'} pl-16 md:pl-8`}
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      {/* Timeline node */}
                      <div className={`absolute timeline-node w-6 h-6 rounded-full left-5 md:left-1/2 transform md:-translate-x-3 top-8 z-10 hover:scale-125 transition-all duration-300`}>
                        <div className={`w-full h-full rounded-full bg-gradient-to-r ${getAgendaTypeColor(item.type)} pulse-glow`}></div>
                      </div>

                      {/* Content card */}
                      <Card className={`
                        timeline-node bg-black/40 backdrop-blur-sm border-white/20 hover:border-cyan-400/50 
                        transition-all duration-300 hover:scale-105 group
                        ${isLeft ? 'md:mr-8' : 'md:ml-8'}
                      `}>
                        <CardContent className="p-6">
                          {/* Time and Type */}
                          <div className="flex flex-wrap items-center gap-3 mb-4">
                            <Badge className={`bg-gradient-to-r ${getAgendaTypeColor(item.type)} text-white border-none`}>
                              {getAgendaTypeLabel(item.type)}
                            </Badge>
                            <span className="text-sm font-rajdhani text-cyan-400">
                              {formatTime(item.start_time)} - {formatTime(item.end_time)}
                            </span>
                            <span className="text-sm font-rajdhani text-gray-400">
                              📍 {item.location}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="text-xl font-bold font-orbitron text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300">
                            {item.title}
                          </h3>

                          {/* Speaker */}
                          {speaker && (
                            <div className="flex items-center gap-3 mb-3">
                              <img
                                src={speaker.avatar_url}
                                alt={speaker.name}
                                className="w-8 h-8 rounded-full object-cover border border-cyan-400/50"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face';
                                }}
                              />
                              <span className="text-sm font-rajdhani text-purple-300">
                                {speaker.name} • {speaker.company}
                              </span>
                            </div>
                          )}

                          {/* Description */}
                          <p className="text-gray-300 font-rajdhani group-hover:text-white transition-colors duration-300">
                            {item.description}
                          </p>

                          {/* Expand indicator */}
                          <div className="mt-4 text-cyan-400 text-sm font-rajdhani opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            点击查看详情 →
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </DialogTrigger>

                  <DialogContent className="bg-black/90 backdrop-blur-md border-cyan-400/30 text-white max-w-3xl">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-orbitron text-cyan-400">
                        {item.title}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                      {/* Event details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white/5 rounded-lg p-4">
                          <h4 className="font-bold font-rajdhani text-purple-400 mb-2">时间</h4>
                          <p className="font-rajdhani text-white">
                            {formatTime(item.start_time)} - {formatTime(item.end_time)}
                          </p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4">
                          <h4 className="font-bold font-rajdhani text-green-400 mb-2">地点</h4>
                          <p className="font-rajdhani text-white">{item.location}</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4">
                          <h4 className="font-bold font-rajdhani text-orange-400 mb-2">类型</h4>
                          <p className="font-rajdhani text-white">{getAgendaTypeLabel(item.type)}</p>
                        </div>
                      </div>

                      {/* Speaker info */}
                      {speaker && (
                        <div className="bg-gradient-to-r from-purple-900/50 to-cyan-900/50 rounded-lg p-6">
                          <h4 className="font-bold font-rajdhani text-cyan-400 mb-4">演讲嘉宾</h4>
                          <div className="flex items-center gap-4">
                            <img
                              src={speaker.avatar_url}
                              alt={speaker.name}
                              className="w-16 h-16 rounded-full object-cover border-2 border-cyan-400/50"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face';
                              }}
                            />
                            <div>
                              <h5 className="text-xl font-bold font-orbitron text-white">{speaker.name}</h5>
                              <p className="text-purple-300 font-rajdhani">{speaker.position}</p>
                              <p className="text-gray-400 font-rajdhani">{speaker.company}</p>
                            </div>
                          </div>
                          <p className="mt-4 text-gray-300 font-rajdhani">{speaker.bio}</p>
                        </div>
                      )}

                      {/* Description */}
                      <div>
                        <h4 className="font-bold font-rajdhani text-cyan-400 mb-2">议程详情</h4>
                        <p className="font-rajdhani text-gray-300 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              );
            })}
          </div>
        </div>

        {/* Empty state */}
        {agenda.length === 0 && (
          <div className="text-center py-16 fade-in">
            <div className="text-6xl mb-4">🚀</div>
            <p className="text-xl font-rajdhani text-gray-400">
              精彩议程即将发布，敬请期待...
            </p>
          </div>
        )}
      </div>

      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-green-500/5 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/6 w-96 h-96 bg-blue-500/5 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
    </section>
  );
}