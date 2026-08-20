import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllJobs, likeJob } from "../../api/jobApi";
import { applyForJob, getMyApplications } from "../../api/applicationApi";
import { useAuth } from "../../context/AuthContext";

const StudentDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const { logout } = useAuth();
    const navigate = useNavigate();

    // New State for UI
    const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' or 'applications'
    const [showModal, setShowModal] = useState(false);
    const [applyingJobId, setApplyingJobId] = useState(null);
    const [coverLetter, setCoverLetter] = useState("");
    const [cvFile, setCvFile] = useState(null);

    // Search Filters
    const [filters, setFilters] = useState({
        keyword: "",
        location: "",
        duration: ""
    });

    useEffect(() => {
        fetchData();
    }, []);

    const handleSearch = () => {
        setLoading(true);
        fetchData();
    };

    const fetchData = async () => {
        try {
            const [jobsRes, appsRes] = await Promise.all([
                getAllJobs(filters),
                getMyApplications(),
            ]);
            setJobs(jobsRes.data);
            setApplications(appsRes.data);
        } catch (err) {
            console.error("Error fetching data", err);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (jobId) => {
        try {
            await likeJob(jobId);
            setJobs(jobs.map(job => {
                if (job.id === jobId) {
                    const isNowLiked = !job.likedByCurrentUser;
                    return {
                        ...job,
                        likedByCurrentUser: isNowLiked,
                        likes: isNowLiked ? job.likes + 1 : job.likes - 1
                    };
                }
                return job;
            }));
        } catch (err) {
            alert("Failed to like job");
        }
    };

    // Open Modal
    const handleApplyClick = (jobId) => {
        setApplyingJobId(jobId);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setApplyingJobId(null);
        setCoverLetter("");
        setCvFile(null);
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setCvFile(e.target.files[0]);
        }
    };

    const handleSubmitApplication = async (e) => {
        e.preventDefault();

        if (!cvFile) {
            alert("Please upload your CV.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("cv", cvFile);
            formData.append("coverLetter", coverLetter);

            await applyForJob(applyingJobId, formData);

            alert("Application submitted successfully!");
            handleCloseModal();
            fetchData(); // Refresh data
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data) {
                alert(err.response.data);
            } else {
                alert("Failed to submit application");
            }
        }
    };

    const isApplied = (jobId) => {
        return applications.some(app => app.jobId === jobId || app.jobTitle === jobs.find(j => j.id === jobId)?.title);
    };

    return (
        <div className="container">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Student Portal</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => navigate('/student/profile')} className="btn-secondary" style={{ background: 'rgba(255,255,255,0.1)' }}>My Profile</button>
                    <button onClick={logout} className="btn-secondary">Logout</button>
                </div>
            </header>

            {/* Navigation Tabs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem' }}>
                <button
                    onClick={() => setActiveTab('jobs')}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        borderBottom: activeTab === 'jobs' ? '2px solid var(--primary)' : 'none',
                        color: activeTab === 'jobs' ? 'var(--primary)' : 'var(--text-muted)',
                        fontWeight: activeTab === 'jobs' ? 'bold' : 'normal',
                        cursor: 'pointer',
                        padding: '0.5rem 1rem',
                        fontSize: '1rem'
                    }}
                >
                    Job Posts
                </button>
                <button
                    onClick={() => setActiveTab('applications')}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        borderBottom: activeTab === 'applications' ? '2px solid var(--primary)' : 'none',
                        color: activeTab === 'applications' ? 'var(--primary)' : 'var(--text-muted)',
                        fontWeight: activeTab === 'applications' ? 'bold' : 'normal',
                        cursor: 'pointer',
                        padding: '0.5rem 1rem',
                        fontSize: '1rem'
                    }}
                >
                    Applied Jobs
                </button>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    {activeTab === 'jobs' && (
                        <>
                            {/* Search Bar */}
                            <div className="glass-card animate-fade-in" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'end' }}>
                                <div style={{ flex: 2, minWidth: '200px' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#ccc' }}>Search</label>
                                    <input
                                        placeholder="Job title or company..."
                                        value={filters.keyword}
                                        onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                                    />
                                </div>
                                <div style={{ flex: 1, minWidth: '150px' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#ccc' }}>Location</label>
                                    <input
                                        placeholder="e.g. Colombo, Remote"
                                        value={filters.location}
                                        onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                                    />
                                </div>
                                <div style={{ flex: 1, minWidth: '150px' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#ccc' }}>Duration</label>
                                    <select
                                        value={filters.duration}
                                        onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                                    >
                                        <option value="">Any Duration</option>
                                        <option value="3 months">3 months</option>
                                        <option value="6 months">6 months</option>
                                        <option value="12 months">12 months</option>
                                    </select>
                                </div>
                                <button onClick={handleSearch} className="btn-primary" style={{ height: '46px', minWidth: '100px' }}>Search</button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                                {jobs.length === 0 ? <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#888' }}>No jobs found matching your criteria.</p> : jobs.map((job) => (
                                    <div key={job.id} className="glass-card animate-fade-in">
                                        <h3 style={{ marginBottom: '0.5rem' }}>{job.title}</h3>
                                        <p style={{ color: 'var(--primary)', fontWeight: 600, marginBottom: '1rem' }}>{job.companyName}</p>

                                        <div style={{ marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                            <p>📍 {job.location}</p>
                                            <p>⏱ {job.duration}</p>
                                        </div>

                                        <p style={{ marginBottom: '1.5rem', lineHeight: '1.6' }}>{job.description}</p>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <button
                                                onClick={() => handleLike(job.id)}
                                                style={{
                                                    background: 'transparent',
                                                    padding: '0.5rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    color: 'var(--secondary)',
                                                    cursor: 'pointer',
                                                    border: 'none',
                                                    fontSize: '1.1rem'
                                                }}
                                            >
                                                {job.likedByCurrentUser ? "❤️" : "🤍"} {job.likes}
                                            </button>

                                            {isApplied(job.id) ? (
                                                <span style={{ color: 'green', fontWeight: 'bold' }}>Applied</span>
                                            ) : (
                                                <button className="btn-primary" onClick={() => handleApplyClick(job.id)}>
                                                    Apply Now
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {activeTab === 'applications' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {applications.length === 0 ? (
                                <p>You haven't applied to any jobs yet.</p>
                            ) : (
                                applications.map((app) => (
                                    <div key={app.applicationId} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <h3>{app.jobTitle}</h3>
                                            <p style={{ color: 'var(--text-muted)' }}>Status: <span style={{
                                                fontWeight: 'bold',
                                                color: app.status === 'ACCEPTED' ? 'green' : app.status === 'REJECTED' ? 'red' : 'orange'
                                            }}>{app.status}</span></p>
                                            <p style={{ fontSize: '0.8rem', color: '#888' }}>Applied on: {new Date(app.appliedAt).toLocaleDateString()}</p>
                                            {app.coverLetter && <p style={{ marginTop: '0.5rem', fontStyle: 'italic' }}>"{app.coverLetter}"</p>}
                                        </div>
                                        <div>
                                            {/* Could add view details or withdraw button here */}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </>
            )}

            {/* Application Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div className="glass-card" style={{ width: '90%', maxWidth: '500px', background: 'white', color: 'black' }}>
                        <h2 style={{ marginBottom: '1rem' }}>Apply for Job</h2>
                        <form onSubmit={handleSubmitApplication}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Why are you applying?</label>
                                <textarea
                                    value={coverLetter}
                                    onChange={(e) => setCoverLetter(e.target.value)}
                                    required
                                    rows={4}
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                    placeholder="Tell us why you are a good fit..."
                                />
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Upload CV (PDF/Doc)</label>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    required
                                    accept=".pdf,.doc,.docx"
                                    style={{ width: '100%' }}
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                <button type="button" onClick={handleCloseModal} className="btn-secondary" style={{ color: '#333' }}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary">
                                    Submit Application
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;
