import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useCompanyStore } from '../../store/companyStore';
import { toast } from 'sonner';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function EditJobModal({ job, open, onClose }: { job: any; open: boolean; onClose: () => void }) {
  const { updateJob } = useCompanyStore();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    interviewAddress: '',
    salary: '',
    isActive: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (job) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        title: job.title || '',
        description: job.description || '',
        location: job.location || '',
        interviewAddress: job.interviewAddress || '',
        salary: job.salary || '',
        isActive: job.isActive !== undefined ? job.isActive : true,
      });
    }
  }, [job]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job?.id) return;

    setLoading(true);
    try {
      await updateJob(job.id, formData);
      toast.success('Job updated successfully');
      onClose();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error('Failed to update job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Job</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div>
            <Label>Job Title</Label>
            <Input name="title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea name="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={5} required />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label>Location</Label>
              <Input name="location" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} required />
            </div>
            <div>
              <Label>Salary</Label>
              <Input name="salary" value={formData.salary} onChange={(e) => setFormData({...formData, salary: e.target.value})} />
            </div>
          </div>

          <div>
            <Label>Interview Address</Label>
            <Input name="interviewAddress" value={formData.interviewAddress} onChange={(e) => setFormData({...formData, interviewAddress: e.target.value})} required />
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={formData.isActive} 
              onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
            />
            <Label>Keep this job active</Label>
          </div>

          <div className="flex gap-4 pt-6">
            <Button type="submit" disabled={loading} className="flex-1">Save Changes</Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}