import React, { useState } from 'react'
import { supabase } from './supabaseClient'

function ResumeUpload({ user }) {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')

  const handleUpload = async () => {
    if (!file) { alert('Please select a file!'); return }
    if (!user) { alert('Please login first!'); return }

    setUploading(true)
    setError('')

    const fileName = `${user.id}-${Date.now()}-${file.name}`

    const { error } = await supabase.storage
      .from('resumes')
      .upload(fileName, file)

    if (error) {
      setError('Upload failed! ' + error.message)
    } else {
      const { data } = supabase.storage
        .from('resumes')
        .getPublicUrl(fileName)
      setUrl(data.publicUrl)
    }

    setUploading(false)
  }

  return (
    <div style={{ fontFamily: 'Arial', maxWidth: '500px', margin: '30px auto', padding: '30px', background: '#f5f5f5', borderRadius: '10px' }}>

      <h2 style={{ textAlign: 'center', color: '#2557a7' }}>📄 Upload Resume</h2>
      <p style={{ textAlign: 'center', color: 'gray' }}>Upload your resume as PDF</p>

      {!user && (
        <p style={{ textAlign: 'center', color: 'red' }}>⚠️ Please login first to upload your resume!</p>
      )}

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      {url && (
        <div style={{ background: 'white', padding: '15px', borderRadius: '8px', marginBottom: '15px', textAlign: 'center' }}>
          <p style={{ color: 'green', fontWeight: 'bold' }}>✅ Resume uploaded successfully!</p>
          <a href={url} target="_blank" rel="noreferrer" style={{ color: '#2557a7' }}>View your resume</a>
        </div>
      )}

      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={e => setFile(e.target.files[0])}
        style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}
      />

      {file && (
        <p style={{ color: '#555', marginBottom: '10px' }}>📎 Selected: {file.name}</p>
      )}

      <button
        onClick={handleUpload}
        disabled={uploading || !user}
        style={{ width: '100%', padding: '10px', background: user ? '#2557a7' : 'gray', color: 'white', border: 'none', borderRadius: '5px', cursor: user ? 'pointer' : 'not-allowed', fontSize: '16px' }}>
        {uploading ? '⏳ Uploading...' : '📤 Upload Resume'}
      </button>

    </div>
  )
}

export default ResumeUpload