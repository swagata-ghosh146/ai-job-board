import React, { useState } from 'react'
import Login from './Login'

const jobs = [
  { id: 1, title: 'Frontend Developer', company: 'Google', location: 'Remote', skills: 'React, CSS, JS' },
  { id: 2, title: 'Backend Developer', company: 'Amazon', location: 'Bangalore', skills: 'Node.js, MongoDB' },
  { id: 3, title: 'AI Engineer', company: 'OpenAI', location: 'Remote', skills: 'Python, ML, APIs' },
]

function App() {
  const [page, setPage] = useState('home')

  return (
    <div style={{ fontFamily: 'Arial', maxWidth: '800px', margin: '0 auto', padding: '20px' }}>

      {/* Navbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: '#2557a7', margin: 0 }}>🚀 AI Job Board</h1>
        <button
          onClick={() => setPage(page === 'home' ? 'login' : 'home')}
          style={{ background: '#2557a7', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '5px', cursor: 'pointer' }}>
          {page === 'home' ? 'Login' : 'Home'}
        </button>
      </div>

      {/* Pages */}
      {page === 'home' && (
        <div>
          <p style={{ textAlign: 'center', color: 'gray' }}>Find your dream job powered by AI</p>
          {jobs.map(job => (
            <div key={job.id} style={{ background: '#f5f5f5', padding: '20px', borderRadius: '10px', marginBottom: '15px', borderLeft: '4px solid #2557a7' }}>
              <h2 style={{ margin: '0', color: '#2557a7' }}>{job.title}</h2>
              <p style={{ margin: '5px 0', fontWeight: 'bold' }}>{job.company}</p>
              <p style={{ margin: '5px 0', color: 'gray' }}>📍 {job.location}</p>
              <p style={{ margin: '5px 0' }}>🛠 {job.skills}</p>
              <button style={{ background: '#2557a7', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}>
                Apply Now
              </button>
            </div>
          ))}
        </div>
      )}

      {page === 'login' && <Login />}

    </div>
  )
}

export default App