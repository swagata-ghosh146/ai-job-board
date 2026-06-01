import React, { useState } from 'react'

function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignup = () => {
    alert(`Account created for ${name}!`)
  }

  return (
    <div style={{ fontFamily: 'Arial', maxWidth: '400px', margin: '100px auto', padding: '30px', background: '#f5f5f5', borderRadius: '10px' }}>

      <h2 style={{ textAlign: 'center', color: '#2557a7' }}>✍️ Sign Up</h2>

      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={e => setName(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}
      />

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}
      />

      <input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}
      />

      <button
        onClick={handleSignup}
        style={{ width: '100%', padding: '10px', background: '#2557a7', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>
        Create Account
      </button>

      <p style={{ textAlign: 'center', marginTop: '15px' }}>
        Already have an account? <a href="/login" style={{ color: '#2557a7' }}>Login</a>
      </p>

    </div>
  )
}

export default Signup