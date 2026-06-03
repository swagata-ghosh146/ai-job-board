import React, { useState } from 'react'
import { supabase } from './supabaseClient'

function Signup({ onSignup }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSignup = async () => {
    setLoading(true)
    setError('')
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    })
    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  return (
    <div style={{ fontFamily: 'Arial', maxWidth: '400px', margin: '100px auto', padding: '30px', background: '#f5f5f5', borderRadius: '10px' }}>
      <h2 style={{ textAlign: 'center', color: '#2557a7' }}>✍️ Sign Up</h2>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      {success && <p style={{ color: 'green', textAlign: 'center' }}>✅ Account created! Please check your email to confirm.</p>}
      <input type="text" placeholder="Enter your name" value={name} onChange={e => setName(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
      <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
      <input type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
      <button onClick={handleSignup}
        style={{ width: '100%', padding: '10px', background: '#2557a7', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>
        {loading ? 'Creating account...' : 'Create Account'}
      </button>
    </div>
  )
}

export default Signup