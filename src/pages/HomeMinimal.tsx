export default function HomeMinimal() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#16a34a' }}>SolarSys - Energia Solar</h1>
      <p>Descubra quanto você pode economizar com energia solar.</p>
      <a 
        href="/simulador" 
        style={{ 
          backgroundColor: '#16a34a', 
          color: 'white', 
          padding: '10px 20px', 
          textDecoration: 'none', 
          borderRadius: '5px',
          display: 'inline-block',
          marginTop: '20px'
        }}
      >
        Começar Simulação
      </a>
    </div>
  )
}