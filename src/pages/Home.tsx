import { Link } from 'react-router-dom'
import { Sun, SolarHouse } from '../components/illustrations'
import { MinimalistContainer, CenteredContent, FlexLayout } from '../components/layout'
import { HoverLiftButton, FloatingElement } from '../components/animations'
import { AnimatedPageWrapper } from '../components/animations/PageTransitions'

export default function Home() {
  return (
    <AnimatedPageWrapper>
      <MinimalistContainer className="solarsys-gradient">
        <FlexLayout 
          direction="col" 
          align="center" 
          justify="center" 
          className="min-h-screen"
        >
          <CenteredContent maxWidth="2xl" className="space-y-12">
            {/* Hero Section with Animated Sun */}
            <div className="relative">
              <FloatingElement amplitude={8} duration={4}>
                <Sun size="large" className="mx-auto mb-8" />
              </FloatingElement>
              
              <h1 className="text-6xl md:text-7xl font-bold solarsys-text-primary mb-4">
                Solar<span className="solarsys-text-accent">Sys</span>
              </h1>
              
              <p className="text-xl md:text-2xl solarsys-text-secondary max-w-2xl mx-auto leading-relaxed">
                Descubra se a energia solar é ideal para sua casa através de uma experiência visual e intuitiva
              </p>
            </div>

            {/* Illustration Section */}
            <div className="relative py-8">
              <SolarHouse className="mx-auto" animate={true} />
            </div>

            {/* Action Buttons */}
            <FlexLayout 
              direction="col" 
              gap="lg" 
              className="w-full max-w-md mx-auto"
            >
              <HoverLiftButton className="w-full">
                <Link 
                  to="/simulador" 
                  className="btn-solarsys-primary w-full block text-center"
                >
                  Iniciar Simulação
                </Link>
              </HoverLiftButton>
              
              <HoverLiftButton className="w-full">
                <Link 
                  to="/painel" 
                  className="btn-solarsys-secondary w-full block text-center"
                >
                  Painel Administrativo
                </Link>
              </HoverLiftButton>
            </FlexLayout>

            {/* Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full">
              <div className="card-solarsys text-center">
                <div className="w-12 h-12 bg-solarsys-peach/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-solarsys-peach text-xl">⚡</span>
                </div>
                <h3 className="font-semibold solarsys-text-primary mb-2">Cálculo Preciso</h3>
                <p className="solarsys-text-secondary text-sm">
                  Baseado em dados reais de irradiação solar
                </p>
              </div>
              
              <div className="card-solarsys text-center">
                <div className="w-12 h-12 bg-solarsys-green/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-solarsys-green text-xl">🏠</span>
                </div>
                <h3 className="font-semibold solarsys-text-primary mb-2">Análise Completa</h3>
                <p className="solarsys-text-secondary text-sm">
                  Avaliação de viabilidade técnica e financeira
                </p>
              </div>
              
              <div className="card-solarsys text-center">
                <div className="w-12 h-12 bg-solarsys-peach/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-solarsys-peach text-xl">📱</span>
                </div>
                <h3 className="font-semibold solarsys-text-primary mb-2">Contato Direto</h3>
                <p className="solarsys-text-secondary text-sm">
                  Conexão imediata via WhatsApp
                </p>
              </div>
            </div>
          </CenteredContent>
        </FlexLayout>
      </MinimalistContainer>
    </AnimatedPageWrapper>
  )
}