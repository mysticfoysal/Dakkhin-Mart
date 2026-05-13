import React from 'react';

export default function AboutPage() {
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
          <h1 style={{ marginBottom: '12px' }}>About দক্ষিণের স্বাদ</h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)' }}>Premium Coastal Products from Bangladesh</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container" style={{ padding: '72px 0' }}>
        {/* Story Section */}
        <section style={{ marginBottom: '72px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
            <div>
              <h2 style={{ marginBottom: '24px', fontSize: '32px' }}>Our Story</h2>
              <p style={{ fontSize: '16px', color: 'var(--text-mid)', lineHeight: '1.8', marginBottom: '16px' }}>
                দক্ষিণের স্বাদ was born from a simple passion: bringing authentic coastal products from Bangladesh's richest regions directly to your table. We started in 2020 with a mission to preserve traditional food heritage while supporting local fishermen and honey farmers.
              </p>
              <p style={{ fontSize: '16px', color: 'var(--text-mid)', lineHeight: '1.8', marginBottom: '16px' }}>
                Our name, "দক্ষিণের স্বাদ" (Taste of the South), represents the essence of Khulna, Barisal, and Sundarbans - regions known for their pristine waters, lush forests, and exceptional food products.
              </p>
              <p style={{ fontSize: '16px', color: 'var(--text-mid)', lineHeight: '1.8' }}>
                Today, we serve thousands of families across Bangladesh, providing fresh honey, premium seafood, and authentic local groceries that taste the way nature intended.
              </p>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, var(--green-pale) 0%, var(--green-light) 100%)',
              borderRadius: 'var(--radius)',
              padding: '60px',
              textAlign: 'center',
              fontSize: '120px'
            }}>
              🌍
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section style={{ marginBottom: '72px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
            <div style={{
              background: 'linear-gradient(135deg, var(--green-light) 0%, var(--green-mid) 100%)',
              borderRadius: 'var(--radius)',
              padding: '60px',
              textAlign: 'center',
              fontSize: '120px',
              color: 'white'
            }}>
              🎯
            </div>
            <div>
              <h2 style={{ marginBottom: '24px', fontSize: '32px' }}>Our Mission</h2>
              <ul style={{ fontSize: '16px', color: 'var(--text-mid)', lineHeight: '1.8', listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '16px', paddingLeft: '32px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>✅</span>
                  <strong>Quality First:</strong> Every product undergoes strict quality checks before delivery
                </li>
                <li style={{ marginBottom: '16px', paddingLeft: '32px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>✅</span>
                  <strong>Fair Pricing:</strong> Direct relationships with producers mean better prices for you
                </li>
                <li style={{ marginBottom: '16px', paddingLeft: '32px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>✅</span>
                  <strong>Community Support:</strong> We help local fishermen and farmers grow their businesses
                </li>
                <li style={{ marginBottom: '16px', paddingLeft: '32px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>✅</span>
                  <strong>Fast Delivery:</strong> From our warehouse to your table in hours, not days
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section style={{ marginBottom: '72px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '48px', fontSize: '32px' }}>Our Core Values</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            {[
              { icon: '🌱', title: 'Authenticity', desc: 'No artificial additives, just pure products' },
              { icon: '⚡', title: 'Speed', desc: 'Lightning-fast delivery across Bangladesh' },
              { icon: '🤝', title: 'Trust', desc: 'Transparent, honest business practices' },
              { icon: '🌍', title: 'Sustainability', desc: 'Supporting local communities and environment' }
            ].map((val, idx) => (
              <div key={idx} style={{
                background: 'var(--green-pale)',
                borderRadius: 'var(--radius)',
                padding: '32px 24px',
                textAlign: 'center',
                border: '1px solid var(--border)'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>{val.icon}</div>
                <h3 style={{ fontSize: '18px', marginBottom: '8px', color: 'var(--text-dark)' }}>{val.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-light)' }}>{val.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* By The Numbers */}
        <section style={{ marginBottom: '72px', background: 'var(--green-pale)', padding: '48px', borderRadius: 'var(--radius)' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '48px', fontSize: '32px' }}>By The Numbers</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '40px', fontWeight: '700', color: 'var(--green-mid)', marginBottom: '8px' }}>12,000+</div>
              <div style={{ fontSize: '16px', color: 'var(--text-mid)' }}>Happy Customers</div>
            </div>
            <div>
              <div style={{ fontSize: '40px', fontWeight: '700', color: 'var(--green-mid)', marginBottom: '8px' }}>250+</div>
              <div style={{ fontSize: '16px', color: 'var(--text-mid)' }}>Daily Orders</div>
            </div>
            <div>
              <div style={{ fontSize: '40px', fontWeight: '700', color: 'var(--green-mid)', marginBottom: '8px' }}>1000+</div>
              <div style={{ fontSize: '16px', color: 'var(--text-mid)' }}>Tons Delivered</div>
            </div>
            <div>
              <div style={{ fontSize: '40px', fontWeight: '700', color: 'var(--green-mid)', marginBottom: '8px' }}>4.8★</div>
              <div style={{ fontSize: '16px', color: 'var(--text-mid)' }}>Average Rating</div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section style={{ marginBottom: '72px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '48px', fontSize: '32px' }}>Meet Our Team</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            {[
              { emoji: '👨‍💼', name: 'আবদুল হামিদ', role: 'Founder & CEO', desc: 'Passionate about coastal products and community support' },
              { emoji: '👩‍💼', name: 'নাজমা আক্তার', role: 'Operations Head', desc: 'Ensures quality and on-time delivery every single day' },
              { emoji: '👨‍💼', name: 'করিম সাহেব', role: 'Head of Sourcing', desc: 'Direct relationships with 100+ local producers' },
              { emoji: '👩‍💼', name: 'ফারিয়া খান', role: 'Customer Care', desc: 'Always here to help with any questions or concerns' }
            ].map((member, idx) => (
              <div key={idx} style={{
                background: 'white',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: '24px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '60px', marginBottom: '12px' }}>{member.emoji}</div>
                <h3 style={{ fontSize: '16px', marginBottom: '4px', color: 'var(--text-dark)' }}>{member.name}</h3>
                <p style={{ fontSize: '13px', color: 'var(--green-mid)', fontWeight: '600', marginBottom: '8px' }}>{member.role}</p>
                <p style={{ fontSize: '13px', color: 'var(--text-light)' }}>{member.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section style={{ textAlign: 'center', padding: '48px', background: 'linear-gradient(135deg, var(--green-mid) 0%, var(--green-dark) 100%)', borderRadius: 'var(--radius)', color: 'white' }}>
          <h2 style={{ marginBottom: '16px', color: 'white' }}>Ready to Experience Premium Coastal Products?</h2>
          <p style={{ marginBottom: '24px', color: 'rgba(255,255,255,0.8)', maxWidth: '500px', margin: '0 auto 24px' }}>
            Join thousands of satisfied customers enjoying fresh, authentic products delivered right to their doorstep.
          </p>
          <a href="/shop" className="btn btn-gold btn-lg">Shop Now</a>
        </section>
      </div>
    </div>
  );
}
