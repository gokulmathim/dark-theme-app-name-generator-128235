import React, { useState, useEffect } from "react";
import "./App.css";

/**
 * PUBLIC_INTERFACE
 * Main App component for AI-powered app name generator.
 * Provides a modern, minimal UI to request and display generated names,
 * supports dark/light theme toggle, copy-to-clipboard, and smooth state UX.
 */
function App() {
  // Theme management
  const [theme, setTheme] = useState(() => {
    // Prefer system preference on first load
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }
    return "light";
  });
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Form state
  const [category, setCategory] = useState("app");
  const [styleTheme, setStyleTheme] = useState(""); // e.g., "creative", "funny"
  const [count, setCount] = useState(10); // default number of names

  // Results state
  const [names, setNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedIdx, setCopiedIdx] = useState(null);

  // PUBLIC_INTERFACE
  // Handles generating app names by calling backend
  async function handleGenerate(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setNames([]);
    setCopiedIdx(null);

    // You may need to change this endpoint if running in production!
    // By default, assume local CORS/dev proxy, or update as needed.
    const endpoint = "/generate-names";
    let payload = {
      n: count,
      category,
      ...(styleTheme ? { theme: styleTheme } : {}),
    };
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }
      const data = await response.json();
      if (Array.isArray(data.names)) {
        setNames(data.names);
      } else {
        setError("No names returned. Please try again.");
      }
      if (data.error) {
        setError(data.error);
      }
    } catch (err) {
      setError(
        err.message ||
          "Failed to communicate with the backend. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  // PUBLIC_INTERFACE
  // Handles copying an app name to clipboard
  const handleCopy = async (name, idx) => {
    try {
      await navigator.clipboard.writeText(name);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1200);
    } catch (e) {
      // Fallback for clipboard issues
      window.prompt("Copy to clipboard: Ctrl+C, Enter", name);
    }
  };

  // PUBLIC_INTERFACE
  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <div className="App">
      <header className="App-header">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
        <h1 style={{ marginBottom: 6, letterSpacing: "1.5px" }}>
          AI App Name Generator
        </h1>
        <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: 16 }}>
          Describe the style or category for your app name inspiration.
        </p>
        <form
          style={{
            margin: "32px 0 10px 0",
            width: "100%",
            maxWidth: 400,
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            gap: 16,
          }}
          onSubmit={handleGenerate}
        >
          <input
            type="text"
            placeholder="Category (e.g., app, fintech, game)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={inputStyle}
            disabled={loading}
            autoComplete="off"
            required
          />
          <input
            type="text"
            placeholder="Style or theme (e.g. creative, fun, minimal)"
            value={styleTheme}
            onChange={(e) => setStyleTheme(e.target.value)}
            style={inputStyle}
            autoComplete="off"
            disabled={loading}
          />
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <label htmlFor="count" style={{ fontWeight: 500, flex: "1 0 90px" }}>
              Number of names:
            </label>
            <input
              id="count"
              type="number"
              min={1}
              max={20}
              value={count}
              onChange={(e) =>
                setCount(
                  Math.max(1, Math.min(20, parseInt(e.target.value) || 10))
                )
              }
              style={{
                ...inputStyle,
                maxWidth: 64,
                textAlign: "right",
                padding: "8px 6px",
                fontSize: 16,
              }}
              disabled={loading}
              required
            />
            <button
              type="submit"
              style={buttonStyle}
              disabled={loading}
              aria-label="Generate names"
            >
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>
        </form>
        <section
          style={{
            margin: "30px 0 0 0",
            width: "100%",
            maxWidth: 440,
            minHeight: 80,
          }}
          aria-live="polite"
        >
          {error && (
            <div
              style={{
                color: "#E75252",
                background: "rgba(231,82,82,0.07)",
                border: "1px solid #E75252",
                borderRadius: 7,
                padding: "10px 16px",
                margin: "0 0 16px",
              }}
            >
              {error}
            </div>
          )}
          {names.length > 0 && (
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                textAlign: "left",
                display: "flex",
                flexDirection: "column",
                gap: 9,
              }}
            >
              {names.map((name, idx) => (
                <li
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "var(--bg-secondary)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "7px",
                    padding: "10px 20px",
                    fontFamily: "monospace",
                    fontSize: 19,
                    fontWeight: 600,
                  }}
                >
                  <span style={{ overflowWrap: "anywhere", flex: "1 1 auto" }}>
                    {name}
                  </span>
                  <button
                    onClick={() => handleCopy(name, idx)}
                    aria-label={`Copy ${name} to clipboard`}
                    style={{
                      ...copyButtonStyle,
                      background:
                        copiedIdx === idx
                          ? "var(--button-bg)"
                          : "transparent",
                      color:
                        copiedIdx === idx
                          ? "var(--button-text)"
                          : "var(--text-secondary)",
                      fontWeight: copiedIdx === idx ? 700 : 500,
                    }}
                  >
                    {copiedIdx === idx ? "✓ Copied" : "Copy"}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {!error && !loading && names.length === 0 && (
            <div
              style={{
                color: "var(--text-secondary)",
                padding: "14px 0",
                fontSize: 16,
                fontStyle: "italic",
              }}
            >
              No names yet. Enter criteria above and press Generate.
            </div>
          )}
        </section>
        <footer
          style={{
            marginTop: 36,
            fontSize: 14,
            color: "var(--text-secondary)",
            opacity: 0.82,
            letterSpacing: "0.05em",
            fontWeight: 400,
            paddingBottom: 16,
          }}
        >
          Powered by AI • <span style={{ fontWeight: 500 }}>Black &amp; White Minimal UI.</span>
        </footer>
      </header>
    </div>
  );
}

// --- Inline minimal, modern input/button styles to avoid external dependencies --
const inputStyle = {
  padding: "10px 15px",
  border: "1px solid var(--border-color)",
  borderRadius: "7px",
  fontSize: "17px",
  background: "var(--bg-primary)",
  color: "var(--text-primary)",
  outline: "none",
  marginBottom: 0,
  fontWeight: 400,
  transition: "border 0.2s",
};

const buttonStyle = {
  background: "var(--button-bg)",
  color: "var(--button-text)",
  fontWeight: 600,
  fontSize: "17px",
  border: "none",
  outline: "none",
  padding: "10px 20px",
  borderRadius: "7px",
  cursor: "pointer",
  boxShadow: "0 2px 4px rgba(0,0,0,0.03)",
  transition: "background 0.15s, color 0.18s",
};

const copyButtonStyle = {
  border: "none",
  outline: "none",
  background: "transparent",
  color: "var(--text-secondary)",
  cursor: "pointer",
  padding: "6px 12px",
  borderRadius: "6px",
  fontSize: "14px",
  fontWeight: 600,
  marginLeft: "12px",
  transition: "background 0.15s, color 0.18s",
};

export default App;
