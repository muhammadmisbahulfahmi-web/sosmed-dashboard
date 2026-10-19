
import { useEffect, useState, type FormEvent } from "react";
import "./App.css";

type Platform = "Instagram" | "TikTok" | "YouTube" | "X";

type SearchHistory = {
  id: string;
  platform: Platform;
  username: string;
  date: string;
};

const STORAGE_KEY = "sosmed-search-history";

export default function App() {
  const [platform, setPlatform] = useState<Platform>("Instagram");
  const [username, setUsername] = useState("");
  const [history, setHistory] = useState<SearchHistory[]>([]);
  const [message, setMessage] = useState("");
  const [activePage, setActivePage] = useState("Dashboard");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setHistory(JSON.parse(saved) as SearchHistory[]);
      }
    } catch {
      setHistory([]);
    }
  }, []);

  function saveHistory(items: SearchHistory[]) {
    setHistory(items);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      setMessage("Riwayat tidak dapat disimpan di browser ini.");
    }
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const profile = username.trim().replace(/^@+/, "");

    if (!profile) {
      setMessage("Masukkan username terlebih dahulu.");
      return;
    }

    const item: SearchHistory = {
      id: `${Date.now()}-${Math.random()}`,
      platform,
      username: profile,
      date: new Date().toLocaleString("id-ID"),
    };

    saveHistory([item, ...history].slice(0, 100));
    setMessage(
      `@${profile} dari ${platform} disimpan ke riwayat. Data profil asli belum diambil karena API belum terhubung.`
    );
    setActivePage("Cek Profil");
  }

  function clearHistory() {
    if (!window.confirm("Hapus seluruh riwayat pencarian?")) return;

    saveHistory([]);
    setMessage("Riwayat pencarian berhasil dihapus.");
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">S</div>
          <div>
            <h2>Sosmed Tools</h2>
            <span>PROFILE DASHBOARD</span>
          </div>
        </div>

        <div className="menu-label">MENU UTAMA</div>

        {["Dashboard", "Cek Profil", "Riwayat Pencarian"].map((page) => (
          <button
            type="button"
            key={page}
            className={`menu-item ${activePage === page ? "active" : ""}`}
            onClick={() => {
              setActivePage(page);
              setMessage("");
            }}
          >
            <span>
              {page === "Dashboard"
                ? "▦"
                : page === "Cek Profil"
                  ? "◎"
                  : "◷"}
            </span>
            <span>{page}</span>
          </button>
        ))}

        <div className="sidebar-bottom">
          <div className="status-dot" />
          <div>
            <strong>Mode Demo</strong>
            <p>API belum terhubung</p>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <span className="breadcrumb">Workspace / </span>
            <strong>{activePage}</strong>
          </div>
          <div className="user-avatar">ST</div>
        </header>

        <section className="content">
          {activePage === "Dashboard" && (
            <>
              <div className="welcome">
                <div>
                  <div className="eyebrow">SOCIAL MEDIA TOOLKIT</div>
                  <h1>Dashboard Sosmed</h1>
                  <p>Kelola riwayat pencarian profil dalam satu tempat.</p>
                </div>
                <div className="welcome-icon">✳</div>
              </div>

              <div className="stats">
                <article className="stat-card">
                  <div className="stat-icon purple">◎</div>
                  <span>Platform tersedia</span>
                  <strong>4</strong>
                  <small>Instagram, TikTok, YouTube, X</small>
                </article>

                <article className="stat-card">
                  <div className="stat-icon blue">⌕</div>
                  <span>Total riwayat</span>
                  <strong>{history.length}</strong>
                  <small>Disimpan di browser ini</small>
                </article>

                <article className="stat-card">
                  <div className="stat-icon green">✓</div>
                  <span>Status aplikasi</span>
                  <strong className="status-text">Online</strong>
                  <small>Antarmuka dashboard aktif</small>
                </article>
              </div>

              <section className="search-card">
                <div className="section-heading">
                  <div>
                    <h2>Mulai Pencarian</h2>
                    <p>Buka formulir untuk mencatat username profil.</p>
                  </div>
                </div>
                <button
                  className="primary-action"
                  onClick={() => setActivePage("Cek Profil")}
                >
                  Buka Cek Profil →
                </button>
              </section>
            </>
          )}

          {activePage === "Cek Profil" && (
            <section className="search-card">
              <div className="section-heading">
                <div>
                  <h2>Cek Profil Media Sosial</h2>
                  <p>
                    Masukkan username profil publik yang ingin diperiksa.
                  </p>
                </div>
                <span className="demo-badge">DEMO</span>
              </div>

              <form onSubmit={handleSearch}>
                <label htmlFor="platform">Pilih platform</label>
                <select
                  id="platform"
                  value={platform}
                  onChange={(event) =>
                    setPlatform(event.target.value as Platform)
                  }
                >
                  <option>Instagram</option>
                  <option>TikTok</option>
                  <option>YouTube</option>
                  <option>X</option>
                </select>

                <label htmlFor="username">Username profil</label>
                <div className="username-input">
                  <span>@</span>
                  <input
                    id="username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="contoh_username"
                    maxLength={100}
                  />
                </div>

                <button type="submit">⌕ &nbsp; Simpan Pencarian</button>
              </form>

              {message && (
                <div className="notice" role="status">
                  {message}
                </div>
              )}

              <div className="privacy-note">
                <span>ⓘ</span>
                <p>
                  Fitur ini menyimpan username ke riwayat lokal. Data profil
                  asli baru bisa diperoleh setelah API yang sesuai terhubung.
                </p>
              </div>
            </section>
          )}

          {activePage === "Riwayat Pencarian" && (
            <section className="search-card">
              <div className="section-heading">
                <div>
                  <h2>Riwayat Pencarian</h2>
                  <p>
                    {history.length} catatan tersimpan di browser ini.
                  </p>
                </div>

                {history.length > 0 && (
                  <button
                    type="button"
                    className="secondary-action"
                    onClick={clearHistory}
                  >
                    Hapus Semua
                  </button>
                )}
              </div>

              {message && (
                <div className="notice" role="status">{message}</div>
              )}

              {history.length === 0 ? (
                <p className="empty-state">
                  Belum ada riwayat. Buka Cek Profil untuk memulai.
                </p>
              ) : (
                <div className="history-list">
                  {history.map((item) => (
                    <article className="history-item" key={item.id}>
                      <div className="history-avatar">
                        {item.platform.slice(0, 1)}
                      </div>
                      <div className="history-info">
                        <strong>@{item.username}</strong>
                        <span>{item.platform}</span>
                        <small>{item.date}</small>
                      </div>
                      <button
                        type="button"
                        className="text-action"
                        onClick={() => {
                          setPlatform(item.platform);
                          setUsername(item.username);
                          setActivePage("Cek Profil");
                          setMessage("");
                        }}
                      >
                        Gunakan
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          <footer>
            Sosmed Tools © 2026 · Gunakan API resmi dan hormati privasi pengguna.
          </footer>
        </section>
      </main>
    </div>
  );
}
