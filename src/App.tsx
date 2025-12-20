function App() {
  console.log('App component rendering...')
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f0f0f0',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <h1 style={{ color: '#2E7D32', marginBottom: '1rem' }}>
          🌞 SolarSys Test
        </h1>
        <p style={{ color: '#666', marginBottom: '1rem' }}>
          If you can see this, React is working!
        </p>
        <button 
          onClick={() => alert('Button clicked!')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#2E7D32',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Test Button
        </button>
      </div>
    </div>
  )
}

export default App
