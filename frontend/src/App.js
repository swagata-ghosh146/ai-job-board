import React, { useState, useEffect } from 'react'
import Login from './Login'
import Signup from './Signup'
import PostJob from './PostJob'
import ResumeMatch from './ResumeMatch'
import ResumeUpload from './ResumeUpload'
import MyApplications from './MyApplications'
import EmployerDashboard from './EmployerDashboard'
import { supabase } from './supabaseClient'

function App() {
  const [page, setPage] = useState('home')
  const [jobs, setJobs] = useState([])
  const [user, setUser] = useState(null)
  const [search, setSearch] = useState('')
  const [applied, setApplied] = useState([])
  const [darkMode, setDarkMode] = useState(false)
  const [saved, setSaved] = useState([])

  const theme = {
    bg: darkMode ? '#1a1a2e' : 'white',
    cardBg: darkMode ? '#16213e' : '#f5f5f5',
    text: darkMode ? 'white' : 'black',
    subText: darkMode ? '#aaa' : 'gray',
    border: darkMode ? '#0f3460' : '#ccc',
  }

  useEffect(() => {
    fetchJobs()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user)
        fetchApplications(session.user.id)
      }
    })
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]')
    setSaved(savedJobs)
  }, [])

  const fetchJobs = async () => {
    const { data, error } = await supabase.from('jobs').select('*')
    if (error) console.log(error)
    else setJobs(data)
  }

  const fetchApplications = async (userId) => {
    const { data } = await supabase.from('applications').select('job_id').eq('user_id', userId)
    if (data) setApplied(data.map(a => a.job_id))
  }

  const handleApply = async (job) => {
    if (!user) {
      alert('Please login first to apply!')
      setPage('login')
      return
    }
    if (applied.includes(job.id)) {
      alert('You already applied for this job!')
      return
    }
    const { error } = await supabase.from('applications').insert([{
      job_id: job.id,
      user_id: user.id,
      user_email: user.email
    }])
    if (error) {
      alert('Error applying!')
    } else {
      setApplied([...applied, job.id])
      alert(`✅ Successfully applied for ${job.title} at ${job.company}!`)
    }
  }

  const handleSave = (jobId) => {
    let newSaved
    if (saved.includes(jobId)) {
      newSaved = saved.filter(id => id !== jobId)
    } else {
      newSaved = [...saved, jobId]
    }
    setSaved(newSaved)
    localStorage.setItem('savedJobs', JSON.stringify(newSaved))
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setApplied([])
    setPage('home')
  }

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.company.toLowerCase().includes(search.toLowerCase()) ||
    job.skills.toLowerCase().includes(search.toLowerCase())
  )

  const savedJobs = jobs.filter(job => saved.includes(job.id))

  return (
    <div style={{ fontFamily: 'Arial', maxWidth: '800px', margin: '0 auto', padding: '20px', background: theme.bg, minHeight: '100vh', color: theme.text }}>

      {/* Navbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <h1 onClick={() => setPage('home')} style={{ color: '#2557a7', margin: 0, cursor: 'pointer' }}>🚀 AI Job Board</h1>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button onClick={() => setDarkMode(!darkMode)} style={{ background: darkMode ? 'white' : '#1a1a2e', color: darkMode ? 'black' : 'white', border: 'none', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer' }}>{darkMode ? '☀️ Light' : '🌙 Dark'}</button>
          <button onClick={() => setPage('postjob')} style={{ background: page === 'postjob' ? '#2557a7' : 'transparent', color: page === 'postjob' ? 'white' : '#2557a7', border: '1px solid #2557a7', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer' }}>Post Job</button>
          <button onClick={() => setPage('resumematch')} style={{ background: page === 'resumematch' ? '#2557a7' : 'transparent', color: page === 'resumematch' ? 'white' : '#2557a7', border: '1px solid #2557a7', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer' }}>🤖 Match</button>
          <button onClick={() => setPage('resumeupload')} style={{ background: page === 'resumeupload' ? '#2557a7' : 'transparent', color: page === 'resumeupload' ? 'white' : '#2557a7', border: '1px solid #2557a7', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer' }}>📄 Resume</button>
          <button onClick={() => setPage('saved')} style={{ background: page === 'saved' ? '#2557a7' : 'transparent', color: page === 'saved' ? 'white' : '#2557a7', border: '1px solid #2557a7', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer' }}>⭐ Saved {saved.length > 0 && `(${saved.length})`}</button>
          <button onClick={() => setPage('dashboard')} style={{ background: page === 'dashboard' ? '#2557a7' : 'transparent', color: page === 'dashboard' ? 'white' : '#2557a7', border: '1px solid #2557a7', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer' }}>📊 Dashboard</button>
          {user ? (
            <>
              <button onClick={() => setPage('myapplications')} style={{ background: page === 'myapplications' ? '#2557a7' : 'transparent', color: page === 'myapplications' ? 'white' : '#2557a7', border: '1px solid #2557a7', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer' }}>📋 My Jobs</button>
              <span style={{ color: '#2557a7', fontWeight: 'bold', fontSize: '13px' }}>👋 {user.email}</span>
              <button onClick={handleLogout} style={{ background: 'red', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer' }}>Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => setPage('login')} style={{ background: page === 'login' ? '#2557a7' : 'transparent', color: page === 'login' ? 'white' : '#2557a7', border: '1px solid #2557a7', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer' }}>Login</button>
              <button onClick={() => setPage('signup')} style={{ background: page === 'signup' ? '#2557a7' : 'transparent', color: page === 'signup' ? 'white' : '#2557a7', border: '1px solid #2557a7', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer' }}>Sign Up</button>
            </>
          )}
        </div>
      </div>

      {/* Pages */}
      {page === 'home' && (
        <div>
          <p style={{ textAlign: 'center', color: theme.subText }}>Find your dream job powered by AI</p>
          <input
            type="text"
            placeholder="🔍 Search by job title, company or skills..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: `1px solid ${theme.border}`, boxSizing: 'border-box', fontSize: '15px', background: theme.cardBg, color: theme.text }}
          />
          {filteredJobs.length === 0 && <p style={{ textAlign: 'center' }}>No jobs found! 😅</p>}
          {filteredJobs.map(job => (
            <div key={job.id} style={{ background: theme.cardBg, padding: '20px', borderRadius: '10px', marginBottom: '15px', borderLeft: '4px solid #2557a7' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h2 style={{ margin: '0', color: '#2557a7' }}>{job.title}</h2>
                <button onClick={() => handleSave(job.id)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>
                  {saved.includes(job.id) ? '⭐' : '☆'}
                </button>
              </div>
              <p style={{ margin: '5px 0', fontWeight: 'bold', color: theme.text }}>{job.company}</p>
              <p style={{ margin: '5px 0', color: theme.subText }}>📍 {job.location}</p>
              <p style={{ margin: '5px 0', color: theme.text }}>🛠 {job.skills}</p>
              <p style={{ margin: '5px 0', color: theme.subText }}>{job.description}</p>
              <button
                onClick={() => handleApply(job)}
                style={{ background: applied.includes(job.id) ? 'green' : '#2557a7', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}>
                {applied.includes(job.id) ? '✅ Applied' : 'Apply Now'}
              </button>
            </div>
          ))}
        </div>
      )}

      {page === 'saved' && (
        <div>
          <h2 style={{ color: '#2557a7' }}>⭐ Saved Jobs</h2>
          {savedJobs.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', background: theme.cardBg, borderRadius: '10px' }}>
              <p>No saved jobs yet!</p>
              <p style={{ color: theme.subText }}>Click the ☆ star on any job to save it 😊</p>
            </div>
          )}
          {savedJobs.map(job => (
            <div key={job.id} style={{ background: theme.cardBg, padding: '20px', borderRadius: '10px', marginBottom: '15px', borderLeft: '4px solid gold' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h2 style={{ margin: '0', color: '#2557a7' }}>{job.title}</h2>
                <button onClick={() => handleSave(job.id)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>⭐</button>
              </div>
              <p style={{ margin: '5px 0', fontWeight: 'bold', color: theme.text }}>{job.company}</p>
              <p style={{ margin: '5px 0', color: theme.subText }}>📍 {job.location}</p>
              <p style={{ margin: '5px 0', color: theme.text }}>🛠 {job.skills}</p>
              <button
                onClick={() => handleApply(job)}
                style={{ background: applied.includes(job.id) ? 'green' : '#2557a7', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}>
                {applied.includes(job.id) ? '✅ Applied' : 'Apply Now'}
              </button>
            </div>
          ))}
        </div>
      )}

      {page === 'login' && <Login onLogin={(user) => { setUser(user); fetchApplications(user.id); setPage('home') }} />}
      {page === 'signup' && <Signup />}
      {page === 'postjob' && <PostJob onJobPosted={() => { fetchJobs(); setPage('home') }} user={user} />}
      {page === 'resumematch' && <ResumeMatch />}
      {page === 'resumeupload' && <ResumeUpload user={user} />}
      {page === 'myapplications' && <MyApplications user={user} />}
      {page === 'dashboard' && <EmployerDashboard user={user} />}

    </div>
  )
}

export default App
