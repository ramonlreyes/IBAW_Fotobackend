import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './features/authentication';
import { AlbumProvider } from './shared/services/albumContext';
import { HomePage } from './features/home';
import { LoginPage } from './features/authentication';
import { AlbumsPage } from './features/albums';


function App() {
  return (
    <div>
      <AuthProvider>
        <AlbumProvider>
          <Router>
          <div className='App'>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/:category" element={<HomePage />} />
              <Route path="/album/:albumId" element={<AlbumsPage />} />
            </Routes>
          </div>
        </Router>
        </AlbumProvider>
      </AuthProvider>
    </div>
  )
}

export default App
