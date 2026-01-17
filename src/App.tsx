import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AppProvider } from './contexts/AppContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageRouter } from './components/LanguageRouter';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { GuestRoute } from './components/GuestRoute';
import { HomePage } from './pages/HomePage';
import { HomePageProtected } from './pages/HomePageProtected';
import { LoginPage } from './pages/LoginPage';
import { UsersPage } from './pages/UsersPage';
import { UserDetailPage } from './pages/UserDetailPage';
import { CreateUserPage } from './pages/CreateUserPage';
import { EditUserPage } from './pages/EditUserPage';
import { FacesPage } from './pages/FacesPage';
import { FaceDetailPage } from './pages/FaceDetailPage';
import { CreateFacePage } from './pages/CreateFacePage';
import { EditFacePage } from './pages/EditFacePage';
import { CreatePagePage } from './pages/CreatePagePage';
import { EditPagePage } from './pages/EditPagePage';
import { PageDetailPage } from './pages/PageDetailPage';
import { logger } from './utils/logger';
import { supportedLanguages } from './i18n/config';
import { getAllRouteTranslations } from './utils/routeTranslations';
import i18n from './i18n/config';
import './styles/toast.scss';

// Get all route translations for routing
const getRoutePaths = (englishRoute: string): string[] => {
  return getAllRouteTranslations(englishRoute, (key: string, options?: { lng?: string }) => {
    return i18n.t(key, { lng: options?.lng || 'en' });
  });
};

function AppContent() {
  logger.info('App component mounted');

  // Get all possible translations for each route
  const loginPaths = getRoutePaths('login');
  const homepagePaths = getRoutePaths('homepage');
  const usersPaths = getRoutePaths('users');
  const facesPaths = getRoutePaths('faces');
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated && <Sidebar />}
      {isAuthenticated && <Header />}
      <Routes>
        {/* Redirect root to default language */}
        <Route path="/" element={<Navigate to={`/${supportedLanguages[0]}`} replace />} />

        {/* Language-based routes */}
        <Route path="/:lang" element={<LanguageRouter />}>
          {/* Root route - redirect to login if not authenticated, to homepage if authenticated */}
          <Route
            index
            element={
              <ProtectedRoute redirectTo="login">
                <HomePage />
              </ProtectedRoute>
            }
          />

          {/* Login route with all translations - guest only */}
          {loginPaths.map((path) => (
            <Route
              key={path}
              path={path}
              element={
                <GuestRoute>
                  <LoginPage />
                </GuestRoute>
              }
            />
          ))}

          {/* Protected homepage route with all translations */}
          {homepagePaths.map((path) => (
            <Route
              key={path}
              path={path}
              element={
                <ProtectedRoute redirectTo="login">
                  <HomePageProtected />
                </ProtectedRoute>
              }
            />
          ))}

          {/* Protected users route with all translations */}
          {usersPaths.map((path) => (
            <Route
              key={path}
              path={path}
              element={
                <ProtectedRoute redirectTo="login">
                  <UsersPage />
                </ProtectedRoute>
              }
            />
          ))}

          {/* Protected user detail route - uses :id parameter */}
          {usersPaths.map((path) => (
            <Route
              key={`${path}/:id`}
              path={`${path}/:id`}
              element={
                <ProtectedRoute redirectTo="login">
                  <UserDetailPage />
                </ProtectedRoute>
              }
            />
          ))}

          {/* Protected user create route */}
          {usersPaths.map((path) => (
            <Route
              key={`${path}/create`}
              path={`${path}/create`}
              element={
                <ProtectedRoute redirectTo="login">
                  <CreateUserPage />
                </ProtectedRoute>
              }
            />
          ))}

          {/* Protected user edit route - uses :id parameter */}
          {usersPaths.map((path) => (
            <Route
              key={`${path}/:id/edit`}
              path={`${path}/:id/edit`}
              element={
                <ProtectedRoute redirectTo="login">
                  <EditUserPage />
                </ProtectedRoute>
              }
            />
          ))}

          {/* Protected faces route with all translations */}
          {facesPaths.map((path) => (
            <Route
              key={path}
              path={path}
              element={
                <ProtectedRoute redirectTo="login">
                  <FacesPage />
                </ProtectedRoute>
              }
            />
          ))}

          {/* Protected face detail route - uses :id parameter */}
          {facesPaths.map((path) => (
            <Route
              key={`${path}/:id`}
              path={`${path}/:id`}
              element={
                <ProtectedRoute redirectTo="login">
                  <FaceDetailPage />
                </ProtectedRoute>
              }
            />
          ))}

          {/* Protected face create route */}
          {facesPaths.map((path) => (
            <Route
              key={`${path}/create`}
              path={`${path}/create`}
              element={
                <ProtectedRoute redirectTo="login">
                  <CreateFacePage />
                </ProtectedRoute>
              }
            />
          ))}

          {/* Protected face edit route - uses :id parameter */}
          {facesPaths.map((path) => (
            <Route
              key={`${path}/:id/edit`}
              path={`${path}/:id/edit`}
              element={
                <ProtectedRoute redirectTo="login">
                  <EditFacePage />
                </ProtectedRoute>
              }
            />
          ))}

          {/* Protected page create route - uses :faceId parameter */}
          {facesPaths.map((path) => (
            <Route
              key={`${path}/:faceId/pages/create`}
              path={`${path}/:faceId/pages/create`}
              element={
                <ProtectedRoute redirectTo="login">
                  <CreatePagePage />
                </ProtectedRoute>
              }
            />
          ))}

          {/* Protected page detail route - uses :id parameter (must be before edit) */}
          <Route
            path="pages/:id"
            element={
              <ProtectedRoute redirectTo="login">
                <PageDetailPage />
              </ProtectedRoute>
            }
          />

          {/* Protected page edit route - uses :id parameter */}
          <Route
            path="pages/:id/edit"
            element={
              <ProtectedRoute redirectTo="login">
                <EditPagePage />
              </ProtectedRoute>
            }
          />

          {/* Redirect invalid routes to home */}
          <Route path="*" element={<Navigate to=".." replace />} />
        </Route>

        {/* Catch all - redirect to default language */}
        <Route path="*" element={<Navigate to={`/${supportedLanguages[0]}`} replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </BrowserRouter>
      </AuthProvider>
    </AppProvider>
  );
}

export default App;
