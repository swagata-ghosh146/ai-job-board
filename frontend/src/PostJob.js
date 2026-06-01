import React, { useState } from 'react'
import { supabase } from './supabaseClient'

function PostJob({ onJobPosted }) {
  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [location, setLocation] = useState('')
  const [skills, setSkills] = useState('')
  const [description, setDescription] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async () => {
    if (!title || !company || !location || !skills) {
      alert('Please fill all fields!')
      return
    }

    const { error } = await supabase.from('jobs').insert([
      { title, company, location, skills, description }
    ])

    if (error) {
      alert('Error posting job!')
      console.log(error)
    } else {
      setSuccess(true)
      setSuccess(true)
setTimeout(() => { onJobPosted() }, 1500)
      setTitle('')
      setCompany('')
      setLocation('')
      setSkills('')
      setDescription('')
    }
  }

  return (
    <div style={{ fontFamily: 'Arial', maxWidth: '500px', margin: '30px auto', padding: '30px', background: '#f5f5f5', borderRadius: '10px' }}>

      <h2 style={{ textAlign: 'center', color: '#2557a7' }}>📝 Post a Job</h2>

      {success && <p style={{ textAlign: 'center', color: 'green', fontWeight: 'bold' }}>✅ Job posted successfully!</p>}

      <input type="text" placeholder="Job Title" value={title} onChange={e => setTitle(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }} />

      <input type="text" placeholder="Company Name" value={company} onChange={e => setCompany(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }} />

      <input type="text" placeholder="Location (e.g. Remote, Bangalore)" value={location} onChange={e => setLocation(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }} />

      <input type="text" placeholder="Skills (e.g. React, Node.js)" value={skills} onChange={e => setSkills(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }} />

      <textarea placeholder="Job Description" value={description} onChange={e => setDescription(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box', height: '100px' }} />

      <button onClick={handleSubmit}
        style={{ width: '100%', padding: '10px', background: '#2557a7', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>
        Post Job
      </button>

    </div>
  )
}

export default PostJob