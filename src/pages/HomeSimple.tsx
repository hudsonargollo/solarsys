import { Link } from 'react-router-dom'

export default function HomeSimple() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">☀</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                SolarSys
              </span>
            </div>
            
            <div className="hidden md:flex space-x-8">
              <a href="#inicio" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">Início</a>
              <a href="#beneficios" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">Benefícios</a>
              <a href="#como-funciona" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">Como Funciona</a>
              <a href="#contato" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">Contato</a>
            </div>

            <Link 
              to="/simulador" 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Simular Agora
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="inicio" className="pt-32 pb-20 px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full border border-blue-200">
                <span className="text-blue-600 font-medium text-sm">✨ Tecnologia Solar Avançada</span>
              </div>
              
              <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">
                  Transforme
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Sua Casa
                </span>
                <br />
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                  em Usina Solar
                </span>
              </h1>
              
              <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
                Descubra o potencial solar da sua residência com nossa simulação inteligente. 
                Economia real, sustentabilidade garantida e retorno do investimento em até 5 anos.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/simulador"
                  className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 inline-flex items-center justify-center shadow-xl"
                >
                  <span className="mr-2">🚀</span>
                  Começar Simulação Gratuita
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                
                <button className="group border-2 border-slate-300 text-slate-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 inline-flex items-center justify-center">
                  <span className="mr-2">📞</span>
                  Falar com Especialista
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-slate-200">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">95%</div>
                  <div className="text-sm text-slate-600 font-medium">Economia Média</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">25</div>
                  <div className="text-sm text-slate-600 font-medium">Anos Garantia</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-600">4-6</div>
                  <div className="text-sm text-slate-600 font-medium">Anos Payback</div>
                </div>
              </div>
            </div>

            {/* Right Content - Premium Illustration */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-12 shadow-2xl">
                {/* Solar House Illustration */}
                <div className="text-center space-y-6">
                  <div className="relative">
                    <div className="text-8xl mb-4">🏠</div>
                    <div className="absolute -top-4 -right-4 text-4xl animate-pulse">☀️</div>
                    <div className="absolute -top-2 -left-6 text-3xl animate-bounce">⚡</div>
                  </div>
                  
                  {/* Energy Flow Animation */}
                  <div className="flex justify-center items-center space-x-4">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full animate-ping" style={{animationDelay: '0.4s'}}></div>
                  </div>
                  
                  <p className="text-slate-700 font-semibold text-lg">
                    Energia Limpa e Renovável
                  </p>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="beneficios" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-green-50 rounded-full border border-green-200 mb-6">
              <span className="text-green-600 font-medium text-sm">🌱 Vantagens Exclusivas</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
              Por Que Escolher
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Energia Solar?</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Invista no futuro sustentável e transforme sua casa em uma fonte de economia e valor
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "💰",
                title: "Economia Imediata",
                description: "Reduza sua conta de luz em até 95% desde o primeiro mês. ROI garantido em 4-6 anos.",
                color: "from-green-400 to-emerald-600"
              },
              {
                icon: "🌱",
                title: "Sustentabilidade Total",
                description: "100% energia renovável. Reduza sua pegada de carbono e contribua para um planeta mais limpo.",
                color: "from-blue-400 to-cyan-600"
              },
              {
                icon: "📈",
                title: "Valorização Imobiliária",
                description: "Aumente o valor do seu imóvel em até 15% com tecnologia solar de última geração.",
                color: "from-purple-400 to-indigo-600"
              },
              {
                icon: "🔒",
                title: "Proteção Inflacionária",
                description: "Blindagem total contra aumentos na tarifa elétrica. Previsibilidade de custos por 25 anos.",
                color: "from-amber-400 to-orange-600"
              },
              {
                icon: "⚡",
                title: "Tecnologia Avançada",
                description: "Painéis de alta eficiência, inversores inteligentes e monitoramento em tempo real.",
                color: "from-teal-400 to-blue-600"
              },
              {
                icon: "🛡️",
                title: "Garantia Premium",
                description: "25 anos de garantia de performance + 10 anos de garantia do fabricante.",
                color: "from-rose-400 to-pink-600"
              }
            ].map((benefit, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-slate-50 to-white p-8 rounded-2xl border border-slate-200 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{benefit.title}</h3>
                <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="como-funciona" className="py-24 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full border border-blue-200 mb-6">
              <span className="text-blue-600 font-medium text-sm">⚡ Processo Inteligente</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
              Como Funciona Nossa
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Simulação</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Tecnologia de ponta para calcular o potencial solar da sua casa com precisão científica
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Análise Geográfica",
                description: "Informe seu CEP para análise precisa de irradiação solar, clima e regulamentações locais",
                icon: "🌍"
              },
              {
                step: "02", 
                title: "Perfil Energético",
                description: "Analisamos seu consumo atual e padrões de uso para dimensionamento otimizado",
                icon: "📊"
              },
              {
                step: "03",
                title: "Engenharia Personalizada",
                description: "Avaliamos tipo de telhado, área disponível e características estruturais",
                icon: "🏗️"
              },
              {
                step: "04",
                title: "Proposta Inteligente",
                description: "Receba simulação completa com ROI, economia e cronograma de instalação",
                icon: "🎯"
              }
            ].map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-xl group-hover:scale-110 transition-transform">
                    {step.step}
                  </div>
                  <div className="text-4xl mb-4">{step.icon}</div>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-transparent"></div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link 
              to="/simulador"
              className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 inline-flex items-center shadow-xl"
            >
              <span className="mr-2">⚡</span>
              Fazer Simulação Inteligente
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="container mx-auto px-6 text-center relative">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-full border border-white/20 mb-8">
              <span className="text-white font-medium text-sm">🌟 Oferta Limitada</span>
            </div>
            
            <h2 className="text-5xl lg:text-6xl font-bold mb-8">
              Pronto Para
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent"> Economizar?</span>
            </h2>
            
            <p className="text-xl mb-12 max-w-2xl mx-auto opacity-90 leading-relaxed">
              Junte-se a mais de 10.000 brasileiros que já escolheram a energia solar. 
              Simulação gratuita, sem compromisso, resultado em 2 minutos.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link 
                to="/simulador"
                className="group bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 px-12 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 inline-flex items-center shadow-xl"
              >
                <span className="mr-2">🌟</span>
                Começar Agora - É Grátis!
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              
              <div className="flex items-center space-x-4 text-sm opacity-75">
                <span>✓ Sem cadastro</span>
                <span>✓ Resultado imediato</span>
                <span>✓ 100% gratuito</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">☀</span>
                </div>
                <span className="text-2xl font-bold">SolarSys</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Transformando o futuro energético do Brasil com tecnologia solar de última geração.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold mb-6 text-lg">Soluções</h3>
              <ul className="space-y-3 text-slate-400">
                <li><Link to="/simulador" className="hover:text-white transition-colors">Simulador Solar</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Painéis Residenciais</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sistemas Comerciais</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Monitoramento</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-6 text-lg">Suporte</h3>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Garantias</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Manutenção</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Financiamento</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-6 text-lg">Contato</h3>
              <ul className="space-y-3 text-slate-400">
                <li className="flex items-center"><span className="mr-2">📞</span> (11) 99999-9999</li>
                <li className="flex items-center"><span className="mr-2">📧</span> contato@solarsys.com.br</li>
                <li className="flex items-center"><span className="mr-2">📍</span> São Paulo, SP</li>
                <li className="flex items-center"><span className="mr-2">🕒</span> Seg-Sex: 8h às 18h</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400">&copy; 2024 SolarSys. Todos os direitos reservados.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Privacidade</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Termos</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}