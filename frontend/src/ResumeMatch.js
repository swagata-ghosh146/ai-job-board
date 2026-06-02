import React, { useState } from 'react'
import { supabase } from './supabaseClient'

function ResumeMatch() {
  const [skills, setSkills] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const matchJobs = async () => {
    if (!skills) {
      alert('Please enter your skills!')
      return
    }

    setLoading(true)
    setResults([])

    const { data: jobs } = await supabase.from('jobs').select('*')

    const userSkills = skills.toLowerCase().split(/[,\s]+/).filter(Boolean)

    const matched = jobs.map(job => {
      const jobSkills = job.skills.toLowerCase().split(/[,\s]+/).filter(Boolean)
      const matched = userSkills.filter(s => jobSkills.some(js => js.includes(s) || s.includes(js)))
      const score = Math.round((matched.length / jobSkills.length) * 100)
      const missing = jobSkills.filter(js => !userSkills.some(s => s.includes(js) || js.includes(s)))
      return {
        job: `${job.title} at ${job.company}`,
        score: Math.min(score, 100),
        reason: missing.length > 0 ? `Missing skills: ${missing.join(', ')}` : 'Great match! You have all required skills!',
        location: job.location
      }
    })

    matched.sort((a, b) => b.score - a.score)
    setResults(matched)
    setLoading(false)
  }

  return (
    <div style={{ fontFamily: 'Arial', maxWidth: '600px', margin: '30px auto', padding: '30px', background: '#f5f5f5', borderRadius: '10px' }}>

      <h2 style={{ textAlign: 'center', color: '#2557a7' }}>🤖 AI Resume Matcher</h2>
      <p style={{ textAlign: 'center', color: 'gray' }}>Enter your skills and get matched to the best jobs!</p>

      <textarea
        placeholder="Enter your skills (e.g. React, Node.js, Python, SQL...)"
        value={skills}
        onChange={e => setSkills(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box', height: '100px' }}
      />

      <button onClick={matchJobs}
        style={{ width: '100%', padding: '10px', background: '#2557a7', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>
        {loading ? '🤖 Matching...' : '🚀 Match My Skills'}
      </button>

      {results.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ color: '#2557a7' }}>Your Job Matches:</h3>
          {results.map((r, i) => (
            <div key={i} style={{ background: 'white', padding: '15px', borderRadius: '8px', marginBottom: '10px', borderLeft: `4px solid ${r.score >= 70 ? 'green' : r.score >= 40 ? 'orange' : 'red'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>{r.job}</strong>
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: r.score >= 70 ? 'green' : r.score >= 40 ? 'orange' : 'red' }}>{r.score}%</span>
              </div>
              <p style={{ margin: '5px 0', color: 'gray', fontSize: '13px' }}>📍 {r.location}</p>
              <p style={{ margin: '5px 0', color: '#555', fontSize: '14px' }}>{r.reason}</p>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default ResumeMatch