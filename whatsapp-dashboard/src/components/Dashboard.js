import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316'];

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

const styles = {
  container: {
    padding: '24px',
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px'
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#111827',
    margin: 0
  },
  subtitle: {
    color: '#6b7280',
    marginTop: '4px',
    fontSize: '16px'
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px'
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s'
  },
  buttonSecondary: {
    backgroundColor: '#6b7280'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px',
    marginBottom: '32px'
  },
  statCard: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb'
  },
  statCardBlue: {
    background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
    borderColor: '#93c5fd'
  },
  statCardGreen: {
    background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
    borderColor: '#86efac'
  },
  statCardPurple: {
    background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
    borderColor: '#c4b5fd'
  },
  statCardOrange: {
    background: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)',
    borderColor: '#fb923c'
  },
  statContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  statLabel: {
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '8px'
  },
  statValue: {
    fontSize: '32px',
    fontWeight: 'bold'
  },
  statIcon: {
    width: '32px',
    height: '32px'
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '24px',
    marginBottom: '32px'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb'
  },
  cardHeader: {
    padding: '20px 24px 0 24px'
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    margin: 0
  },
  cardContent: {
    padding: '24px'
  },
  filtersCard: {
    marginBottom: '24px'
  },
  filtersContent: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    alignItems: 'center'
  },
  searchContainer: {
    position: 'relative',
    flex: 1,
    minWidth: '250px'
  },
  searchInput: {
    width: '100%',
    padding: '12px 16px 12px 40px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s'
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9ca3af',
    width: '16px',
    height: '16px'
  },
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  select: {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none'
  },
  chatList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  chatCard: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    transition: 'box-shadow 0.2s'
  },
  chatHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px'
  },
  chatLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#10b981'
  },
  phoneNumber: {
    fontWeight: '600',
    color: '#111827'
  },
  modelBadge: {
    padding: '4px 8px',
    borderRadius: '16px',
    fontSize: '12px',
    fontWeight: '500'
  },
  chatRight: {
    textAlign: 'right',
    fontSize: '14px',
    color: '#6b7280'
  },
  messageContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  messageBox: {
    padding: '12px 16px',
    borderRadius: '8px'
  },
  userMessage: {
    backgroundColor: '#f3f4f6'
  },
  botReply: {
    backgroundColor: '#dbeafe'
  },
  messageLabel: {
    fontSize: '12px',
    marginBottom: '4px',
    fontWeight: '500'
  },
  messageText: {
    color: '#374151',
    lineHeight: '1.5'
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
    fontSize: '16px',
    color: '#6b7280'
  },
  error: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px'
  },
  errorCard: {
    backgroundColor: 'white',
    padding: '32px',
    borderRadius: '12px',
    textAlign: 'center',
    maxWidth: '400px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  },
  errorIcon: {
    color: '#ef4444',
    fontSize: '24px',
    marginBottom: '12px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '48px 24px',
    color: '#6b7280'
  },
  emptyIcon: {
  fontSize: '48px',
  marginBottom: '16px'
},
pagination: {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '8px',
  marginTop: '24px',
  padding: '16px'
},
paginationButton: {
  padding: '8px 12px',
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  backgroundColor: 'white',
  cursor: 'pointer',
  fontSize: '14px',
  transition: 'all 0.2s'
},
paginationButtonActive: {
  backgroundColor: '#3b82f6',
  color: 'white',
  borderColor: '#3b82f6'
},
paginationInfo: {
  fontSize: '14px',
  color: '#6b7280',
  margin: '0 16px'
},
dateRangeContainer: {
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
},
dateInput: {
  padding: '6px 8px',
  border: '1px solid #d1d5db',
  borderRadius: '4px',
  fontSize: '12px'
}
};

export default function Dashboard() {
  const [chats, setChats] = useState([]);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 300);

useEffect(() => {
  setSearch(debouncedSearch);
}, [debouncedSearch]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc');
  const [dateFilter, setDateFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/chats');
        setChats(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load chats');
        setLoading(false);
        console.error('Failed to load chats', err);
      }
    };

    fetchChats();
  }, []);

  const filteredAndSortedChats = useMemo(() => {
  let filtered = chats.filter(chat => {
    const matchesSearch = 
      chat.number.includes(search) ||
      chat.message.toLowerCase().includes(search.toLowerCase()) ||
      chat.reply.toLowerCase().includes(search.toLowerCase());

    const matchesDate = dateFilter === 'all' || (() => {
      const chatDate = new Date(chat.timestamp);
      const now = new Date();
      
      
      if (dateFilter === 'custom' && (dateRange.start || dateRange.end)) {
        const startDate = dateRange.start ? new Date(dateRange.start) : new Date('1900-01-01');
        const endDate = dateRange.end ? new Date(dateRange.end) : new Date();
        return chatDate >= startDate && chatDate <= endDate;
      }
      
      switch (dateFilter) {
        case 'today':
          return chatDate.toDateString() === now.toDateString();
        case 'week':
          return (now - chatDate) / (1000 * 60 * 60 * 24) <= 7;
        case 'month':
          return (now - chatDate) / (1000 * 60 * 60 * 24) <= 30;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesDate;
  });

  return filtered.sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    return sortOrder === 'asc' ? comparison : -comparison;
  });
}, [chats, search, dateFilter, dateRange, sortBy, sortOrder]);


const paginatedChats = useMemo(() => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  return filteredAndSortedChats.slice(startIndex, startIndex + itemsPerPage);
}, [filteredAndSortedChats, currentPage, itemsPerPage]);

const totalPages = Math.ceil(filteredAndSortedChats.length / itemsPerPage);

  const stats = useMemo(() => {
    const totalChats = chats.length;
    const uniqueNumbers = new Set(chats.map(chat => chat.number)).size;
    const avgResponseTime = chats.reduce((sum, chat) => sum + (chat.responseTime || 0), 0) / totalChats || 0;
    const todayChats = chats.filter(chat => 
      new Date(chat.timestamp).toDateString() === new Date().toDateString()
    ).length;

    return { totalChats, uniqueNumbers, avgResponseTime, todayChats };
  }, [chats]);

  const modelStats = useMemo(() => {
    const stats = chats.reduce((acc, chat) => {
      const model = chat.model || 'unknown';
      acc[model] = (acc[model] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(stats).map(([name, value]) => ({ name, value }));
  }, [chats]);

  const dailyStats = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toDateString();
    }).reverse();

    return last7Days.map(dateStr => {
      const count = chats.filter(chat => 
        new Date(chat.timestamp).toDateString() === dateStr
      ).length;
      return {
        date: new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' }),
        chats: count
      };
    });
  }, [chats]);
  
  
useEffect(() => {
  setCurrentPage(1);
}, [search, dateFilter, dateRange, sortBy, sortOrder]);

const handleRefresh = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/chats');
      setChats(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to refresh chats');
      setLoading(false);
      console.error('Failed to refresh chats', err);
    }
  };

  const handleExport = () => {
    const csvData = filteredAndSortedChats.map(chat => ({
      timestamp: chat.timestamp,
      number: chat.number,
      message: chat.message.replace(/,/g, ';'),
      reply: chat.reply.replace(/,/g, ';'),
      model: chat.model,
      responseTime: chat.responseTime
    }));

    const csvContent = [
      'Timestamp,Number,Message,Reply,Model,Response Time',
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'whatsapp-chats.csv';
    a.click();
  };

  const getModelBadgeStyle = (model) => {
    const baseStyle = { ...styles.modelBadge };
    switch (model) {
      case 'gpt-4':
        return { ...baseStyle, backgroundColor: '#dbeafe', color: '#1e40af' };
      case 'claude-3':
        return { ...baseStyle, backgroundColor: '#f3e8ff', color: '#7c3aed' };
      default:
        return { ...baseStyle, backgroundColor: '#f3f4f6', color: '#374151' };
    }
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <div>🔄 Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.error}>
        <div style={styles.errorCard}>
          <div style={styles.errorIcon}>⚠️ Error</div>
          <p>{error}</p>
          <button 
            onClick={handleRefresh}
            style={{ ...styles.button, marginTop: '16px' }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>📊 WhatsApp Chat Dashboard</h1>
          <p style={styles.subtitle}>Monitor and analyze your chat interactions</p>
        </div>
        <div style={styles.buttonGroup}>
          <button onClick={handleExport} style={styles.button}>
            📥 Export
          </button>
          <button onClick={handleRefresh} style={{ ...styles.button, ...styles.buttonSecondary }}>
            🔄 Refresh
          </button>
        </div>
      </div>

      
      <div style={styles.statsGrid}>
        <div style={{ ...styles.statCard, ...styles.statCardBlue }}>
          <div style={styles.statContent}>
            <div>
              <p style={{ ...styles.statLabel, color: '#1d4ed8' }}>Total Chats</p>
              <p style={{ ...styles.statValue, color: '#1e3a8a' }}>{stats.totalChats}</p>
            </div>
            <div style={{ ...styles.statIcon, color: '#3b82f6' }}>💬</div>
          </div>
        </div>

        <div style={{ ...styles.statCard, ...styles.statCardGreen }}>
          <div style={styles.statContent}>
            <div>
              <p style={{ ...styles.statLabel, color: '#059669' }}>Unique Users</p>
              <p style={{ ...styles.statValue, color: '#064e3b' }}>{stats.uniqueNumbers}</p>
            </div>
            <div style={{ ...styles.statIcon, color: '#10b981' }}>👥</div>
          </div>
        </div>

        <div style={{ ...styles.statCard, ...styles.statCardPurple }}>
          <div style={styles.statContent}>
            <div>
              <p style={{ ...styles.statLabel, color: '#7c3aed' }}>Avg Response Time</p>
              <p style={{ ...styles.statValue, color: '#581c87' }}>{stats.avgResponseTime.toFixed(1)}s</p>
            </div>
            <div style={{ ...styles.statIcon, color: '#8b5cf6' }}>⏱️</div>
          </div>
        </div>

        <div style={{ ...styles.statCard, ...styles.statCardOrange }}>
          <div style={styles.statContent}>
            <div>
              <p style={{ ...styles.statLabel, color: '#ea580c' }}>Today's Chats</p>
              <p style={{ ...styles.statValue, color: '#9a3412' }}>{stats.todayChats}</p>
            </div>
            <div style={{ ...styles.statIcon, color: '#f97316' }}>📈</div>
          </div>
        </div>
      </div>

      
      <div style={styles.chartsGrid}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Model Usage Distribution</h3>
          </div>
          <div style={styles.cardContent}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={modelStats}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {modelStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Daily Chat Volume (Last 7 Days)</h3>
          </div>
          <div style={styles.cardContent}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="chats" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      
      <div style={{ ...styles.card, ...styles.filtersCard }}>
        <div style={styles.cardContent}>
          <div style={styles.filtersContent}>
            <div style={styles.searchContainer}>
              <div style={styles.searchIcon}>🔍</div>
              <input
                style={styles.searchInput}
                placeholder="Search by number, message, or reply..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            
            <div style={styles.filterGroup}>
              <span>📅</span>
              <select
                style={styles.select}
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

{dateFilter === 'custom' && (
  <div style={styles.dateRangeContainer}>
    <input
      type="date"
      style={styles.dateInput}
      value={dateRange.start}
      onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
      placeholder="Start date"
    />
    <span>to</span>
    <input
      type="date"
      style={styles.dateInput}
      value={dateRange.end}
      onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
      placeholder="End date"
    />
  </div>
)}

            <div style={styles.filterGroup}>
              <span>📊 Sort:</span>
              <select
                style={styles.select}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="timestamp">Date</option>
                <option value="number">Number</option>
                <option value="model">Model</option>
                <option value="responseTime">Response Time</option>
              </select>
              <button
                style={{ ...styles.select, cursor: 'pointer', backgroundColor: '#f9fafb' }}
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>
      </div>

      
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', margin: 0 }}>
            Chat History ({filteredAndSortedChats.length} of {chats.length})
          </h2>
        </div>
        
        <div style={styles.chatList}>
          {filteredAndSortedChats.length === 0 ? (
            <div style={styles.card}>
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>💬</div>
                <p>No chats found matching your criteria.</p>
              </div>
            </div>
          ) : (
            paginatedChats.map((chat, index) => (
              <div 
                key={chat.id || index} 
                style={styles.chatCard}
                onMouseEnter={(e) => e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'}
                onMouseLeave={(e) => e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)'}
              >
                <div style={styles.chatHeader}>
                  <div style={styles.chatLeft}>
                    <div style={styles.statusDot}></div>
                    <span style={styles.phoneNumber}>{chat.number}</span>
                    <span style={getModelBadgeStyle(chat.model)}>
                      {chat.model || 'Unknown'}
                    </span>
                  </div>
                  <div style={styles.chatRight}>
                    <div>{new Date(chat.timestamp).toLocaleDateString()}</div>
                    <div>{new Date(chat.timestamp).toLocaleTimeString()}</div>
                    {chat.responseTime && (
                      <div style={{ fontSize: '12px' }}>Response: {chat.responseTime}s</div>
                    )}
                  </div>
                </div>
                
                <div style={styles.messageContainer}>
                  <div style={{ ...styles.messageBox, ...styles.userMessage }}>
                    <div style={{ ...styles.messageLabel, color: '#6b7280' }}>Message</div>
                    <div style={styles.messageText}>{chat.message}</div>
                  </div>
                  
                  <div style={{ ...styles.messageBox, ...styles.botReply }}>
                    <div style={{ ...styles.messageLabel, color: '#1d4ed8' }}>Reply</div>
                    <div style={styles.messageText}>{chat.reply}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>


      {totalPages > 1 && (
        <div style={styles.pagination}>
          <button
            style={styles.paginationButton}
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            First
          </button>
          <button
            style={styles.paginationButton}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
            return (
              <button
                key={pageNum}
                style={{
                  ...styles.paginationButton,
                  ...(currentPage === pageNum ? styles.paginationButtonActive : {})
                }}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}
          
          <button
            style={styles.paginationButton}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
          <button
            style={styles.paginationButton}
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            Last
          </button>
          
          <div style={styles.paginationInfo}>
            Page {currentPage} of {totalPages} ({filteredAndSortedChats.length} total)
          </div>
        </div>
      )}
    </div>
  );
}
