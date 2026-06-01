import React, { useState, useEffect } from 'react'
import Login from './Login'
import Signup from './Signup'
import PostJob from './PostJob'
import { supabase } from './supabaseClient'

function App() {
  const [page, setPage] = useState('home')
  const [jobs, setJobs] = useState([])

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    const { data, error } = await supabase.from('jobs').select('*')
    if (error) console.log(error)
    else setJobs(data)
  }

  return (
    <div style={{ fontFamily: 'Arial', maxWidth: '800px', margin: '0 auto', padding: '20px' }}>

      {/* Navbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <h1 onClick={() => setPage('home')} style={{ color: '#2557a7', margin: 0, cursor: 'pointer' }}>🚀 AI Job Board</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setPage('postjob')} style={{ background: page === 'postjob' ? '#2557a7' : 'white', color: page === 'postjob' ? 'white' : '#2557a7', border: '1px solid #2557a7', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer' }}>Post Job</button>
          <button onClick={() => setPage('login')} style={{ background: page === 'login' ? '#2557a7' : 'white', color: page === 'login' ? 'white' : '#2557a7', border: '1px solid #2557a7', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer' }}>Login</button>
          <button onClick={() => setPage('signup')} style={{ background: page === 'signup' ? '#2557a7' : 'white', color: page === 'signup' ? 'white' : '#2557a7', border: '1px solid #2557a7', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer' }}>Sign Up</button>
        </div>
      </div>

      {/* Pages */}
      {page === 'home' && (
        <div>
          <p style={{ textAlign: 'center', color: 'gray' }}>Find your dream job powered by AI</p>
          {jobs.length === 0 && <p style={{ textAlign: 'center' }}>Loading jobs...</p>}
          {jobs.map(job => (
            <div key={job.id} style={{ background: '#f5f5f5', padding: '20px', borderRadius: '10px', marginBottom: '15px', borderLeft: '4px solid #2557a7' }}>
              <h2 style={{ margin: '0', color: '#2557a7' }}>{job.title}</h2>
              <p style={{ margin: '5px 0', fontWeight: 'bold' }}>{job.company}</p>
              <p style={{ margin: '5px 0', color: 'gray' }}>📍 {job.location}</p>
              <p style={{ margin: '5px 0' }}>🛠 {job.skills}</p>
              <p style={{ margin: '5px 0', color: '#555' }}>{job.description}</p>
              <button style={{ background: '#2557a7', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}>Apply Now</button>
            </div>
          ))}
        </div>
      )}

      {page === 'login' && <Login />}
      {page === 'signup' && <Signup />}
      {page === 'postjob' && <PostJob onJobPosted={() => { fetchJobs(); setPage('home'); }} />}

    </div>
  )
}

export default App