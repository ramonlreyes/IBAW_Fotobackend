import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './features/authentication';
import { AlbumProvider } from './shared/services/albumContext';
import { HomePage } from './features/home';
import { AuthPage } from './features/authentication';
import { AlbumsPage } from './features/albums';
import { AlbumDetailPage } from './features/albums';
import { AdminDashboard } from './features/authentication';


function App() {
  return (
    <div>
      <AuthProvider>
        <AlbumProvider>
          <Router>
          <div className='App'>
            <Routes>
              <Route path="/" element={<HomePage />} />s
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/:category" element={<AlbumsPage />} />
              <Route path="/album/:albumId" element={<AlbumDetailPage />} />
              <Route path='/admin' element={<AdminDashboard />} />
            </Routes>
          </div>
        </Router>
        </AlbumProvider>
      </AuthProvider>
    </div>
  )
}

export default App
