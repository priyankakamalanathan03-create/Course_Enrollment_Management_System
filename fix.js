const fs = require('fs');
const file = 'C:\\Users\\malap\\Downloads\\course_enrollment_management_system_fronted-main\\course_enrollment_management_system_fronted-main\\frontend\\src\\pages\\StudentDashboard.jsx';
let content = fs.readFileSync(file, 'utf8');

const newBlock = "{myCourses.map((enrollment) => (
  <motion.div key={enrollment._id} className=\"glass-panel course-card flex flex-col\">
    <div className=\"course-icon-wrapper\">
      {getCategoryIcon(enrollment.courseId?.category)}
    </div>
    <div className=\"course-header\">
      <h3 className=\"course-title\">{enrollment.courseId?.title}</h3>
      <span className={\"status-badge status-\" + enrollment.status}>
        {enrollment.status}
      </span>
    </div>

    {/* BUG FIX: Only show progress if the student is officially ENROLLED */}
    {enrollment.status === \"enrolled\" || enrollment.status === \"completed\" ? (
      <div style={{ marginTop: 'auto' }}>
        <div className=\"course-meta\">
          <span>Progress</span>
          <span>{enrollment.progress}%</span>
        </div>
        <div className=\"progress-bar\" style={{ marginBottom: '1rem' }}>
          <div className=\"progress-fill\" style={{ width: enrollment.progress + '%' }}></div>
        </div>
        
        {enrollment.progress >= 100 ? (
          <motion.button 
            whileHover={{ scale: 1.02 }}
            onClick={() => downloadCertificate(enrollment.courseId.title, enrollment.grade)}
            className=\"flex items-center justify-center gap-2\"
            style={{width: '100%', background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)', border: 'none', color: 'white', padding: '0.6rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '0.5rem'}}
          >
            <Award size={18} /> Download Certificate
          </motion.button>
        ) : null}
      </div>
    ) : (
      /* If pending, show a simple message instead of progress */
      <p style={{ color: 'var(--warning)', fontSize: '0.85rem', margin: '1rem 0', marginTop: 'auto' }}>
        Your request is being reviewed by the Admin.
      </p>
    )}

    <motion.button 
      whileHover={{ scale: 1.02 }}
      onClick={() => handleDropCourse(enrollment.courseId._id)}
      className=\"flex items-center justify-center gap-2\"
      style={{
        width: '100%', background: 'transparent', border: '1px solid #ef4444', 
        color: '#ef4444', padding: '0.5rem', borderRadius: '6px', cursor: 'pointer', marginTop: enrollment.status === 'pending' ? '0' : '0.5rem'
      }}
    >
      <XCircle size={16} /> 
      {/* BUG FIX: Change button name based on status */}
      {enrollment.status === \"pending\" ? \"Cancel Request\" : \"Drop Course\"}
    </motion.button>
  </motion.div>
))}";

const lines = content.split('\n');
const startIdx = lines.findIndex(l => l.includes('{myCourses.map((enrollment) => ('));
const endIdx = lines.findIndex((l, i) => i > startIdx && l.includes('))}'));

if (startIdx !== -1 && endIdx !== -1) {
    lines.splice(startIdx, endIdx - startIdx + 1, newBlock);
    fs.writeFileSync(file, lines.join('\n'));
}
