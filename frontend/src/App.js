import React, { useState, useEffect } from 'react'
import Login from './Login'
import Signup from './Signup'
import PostJob from './PostJob'
import ResumeMatch from './ResumeMatch'
import ResumeUpload from './ResumeUpload'
import { supabase } from './supabaseClient'

function App() {
  const [page, setPage] = useState('home')
  const [jobs, setJobs] = useState([])
  const [user, setUser] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchJobs()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setUser(session.user)
    })
  }, [])

  const fetchJobs = async () => {
    const { data, error } = await supabase.from('jobs').select('*')
    if (error) console.log(error)
    else setJobs(data)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setPage('home')
  }

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.company.toLowerCase().includes(search.toLowerCase()) ||
    job.skills.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ fontFamily: 'Arial', maxWidth: '800px', margin: '0 auto', padding: '20px' }}>

      {/* Navbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <h1 onClick={() => setPage('home')} style={{ color: '#2557a7', margin: 0, cursor: 'pointer' }}>🚀 AI Job Board</h1>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button onClick={() => setPage('postjob')} style={{ background: page === 'postjob' ? '#2557a7' : 'white', color: page === 'postjob' ? 'white' : '#2557a7', border: '1px solid #2557a7', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer' }}>Post Job</button>
          <button onClick={() => setPage('resumematch')} style={{ background: page === 'resumematch' ? '#2557a7' : 'white', color: page === 'resumematch' ? 'white' : '#2557a7', border: '1px solid #2557a7', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer' }}>🤖 Match</button>
          <button onClick={() => setPage('resumeupload')} style={{ background: page === 'resumeupload' ? '#2557a7' : 'white', color: page === 'resumeupload' ? 'white' : '#2557a7', border: '1px solid #2557a7', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer' }}>📄 Resume</button>
          {user ? (
            <>
              <span style={{ color: '#2557a7', fontWeight: 'bold' }}>👋 {user.email}</span>
              <button onClick={handleLogout} style={{ background: 'red', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer' }}>Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => setPage('login')} style={{ background: page === 'login' ? '#2557a7' : 'white', color: page === 'login' ? 'white' : '#2557a7', border: '1px solid #2557a7', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer' }}>Login</button>
              <button onClick={() => setPage('signup')} style={{ background: page === 'signup' ? '#2557a7' : 'white', color: page === 'signup' ? 'white' : '#2557a7', border: '1px solid #2557a7', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer' }}>Sign Up</button>
            </>
          )}
        </div>
      </div>

      {/* Pages */}
      {page === 'home' && (
        <div>
          <p style={{ textAlign: 'center', color: 'gray' }}>Find your dream job powered by AI</p>
          <input
            type="text"
            placeholder="🔍 Search by job title, company or skills..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '15px' }}
          />
          {filteredJobs.length === 0 && <p style={{ textAlign: 'center' }}>No jobs found! 😅</p>}
          {filteredJobs.map(job => (
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

      {page === 'login' && <Login onLogin={(user) => { setUser(user); setPage('home') }} />}
      {page === 'signup' && <Signup />}
      {page === 'postjob' && <PostJob onJobPosted={() => { fetchJobs(); setPage('home') }} />}
      {page === 'resumematch' && <ResumeMatch />}
      {page === 'resumeupload' && <ResumeUpload user={user} />}

    </div>
  )
}

export default App