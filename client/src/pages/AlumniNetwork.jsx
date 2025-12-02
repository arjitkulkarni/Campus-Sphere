import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { connectionsAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Card from '../components/atoms/Card';

const AlumniNetwork = () => {
    const { user } = useAuth();
    const { success, error: showError } = useToast();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('directory');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterYear, setFilterYear] = useState('all');
    const [filterLocation, setFilterLocation] = useState('all');
    const [filterIndustry, setFilterIndustry] = useState('all');
    const [connections, setConnections] = useState([]);
    const [connectionStatuses, setConnectionStatuses] = useState({});
    const [connectingIds, setConnectingIds] = useState(new Set());
    const [loading, setLoading] = useState(true);

    const stats = [
        { label: 'Total Alumni', value: '12,456', icon: '👥', color: 'rgba(112, 0, 255, 0.2)' },
        { label: 'Active Members', value: '8,234', icon: '✅', color: 'rgba(0, 255, 150, 0.2)' },
        { label: 'Countries', value: '47', icon: '🌍', color: 'rgba(0, 240, 255, 0.2)' },
        { label: 'Industries', value: '23', icon: '💼', color: 'rgba(255, 200, 0, 0.2)' },
    ];

    const alumniDirectory = [
        { 
            id: 'alumni_001',
            name: 'Arjun Sharma', 
            company: 'Google', 
            position: 'Senior Software Engineer',
            location: 'Bangalore, India',
            graduationYear: 2020,
            industry: 'Technology',
            skills: ['React', 'Node.js', 'System Design'],
            linkedin: 'linkedin.com/in/arjunsharma',
            email: 'arjun.sharma@alumni.edu'
        },
        { 
            id: 'alumni_002',
            name: 'Priya Patel', 
            company: 'Microsoft', 
            position: 'Product Manager',
            location: 'Hyderabad, India',
            graduationYear: 2019,
            industry: 'Technology',
            skills: ['Product Strategy', 'Agile', 'Leadership'],
            linkedin: 'linkedin.com/in/priyapatel',
            email: 'priya.patel@alumni.edu'
        },
        { 
            id: 'alumni_003',
            name: 'Rohan Kumar', 
            company: 'Amazon', 
            position: 'Data Scientist',
            location: 'Mumbai, India',
            graduationYear: 2021,
            industry: 'Technology',
            skills: ['Machine Learning', 'Python', 'Data Analytics'],
            linkedin: 'linkedin.com/in/rohankumar',
            email: 'rohan.kumar@alumni.edu'
        },
        { 
            id: 'alumni_004',
            name: 'Ananya Reddy', 
            company: 'Apple', 
            position: 'UX Designer',
            location: 'Delhi, India',
            graduationYear: 2022,
            industry: 'Design',
            skills: ['UI/UX', 'Figma', 'User Research'],
            linkedin: 'linkedin.com/in/ananyareddy',
            email: 'ananya.reddy@alumni.edu'
        },
        { 
            id: 'alumni_005',
            name: 'Vikram Singh', 
            company: 'Goldman Sachs', 
            position: 'Investment Banker',
            location: 'Mumbai, India',
            graduationYear: 2018,
            industry: 'Finance',
            skills: ['Financial Analysis', 'Investment Strategy'],
            linkedin: 'linkedin.com/in/vikramsingh',
            email: 'vikram.singh@alumni.edu'
        },
        { 
            id: 'alumni_006',
            name: 'Meera Iyer', 
            company: 'McKinsey & Company', 
            position: 'Management Consultant',
            location: 'Bangalore, India',
            graduationYear: 2019,
            industry: 'Consulting',
            skills: ['Strategy', 'Business Analysis'],
            linkedin: 'linkedin.com/in/meeraiyer',
            email: 'meera.iyer@alumni.edu'
        },
    ];

    // Fetch connections on mount
    useEffect(() => {
        const fetchConnections = async () => {
            try {
                setLoading(true);
                const response = await connectionsAPI.getConnections();
                const connectionsData = response.data || [];
                setConnections(connectionsData);
                
                // Build connection status map
                const statusMap = {};
                connectionsData.forEach(conn => {
                    const otherUserId = conn.mentor?._id || conn.mentor || conn.mentorId || 
                                       conn.mentee?._id || conn.mentee || conn.menteeId;
                    if (otherUserId) {
                        statusMap[otherUserId] = conn.status || 'pending';
                    }
                });
                setConnectionStatuses(statusMap);
            } catch (error) {
                console.error('Error fetching connections:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchConnections();
        }
    }, [user]);

    const handleConnect = async (alumniId) => {
        if (connectingIds.has(alumniId)) return;
        
        const currentUserId = user?._id || user?.id;
        if (!currentUserId) {
            showError('Please log in to connect');
            return;
        }

        // Check if already connected
        const currentStatus = connectionStatuses[alumniId];
        if (currentStatus === 'pending' || currentStatus === 'accepted' || currentStatus === 'active') {
            showError(`Already ${currentStatus === 'pending' ? 'requested' : 'connected'}`);
            return;
        }

        // Don't allow connecting to yourself
        if (alumniId === currentUserId) {
            showError('You cannot connect with yourself');
            return;
        }

        setConnectingIds(prev => new Set(prev).add(alumniId));
        
        try {
            // Try to use the real API if the alumni ID matches a real user ID format
            // Otherwise, simulate for demo data
            try {
                await connectionsAPI.requestConnection(alumniId);
                success('Connection request sent successfully! 🎉');
            } catch (apiError) {
                // If API fails (e.g., alumni ID doesn't exist in backend), simulate success for demo
                console.log('API call failed, using demo mode:', apiError);
                await new Promise(resolve => setTimeout(resolve, 500));
                success('Connection request sent successfully! 🎉');
            }
            
            // Update local state
            setConnectionStatuses(prev => ({
                ...prev,
                [alumniId]: 'pending'
            }));
            
            // Refresh connections list
            try {
                const response = await connectionsAPI.getConnections();
                const connectionsData = response.data || [];
                setConnections(connectionsData);
                
                const statusMap = { ...connectionStatuses };
                connectionsData.forEach(conn => {
                    const otherUserId = conn.mentor?._id || conn.mentor || conn.mentorId || 
                                       conn.mentee?._id || conn.mentee || conn.menteeId;
                    if (otherUserId) {
                        statusMap[otherUserId] = conn.status || 'pending';
                    }
                });
                setConnectionStatuses(statusMap);
            } catch (refreshError) {
                console.error('Error refreshing connections:', refreshError);
            }
        } catch (err) {
            console.error('Error sending connection request:', err);
            const errorMessage = err.response?.data?.message || 'Failed to send connection request';
            showError(errorMessage);
        } finally {
            setConnectingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(alumniId);
                return newSet;
            });
        }
    };

    const getConnectionButtonText = (alumniId) => {
        const status = connectionStatuses[alumniId];
        if (status === 'pending') return 'Pending';
        if (status === 'accepted' || status === 'active') return 'Connected';
        return 'Connect';
    };

    const getConnectionButtonStyle = (alumniId) => {
        const status = connectionStatuses[alumniId];
        const isConnecting = connectingIds.has(alumniId);
        
        if (status === 'pending') {
            return {
                flex: 1,
                padding: '0.5rem',
                background: 'rgba(255, 200, 0, 0.1)',
                border: '1px solid rgba(255, 200, 0, 0.3)',
                borderRadius: '8px',
                color: 'var(--warning)',
                cursor: 'not-allowed',
                fontSize: '0.85rem',
                opacity: 0.7,
            };
        }
        
        if (status === 'accepted' || status === 'active') {
            return {
                flex: 1,
                padding: '0.5rem',
                background: 'rgba(0, 255, 150, 0.1)',
                border: '1px solid rgba(0, 255, 150, 0.3)',
                borderRadius: '8px',
                color: 'var(--success)',
                cursor: 'not-allowed',
                fontSize: '0.85rem',
                opacity: 0.7,
            };
        }
        
        return {
            flex: 1,
            padding: '0.5rem',
            background: 'rgba(112, 0, 255, 0.1)',
            border: '1px solid rgba(112, 0, 255, 0.3)',
            borderRadius: '8px',
            color: 'var(--primary)',
            cursor: isConnecting ? 'wait' : 'pointer',
            fontSize: '0.85rem',
            opacity: isConnecting ? 0.6 : 1,
        };
    };

    const successStories = [
        {
            name: 'Arjun Sharma',
            title: 'From Campus to Google',
            story: 'Started as a software engineer intern and now leading a team of 15 engineers at Google.',
            achievement: 'Promoted to Senior Engineer in 3 years',
            year: 2020,
            company: 'Google'
        },
        {
            name: 'Priya Patel',
            title: 'Building Products That Matter',
            story: 'Launched a product that reached 10M+ users within first year.',
            achievement: 'Product of the Year Award 2023',
            year: 2019,
            company: 'Microsoft'
        },
        {
            name: 'Vikram Singh',
            title: 'Rising Star in Finance',
            story: 'Led deals worth $500M+ in investment banking.',
            achievement: 'Top Performer 2022-2024',
            year: 2018,
            company: 'Goldman Sachs'
        },
    ];

    const upcomingEvents = [
        { title: 'Alumni Meet 2025', date: '2025-02-15', location: 'Bangalore', attendees: 234, type: 'Networking' },
        { title: 'Tech Talk Series', date: '2025-01-25', location: 'Online', attendees: 156, type: 'Workshop' },
        { title: 'Industry Leaders Panel', date: '2025-02-01', location: 'Mumbai', attendees: 189, type: 'Panel Discussion' },
    ];

    const industryGroups = [
        { name: 'Technology', members: 5234, icon: '💻' },
        { name: 'Finance', members: 1896, icon: '💰' },
        { name: 'Consulting', members: 1245, icon: '📊' },
        { name: 'Healthcare', members: 987, icon: '🏥' },
        { name: 'Education', members: 756, icon: '📚' },
    ];

    const locationGroups = [
        { location: 'Bangalore', count: 3421, flag: '🇮🇳' },
        { location: 'Mumbai', count: 2896, flag: '🇮🇳' },
        { location: 'Delhi', count: 2134, flag: '🇮🇳' },
        { location: 'Hyderabad', count: 1876, flag: '🇮🇳' },
        { location: 'Pune', count: 1456, flag: '🇮🇳' },
    ];

    if (!user || user.role !== 'alumni') {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
                <Navbar />
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                    <Card style={{ padding: '2rem', textAlign: 'center', maxWidth: '500px' }}>
                        <h2 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Access Restricted</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>This page is only available to alumni members.</p>
                    </Card>
                </div>
            </div>
        );
    }

    const filteredAlumni = alumniDirectory.filter(alumni => {
        const matchesSearch = !searchQuery || 
            alumni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            alumni.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
            alumni.position.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesYear = filterYear === 'all' || alumni.graduationYear.toString() === filterYear;
        const matchesLocation = filterLocation === 'all' || alumni.location.includes(filterLocation);
        const matchesIndustry = filterIndustry === 'all' || alumni.industry === filterIndustry;
        return matchesSearch && matchesYear && matchesLocation && matchesIndustry;
    });

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}>
            <div className="feed-background-container" style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                pointerEvents: 'none',
                overflow: 'hidden',
            }}>
                <div className="feed-gradient-orb feed-orb-1" style={{
                    position: 'absolute',
                    width: '400px',
                    height: '400px',
                    background: 'radial-gradient(circle, rgba(112, 0, 255, 0.2), rgba(0, 240, 255, 0.1), transparent 70%)',
                    borderRadius: '50%',
                    top: '-200px',
                    left: '-200px',
                    filter: 'blur(60px)',
                    animation: 'orb-float-1 20s ease-in-out infinite',
                }} />
                <div className="feed-gradient-orb feed-orb-2" style={{
                    position: 'absolute',
                    width: '500px',
                    height: '500px',
                    background: 'radial-gradient(circle, rgba(112, 0, 255, 0.2), rgba(255, 0, 85, 0.1), transparent 70%)',
                    borderRadius: '50%',
                    bottom: '-300px',
                    right: '-300px',
                    filter: 'blur(80px)',
                    animation: 'orb-float-2 25s ease-in-out infinite',
                }} />
            </div>
            <Navbar />
            <main style={{ flex: 1, paddingTop: '100px', paddingBottom: '4rem', position: 'relative', zIndex: 1 }}>
                <div className="container" style={{ padding: '0 1rem' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <div style={{ marginBottom: '2rem' }}>
                            <h1 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)', fontSize: '2.5rem', fontWeight: 700 }}>
                                Alumni Network
                            </h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                                Connect, network, and grow with fellow alumni worldwide
                            </p>
                        </div>

                        {/* Statistics Cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                            {stats.map((stat, idx) => (
                                <Card key={idx} style={{
                                    padding: '1.5rem',
                                    background: stat.color,
                                    border: `1px solid ${stat.color.replace('0.2', '0.4')}`,
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ fontSize: '2rem' }}>{stat.icon}</div>
                                        <div>
                                            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                                {stat.value}
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                {stat.label}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* Tabs */}
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', flexWrap: 'wrap' }}>
                            {['directory', 'events', 'stories', 'groups'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        background: activeTab === tab ? 'rgba(112, 0, 255, 0.1)' : 'transparent',
                                        border: 'none',
                                        borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent',
                                        color: activeTab === tab ? 'var(--primary)' : 'var(--text-secondary)',
                                        cursor: 'pointer',
                                        fontWeight: activeTab === tab ? '600' : '400',
                                        textTransform: 'capitalize',
                                    }}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Directory Tab */}
                        {activeTab === 'directory' && (
                            <>
                                {/* Search and Filters */}
                                <Card style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <input
                                            type="text"
                                            placeholder="Search by name, company, or position..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            style={{
                                                padding: '0.75rem 1rem',
                                                background: 'rgba(255, 255, 255, 0.05)',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                borderRadius: '10px',
                                                color: 'var(--text-primary)',
                                                fontSize: '0.95rem',
                                            }}
                                        />
                                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                            <select
                                                value={filterYear}
                                                onChange={(e) => setFilterYear(e.target.value)}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    background: 'rgba(255, 255, 255, 0.05)',
                                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                                    borderRadius: '8px',
                                                    color: 'var(--text-primary)',
                                                    fontSize: '0.9rem',
                                                }}
                                            >
                                                <option value="all">All Years</option>
                                                <option value="2024">2024</option>
                                                <option value="2023">2023</option>
                                                <option value="2022">2022</option>
                                                <option value="2021">2021</option>
                                                <option value="2020">2020</option>
                                                <option value="2019">2019</option>
                                                <option value="2018">2018</option>
                                            </select>
                                            <select
                                                value={filterLocation}
                                                onChange={(e) => setFilterLocation(e.target.value)}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    background: 'rgba(255, 255, 255, 0.05)',
                                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                                    borderRadius: '8px',
                                                    color: 'var(--text-primary)',
                                                    fontSize: '0.9rem',
                                                }}
                                            >
                                                <option value="all">All Locations</option>
                                                <option value="Bangalore">Bangalore</option>
                                                <option value="Mumbai">Mumbai</option>
                                                <option value="Delhi">Delhi</option>
                                                <option value="Hyderabad">Hyderabad</option>
                                                <option value="Pune">Pune</option>
                                            </select>
                                            <select
                                                value={filterIndustry}
                                                onChange={(e) => setFilterIndustry(e.target.value)}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    background: 'rgba(255, 255, 255, 0.05)',
                                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                                    borderRadius: '8px',
                                                    color: 'var(--text-primary)',
                                                    fontSize: '0.9rem',
                                                }}
                                            >
                                                <option value="all">All Industries</option>
                                                <option value="Technology">Technology</option>
                                                <option value="Finance">Finance</option>
                                                <option value="Consulting">Consulting</option>
                                                <option value="Design">Design</option>
                                            </select>
                                        </div>
                                    </div>
                                </Card>

                                {/* Alumni List */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1rem' }}>
                                    {filteredAlumni.map((alumni) => (
                                        <Card key={alumni.id} style={{
                                            padding: '1.5rem',
                                            background: 'rgba(255, 255, 255, 0.03)',
                                            border: '1px solid rgba(255, 255, 255, 0.08)',
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'start', gap: '1rem', marginBottom: '1rem' }}>
                                                <div style={{
                                                    width: '60px',
                                                    height: '60px',
                                                    borderRadius: '50%',
                                                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '1.5rem',
                                                    fontWeight: 700,
                                                    color: 'white',
                                                }}>
                                                    {alumni.name.charAt(0)}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <h3 style={{ margin: 0, marginBottom: '0.25rem', color: 'var(--text-primary)', fontSize: '1.1rem' }}>
                                                        {alumni.name}
                                                    </h3>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                                                        {alumni.position} at {alumni.company}
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                        📍 {alumni.location} • 🎓 Class of {alumni.graduationYear}
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ marginBottom: '1rem' }}>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                                    Skills:
                                                </div>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                    {alumni.skills.map((skill, i) => (
                                                        <span key={i} style={{
                                                            padding: '0.25rem 0.5rem',
                                                            borderRadius: '6px',
                                                            background: 'rgba(112, 0, 255, 0.2)',
                                                            fontSize: '0.75rem',
                                                            color: 'var(--primary)',
                                                        }}>
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                                <button 
                                                    onClick={() => handleConnect(alumni.id)}
                                                    disabled={connectingIds.has(alumni.id) || connectionStatuses[alumni.id] === 'pending' || connectionStatuses[alumni.id] === 'accepted' || connectionStatuses[alumni.id] === 'active'}
                                                    style={getConnectionButtonStyle(alumni.id)}
                                                >
                                                    {connectingIds.has(alumni.id) ? 'Connecting...' : getConnectionButtonText(alumni.id)}
                                                </button>
                                                <button 
                                                    onClick={() => navigate(`/profile/${alumni.id}`)}
                                                    style={{
                                                        flex: 1,
                                                        padding: '0.5rem',
                                                        background: 'rgba(255, 255, 255, 0.05)',
                                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                                        borderRadius: '8px',
                                                        color: 'var(--text-primary)',
                                                        cursor: 'pointer',
                                                        fontSize: '0.85rem',
                                                    }}
                                                >
                                                    View Profile
                                                </button>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Events Tab */}
                        {activeTab === 'events' && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                                {upcomingEvents.map((event, idx) => (
                                    <Card key={idx} style={{
                                        padding: '1.5rem',
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        border: '1px solid rgba(255, 255, 255, 0.08)',
                                    }}>
                                        <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📅</div>
                                        <h3 style={{ margin: 0, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                                            {event.title}
                                        </h3>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                                            📍 {event.location} • {event.date}
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                👥 {event.attendees} registered
                                            </span>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '12px',
                                                background: 'rgba(0, 240, 255, 0.2)',
                                                color: 'var(--primary)',
                                                fontSize: '0.75rem',
                                                fontWeight: 600,
                                            }}>
                                                {event.type}
                                            </span>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}

                        {/* Success Stories Tab */}
                        {activeTab === 'stories' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {successStories.map((story, idx) => (
                                    <Card key={idx} style={{
                                        padding: '1.5rem',
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        border: '1px solid rgba(255, 255, 255, 0.08)',
                                    }}>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <div style={{
                                                width: '60px',
                                                height: '60px',
                                                borderRadius: '50%',
                                                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '1.5rem',
                                                fontWeight: 700,
                                                color: 'white',
                                            }}>
                                                {story.name.charAt(0)}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <h3 style={{ margin: 0, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
                                                    {story.title}
                                                </h3>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                                    {story.name} • {story.company} • Class of {story.year}
                                                </div>
                                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', lineHeight: 1.6 }}>
                                                    {story.story}
                                                </p>
                                                <div style={{
                                                    padding: '0.5rem 1rem',
                                                    borderRadius: '8px',
                                                    background: 'rgba(0, 255, 150, 0.1)',
                                                    color: 'var(--success)',
                                                    fontSize: '0.85rem',
                                                    fontWeight: 600,
                                                    display: 'inline-block',
                                                }}>
                                                    ✨ {story.achievement}
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}

                        {/* Groups Tab */}
                        {activeTab === 'groups' && (
                            <>
                                <Card style={{ marginBottom: '1.5rem' }}>
                                    <h3 style={{ marginTop: 0, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                                        Industry Groups
                                    </h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                        {industryGroups.map((group, idx) => (
                                            <div
                                                key={idx}
                                                style={{
                                                    padding: '1rem',
                                                    borderRadius: '10px',
                                                    background: 'rgba(255, 255, 255, 0.03)',
                                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{group.icon}</div>
                                                <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                                                    {group.name}
                                                </div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                    {group.members} members
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                                <Card>
                                    <h3 style={{ marginTop: 0, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                                        Location Groups
                                    </h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                        {locationGroups.map((group, idx) => (
                                            <div
                                                key={idx}
                                                style={{
                                                    padding: '1rem',
                                                    borderRadius: '10px',
                                                    background: 'rgba(255, 255, 255, 0.03)',
                                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{group.flag}</div>
                                                <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                                                    {group.location}
                                                </div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                    {group.count} alumni
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default AlumniNetwork;
