/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdminStore } from '../../store/adminStore';
import { toast } from 'sonner';

export default function EditCompanyModal({ company, open, onClose }: { company: any; open: boolean; onClose: () => void }) {
  const { updateCompany } = useAdminStore();
  const [formData, setFormData] = useState({
    name: '',
    cacRc: '',
    address: '',
    status: 'APPROVED',
    isVerified: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (company) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: company.name || '',
        cacRc: company.cacRc || '',
        address: company.address || '',
        status: company.status || 'APPROVED',
        isVerified: company.isVerified || true,
      });
    }
  }, [company]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company?.id) return;

    setLoading(true);
    try {
      await updateCompany(company.id, formData);
      toast.success('Company updated successfully');
      onClose();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error('Failed to update company');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Company</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          <div>
            <Label>Company Name</Label>
            <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          </div>

          <div>
            <Label>CAC RC</Label>
            <Input value={formData.cacRc} onChange={(e) => setFormData({...formData, cacRc: e.target.value.toUpperCase()})} required />
          </div>

          <div>
            <Label>Address</Label>
            <Input value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
          </div>

          <div>
            <Label>Status</Label>
            <select 
              value={formData.status} 
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="w-full border rounded p-3"
            >
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}