import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import "./index.css";

function LandingPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const name = params.get("name");
  const email = params.get("email");
  const picture = params.get("picture");
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
  const googleAuthUrl = `${apiBaseUrl}/auth/google`;

  const startGoogleAuth = () => {
    window.location.href = googleAuthUrl;
  };

  return (
    <main className="shell">
      <section className="hero-card">
        <p className="eyebrow">Course Builder</p>
        <h1>Build courses with a clean Google sign-in entry point.</h1>
        <p className="lede">
          This frontend starts the Google OAuth 2.0 flow through your Express backend.
          Sign in first, then attach course creation, dashboard, and content generation.
        </p>

        <div className="actions">
          <button className="google-button" onClick={startGoogleAuth} type="button">
            Continue With Google
          </button>
        </div>

        <div className="meta-panel">
          <div>
            <span className="meta-label">OAuth start URL</span>
            <strong>{googleAuthUrl}</strong>
          </div>
          <div>
            <span className="meta-label">Next frontend work</span>
            <strong>Dashboard, courses, editor</strong>
          </div>
        </div>

        {name || email ? (
          <div className="profile-card">
            {picture ? (
              <img alt={name || "Google profile"} className="avatar" src={picture} />
            ) : null}
            <div>
              <span className="meta-label">Signed in as</span>
              <strong>{name || "Unknown user"}</strong>
              <div className="profile-copy">{email || "No email returned"}</div>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}

function AuthCallbackPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const name = params.get("name");
  const email = params.get("email");
  const picture = params.get("picture");

  return (
    <main className="shell">
      <section className="hero-card callback-card">
        <p className="eyebrow">OAuth Callback</p>
        <h1>Google authentication returned to the app.</h1>
        <p className="lede">
          Your backend redirected the user back into the frontend after the Google OAuth
          flow completed.
        </p>

        <div className="meta-panel">
          <div>
            <span className="meta-label">Signed in as</span>
            <strong>{name || "Unknown user"}</strong>
          </div>
          <div>
            <span className="meta-label">Email</span>
            <strong>{email || "Unavailable"}</strong>
          </div>
        </div>

        {picture ? (
          <div className="profile-card">
            <img alt={name || "Google profile"} className="avatar" src={picture} />
            <div>
              <span className="meta-label">OAuth status</span>
              <strong>Authentication successful</strong>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LandingPage />} path="/" />
        <Route element={<AuthCallbackPage />} path="/auth/callback" />
      </Routes>
    </BrowserRouter>
  );
}
