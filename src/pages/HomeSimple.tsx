import { Link } from 'react-router-dom'

export default function HomeSimple() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-yellow-400 rounded-full"></div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                SolarSys
              </span>
            </div>
            
            <div className="hidden md:flex space-x-6">
              <a href="#inicio" className="text-gray-700 hover:text-blue-600 transition-colors">Início</a>
              <a href="#beneficios" className="text-gray-700 hover:text-blue-600 transition-colors">Benefícios</a>
              <a href="#como-funciona" className="text-gray-700 hover:text-blue-600 transition-colors">Como Funciona</a>
              <a href="#contato" className="text-gray-700 hover:text-blue-600 transition-colors">Contato</a>
            </div>

            <Link 
              to="/simulador" 
              className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
            >
              Simular Agora
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="inicio" className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Energia Solar
                </span>
                <br />
                <span className="text-gray-800">
                  Para Sua Casa
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Descubra quanto você pode economizar com energia solar. 
                Simulação gratuita, rápida e precisa em poucos cliques.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/simulador"
                  className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all duration-300 inline-block text-center"
                >
                  🚀 Começar Simulação
                </Link>
                
                <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full font-semibold text-lg hover:border-blue-600 hover:text-blue-600 transition-all duration-300">
                  📞 Falar com Especialista
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">85%</div>
                  <div className="text-sm text-gray-600">Economia Média</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">25</div>
                  <div className="text-sm text-gray-600">Anos de Garantia</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600">5-7</div>
                  <div className="text-sm text-gray-600">Anos Payback</div>
                </div>
              </div>
            </div>

            {/* Right Content - Simple Illustration */}
            <div className="relative">
              <div className="w-full max-w-md mx-auto bg-blue-100 rounded-2xl p-8">
                <div className="text-center">
                  <div className="text-6xl mb-4">🏠</div>
                  <div className="text-4xl mb-4">☀️</div>
                  <p className="text-gray-700 font-semibold">Energia Solar para sua Casa</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="beneficios" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
              Por Que Escolher Energia Solar?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Invista no futuro sustentável e economize desde o primeiro mês
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "💰",
                title: "Economia Imediata",
                description: "Reduza sua conta de luz em até 95% desde o primeiro mês de instalação"
              },
              {
                icon: "🌱",
                title: "Sustentabilidade",
                description: "Contribua para um planeta mais limpo com energia 100% renovável"
              },
              {
                icon: "📈",
                title: "Valorização do Imóvel",
                description: "Aumente o valor do seu imóvel em até 8% com energia solar"
              },
              {
                icon: "🔒",
                title: "Proteção contra Inflação",
                description: "Livre-se dos aumentos constantes na tarifa de energia elétrica"
              },
              {
                icon: "⚡",
                title: "Energia Limpa",
                description: "Sistema silencioso e sem emissão de poluentes ou gases"
              },
              {
                icon: "🛡️",
                title: "Garantia Estendida",
                description: "25 anos de garantia de performance dos painéis solares"
              }
            ].map((benefit, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300"
              >
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="como-funciona" className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
              Como Funciona Nossa Simulação
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Em poucos passos, descubra o potencial solar da sua casa
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Localização",
                description: "Informe seu CEP para análise de irradiação solar da região"
              },
              {
                step: "02", 
                title: "Consumo",
                description: "Conte sobre seu consumo atual de energia elétrica"
              },
              {
                step: "03",
                title: "Estrutura",
                description: "Descreva o tipo de telhado e características da sua casa"
              },
              {
                step: "04",
                title: "Resultado",
                description: "Receba sua simulação completa e fale com nossos especialistas"
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              to="/simulador"
              className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-10 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all duration-300 inline-block"
            >
              ⚡ Fazer Simulação Gratuita
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Pronto Para Economizar?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Junte-se a milhares de brasileiros que já escolheram a energia solar. 
            Faça sua simulação gratuita agora!
          </p>
          
          <Link 
            to="/simulador"
            className="bg-white text-blue-600 px-10 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all duration-300 inline-block"
          >
            🌟 Começar Agora - É Grátis!
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-yellow-400 rounded-full"></div>
                <span className="text-2xl font-bold">SolarSys</span>
              </div>
              <p className="text-gray-400">
                Transformando o futuro energético do Brasil, uma casa por vez.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Produtos</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/simulador" className="hover:text-white transition-colors">Simulador Solar</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Painéis Residenciais</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sistemas Comerciais</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Suporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Garantias</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Manutenção</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Contato</h3>
              <ul className="space-y-2 text-gray-400">
                <li>📞 (11) 99999-9999</li>
                <li>📧 contato@solarsys.com.br</li>
                <li>📍 São Paulo, SP</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SolarSys. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}