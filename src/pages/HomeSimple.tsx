import { Link } from 'react-router-dom'

export default function HomeSimple() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg"></div>
              <span className="text-xl font-bold text-gray-900">SolarSys</span>
            </div>
            
            <div className="hidden md:flex space-x-8">
              <a href="#inicio" className="text-gray-600 hover:text-gray-900 transition-colors">Início</a>
              <a href="#beneficios" className="text-gray-600 hover:text-gray-900 transition-colors">Benefícios</a>
              <a href="#como-funciona" className="text-gray-600 hover:text-gray-900 transition-colors">Como Funciona</a>
              <a href="#contato" className="text-gray-600 hover:text-gray-900 transition-colors">Contato</a>
            </div>

            <Link 
              to="/simulador" 
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2.5 rounded-lg font-medium hover:shadow-lg transition-all duration-300"
            >
              Simular Agora
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="inicio" className="pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-gray-900">
                  O futuro da energia
                  <span className="block bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                    está no seu telhado
                  </span>
                </h1>
                
                <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-2xl">
                  Transforme sua casa em uma usina de energia limpa e renovável. 
                  Economize até 95% na conta de luz com tecnologia solar de última geração.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/simulador"
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-center"
                >
                  Calcular Minha Economia
                </Link>
                
                <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg hover:border-orange-500 hover:text-orange-500 transition-all duration-300">
                  Falar com Especialista
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
                <div>
                  <div className="text-3xl font-bold text-orange-500">95%</div>
                  <div className="text-sm text-gray-600 font-medium">Redução na conta</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-500">25</div>
                  <div className="text-sm text-gray-600 font-medium">Anos de garantia</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-500">5</div>
                  <div className="text-sm text-gray-600 font-medium">Anos para retorno</div>
                </div>
              </div>
            </div>

            {/* Right Content - Visual */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl p-12 aspect-square flex items-center justify-center">
                {/* Solar Panel Illustration */}
                <div className="w-full max-w-md">
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                    <div className="grid grid-cols-4 gap-2">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <div 
                          key={i} 
                          className="aspect-square bg-gradient-to-br from-blue-600 to-blue-800 rounded-sm"
                          style={{ animationDelay: `${i * 0.1}s` }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute top-8 right-8 w-4 h-4 bg-orange-400 rounded-full animate-pulse"></div>
                <div className="absolute bottom-12 left-8 w-6 h-6 bg-red-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-1/2 left-4 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="beneficios" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Por que escolher energia solar?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Invista no futuro sustentável e transforme sua casa em uma fonte de economia e valor
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Economia Imediata",
                description: "Reduza sua conta de luz em até 95% desde o primeiro mês de instalação. Investimento com retorno garantido.",
                color: "from-green-400 to-emerald-500"
              },
              {
                title: "Energia Limpa",
                description: "100% renovável e sustentável. Contribua para um planeta mais limpo e reduza sua pegada de carbono.",
                color: "from-blue-400 to-cyan-500"
              },
              {
                title: "Valorização do Imóvel",
                description: "Aumente o valor do seu imóvel em até 15% com tecnologia solar moderna e certificada.",
                color: "from-purple-400 to-indigo-500"
              },
              {
                title: "Proteção Contra Inflação",
                description: "Livre-se dos aumentos constantes na tarifa elétrica. Previsibilidade de custos por 25 anos.",
                color: "from-orange-400 to-red-500"
              },
              {
                title: "Tecnologia Avançada",
                description: "Painéis de alta eficiência com inversores inteligentes e monitoramento em tempo real.",
                color: "from-teal-400 to-blue-500"
              },
              {
                title: "Garantia Estendida",
                description: "25 anos de garantia de performance dos painéis solares com suporte técnico especializado.",
                color: "from-pink-400 to-rose-500"
              }
            ].map((benefit, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${benefit.color} rounded-xl mb-6`}></div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="como-funciona" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Como funciona nossa simulação
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Processo inteligente e preciso para calcular o potencial solar da sua casa
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Localização",
                description: "Informe seu CEP para análise precisa de irradiação solar e regulamentações locais"
              },
              {
                step: "02", 
                title: "Consumo Energético",
                description: "Analisamos seu perfil de consumo atual para dimensionamento otimizado do sistema"
              },
              {
                step: "03",
                title: "Características do Imóvel",
                description: "Avaliamos tipo de telhado, área disponível e condições estruturais"
              },
              {
                step: "04",
                title: "Proposta Personalizada",
                description: "Receba simulação completa com economia, investimento e cronograma de instalação"
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-2xl flex items-center justify-center text-lg font-bold mx-auto mb-6 shadow-lg">
                    {step.step}
                  </div>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-orange-200 to-transparent"></div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link 
              to="/simulador"
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-12 py-4 rounded-lg font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300 inline-block"
            >
              Fazer Simulação Gratuita
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Mais de 10.000 famílias já economizam com energia solar
            </h2>
            <p className="text-xl text-gray-600">
              Junte-se aos brasileiros que escolheram independência energética
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Maria Silva",
                location: "São Paulo, SP",
                savings: "R$ 450/mês",
                testimonial: "Minha conta de luz caiu de R$ 500 para R$ 50. O investimento se pagou em 4 anos e agora é só economia."
              },
              {
                name: "João Santos",
                location: "Rio de Janeiro, RJ", 
                savings: "R$ 380/mês",
                testimonial: "Processo muito fácil e transparente. A equipe cuidou de tudo, desde o projeto até a instalação."
              },
              {
                name: "Ana Costa",
                location: "Belo Horizonte, MG",
                savings: "R$ 520/mês",
                testimonial: "Além da economia, minha casa valorizou. Foi o melhor investimento que já fiz para minha família."
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.location}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">{testimonial.savings}</div>
                      <div className="text-sm text-gray-600">economia mensal</div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">"{testimonial.testimonial}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-8">
            Pronto para economizar na conta de luz?
          </h2>
          
          <p className="text-xl mb-12 opacity-90 leading-relaxed">
            Faça sua simulação gratuita agora e descubra quanto você pode economizar 
            com energia solar. Sem compromisso, resultado em 2 minutos.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link 
              to="/simulador"
              className="bg-white text-orange-600 px-12 py-4 rounded-lg font-bold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Calcular Minha Economia
            </Link>
            
            <div className="flex items-center space-x-6 text-sm opacity-75">
              <span>✓ Gratuito</span>
              <span>✓ Sem cadastro</span>
              <span>✓ Resultado imediato</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg"></div>
                <span className="text-xl font-bold">SolarSys</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Transformando o futuro energético do Brasil com tecnologia solar de última geração.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold mb-6 text-lg">Soluções</h3>
              <ul className="space-y-3 text-gray-400">
                <li><Link to="/simulador" className="hover:text-white transition-colors">Simulador Solar</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Painéis Residenciais</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sistemas Comerciais</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Monitoramento</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-6 text-lg">Suporte</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Garantias</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Manutenção</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Financiamento</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-6 text-lg">Contato</h3>
              <ul className="space-y-3 text-gray-400">
                <li>(11) 99999-9999</li>
                <li>contato@solarsys.com.br</li>
                <li>São Paulo, SP</li>
                <li>Seg-Sex: 8h às 18h</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">&copy; 2024 SolarSys. Todos os direitos reservados.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacidade</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Termos</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}