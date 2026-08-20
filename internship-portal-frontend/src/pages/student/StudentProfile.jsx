import { useState, useEffect } from "react";
import { getProfile, updateProfile } from "../../api/studentApi";
import { useNavigate } from "react-router-dom";

const StudentProfile = () => {
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        university: "",
        degree: "",
        academicYear: 0,
        bio: "",
        skills: "",
        experience: "",
        portfolioUrl: "",
        linkedInUrl: ""
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await getProfile();
            setProfile(res.data);
            setFormData(res.data);
        } catch (err) {
            console.error("Failed to fetch profile", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await updateProfile(formData);
            setProfile(res.data);
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (err) {
            console.error("Failed to update profile", err);
            alert("Failed to update profile");
        }
    };

    const getInitials = (name) => {
        if (!name) return "Me";
        return name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
    };

    if (loading) return (
        <div className="container center-screen">
            <div className="glass-card" style={{ padding: '2rem' }}>Loading profile...</div>
        </div>
    );

    return (
        <div className="container">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>My Profile</h1>
                <button className="btn-secondary" onClick={() => navigate("/student/dashboard")}>Back to Dashboard</button>
            </header>

            {!isEditing ? (
                <div className="profile-grid animate-fade-in">
                    {/* Left Column: Stats & Quick Info */}
                    <div className="glass-card" style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <div className="profile-avatar">
                                {getInitials(profile.fullName)}
                            </div>
                        </div>
                        <h2 style={{ marginBottom: '0.5rem' }}>{profile.fullName}</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{profile.email}</p>

                        <button className="btn-primary" style={{ width: '100%', marginBottom: '2rem' }} onClick={() => setIsEditing(true)}>
                            Edit Profile
                        </button>

                        <div style={{ textAlign: 'left' }}>
                            <div style={{ marginBottom: '2rem' }}>
                                <h3 className="profile-section-title">Contact & Links</h3>
                                {profile.linkedInUrl && (
                                    <a href={profile.linkedInUrl} target="_blank" rel="noopener noreferrer" className="profile-link">
                                        🔗 LinkedIn Profile
                                    </a>
                                )}
                                {profile.portfolioUrl && (
                                    <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" className="profile-link">
                                        🎨 Portfolio
                                    </a>
                                )}
                                {profile.cvUrl ? (
                                    <div className="profile-link">
                                        📄 CV Uploaded
                                    </div>
                                ) : (
                                    <div className="profile-link" style={{ opacity: 0.5 }}>
                                        📄 No CV Uploaded
                                    </div>
                                )}
                            </div>

                            <div style={{ marginBottom: '2rem' }}>
                                <h3 className="profile-section-title">Education</h3>
                                <div style={{ marginBottom: '1rem' }}>
                                    <p style={{ fontWeight: 600, color: 'var(--text)' }}>{profile.university || "University not set"}</p>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--primary)' }}>{profile.degree}</p>
                                    {profile.academicYear > 0 && (
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                                            Year {profile.academicYear}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="profile-section-title">Skills</h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {profile.skills ? profile.skills.split(',').map(skill => (
                                        <span key={skill} className="skill-tag">
                                            {skill.trim()}
                                        </span>
                                    )) : <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No skills listed</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Bio & Experience */}
                    <div className="glass-card">
                        <div style={{ marginBottom: '3rem' }}>
                            <h3 className="profile-section-title">About Me</h3>
                            <p style={{ lineHeight: '1.8', color: '#e2e8f0', fontSize: '1.05rem', whiteSpace: 'pre-wrap' }}>
                                {profile.bio || "Write a short bio to introduce yourself..."}
                            </p>
                        </div>

                        <div>
                            <h3 className="profile-section-title">Professional Experience</h3>
                            {profile.experience ? (
                                <div style={{ marginTop: '1.5rem' }}>
                                    {/* Naive split by newlines for timeline effect, or just show as text block if not structured */}
                                    {profile.experience.split('\n').filter(line => line.trim() !== '').map((line, index) => (
                                        <div key={index} className="timeline-item">
                                            <p>{line}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '1rem' }}>
                                    Add your internships, projects, or work experience here.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                // EDIT MODE
                <div className="glass-card animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h2 style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>Edit Profile</h2>
                    <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label className="form-label">Full Name</label>
                                <input value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
                            </div>
                            <div>
                                <label className="form-label">University</label>
                                <input value={formData.university} onChange={(e) => setFormData({ ...formData, university: e.target.value })} />
                            </div>
                            <div>
                                <label className="form-label">Degree</label>
                                <input value={formData.degree} onChange={(e) => setFormData({ ...formData, degree: e.target.value })} />
                            </div>
                            <div>
                                <label className="form-label">Academic Year</label>
                                <input type="number" value={formData.academicYear} onChange={(e) => setFormData({ ...formData, academicYear: parseInt(e.target.value) })} />
                            </div>
                        </div>

                        <div>
                            <label className="form-label">Professional Bio</label>
                            <textarea rows="4" value={formData.bio || ""} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} placeholder="Tell us about yourself..." />
                        </div>

                        <div>
                            <label className="form-label">Skills (comma separated)</label>
                            <input value={formData.skills || ""} onChange={(e) => setFormData({ ...formData, skills: e.target.value })} placeholder="Java, React, Spring Boot..." />
                        </div>

                        <div>
                            <label className="form-label">Experience (One item per line for timeline view)</label>
                            <textarea rows="6" value={formData.experience || ""} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} placeholder="Intern @ TechCorp - Worked on..." />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label className="form-label">LinkedIn URL</label>
                                <input value={formData.linkedInUrl || ""} onChange={(e) => setFormData({ ...formData, linkedInUrl: e.target.value })} />
                            </div>
                            <div>
                                <label className="form-label">Portfolio URL</label>
                                <input value={formData.portfolioUrl || ""} onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                            <button type="button" className="btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                            <button type="submit" className="btn-primary">Save Changes</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default StudentProfile;
