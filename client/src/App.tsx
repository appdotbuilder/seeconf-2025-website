import './App.css';
import { useState, useEffect, useCallback } from 'react';
import { trpc } from '@/utils/trpc';
import type { CountdownResponse, Speaker, Agenda, Partner } from '../../server/src/schema';

// Components
import { ParticleBackground } from '@/components/ParticleBackground';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { ConferenceOverview } from '@/components/ConferenceOverview';
import { SpeakersSection } from '@/components/SpeakersSection';
import { AgendaSection } from '@/components/AgendaSection';
import { RegistrationSection } from '@/components/RegistrationSection';
import { PartnersSection } from '@/components/PartnersSection';
import { Footer } from '@/components/Footer';

function App() {
  const [countdown, setCountdown] = useState<CountdownResponse>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total_seconds: 0,
    is_live: false
  });
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [agenda, setAgenda] = useState<Agenda[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [activeSection, setActiveSection] = useState('hero');

  // Load countdown data
  const loadCountdown = useCallback(async () => {
    try {
      const result = await trpc.getCountdown.query();
      setCountdown(result);
    } catch (error) {
      console.error('Failed to load countdown:', error);
    }
  }, []);

  // Load speakers data with stub data since API returns empty
  const loadSpeakers = useCallback(async () => {
    try {
      const result = await trpc.getSpeakers.query();
      // Using stub data since API returns empty array
      if (result.length === 0) {
        const stubSpeakers: Speaker[] = [
          {
            id: 1,
            name: '张三',
            position: '首席技术官',
            company: 'TechCorp',
            avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
            bio: '10年前端开发经验，专注于React生态和性能优化',
            speech_topic: 'React 19的新特性与未来发展',
            social_links: '{"twitter": "@zhangsan", "github": "@zhangsan"}',
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            id: 2,
            name: 'Sarah Johnson',
            position: 'Senior Frontend Architect',
            company: 'Google',
            avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b2e26b3a?w=300&h=300&fit=crop&crop=face',
            bio: 'Leading Chrome DevTools team, passionate about developer experience',
            speech_topic: 'The Future of Web Development Tools',
            social_links: '{"twitter": "@sarahj", "linkedin": "/in/sarahj"}',
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            id: 3,
            name: '李明',
            position: '前端架构师',
            company: '字节跳动',
            avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
            bio: '专注于大规模前端工程化和微前端架构',
            speech_topic: 'Micro-Frontend在企业级应用中的实践',
            social_links: '{"github": "@liming", "weibo": "@liming"}',
            created_at: new Date(),
            updated_at: new Date()
          }
        ];
        setSpeakers(stubSpeakers);
      } else {
        setSpeakers(result);
      }
    } catch (error) {
      console.error('Failed to load speakers:', error);
    }
  }, []);

  // Load agenda data with stub data
  const loadAgenda = useCallback(async () => {
    try {
      const result = await trpc.getAgenda.query();
      // Using stub data since API returns empty array
      if (result.length === 0) {
        const stubAgenda: Agenda[] = [
          {
            id: 1,
            title: '开幕式 & 主题演讲',
            description: 'See Conf 2025 正式开启，探讨前端技术的未来发展趋势',
            start_time: new Date('2025-11-22T09:00:00'),
            end_time: new Date('2025-11-22T10:30:00'),
            type: 'main_forum',
            speaker_id: 1,
            location: '主会场',
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            id: 2,
            title: '体验设计的技术实现',
            description: '探索如何通过技术手段实现极致的用户体验',
            start_time: new Date('2025-11-22T11:00:00'),
            end_time: new Date('2025-11-22T12:00:00'),
            type: 'design_forum',
            speaker_id: 2,
            location: '设计分会场',
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            id: 3,
            title: '前端工程化实践',
            description: '大型项目的前端工程化解决方案与最佳实践',
            start_time: new Date('2025-11-22T14:00:00'),
            end_time: new Date('2025-11-22T15:30:00'),
            type: 'engineering_forum',
            speaker_id: 3,
            location: '工程分会场',
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            id: 4,
            title: '动手实践工作坊',
            description: '现代前端开发工具链的实际操作与应用',
            start_time: new Date('2025-11-22T16:00:00'),
            end_time: new Date('2025-11-22T18:00:00'),
            type: 'workshop',
            speaker_id: null,
            location: '实践区',
            created_at: new Date(),
            updated_at: new Date()
          }
        ];
        setAgenda(stubAgenda);
      } else {
        setAgenda(result);
      }
    } catch (error) {
      console.error('Failed to load agenda:', error);
    }
  }, []);

  // Load partners data with stub data
  const loadPartners = useCallback(async () => {
    try {
      const result = await trpc.getPartners.query();
      // Using stub data since API returns empty array
      if (result.length === 0) {
        const stubPartners: Partner[] = [
          {
            id: 1,
            name: 'Google',
            logo_url: 'https://logo.clearbit.com/google.com',
            website_url: 'https://google.com',
            tier: 'title',
            description: '全球领先的科技公司',
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            id: 2,
            name: 'Microsoft',
            logo_url: 'https://logo.clearbit.com/microsoft.com',
            website_url: 'https://microsoft.com',
            tier: 'platinum',
            description: '云计算与开发工具领导者',
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            id: 3,
            name: 'Meta',
            logo_url: 'https://logo.clearbit.com/meta.com',
            website_url: 'https://meta.com',
            tier: 'gold',
            description: 'React技术的创造者',
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            id: 4,
            name: 'Vercel',
            logo_url: 'https://logo.clearbit.com/vercel.com',
            website_url: 'https://vercel.com',
            tier: 'silver',
            description: '现代Web开发平台',
            created_at: new Date(),
            updated_at: new Date()
          }
        ];
        setPartners(stubPartners);
      } else {
        setPartners(result);
      }
    } catch (error) {
      console.error('Failed to load partners:', error);
    }
  }, []);

  // Update countdown every second
  useEffect(() => {
    loadCountdown();
    const interval = setInterval(loadCountdown, 1000);
    return () => clearInterval(interval);
  }, [loadCountdown]);

  // Load data on mount
  useEffect(() => {
    loadSpeakers();
    loadAgenda();
    loadPartners();
  }, [loadSpeakers, loadAgenda, loadPartners]);

  // Handle scroll for active section detection
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'speakers', 'agenda', 'tech-zone', 'registration'];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (currentSection && currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-violet-800 text-white relative overflow-x-hidden">
      {/* Starfield background */}
      <div className="starfield"></div>
      
      {/* Particle background */}
      <ParticleBackground />

      {/* Navigation */}
      <Navigation activeSection={activeSection} />

      {/* Hero Section */}
      <HeroSection 
        countdown={countdown} 
        onScrollToSection={(section: string) => {
          const element = document.getElementById(section);
          element?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Conference Overview */}
      <ConferenceOverview />

      {/* Speakers Section */}
      <SpeakersSection speakers={speakers} />

      {/* Agenda Section */}
      <AgendaSection agenda={agenda} speakers={speakers} />

      {/* Registration Section */}
      <RegistrationSection />

      {/* Partners Section */}
      <PartnersSection partners={partners} />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;