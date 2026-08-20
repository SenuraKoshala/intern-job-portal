import { useEffect, useState } from "react";
import { getMyJobs, createJob, updateJob, deleteJob } from "../../api/jobApi";
import { getApplicantsForJob, updateApplicationStatus } from "../../api/applicationApi";
import { useAuth } from "../../context/AuthContext";

const CompanyDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showJobModal, setShowJobModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [applicants, setApplicants] = useState([]);

    const { logout } = useAuth();

    // Job Form State
    const [jobForm, setJobForm] = useState({
        title: "",
        description: "",
        location: "",
        duration: ""
    });

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await getMyJobs();
            setJobs(res.data);
        } catch (err) {
            console.error("Error fetching jobs", err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCreate = () => {
        setIsEditing(false);
        setJobForm({ title: "", description: "", location: "", duration: "" });
        setShowJobModal(true);
    };

    const handleOpenEdit = (job, e) => {
        e.stopPropagation(); // Prevent opening applicants view
        setIsEditing(true);
        setSelectedJobId(job.id);
        setJobForm({
            title: job.title,
            description: job.description,
            location: job.location,
            duration: job.duration
        });
        setShowJobModal(true);
    };

    const handleDeleteJob = async (jobId, e) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this job post?")) {
            try {
                await deleteJob(jobId);
                fetchJobs();
                if (selectedJobId === jobId) {
                    setSelectedJobId(null);
                    setApplicants([]);
                }
            } catch (err) {
                alert("Failed to delete job");
            }
        }
    };

    const handleJobSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await updateJob(selectedJobId, jobForm);
            } else {
                await createJob(jobForm);
            }
            setShowJobModal(false);
            fetchJobs();
        } catch (err) {
            alert(`Failed to ${isEditing ? 'update' : 'create'} job`);
        }
    };

    const viewApplicants = async (jobId) => {
        setSelectedJobId(jobId);
        setApplicants([]); // Clear previous
        try {
            const res = await getApplicantsForJob(jobId);
            setApplicants(res.data);
        } catch (err) {
            console.error("Failed to fetch applicants");
        }
    };

    const handleStatusUpdate = async (appId, status) => {
        try {
            await updateApplicationStatus(appId, status);
            if (selectedJobId) viewApplicants(selectedJobId);
        } catch (err) {
            alert("Failed to update status");
        }
    };

    return (
        <div className="container">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1>Company Dashboard</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage your listings and applicants</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn-primary" onClick={handleOpenCreate}>
                        + Post New Job
                    </button>
                    <button className="btn-secondary" onClick={logout}>Logout</button>
                </div>
            </header>

            {/* Job Modal */}
            {showJobModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div className="glass-card animate-scale-in" style={{ width: '90%', maxWidth: '600px', background: 'white', color: 'black' }}>
                        <h2 style={{ marginBottom: '1rem' }}>{isEditing ? "Edit Job" : "Post New Internship"}</h2>
                        <form onSubmit={handleJobSubmit} style={{ display: 'grid', gap: '1rem' }}>
                            <input
                                placeholder="Job Title"
                                value={jobForm.title}
                                onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                                required
                                style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                            <textarea
                                placeholder="Description"
                                rows="5"
                                value={jobForm.description}
                                onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                                required
                                style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <input
                                    placeholder="Location"
                                    value={jobForm.location}
                                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                                    required
                                    style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                />
                                <input
                                    placeholder="Duration (e.g. 6 months)"
                                    value={jobForm.duration}
                                    onChange={(e) => setJobForm({ ...jobForm, duration: e.target.value })}
                                    required
                                    style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setShowJobModal(false)} className="btn-secondary" style={{ color: '#333' }}>Cancel</button>
                                <button type="submit" className="btn-primary">{isEditing ? "Save Changes" : "Publish Job"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2rem', minHeight: '60vh' }}>
                {/* Jobs List */}
                <div>
                    <h2 style={{ marginBottom: '1rem', borderBottom: '2px solid var(--primary)', display: 'inline-block', paddingBottom: '0.5rem' }}>Your Job Posts</h2>
                    {loading ? <p>Loading...</p> : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '70vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
                            {jobs.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No jobs posted yet.</p> : jobs.map(job => (
                                <div
                                    key={job.id}
                                    className="glass-card job-card-hover"
                                    style={{
                                        cursor: 'pointer',
                                        border: selectedJobId === job.id ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                                        position: 'relative',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onClick={() => viewApplicants(job.id)}
                                >
                                    <h3 style={{ paddingRight: '4rem' }}>{job.title}</h3>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{job.location} • {job.duration}</p>
                                    <div style={{ fontSize: '0.8rem', color: '#888' }}>
                                        Create at: {new Date(job.createdAt).toLocaleDateString()}
                                    </div>

                                    {/* Action Buttons */}
                                    <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={(e) => handleOpenEdit(job, e)}
                                            title="Edit"
                                            style={{ background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', padding: '0.4rem', borderRadius: '4px' }}
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={(e) => handleDeleteJob(job.id, e)}
                                            title="Delete"
                                            style={{ background: 'rgba(255,0,0,0.1)', border: 'none', cursor: 'pointer', padding: '0.4rem', borderRadius: '4px' }}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Applicants View */}
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: '16px', padding: '1.5rem', backdropFilter: 'blur(10px)' }}>
                    <h2 style={{ marginBottom: '1rem' }}>
                        {selectedJobId
                            ? `Applicants for "${jobs.find(j => j.id === selectedJobId)?.title || 'Job'}"`
                            : "Select a job to view applicants"}
                    </h2>

                    {!selectedJobId ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', color: 'var(--text-muted)' }}>
                            <p>👈 Select a job from the list on the left</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {applicants.length === 0 ? (
                                <p style={{ color: 'var(--text-muted)' }}>No applicants yet for this job.</p>
                            ) : applicants.map(app => (
                                <div key={app.applicationId} className="glass-card animate-fade-in" style={{ background: 'rgba(0,0,0,0.2)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <h4 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{app.studentName}</h4>
                                            <p style={{ fontSize: '0.85rem', color: '#aaa', marginBottom: '1rem' }}>Applied: {new Date(app.appliedAt).toLocaleDateString()}</p>
                                        </div>
                                        <span style={{
                                            padding: '0.2rem 0.6rem',
                                            borderRadius: '12px',
                                            fontSize: '0.8rem',
                                            fontWeight: 'bold',
                                            background: app.status === 'ACCEPTED' ? 'rgba(74, 222, 128, 0.2)' : app.status === 'REJECTED' ? 'rgba(248, 113, 113, 0.2)' : 'rgba(251, 191, 36, 0.2)',
                                            color: app.status === 'ACCEPTED' ? '#4ade80' : app.status === 'REJECTED' ? '#f87171' : '#fbbf24'
                                        }}>
                                            {app.status}
                                        </span>
                                    </div>

                                    {/* Cover Letter & CV */}
                                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                                        <p style={{ fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Motivation:</p>
                                        <p style={{ fontStyle: 'italic', color: '#ddd', fontSize: '0.95rem', lineHeight: '1.5' }}>
                                            "{app.coverLetter || "No cover letter provided."}"
                                        </p>

                                        <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.5rem' }}>
                                            <p style={{ fontSize: '0.9rem' }}>
                                                CV: {app.cvUrl ? (
                                                    <span style={{ color: 'var(--primary)', wordBreak: 'break-all' }}>{app.cvUrl}</span>
                                                ) : (
                                                    <span style={{ color: '#888' }}>Not uploaded</span>
                                                )}
                                            </p>
                                            {/* Note: In a real app, we would make this a downloadable link. Since it's a local path in this demo, we just display it. */}
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                        {app.status === 'PENDING' && (
                                            <>
                                                <button
                                                    onClick={() => handleStatusUpdate(app.applicationId, 'ACCEPTED')}
                                                    style={{ padding: '0.5rem 1rem', background: '#22c55e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(app.applicationId, 'REJECTED')}
                                                    style={{ padding: '0.5rem 1rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                        {app.status !== 'PENDING' && (
                                            <button
                                                onClick={() => handleStatusUpdate(app.applicationId, 'PENDING')}
                                                style={{ padding: '0.5rem 1rem', background: '#666', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                                            >
                                                Reset Status
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CompanyDashboard;
