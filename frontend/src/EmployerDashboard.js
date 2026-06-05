import React, { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

function EmployerDashboard({ user }) {
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState({})
  const [loading, setLoading] = useState(true)

 useEffect(() => {
    if (user) fetchMyJobs()
    else setLoading(false)
  }, [user])

  const fetchMyJobs = async () => {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('employer_email', user.email)
      .order('created_at', { ascending: false })

    if (error) console.log(error)
    else {
      setJobs(data)
      fetchApplications(data)
    }
    setLoading(false)
  }

  const fetchApplications = async (jobs) => {
    const appMap = {}
    for (const job of jobs) {
      const { data } = await supabase
        .from('applications')
        .select('*')
        .eq('job_id', job.id)
      appMap[job.id] = data || []
    }
    setApplications(appMap)
  }

  if (!user) {
    return <p style={{ textAlign: 'center', color: 'red' }}>⚠️ Please login first!</p>
  }

  return (
    <div style={{ fontFamily: 'Arial', maxWidth: '700px', margin: '30px auto', padding: '20px' }}>
      <h2 style={{ color: '#2557a7' }}>📊 Employer Dashboard</h2>
      <p style={{ color: 'gray' }}>Jobs you posted and their applications</p>

      {loading && <p>Loading...</p>}

      {!loading && jobs.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', background: '#f5f5f5', borderRadius: '10px' }}>
          <p style={{ fontSize: '18px' }}>You haven't posted any jobs yet!</p>
          <p style={{ color: 'gray' }}>Click Post Job to add your first job 😊</p>
        </div>
      )}

      {jobs.map(job => (
        <div key={job.id} style={{ background: '#f5f5f5', padding: '20px', borderRadius: '10px', marginBottom: '20px', borderLeft: '4px solid #2557a7' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: '0', color: '#2557a7' }}>{job.title}</h3>
            <span style={{ background: '#2557a7', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '13px' }}>
              {applications[job.id]?.length || 0} applicants
            </span>
          </div>
          <p style={{ margin: '5px 0', fontWeight: 'bold' }}>{job.company}</p>
          <p style={{ margin: '5px 0', color: 'gray' }}>📍 {job.location}</p>

          {applications[job.id]?.length > 0 && (
            <div style={{ marginTop: '15px' }}>
              <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>👥 Applicants:</p>
              {applications[job.id].map((app, i) => (
                <div key={i} style={{ background: 'white', padding: '10px', borderRadius: '5px', marginBottom: '5px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>📧 {app.user_email}</span>
                  <span style={{ color: 'gray', fontSize: '13px' }}>
                    {new Date(app.applied_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default EmployerDashboard