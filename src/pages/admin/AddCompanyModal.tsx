import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdminStore } from '../../store/adminStore';
import { toast } from 'sonner';

export default function AddCompanyModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { onboardCompany } = useAdminStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    cacRc: '',
    address: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onboardCompany(formData);
      toast.success('Company onboarded successfully!');
      onClose();
      setFormData({ email: '', password: '', name: '', cacRc: '', address: '' });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error('Failed to onboard company');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Onboard New Company</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          <div>
            <Label>Company Name</Label>
            <Input 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. Dangote Group"
              required 
            />
          </div>

          <div>
            <Label>CAC RC Number</Label>
            <Input 
              value={formData.cacRc} 
              onChange={(e) => setFormData({...formData, cacRc: e.target.value.toUpperCase()})}
              placeholder="RC123456"
              required 
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input 
              type="email"
              value={formData.email} 
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="company@domain.com"
              required 
              autoComplete='one-time-code'
            />
          </div>

          <div>
            <Label>Password</Label>
            <Input 
              type="password"
              value={formData.password} 
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="••••••••"
              autoComplete='one-time-code'
              required 
            />
          </div>

          <div>
            <Label>Address (Optional)</Label>
            <Input 
              value={formData.address} 
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              placeholder="Full company address"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full h-12 bg-orange-600">
            {loading ? 'Onboarding...' : 'Onboard Company'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}