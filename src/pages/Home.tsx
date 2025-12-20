import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

const floatingAnimation = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

const pulseAnimation = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

// Solar Panel SVG Component
const SolarPanel = ({ className = "" }) => (
  <motion.svg 
    className={className}
    viewBox="0 0 200 120" 
    fill="none"
    variants={floatingAnimation}
    animate="animate"
  >
    <rect x="10" y="20" width="180" height="80" rx="8" fill="#1e40af" stroke="#3b82f6" strokeWidth="2"/>
    <g fill="#60a5fa" opacity="0.8">
      <rect x="20" y="30" width="35" height="25" rx="2"/>
      <rect x="65" y="30" width="35" height="25" rx="2"/>
      <rect x="110" y="30" width="35" height="25" rx="2"/>
      <rect x="155" y="30" width="25" height="25" rx="2"/>
      <rect x="20" y="65" width="35" height="25" rx="2"/>
      <rect x="65" y="65" width="35" height="25" rx="2"/>
      <rect x="110" y="65" width="35" height="25" rx="2"/>
      <rect x="155" y="65" width="25" height="25" rx="2"/>
    </g>
    <motion.circle 
      cx="30" 
      cy="42" 
      r="2" 
      fill="#fbbf24"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <motion.circle 
      cx="75" 
      cy="42" 
      r="2" 
      fill="#fbbf24"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
    />
    <motion.circle 
      cx="120" 
      cy="42" 
      r="2" 
      fill="#fbbf24"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
    />
  </motion.svg>
)

// Sun SVG Component
const AnimatedSun = ({ className = "" }) => (
  <motion.svg 
    className={className}
    viewBox="0 0 100 100" 
    fill="none"
    animate={{ rotate: 360 }}
    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
  >
    <motion.circle 
      cx="50" 
      cy="50" 
      r="20" 
      fill="#fbbf24"
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 3, repeat: Infinity }}
    />
    {[...Array(8)].map((_, i) => (
      <motion.line
        key={i}
        x1="50"
        y1="10"
        x2="50"
        y2="20"
        stroke="#fbbf24"
        strokeWidth="3"
        strokeLinecap="round"
        transform={`rotate(${i * 45} 50 50)`}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
      />
    ))}
  </motion.svg>
)

// House with Solar Panels SVG
const SolarHouse = ({ className = "" }) => (
  <motion.svg 
    className={className}
    viewBox="0 0 300 200" 
    fill="none"
    variants={fadeInUp}
  >
    {/* House base */}
    <rect x="50" y="120" width="200" height="70" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2"/>
    
    {/* Roof */}
    <polygon points="40,120 150,60 260,120" fill="#6b7280" stroke="#4b5563" strokeWidth="2"/>
    
    {/* Solar panels on roof */}
    <motion.rect 
      x="80" y="80" width="40" height="25" rx="2" 
      fill="#1e40af" 
      variants={pulseAnimation}
      animate="animate"
    />
    <motion.rect 
      x="130" y="75" width="40" height="25" rx="2" 
      fill="#1e40af"
      variants={pulseAnimation}
      animate="animate"
    />
    <motion.rect 
      x="180" y="80" width="40" height="25" rx="2" 
      fill="#1e40af"
      variants={pulseAnimation}
      animate="animate"
    />
    
    {/* Door */}
    <rect x="120" y="150" width="20" height="40" fill="#8b5cf6"/>
    
    {/* Windows */}
    <rect x="80" y="140" width="25" height="25" fill="#60a5fa" opacity="0.7"/>
    <rect x="175" y="140" width="25" height="25" fill="#60a5fa" opacity="0.7"/>
    
    {/* Energy flow lines */}
    <motion.path
      d="M100 90 Q120 100 140 85"
      stroke="#fbbf24"
      strokeWidth="2"
      fill="none"
      animate={{ pathLength: [0, 1, 0] }}
      transition={{ duration: 3, repeat: Infinity }}
    />
    <motion.path
      d="M150 85 Q170 95 190 90"
      stroke="#fbbf24"
      strokeWidth="2"
      fill="none"
      animate={{ pathLength: [0, 1, 0] }}
      transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
    />
  </motion.svg>
)

export default function Home() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Navigation */}
      <motion.nav 
        className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-200"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <AnimatedSun className="w-8 h-8" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                SolarSys
              </span>
            </motion.div>
            
            <div className="hidden md:flex space-x-6">
              <Link to="#inicio" className="text-gray-700 hover:text-blue-600 transition-colors">Início</Link>
              <Link to="#beneficios" className="text-gray-700 hover:text-blue-600 transition-colors">Benefícios</Link>
              <Link to="#como-funciona" className="text-gray-700 hover:text-blue-600 transition-colors">Como Funciona</Link>
              <Link to="#contato" className="text-gray-700 hover:text-blue-600 transition-colors">Contato</Link>
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/simulador" 
                className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
              >
                Simular Agora
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section id="inicio" className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <motion.div 
            className="grid lg:grid-cols-2 gap-12 items-center"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {/* Left Content */}
            <motion.div className="space-y-8" variants={fadeInUp}>
              <motion.h1 
                className="text-5xl lg:text-7xl font-bold leading-tight"
                variants={fadeInUp}
              >
                <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Energia Solar
                </span>
                <br />
                <span className="text-gray-800">
                  Para Sua Casa
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-600 leading-relaxed max-w-lg"
                variants={fadeInUp}
              >
                Descubra quanto você pode economizar com energia solar. 
                Simulação gratuita, rápida e precisa em poucos cliques.
              </motion.p>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                variants={fadeInUp}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to="/simulador"
                    className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all duration-300 inline-block text-center"
                  >
                    🚀 Começar Simulação
                  </Link>
                </motion.div>
                
                <motion.button
                  className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full font-semibold text-lg hover:border-blue-600 hover:text-blue-600 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  📞 Falar com Especialista
                </motion.button>
              </motion.div>

              {/* Stats */}
              <motion.div 
                className="grid grid-cols-3 gap-6 pt-8"
                variants={fadeInUp}
              >
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
              </motion.div>
            </motion.div>

            {/* Right Content - Illustration */}
            <motion.div 
              className="relative"
              variants={fadeInUp}
              style={{ y: scrollY * -0.1 }}
            >
              <div className="relative z-10">
                <SolarHouse className="w-full max-w-md mx-auto" />
              </div>
              
              {/* Floating elements */}
              <motion.div 
                className="absolute -top-10 -right-10 w-20 h-20"
                animate={{ 
                  rotate: 360,
                  y: [-10, 10, -10]
                }}
                transition={{ 
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <AnimatedSun className="w-full h-full" />
              </motion.div>

              <motion.div 
                className="absolute -bottom-5 -left-5 w-32 h-20"
                variants={floatingAnimation}
                animate="animate"
              >
                <SolarPanel className="w-full h-full" />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="beneficios" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
              Por Que Escolher Energia Solar?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Invista no futuro sustentável e economize desde o primeiro mês
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
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
              <motion.div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300"
                variants={fadeInUp}
                whileHover={{ y: -5 }}
              >
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="como-funciona" className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
              Como Funciona Nossa Simulação
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Em poucos passos, descubra o potencial solar da sua casa
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
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
              <motion.div
                key={index}
                className="text-center"
                variants={fadeInUp}
              >
                <motion.div 
                  className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4"
                  whileHover={{ scale: 1.1 }}
                >
                  {step.step}
                </motion.div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to="/simulador"
                className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-10 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all duration-300 inline-block"
              >
                ⚡ Fazer Simulação Gratuita
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Pronto Para Economizar?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Junte-se a milhares de brasileiros que já escolheram a energia solar. 
              Faça sua simulação gratuita agora!
            </p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to="/simulador"
                className="bg-white text-blue-600 px-10 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all duration-300 inline-block"
              >
                🌟 Começar Agora - É Grátis!
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <AnimatedSun className="w-8 h-8" />
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