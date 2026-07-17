import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, MapPin } from 'lucide-react';

export default function ViewCompanyModal({ 
  company, 
  open, 
  onClose 
}: { 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  company: any; 
  open: boolean; 
  onClose: () => void; 
}) {
  if (!company) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Company Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <h3 className="text-3xl font-bold">{company.name}</h3>
            <p className="text-gray-500 font-mono">CAC: {company.cacRc}</p>
          </div>

          {company.address && (
            <div className="flex gap-3">
              <MapPin className="h-5 w-5 mt-0.5" />
              <span>{company.address}</span>
            </div>
          )}

          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5" />
            <span>Joined: {new Date(company.createdAt).toLocaleDateString()}</span>
          </div>

          <div className={`inline-flex px-4 py-2 rounded-full text-sm ${company.isVerified ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {company.isVerified ? '✓ Verified' : 'Not Verified'}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}