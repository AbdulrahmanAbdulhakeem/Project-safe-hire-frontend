import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function JobDetailModal({ job, open, onClose }: { job: any; open: boolean; onClose: () => void }) {
  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl">{job.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-8 py-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Location</p>
              <p className="text-lg">{job.location}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Salary</p>
              <p className="text-3xl font-bold text-green-600">₦{job.salary}</p>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Interview Address</p>
            <p className="bg-gray-100 p-5 rounded-2xl">{job.interviewAddress}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">Full Description</p>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line text-[17px]">
              {job.description}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}