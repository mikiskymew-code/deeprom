import { Component, ErrorInfo, ReactNode, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in React App:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: '2rem',
          maxWidth: '600px',
          margin: '4rem auto',
          backgroundColor: '#fff',
          borderRadius: '1rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          border: '1px solid #fee2e2',
          textAlign: 'center'
        }}>
          <div style={{
            width: '3.5rem',
            height: '3.5rem',
            backgroundColor: '#fef2f2',
            color: '#dc2626',
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '1.75rem',
            fontWeight: 'bold'
          }}>
            !
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>
            เกิดข้อผิดพลาดในการโหลดระบบ
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '1.5rem', lineHeight: '1.5' }}>
            ไม่สามารถแสดงผลหน้าเว็บได้ โปรดตรวจสอบการเชื่อมต่อหรือรีโหลดหน้าใหม่อีกครั้ง
          </p>
          {this.state.error && (
            <pre style={{
              textAlign: 'left',
              backgroundColor: '#f8fafc',
              padding: '1rem',
              borderRadius: '0.5rem',
              fontSize: '0.75rem',
              color: '#e11d48',
              overflowX: 'auto',
              marginBottom: '1.5rem',
              border: '1px solid #e2e8f0'
            }}>
              {this.state.error.toString()}
            </pre>
          )}
          <button
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#18181b',
              color: '#fbbf24',
              fontWeight: 800,
              padding: '0.75rem 1.5rem',
              borderRadius: '0.75rem',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            รีโหลดหน้าเว็บ
          </button>
        </div>
      );
    }

    const children = (this as unknown as { props: ErrorBoundaryProps }).props?.children;
    return children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
