import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Sun, Moon, Zap, Shield, TrendingUp, Leaf, Home, Users } from 'lucide-react'

export default function HomeSimple() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* ISOTEC Logo */}
              <div className="relative">
                <motion.div 
                  className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Zap className="w-6 h-6 text-white" />
                </motion.div>
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">ISOTEC</span>
            </motion.div>
            
            <div className="hidden md:flex space-x-8">
              <a href="#inicio" className="text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">Início</a>
              <a href="#beneficios" className="text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">Benefícios</a>
              <a href="#como-funciona" className="text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">Como Funciona</a>
              <a href="#contato" className="text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">Contato</a>
            </div>

            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <motion.button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </motion.button>

              <Link 
                to="/simulador" 
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2.5 rounded-lg font-medium hover:shadow-lg transition-all duration-300"
              >
                Simular Agora
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="inicio" className="pt-24 pb-16 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
            {/* Left Content */}
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-6">
                <motion.h1 
                  className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-gray-900 dark:text-white"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  O futuro da energia
                  <motion.span 
                    className="block bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    está no seu telhado
                  </motion.span>
                </motion.h1>
                
                <motion.p 
                  className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  Transforme sua casa em uma usina de energia limpa e renovável. 
                  Economize até 95% na conta de luz com tecnologia solar de última geração.
                </motion.p>
              </div>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to="/simulador"
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-xl transition-all duration-300 text-center inline-flex items-center justify-center space-x-2"
                  >
                    <Zap className="w-5 h-5" />
                    <span>Calcular Minha Economia</span>
                  </Link>
                </motion.div>
                
                <motion.button 
                  className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-lg font-semibold text-lg hover:border-orange-500 hover:text-orange-500 transition-all duration-300 inline-flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Users className="w-5 h-5" />
                  <span>Falar com Especialista</span>
                </motion.button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div 
                className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                <div className="text-center">
                  <motion.div 
                    className="text-3xl font-bold text-orange-500"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                  >
                    95%
                  </motion.div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Redução na conta</div>
                </div>
                <div className="text-center">
                  <motion.div 
                    className="text-3xl font-bold text-orange-500"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  >
                    25
                  </motion.div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Anos de garantia</div>
                </div>
                <div className="text-center">
                  <motion.div 
                    className="text-3xl font-bold text-orange-500"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  >
                    5
                  </motion.div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Anos para retorno</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Content - Mascot & Visual */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="relative bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-3xl p-12 aspect-square flex items-center justify-center">
                {/* Mascot Character */}
                <motion.div 
                  className="relative z-10"
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 2, -2, 0]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {/* Simple Mascot SVG */}
                  <svg width="200" height="200" viewBox="0 0 200 200" className="drop-shadow-2xl">
                    {/* Body */}
                    <motion.circle 
                      cx="100" 
                      cy="120" 
                      r="50" 
                      fill="url(#mascotGradient)"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                    />
                    
                    {/* Head */}
                    <motion.circle 
                      cx="100" 
                      cy="70" 
                      r="35" 
                      fill="url(#headGradient)"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.8, delay: 0.8 }}
                    />
                    
                    {/* Eyes */}
                    <motion.circle 
                      cx="90" 
                      cy="65" 
                      r="4" 
                      fill="#1f2937"
                      animate={{ scaleY: [1, 0.1, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    <motion.circle 
                      cx="110" 
                      cy="65" 
                      r="4" 
                      fill="#1f2937"
                      animate={{ scaleY: [1, 0.1, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    
                    {/* Smile */}
                    <motion.path 
                      d="M 85 75 Q 100 85 115 75" 
                      stroke="#1f2937" 
                      strokeWidth="3" 
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: 1 }}
                    />
                    
                    {/* Solar Panel Hat */}
                    <motion.rect 
                      x="75" 
                      y="35" 
                      width="50" 
                      height="20" 
                      rx="5" 
                      fill="url(#solarGradient)"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 35, opacity: 1 }}
                      transition={{ duration: 0.8, delay: 1.2 }}
                    />
                    
                    {/* Solar Panel Grid */}
                    <motion.g
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8, delay: 1.4 }}
                    >
                      <line x1="85" y1="35" x2="85" y2="55" stroke="#1e40af" strokeWidth="1"/>
                      <line x1="95" y1="35" x2="95" y2="55" stroke="#1e40af" strokeWidth="1"/>
                      <line x1="105" y1="35" x2="105" y2="55" stroke="#1e40af" strokeWidth="1"/>
                      <line x1="115" y1="35" x2="115" y2="55" stroke="#1e40af" strokeWidth="1"/>
                      <line x1="75" y1="42" x2="125" y2="42" stroke="#1e40af" strokeWidth="1"/>
                      <line x1="75" y1="48" x2="125" y2="48" stroke="#1e40af" strokeWidth="1"/>
                    </motion.g>
                    
                    {/* Energy Rays */}
                    <motion.g
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      style={{ transformOrigin: "100px 45px" }}
                    >
                      <motion.line 
                        x1="100" y1="25" x2="100" y2="15" 
                        stroke="#fbbf24" strokeWidth="3" strokeLinecap="round"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <motion.line 
                        x1="120" y1="30" x2="127" y2="23" 
                        stroke="#fbbf24" strokeWidth="3" strokeLinecap="round"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                      />
                      <motion.line 
                        x1="80" y1="30" x2="73" y2="23" 
                        stroke="#fbbf24" strokeWidth="3" strokeLinecap="round"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                      />
                    </motion.g>
                    
                    {/* Gradients */}
                    <defs>
                      <linearGradient id="mascotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#dc2626" />
                      </linearGradient>
                      <linearGradient id="headGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fb923c" />
                        <stop offset="100%" stopColor="#f97316" />
                      </linearGradient>
                      <linearGradient id="solarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1e40af" />
                        <stop offset="100%" stopColor="#1e3a8a" />
                      </linearGradient>
                    </defs>
                  </svg>
                </motion.div>
                
                {/* Floating Energy Particles */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                    style={{
                      left: `${20 + i * 15}%`,
                      top: `${30 + (i % 2) * 40}%`,
                    }}
                    animate={{
                      y: [0, -20, 0],
                      opacity: [0.3, 1, 0.3],
                      scale: [0.8, 1.2, 0.8],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.5,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="beneficios" className="py-24 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Por que escolher energia solar?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Invista no futuro sustentável e transforme sua casa em uma fonte de economia e valor
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                title: "Economia Imediata",
                description: "Reduza sua conta de luz em até 95% desde o primeiro mês de instalação. Investimento com retorno garantido.",
                color: "from-green-400 to-emerald-500"
              },
              {
                icon: Leaf,
                title: "Energia Limpa",
                description: "100% renovável e sustentável. Contribua para um planeta mais limpo e reduza sua pegada de carbono.",
                color: "from-blue-400 to-cyan-500"
              },
              {
                icon: Home,
                title: "Valorização do Imóvel",
                description: "Aumente o valor do seu imóvel em até 15% com tecnologia solar moderna e certificada.",
                color: "from-purple-400 to-indigo-500"
              },
              {
                icon: Shield,
                title: "Proteção Contra Inflação",
                description: "Livre-se dos aumentos constantes na tarifa elétrica. Previsibilidade de custos por 25 anos.",
                color: "from-orange-400 to-red-500"
              },
              {
                icon: Zap,
                title: "Tecnologia Avançada",
                description: "Painéis de alta eficiência com inversores inteligentes e monitoramento em tempo real.",
                color: "from-teal-400 to-blue-500"
              },
              {
                icon: Shield,
                title: "Garantia Estendida",
                description: "25 anos de garantia de performance dos painéis solares com suporte técnico especializado.",
                color: "from-pink-400 to-rose-500"
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-600"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <motion.div 
                  className={`w-12 h-12 bg-gradient-to-br ${benefit.color} rounded-xl mb-6 flex items-center justify-center`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <benefit.icon className="w-6 h-6 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{benefit.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="como-funciona" className="py-24 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Como funciona nossa simulação
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Processo inteligente e preciso para calcular o potencial solar da sua casa
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Localização",
                description: "Informe seu CEP para análise precisa de irradiação solar e regulamentações locais",
                icon: "🌍"
              },
              {
                step: "02", 
                title: "Consumo Energético",
                description: "Analisamos seu perfil de consumo atual para dimensionamento otimizado do sistema",
                icon: "📊"
              },
              {
                step: "03",
                title: "Características do Imóvel",
                description: "Avaliamos tipo de telhado, área disponível e condições estruturais",
                icon: "🏠"
              },
              {
                step: "04",
                title: "Proposta Personalizada",
                description: "Receba simulação completa com economia, investimento e cronograma de instalação",
                icon: "📋"
              }
            ].map((step, index) => (
              <motion.div 
                key={index} 
                className="text-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="relative mb-8">
                  <motion.div 
                    className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-2xl flex items-center justify-center text-lg font-bold mx-auto mb-6 shadow-lg"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {step.step}
                  </motion.div>
                  <motion.div 
                    className="text-4xl mb-4"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, delay: index * 0.5 }}
                  >
                    {step.icon}
                  </motion.div>
                  {index < 3 && (
                    <motion.div 
                      className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-orange-200 to-transparent dark:from-orange-800"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      transition={{ duration: 1, delay: index * 0.2 + 0.5 }}
                      viewport={{ once: true }}
                    />
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to="/simulador"
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-12 py-4 rounded-lg font-semibold text-lg hover:shadow-xl transition-all duration-300 inline-flex items-center space-x-2"
              >
                <Zap className="w-5 h-5" />
                <span>Fazer Simulação Gratuita</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Mais de 10.000 famílias já economizam com energia solar
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Junte-se aos brasileiros que escolheram independência energética
            </p>
          </motion.div>

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
              <motion.div 
                key={index} 
                className="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-600"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.location}</p>
                    </div>
                    <div className="text-right">
                      <motion.div 
                        className="text-lg font-bold text-green-600"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                      >
                        {testimonial.savings}
                      </motion.div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">economia mensal</div>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">"{testimonial.testimonial}"</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-orange-500 to-red-500 text-white relative overflow-hidden">
        <motion.div 
          className="absolute inset-0 opacity-20"
          animate={{ 
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            repeatType: "reverse" 
          }}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px"
          }}
        />
        
        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <motion.h2 
            className="text-4xl lg:text-5xl font-bold mb-8"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Pronto para economizar na conta de luz?
          </motion.h2>
          
          <motion.p 
            className="text-xl mb-12 opacity-90 leading-relaxed"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Faça sua simulação gratuita agora e descubra quanto você pode economizar 
            com energia solar. Sem compromisso, resultado em 2 minutos.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to="/simulador"
                className="bg-white text-orange-600 px-12 py-4 rounded-lg font-bold text-lg hover:shadow-xl transition-all duration-300 inline-flex items-center space-x-2"
              >
                <Zap className="w-5 h-5" />
                <span>Calcular Minha Economia</span>
              </Link>
            </motion.div>
            
            <div className="flex items-center space-x-6 text-sm opacity-75">
              <span>✓ Gratuito</span>
              <span>✓ Sem cadastro</span>
              <span>✓ Resultado imediato</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-16 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">ISOTEC</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Transformando o futuro energético do Brasil com tecnologia solar de última geração.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="font-bold mb-6 text-lg">Soluções</h3>
              <ul className="space-y-3 text-gray-400">
                <li><Link to="/simulador" className="hover:text-white transition-colors">Simulador Solar</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Painéis Residenciais</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sistemas Comerciais</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Monitoramento</a></li>
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="font-bold mb-6 text-lg">Suporte</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Garantias</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Manutenção</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Financiamento</a></li>
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="font-bold mb-6 text-lg">Contato</h3>
              <ul className="space-y-3 text-gray-400">
                <li>(11) 99999-9999</li>
                <li>contato@isotec.com.br</li>
                <li>São Paulo, SP</li>
                <li>Seg-Sex: 8h às 18h</li>
              </ul>
            </motion.div>
          </div>
          
          <motion.div 
            className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-400">&copy; 2024 ISOTEC. Todos os direitos reservados.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacidade</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Termos</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookies</a>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  )
}