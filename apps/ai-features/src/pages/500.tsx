export default function ServerErrorPage() {
  return (
    <main style={styles.shell}>
      <section style={styles.card}>
        <div style={styles.icon}>500</div>
        <p style={styles.eyebrow}>Server error</p>
        <h1 style={styles.title}>The app could not finish this request</h1>
        <p style={styles.description}>
          Something failed on our side. Try again in a moment, or return home.
        </p>
        <a href='/' style={styles.link}>Go home</a>
      </section>
    </main>
  );
}

const styles = {
  shell: {
    minHeight: '100vh',
    display: 'grid',
    placeItems: 'center',
    background: '#f8fafc',
    padding: '24px',
    fontFamily: 'system-ui, sans-serif',
  },
  card: {
    width: '100%',
    maxWidth: '480px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    background: '#ffffff',
    padding: '24px',
  },
  icon: {
    display: 'grid',
    width: '44px',
    height: '44px',
    placeItems: 'center',
    borderRadius: '8px',
    background: '#fdecea',
    color: '#c62828',
    fontSize: '12px',
    fontWeight: 700,
  },
  eyebrow: {
    margin: '20px 0 0',
    color: '#2563eb',
    fontSize: '12px',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
  },
  title: {
    margin: '8px 0 0',
    color: '#0f172a',
    fontSize: '24px',
    lineHeight: 1.2,
  },
  description: {
    margin: '8px 0 0',
    color: '#64748b',
    fontSize: '14px',
    lineHeight: 1.6,
  },
  link: {
    display: 'inline-flex',
    height: '40px',
    alignItems: 'center',
    marginTop: '24px',
    borderRadius: '6px',
    background: '#2563eb',
    color: '#ffffff',
    padding: '0 16px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 600,
  },
};
