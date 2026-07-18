import { useState, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

export default function AdminApprovalPage() {
  const [pending, setPending] = useState([]);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    const res = await api.get("/enroll/admin/pending"); 
    setPending(res.data);
  };

  const handleAction = async (id, action) => {
    try {
      await api.put("/enroll/approve", { enrollmentId: id, action });
      toast.success("Request " + (action === 'enrolled' ? 'Approved' : 'Rejected'));
      fetchPending();
    } catch (err) { toast.error("Update failed"); }
  };

  return (
    <div className="glass-panel">
      <h2 className="section-title">Admin Approval Queue</h2>
      {pending.length === 0 ? <p>No pending requests.</p> : pending.map(item => (
        <div key={item._id} className="glass-panel mt-2 flex justify-between items-center">
          <div>
            <strong>{item.studentId?.name}</strong> wants to join <strong>{item.courseId?.title}</strong>
          </div>
          <div className="flex gap-2">
            <button onClick={() => handleAction(item._id, 'enrolled')} className="btn-primary" style={{background: 'var(--success)'}}>Approve</button>
            <button onClick={() => handleAction(item._id, 'rejected')} className="btn-primary" style={{background: 'var(--danger)'}}>Reject</button>
          </div>
        </div>
      ))}
    </div>
  );
}
