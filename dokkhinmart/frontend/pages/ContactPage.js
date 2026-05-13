import React, { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for contacting us! আমাদের সাথে যোগাযোগের জন্য ধন্যবাদ! We will reply soon.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div>
      {/* Page Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--green-dark) 0%, var(--green-mid) 100%)',
        color: 'white',
        padding: '60px 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{ marginBottom: '12px' }}>Contact Us</h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)' }}>We're here to help! Get in touch anytime.</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container" style={{ padding: '72px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
          {/* Contact Form */}
          <div>
            <h2 style={{ marginBottom: '32px', fontSize: '28px' }}>Send us a Message</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-dark)' }}>Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    fontSize: '14px',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-dark)' }}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    fontSize: '14px',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-dark)' }}>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+880 1700-000000"
                  value={formData.phone}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    fontSize: '14px',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-dark)' }}>Message</label>
                <textarea
                  name="message"
                  placeholder="Tell us what you think..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <h2 style={{ marginBottom: '32px', fontSize: '28px' }}>Get In Touch</h2>

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', fontSize: '18px' }}>
                <span style={{ fontSize: '24px' }}>📞</span> Phone
              </h3>
              <p style={{ color: 'var(--text-mid)', marginBottom: '8px' }}>
                <strong>Customer Support:</strong><br />
                +880 1700-000000
              </p>
              <p style={{ color: 'var(--text-mid)' }}>
                Available: 8 AM - 10 PM (Daily)
              </p>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', fontSize: '18px' }}>
                <span style={{ fontSize: '24px' }}>💬</span> WhatsApp
              </h3>
              <p style={{ color: 'var(--text-mid)', marginBottom: '12px' }}>
                Chat with us instantly for quick replies
              </p>
              <a href="https://wa.me/8801700000000" className="btn btn-outline" style={{ borderColor: '#25d366', color: '#25d366' }}>
                💬 Chat on WhatsApp
              </a>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', fontSize: '18px' }}>
                <span style={{ fontSize: '24px' }}>📧</span> Email
              </h3>
              <p style={{ color: 'var(--text-mid)' }}>
                <strong>General Inquiries:</strong><br />
                info@dokkhinmart.com
              </p>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', fontSize: '18px' }}>
                <span style={{ fontSize: '24px' }}>📍</span> Address
              </h3>
              <p style={{ color: 'var(--text-mid)', lineHeight: '1.8' }}>
                <strong>Khulna Office:</strong><br />
                Khulna City, Bangladesh<br /><br />
                <strong>Dhaka Office:</strong><br />
                Dhaka, Bangladesh
              </p>
            </div>

            {/* Social Links */}
            <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid var(--border)' }}>
              <h3 style={{ marginBottom: '16px', fontSize: '18px' }}>Follow Us</h3>
              <div style={{ display: 'flex', gap: '12px' }}>
                <a href="#" style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'var(--green-pale)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  transition: 'all 0.3s ease'
                }} onMouseOver={(e) => e.target.style.background = 'var(--green-mid)'} onMouseOut={(e) => e.target.style.background = 'var(--green-pale)'}>
                  📘
                </a>
                <a href="#" style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'var(--green-pale)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  transition: 'all 0.3s ease'
                }} onMouseOver={(e) => e.target.style.background = 'var(--green-mid)'} onMouseOut={(e) => e.target.style.background = 'var(--green-pale)'}>
                  📷
                </a>
                <a href="#" style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'var(--green-pale)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  transition: 'all 0.3s ease'
                }} onMouseOver={(e) => e.target.style.background = 'var(--green-mid)'} onMouseOut={(e) => e.target.style.background = 'var(--green-pale)'}>
                  📽️
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div style={{ marginTop: '72px' }}>
          <h2 style={{ marginBottom: '32px', fontSize: '28px', textAlign: 'center' }}>Business Hours</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
            {[
              { day: 'Monday - Friday', hours: '8:00 AM - 10:00 PM' },
              { day: 'Saturday - Sunday', hours: '9:00 AM - 10:00 PM' },
              { day: 'Holiday', hours: '10:00 AM - 8:00 PM' },
              { day: 'Emergency Orders', hours: 'Always Available' }
            ].map((schedule, idx) => (
              <div key={idx} style={{
                background: 'var(--green-pale)',
                borderRadius: 'var(--radius-sm)',
                padding: '24px',
                textAlign: 'center',
                border: '1px solid var(--border)'
              }}>
                <h4 style={{ color: 'var(--text-dark)', marginBottom: '8px' }}>{schedule.day}</h4>
                <p style={{ color: 'var(--green-mid)', fontWeight: '600', fontSize: '16px' }}>{schedule.hours}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
