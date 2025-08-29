import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { trpc } from '@/utils/trpc';
import type { CreateRegistrationInput } from '../../../server/src/schema';

export function RegistrationSection() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [formData, setFormData] = useState<CreateRegistrationInput>({
    email: '',
    name: '',
    company: null,
    position: null,
    phone: null,
    ticket_type: 'regular',
    dietary_requirements: null,
    t_shirt_size: null
  });

  const createFireworks = () => {
    const fireworksContainer = document.createElement('div');
    fireworksContainer.className = 'fixed inset-0 pointer-events-none z-50';
    document.body.appendChild(fireworksContainer);

    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const firework = document.createElement('div');
        firework.className = 'firework';
        firework.style.left = Math.random() * window.innerWidth + 'px';
        firework.style.top = Math.random() * window.innerHeight + 'px';
        firework.style.background = `radial-gradient(circle, ${['#00d4ff', '#7c3aed', '#10b981', '#f59e0b'][Math.floor(Math.random() * 4)]}, transparent)`;
        fireworksContainer.appendChild(firework);

        setTimeout(() => {
          firework.remove();
        }, 1000);
      }, i * 100);
    }

    setTimeout(() => {
      fireworksContainer.remove();
    }, 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);

    try {
      await trpc.createRegistration.mutate(formData);
      setRegistrationSuccess(true);
      createFireworks();

      // Reset form
      setFormData({
        email: '',
        name: '',
        company: null,
        position: null,
        phone: null,
        ticket_type: 'regular',
        dietary_requirements: null,
        t_shirt_size: null
      });
    } catch (error) {
      console.error('Registration failed:', error);
      alert('报名失败，请稍后重试');
    } finally {
      setIsRegistering(false);
    }
  };

  const techZoneItems = [
    {
      title: '🚀 前端框架展区',
      description: 'React、Vue、Angular等主流框架的最新特性演示',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      title: '⚡ 性能优化专区',
      description: 'Web性能监控、优化工具和最佳实践案例',
      color: 'from-green-400 to-emerald-500'
    },
    {
      title: '🎨 设计系统展示',
      description: '企业级设计系统构建与组件库开发',
      color: 'from-purple-400 to-pink-500'
    },
    {
      title: '🔧 开发工具体验',
      description: 'AI辅助编程、代码审查和自动化测试工具',
      color: 'from-orange-400 to-red-500'
    }
  ];

  return (
    <section id="tech-zone" className="py-20 relative">
      <div className="container mx-auto px-6">
        {/* Tech Zone */}
        <div className="mb-20">
          <div className="text-center mb-16 fade-in">
            <h2 className="text-5xl font-bold font-orbitron bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-4">
              技术展区
            </h2>
            <p className="text-xl font-rajdhani text-gray-300">
              沉浸式体验最新前端技术与工具
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {techZoneItems.map((item, index) => (
              <div 
                key={index}
                className="card-3d hover-particles glow-border bg-black/40 backdrop-blur-sm border-white/20 rounded-lg p-6 fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-full h-2 bg-gradient-to-r ${item.color} rounded-full mb-4`}></div>
                <h3 className="text-2xl font-bold font-orbitron text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-300 font-rajdhani">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Registration CTA */}
        <div id="registration" className="text-center fade-in">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-5xl font-bold font-orbitron bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-6">
              立即锁定席位
            </h2>
            <p className="text-2xl font-rajdhani text-gray-300 mb-12">
              与全球前端专家共赴技术盛宴
            </p>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="floating-btn text-2xl font-bold font-rajdhani px-12 py-6 rounded-full text-white hover:scale-110 transform transition-all duration-300 relative z-10">
                  立即报名
                </Button>
              </DialogTrigger>

              <DialogContent className="bg-black/90 backdrop-blur-md border-cyan-400/30 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-3xl font-orbitron text-cyan-400">
                    {registrationSuccess ? '🎉 报名成功！' : '报名参会'}
                  </DialogTitle>
                </DialogHeader>

                {registrationSuccess ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="text-6xl mb-4">✨</div>
                    <p className="text-xl font-rajdhani text-green-400">
                      恭喜您成功报名 See Conf 2025！
                    </p>
                    <p className="font-rajdhani text-gray-300">
                      我们将通过邮件发送详细的参会信息
                    </p>
                    <Button 
                      onClick={() => setRegistrationSuccess(false)}
                      className="mt-6 bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-purple-500 hover:to-cyan-400 text-white border-none"
                    >
                      继续报名其他人员
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-cyan-400 font-rajdhani">姓名 *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFormData((prev: CreateRegistrationInput) => ({ ...prev, name: e.target.value }))
                          }
                          className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-cyan-400"
                          placeholder="请输入您的姓名"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-cyan-400 font-rajdhani">邮箱 *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFormData((prev: CreateRegistrationInput) => ({ ...prev, email: e.target.value }))
                          }
                          className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-cyan-400"
                          placeholder="请输入您的邮箱"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="company" className="text-cyan-400 font-rajdhani">公司</Label>
                        <Input
                          id="company"
                          value={formData.company || ''}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFormData((prev: CreateRegistrationInput) => ({
                              ...prev,
                              company: e.target.value || null
                            }))
                          }
                          className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-cyan-400"
                          placeholder="您所在的公司"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="position" className="text-cyan-400 font-rajdhani">职位</Label>
                        <Input
                          id="position"
                          value={formData.position || ''}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFormData((prev: CreateRegistrationInput) => ({
                              ...prev,
                              position: e.target.value || null
                            }))
                          }
                          className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-cyan-400"
                          placeholder="您的职位"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-cyan-400 font-rajdhani">手机号</Label>
                        <Input
                          id="phone"
                          value={formData.phone || ''}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFormData((prev: CreateRegistrationInput) => ({
                              ...prev,
                              phone: e.target.value || null
                            }))
                          }
                          className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-cyan-400"
                          placeholder="您的手机号"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ticket_type" className="text-cyan-400 font-rajdhani">票种 *</Label>
                        <Select value={formData.ticket_type} onValueChange={(value) =>
                          setFormData((prev: CreateRegistrationInput) => ({ 
                            ...prev, 
                            ticket_type: value as 'early_bird' | 'regular' | 'student' | 'speaker'
                          }))
                        }>
                          <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-cyan-400">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-black/90 border-white/20 text-white">
                            <SelectItem value="early_bird">早鸟票 ¥299</SelectItem>
                            <SelectItem value="regular">标准票 ¥399</SelectItem>
                            <SelectItem value="student">学生票 ¥199</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="t_shirt_size" className="text-cyan-400 font-rajdhani">T恤尺码</Label>
                      <Select value={formData.t_shirt_size || ''} onValueChange={(value) =>
                        setFormData((prev: CreateRegistrationInput) => ({
                          ...prev,
                          t_shirt_size: (value as "XS" | "S" | "M" | "L" | "XL" | "XXL") || null
                        }))
                      }>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-cyan-400">
                          <SelectValue placeholder="请选择T恤尺码" />
                        </SelectTrigger>
                        <SelectContent className="bg-black/90 border-white/20 text-white">
                          <SelectItem value="XS">XS</SelectItem>
                          <SelectItem value="S">S</SelectItem>
                          <SelectItem value="M">M</SelectItem>
                          <SelectItem value="L">L</SelectItem>
                          <SelectItem value="XL">XL</SelectItem>
                          <SelectItem value="XXL">XXL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dietary_requirements" className="text-cyan-400 font-rajdhani">饮食要求</Label>
                      <Textarea
                        id="dietary_requirements"
                        value={formData.dietary_requirements || ''}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                          setFormData((prev: CreateRegistrationInput) => ({
                            ...prev,
                            dietary_requirements: e.target.value || null
                          }))
                        }
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-cyan-400"
                        placeholder="如有特殊饮食要求，请在此说明"
                        rows={3}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isRegistering}
                      className="w-full floating-btn text-lg font-bold font-rajdhani py-6 text-white relative z-10"
                    >
                      {isRegistering ? '提交中...' : '确认报名'}
                    </Button>
                  </form>
                )}
              </DialogContent>
            </Dialog>

            <div className="mt-8 text-gray-400 font-rajdhani">
              <p>席位有限，先到先得 • 早鸟优惠截止至10月31日</p>
            </div>
          </div>
        </div>
      </div>

      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/5 left-1/5 w-64 h-64 bg-cyan-500/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/5 right-1/5 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>
    </section>
  );
}