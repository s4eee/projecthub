import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      const response = await axios.post('/api/projects', { name, subtitle });
      setProjects([response.data, ...projects]);
      setName('');
      setSubtitle('');
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', fontFamily: 'sans-serif' }}>
      <header style={{ borderBottom: '2px solid #eee', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <h1>🚀 ProjectHub</h1>
        <p style={{ color: '#666' }}>Manage your cloud-hosted projects seamlessly</p>
      </header>

      <section style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <h3>Create a New Project</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Project Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Fintrace"
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Subtitle / Description</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g., Banking analytics tracker"
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <button type="submit" style={{ padding: '0.75rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            Deploy Project to Cloud
          </button>
        </form>
      </section>

      <section>
        <h3>Your Current Projects</h3>
        {loading ? (
          <p>Loading projects from Neon Cloud...</p>
        ) : projects.length === 0 ? (
          <p style={{ color: '#888', fontStyle: 'italic' }}>No projects found. Create your first one above!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {projects.map((project) => (
              <div key={project.id} style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '6px', backgroundColor: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0' }}>{project.name}</h4>
                  <span style={{ fontSize: '0.8rem', background: '#e2e8f0', padding: '0.2rem 0.6rem', borderRadius: '999px', fontWeight: 'bold' }}>
                    {project.status}
                  </span>
                </div>
                {project.subtitle && <p style={{ margin: '0 0 0.5rem 0', color: '#555' }}>{project.subtitle}</p>}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
