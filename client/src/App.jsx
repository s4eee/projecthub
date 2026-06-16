import React, { useState, useEffect } from 'react';

export default function App() {
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [activeTab, setActiveTab] = useState('notes');
  
  // State for editable notes
  const [notes, setNotes] = useState([
    "Need to learn how embedding models work — look into sentence-transformers library.",
    "Cosine similarity might be the right distance metric for clustering.",
    "Consider UMAP for dimensionality reduction before k-means clustering.",
    "Investigate vector databases — Pinecone or Weaviate could be useful here."
  ]);

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error("Error fetching projects:", err));
  }, []);

  const handleNoteChange = (index, value) => {
    const updatedNotes = [...notes];
    updatedNotes[index] = value;
    setNotes(updatedNotes);
  };

  return (
    <>
      <style>{`
        :root {
          --ph-cream: #F5F0EB; --ph-rose: #F2C4C4; --ph-sage: #C4DDD0; --ph-sky: #C4D9F2;
          --ph-lavender: #D4C4F2; --ph-peach: #F2D4C4; --ph-text: #5a5250; --ph-muted: #9a908c;
          --ph-white: #FDFAF8; --ph-radius: 18px;
          --ph-card-shadow: 4px 4px 12px rgba(180,160,150,0.18), -2px -2px 6px rgba(255,255,255,0.7);
          --ph-inset: inset 2px 2px 6px rgba(180,160,150,0.18), inset -2px -2px 4px rgba(255,255,255,0.6);
        }
        .ph-wrap { background: var(--ph-cream); min-height: 100vh; display: flex; font-family: system-ui, sans-serif; color: var(--ph-text); }
        .ph-sidebar { width: 200px; background: var(--ph-white); border-radius: 0 var(--ph-radius) var(--ph-radius) 0; padding: 24px 16px; display: flex; flex-direction: column; gap: 6px; box-shadow: var(--ph-card-shadow); flex-shrink: 0; }
        .ph-logo { font-size: 15px; font-weight: 500; color: var(--ph-text); padding: 0 8px 16px; border-bottom: 1px solid rgba(180,160,150,0.2); margin-bottom: 10px; display: flex; align-items: center; gap: 8px; }
        .ph-logo-dot { width: 22px; height: 22px; background: linear-gradient(135deg, #F2C4C4, #D4C4F2); border-radius: 8px; }
        .ph-nav-item { display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: 12px; font-size: 13px; color: var(--ph-muted); cursor: pointer; transition: all 0.15s; }
        .ph-nav-item.active { background: var(--ph-cream); color: var(--ph-text); font-weight: 500; box-shadow: var(--ph-inset); }
        .ph-main { flex: 1; padding: 24px 20px; overflow-y: auto; }
        .ph-topbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .ph-title { font-size: 18px; font-weight: 500; color: var(--ph-text); }
        .ph-btn-new { display: flex; align-items: center; gap: 6px; background: var(--ph-rose); color: #8a3a3a; border: none; border-radius: 12px; padding: 8px 16px; font-size: 13px; font-weight: 500; cursor: pointer; box-shadow: var(--ph-card-shadow); }
        .ph-projects-label { font-size: 13px; color: var(--ph-muted); margin-bottom: 12px; font-weight: 500; }
        .ph-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        .ph-card { background: var(--ph-white); border-radius: var(--ph-radius); padding: 18px; box-shadow: var(--ph-card-shadow); cursor: pointer; transition: transform 0.15s; }
        .ph-card:hover { transform: translateY(-2px); }
        .ph-card-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 10px; }
        .ph-card-icon { width: 36px; height: 36px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
        .ph-badge { font-size: 10px; font-weight: 500; padding: 3px 8px; border-radius: 20px; }
        .badge-building { background: var(--ph-sky); color: #2a5a8a; }
        .ph-card-name { font-size: 14px; font-weight: 500; color: var(--ph-text); margin-bottom: 6px; line-height: 1.3; }
        .ph-progress-track { height: 5px; background: var(--ph-cream); border-radius: 10px; margin-bottom: 10px; box-shadow: var(--ph-inset); overflow: hidden; }
        .ph-progress-bar { height: 100%; border-radius: 10px; transition: width 0.3s; }
        
        /* Workspace Styles */
        .ws { padding: 4px 0 0 0; }
        .ws-header { display: flex; align-items: center; gap: 12px; margin-bottom: 6px; }
        .ws-back { width: 32px; height: 32px; border-radius: 10px; background: var(--ph-white); box-shadow: var(--ph-card-shadow); display: flex; align-items: center; justify-content: center; color: var(--ph-muted); font-size: 16px; cursor: pointer; border: none; }
        .ws-name { font-size: 18px; font-weight: 500; color: var(--ph-text); }
        .ws-tabs { display: flex; gap: 4px; margin-bottom: 16px; background: var(--ph-white); border-radius: 14px; padding: 5px; box-shadow: var(--ph-card-shadow); width: fit-content; }
        .ws-tab { padding: 7px 14px; border-radius: 10px; font-size: 12px; font-weight: 500; color: var(--ph-muted); cursor: pointer; border: none; background: transparent; }
        .ws-tab.active { background: var(--ph-cream); color: var(--ph-text); box-shadow: var(--ph-inset); }
        .ws-body { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .ws-panel { background: var(--ph-white); border-radius: 18px; padding: 16px; box-shadow: var(--ph-card-shadow); }
        .ws-panel-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
        .ws-panel-title { font-size: 13px; font-weight: 500; color: var(--ph-text); display: flex; align-items: center; gap: 7px; }
        .ws-add-btn { width: 26px; height: 26px; border-radius: 9px; border: none; background: var(--ph-cream); box-shadow: var(--ph-inset); display: flex; align-items: center; justify-content: center; color: var(--ph-muted); font-size: 15px; cursor: pointer; }
        
        /* Editable Input Style */
        .ws-note-input { background: var(--ph-cream); border-radius: 12px; padding: 10px 12px; font-size: 12px; color: var(--ph-text); margin-bottom: 8px; line-height: 1.5; box-shadow: var(--ph-inset); border: none; width: 100%; resize: none; outline: none; font-family: inherit; }
      `}</style>

      <div className="ph-wrap">
        <div className="ph-sidebar">
          <div className="ph-logo">
            <div className="ph-logo-dot"></div> ProjectHub
          </div>
          <div className={`ph-nav-item ${!activeProject ? 'active' : ''}`} onClick={() => setActiveProject(null)}>Dashboard</div>
          <div className="ph-nav-item">Projects</div>
        </div>

        <div className="ph-main">
          {!activeProject ? (
            <>
              <div className="ph-topbar">
                <div className="ph-title">Good morning, Saee 👋</div>
                <button className="ph-btn-new">New project</button>
              </div>
              <div className="ph-projects-label">Your projects</div>
              <div className="ph-cards">
                {projects.map((project) => (
                  <div className="ph-card" key={project.id} onClick={() => setActiveProject(project)}>
                    <div className="ph-card-top">
                      <div className="ph-card-icon" style={{ background: 'var(--ph-sky)', color: '#2a5a8a' }}>🚀</div>
                      <span className="ph-badge badge-building">Building</span>
                    </div>
                    <div className="ph-card-name">{project.name}</div>
                    <div className="ph-progress-track">
                      <div className="ph-progress-bar" style={{ width: '45%', background: 'linear-gradient(90deg,#C4D9F2,#9bbfe8)' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="ws">
              <div className="ws-header">
                <button className="ws-back" onClick={() => setActiveProject(null)}>←</button>
                <div className="ws-name">{activeProject.name}</div>
              </div>
              
              <div className="ws-tabs">
                {['notes', 'links', 'ideas', 'diary', 'milestones'].map((tab) => (
                  <button key={tab} className={`ws-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <div className="ws-body">
                <div className="ws-panel">
                  <div className="ws-panel-head">
                    <div className="ws-panel-title">{activeTab.toUpperCase()}</div>
                    <button className="ws-add-btn">+</button>
                  </div>
                  {activeTab === 'notes' ? (
                    notes.map((note, index) => (
                      <textarea
                        key={index}
                        className="ws-note-input"
                        value={note}
                        onChange={(e) => handleNoteChange(index, e.target.value)}
                      />
                    ))
                  ) : (
                    <div style={{fontSize: '12px', color: 'var(--ph-muted)'}}>Content for {activeTab} section...</div>
                  )}
                </div>
                <div className="ws-panel">
                    <div className="ws-panel-title">Quick Overview</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}