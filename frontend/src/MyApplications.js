import React, { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

function MyApplications({ user }) {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    const { data, error } = await supabase
      .from('applications')
      .select('*, jobs(*)')
      .eq('user_id', user.id)
      .order('applied_at', { ascending: false })

    if (error) console.log(error)
    else setApplications(data)
    setLoading(false)
  }

  if (!user) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <p style={{ color: 'red' }}>⚠️ Please login to see your applications!</p>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: 'Arial', maxWidth: '700px', margin: '30px auto', padding: '20px' }}>
      <h2 style={{ color: '#2557a7' }}>📋 My Applications</h2>
      <p style={{ color: 'gray' }}>Jobs you have applied for</p>

      {loading && <p>Loading...</p>}

      {!loading && applications.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', background: '#f5f5f5', borderRadius: '10px' }}>
          <p style={{ fontSize: '18px' }}>You haven't applied to any jobs yet!</p>
          <p style={{ color: 'gray' }}>Go to home and click Apply Now on any job 😊</p>
        </div>
      )}

      {applications.map(app => (
        <div key={app.id} style={{ background: '#f5f5f5', padding: '20px', borderRadius: '10px', marginBottom: '15px', borderLeft: '4px solid green' }}>
          <h3 style={{ margin: '0', color: '#2557a7' }}>{app.jobs.title}</h3>
          <p style={{ margin: '5px 0', fontWeight: 'bold' }}>{app.jobs.company}</p>
          <p style={{ margin: '5px 0', color: 'gray' }}>📍 {app.jobs.location}</p>
          <p style={{ margin: '5px 0' }}>🛠 {app.jobs.skills}</p>
          <p style={{ margin: '5px 0', color: 'green', fontWeight: 'bold' }}>
            ✅ Applied on {new Date(app.applied_at).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  )
}

export default MyApplications