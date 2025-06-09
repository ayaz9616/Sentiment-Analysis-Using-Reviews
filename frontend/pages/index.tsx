import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  return (
    <main style={{ textAlign: 'center', padding: '4rem' }}>
      <h1>📱 Smart Review Sentiment Analyzer</h1>
      <p>Upload customer reviews and visualize feature-based sentiment.</p>
      <button
        style={{
          marginTop: '2rem',
          padding: '10px 20px',
          fontSize: '1rem',
          cursor: 'pointer',
        }}
        onClick={() => router.push('/upload')}
      >
        Start Analysis
      </button>
    </main>
  );
}
