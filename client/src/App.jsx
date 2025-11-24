import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, paddingTop: '80px' }}>
        {/* Hero Section */}
        <section style={{
          padding: '8rem 2rem',
          textAlign: 'center',
          background: 'radial-gradient(circle at 50% 50%, rgba(0, 240, 255, 0.1) 0%, transparent 50%)'
        }}>
          <div className="container">
            <h1 style={{
              fontSize: '4rem',
              marginBottom: '1.5rem',
              background: 'linear-gradient(to right, #fff, #a0a0b0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Connect. Mentor. <span style={{ color: 'var(--primary)', WebkitTextFillColor: 'var(--primary)' }}>Evolve.</span>
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 2rem' }}>
              The next-generation platform for campus networking, mentorship, and career growth.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button className="btn btn-primary">Get Started</button>
              <button className="btn btn-glass">Learn More</button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section style={{ padding: '4rem 2rem' }}>
          <div className="container">
            <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>Why CampusSphere?</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

              <div className="card">
                <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>AI Matchmaking</h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Smart algorithms connect you with the perfect alumni mentors based on your skills and goals.
                </p>
              </div>

              <div className="card">
                <h3 style={{ color: 'var(--secondary)', marginBottom: '1rem' }}>Opportunity Exchange</h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Exclusive job openings, internships, and research projects posted by alumni and faculty.
                </p>
              </div>

              <div className="card">
                <h3 style={{ color: 'var(--success)', marginBottom: '1rem' }}>Skill Passport</h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Showcase your verified skills, certificates, and achievements in a modern portfolio.
                </p>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
