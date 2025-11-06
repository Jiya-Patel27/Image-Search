import { useEffect, useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;
const SERVER = import.meta.env.VITE_SERVER_URL;

function App() {
  const [user, setUser] = useState(null);
  const [term, setTerm] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState([]);
  const [history, setHistory] = useState([]);
  const [topSearches, setTopSearches] = useState([]);
  const [backendOnline, setBackendOnline] = useState(true);

  useEffect(() => {
    async function initUser() {
      try {
        const res = await axios.get(`${SERVER}/auth/current_user`);
        setUser(res.data.user || null);
        if (res.data.user) fetchHistory();
        setBackendOnline(true);
      } catch (e) {
        console.warn("Backend unreachable (user):", e.message);
        setBackendOnline(false);
        setUser(null);
      }
    }
    initUser();
    fetchTopSearches();
  }, []);

  async function fetchHistory() {
    try {
      const res = await axios.get(`${SERVER}/api/history`);
      setHistory(res.data);
    } catch (err) {
      console.error("Error loading history", err);
    }
  }

  async function fetchTopSearches() {
    try {
      const res = await axios.get(`${SERVER}/api/top-searches`);
      setTopSearches(res.data);
    } catch (err) {
      console.error("Error loading top searches", err);
    }
  }

  async function handleSearch(e) {
    e.preventDefault();
    if (!user) return alert("Please login first.");
    if (!term.trim()) return;

    const res = await axios.post(`${SERVER}/api/search`, { term });
    setResults(res.data.results || []);
    fetchHistory();
  }

  function toggleSelect(url) {
    setSelected(prev =>
      prev.includes(url)
        ? prev.filter(u => u !== url)
        : [...prev, url]
    );
  }

  function login(provider) {
    window.location.href = `${SERVER}/auth/${provider}`;
  }

  function logout() {
    window.location.href = `${SERVER}/auth/logout`;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#3B82F6]/10 via-white to-[#EC4899]/10">
      <header className="flex flex-wrap justify-between items-center px-6 py-4 bg-white shadow-sm sticky top-0 z-10">
        <h1 className="text-2xl md:text-3xl font-bold text-[#3B82F6] tracking-tight">
          Image Search & Multi-select
        </h1>
        <div className="flex items-center gap-2 mt-2 md:mt-0">
          {user ? (
            <>
              <span className="text-sm text-gray-600">Hi, <b>{user.name}</b></span>
              <button
                onClick={logout}
                className="px-3 py-1 text-sm bg-[#EC4899] text-white rounded-lg hover:bg-[#EC4899]/80 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex flex-wrap gap-2">
              {["google", "github", "facebook"].map(p => (
                <button
                  key={p}
                  onClick={() => login(p)}
                  className="px-3 py-1 text-sm rounded-lg bg-[#3B82F6] text-white hover:bg-[#3B82F6]/80 capitalize transition"
                >
                  Login with {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Top Searches */}
        {topSearches.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <h2 className="font-semibold mb-2 text-gray-700">Top Searches:</h2>
            <div className="flex flex-wrap gap-2">
              {topSearches.map((t, i) => (
                <span
                  key={i}
                  className="bg-[#FBBF24]/20 text-[#FBBF24] font-medium px-3 py-1 rounded-full text-sm"
                >
                  {t.term} ({t.count})
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="flex flex-wrap gap-2 items-center mb-6"
        >
          <input
            type="text"
            value={term}
            onChange={e => setTerm(e.target.value)}
            placeholder="Search high-quality images..."
            className="flex grow px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#3B82F6]/80 transition"
          >
            Search
          </button>
        </form>

        {/* Search Info */}
        {results.length > 0 && (
          <p className="text-gray-600 mb-4">
            You searched for <b>{term}</b> — {results.length} results.
            <span className="ml-2 text-[#EC4899] font-medium">
              Selected: {selected.length} images
            </span>
          </p>
        )}

        {/* Image Grid */}
        {results.length > 0 && (
          <>
            <h3 className="text-gray-700 font-semibold mb-3">Images</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
              {results.map((img, idx) => {
                // ✅ use your backend’s key names (thumb, full, alt)
                const imgUrl = img?.thumb || img?.full || img?.thumbUrl;
                if (!imgUrl) {
                  console.warn("Missing image URL for result:", img);
                  return null;
                }

                return (
                  <div
                    key={idx}
                    className="relative group overflow-hidden rounded-xl shadow hover:shadow-md transition bg-white"
                  >
                    <img
                      src={imgUrl}
                      alt={img.alt || "image"}
                      className="w-full h-48 sm:h-56 md:h-64 object-cover"
                      loading="lazy"
                    />
                    <input
                      type="checkbox"
                      checked={selected.includes(imgUrl)}
                      onChange={() => toggleSelect(imgUrl)}
                      className="absolute top-2 left-2 h-5 w-5 text-brand-blue rounded border-gray-300 cursor-pointer z-10"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
                  </div>
                );
              })}
            </div>
          </>
        )}


        {/* History */}
        {user && history.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h2 className="font-semibold mb-2 text-gray-700">Your Search History</h2>
            <ul className="list-disc ml-4 text-sm space-y-1">
              {history.map((h, i) => (
                <li key={i}>
                  <span className="text-[#3B82F6] font-medium cursor-pointer hover:underline">
                    {h.term}
                  </span>{" "}
                  <span className="text-gray-500">
                    ({new Date(h.timestamp).toLocaleString()})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;







// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import SearchBox from "./components/SearchBox";
// import TopSearches from "./components/TopSearches";
// import History from "./components/History";
// import Grid from "./components/Grid";

// // Ensure cookies are sent in cross-origin requests
// axios.defaults.withCredentials = true;

// // ✅ Correct env access for Vite
// const SERVER = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

// export default function App() {
//   const [user, setUser] = useState(null);
//   const [results, setResults] = useState([]);
//   const [term, setTerm] = useState("");
//   const [selected, setSelected] = useState(new Set());
//   const [top, setTop] = useState([]);
//   const [history, setHistory] = useState([]);
//   const [backendOnline, setBackendOnline] = useState(true);

//   // ✅ Fixed async useEffect warning
//   useEffect(() => {
//     async function initUser() {
//       try {
//         const res = await axios.get(`${SERVER}/auth/current_user`);
//         setUser(res.data.user);
//         if (res.data.user) {
//           fetchHistory();
//         }
//         setBackendOnline(true);
//       } catch (e) {
//         console.warn("Backend unreachable (user):", e.message);
//         setBackendOnline(false);
//         setUser(null);
//         // if (e.response && e.response.status === 401) {
//         //   console.log("Not logged in.");
//         // } else {
//         //   console.warn("Network/back-end error:", e.message);
//         // }
//       }
//     }
//     initUser();
//   }, []);

//   useEffect(() => {
//     async function initTop() {
//       try {
//         const res = await axios.get(`${SERVER}/api/top-searches`);
//         setTop(res.data);
//         setBackendOnline(true);
//       } catch (e) {
//         console.warn("Backend unreachable (top-searches):", e.message);
//         setBackendOnline(false);
//       }
//     }
//     initTop();
//   }, []);

//   async function fetchHistory() {
//     try {
//       const res = await axios.get(`${SERVER}/api/history`);
//       setHistory(res.data);
//       setBackendOnline(true);
//     } catch (e) {
//       console.warn("Backend unreachable (history):", e.message);
//       setBackendOnline(false);
//       setHistory([]);
//     }
//   }

//   async function handleSearch(newTerm) {
//     if (!newTerm) return;
//     setTerm(newTerm);
//     try {
//       const res = await axios.post(`${SERVER}/api/search`, { term: newTerm });
//       setResults(res.data.results || []);
//       setSelected(new Set());
//       fetchTopSearches();
//       fetchHistory();
//       setBackendOnline(true);
//     } catch (e) {
//       console.warn("Backend unreachable (search):", e.message);
//       setBackendOnline(false);
//       setResults([]);
//     }
//   }

//   async function fetchTopSearches() {
//     try {
//       const res = await axios.get(`${SERVER}/api/top-searches`);
//       setTop(res.data);
//     } catch (e) {
//       console.warn("Failed fetching top searches:", e.message);
//       setTop([]);
//     }
//   }

//   function toggleSelect(id) {
//     const s = new Set(selected);
//     if (s.has(id)) s.delete(id);
//     else s.add(id);
//     setSelected(s);
//   }

//   function handleLogout() {
//     window.location.href = `${SERVER}/auth/logout`;
//   }

//   return (
//     <div style={{ padding: 20, fontFamily: "Arial, Helvetica, sans-serif" }}>
//       <header
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//       >
//         <h1>Image Search & Multi-select</h1>
//         <div>
//           {user ? (
//             <>
//               <span style={{ marginRight: 10 }}>Hi, {user.name}</span>
//               <button onClick={handleLogout}>Logout</button>
//             </>
//           ) : (
//             <>
//               <a href={`${SERVER}/auth/google`}>
//                 <button>Login with Google</button>
//               </a>
//               <a href={`${SERVER}/auth/github`} style={{ marginLeft: 8 }}>
//                 <button>Login with GitHub</button>
//               </a>
//               <a href={`${SERVER}/auth/facebook`} style={{ marginLeft: 8 }}>
//                 <button>Login with Facebook</button>
//               </a>
//             </>
//           )}
//         </div>
//       </header>

//       {/* 🧠 Show helpful warning when backend is unreachable */}
//       {!backendOnline && (
//         <div
//           style={{
//             background: "#fee",
//             color: "#a00",
//             padding: "10px 15px",
//             borderRadius: 8,
//             marginTop: 10,
//           }}
//         >
//           ⚠️ Cannot connect to backend ({SERVER}). Make sure the server is
//           running and CORS allows this origin.
//         </div>
//       )}

//       <TopSearches top={top} onClickTerm={handleSearch} />

//       <main style={{ display: "flex", gap: 20, marginTop: 20 }}>
//         <div style={{ flex: 1 }}>
//           <SearchBox onSearch={handleSearch} disabled={!user} />
//           <div style={{ marginTop: 10 }}>
//             You searched for <strong>{term || "-"}</strong> — {results.length}{" "}
//             results.
//           </div>
//           <div style={{ marginTop: 10 }}>Selected: {selected.size} images</div>
//           <Grid
//             results={results}
//             selected={selected}
//             toggleSelect={toggleSelect}
//           />
//         </div>

//         <aside style={{ width: 320 }}>
//           <History history={history} onClickTerm={handleSearch} />
//         </aside>
//       </main>
//     </div>
//   );
// }
