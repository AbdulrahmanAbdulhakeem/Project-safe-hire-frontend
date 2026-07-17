/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit2, Eye, Trash2 } from 'lucide-react';
import { useCompanyStore } from '../../store/companyStore';
import { toast } from 'sonner';
import EditJobModal from './EditJobModal';
import JobDetailModal from './JobDetailModal';

export default function MyJobsTable({ jobs }: { jobs: any[] }) {
  const { deleteJob } = useCompanyStore();
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this job permanently?')) return;
    setDeletingId(id);
    try {
      await deleteJob(id);
      toast.success('Job deleted successfully');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error('Failed to delete job');
    } finally {
      setDeletingId(null);
    }
  };

  const openEdit = (job: any) => {
    setSelectedJob(job);
    setIsEditOpen(true);
  };

  const openView = (job: any) => {
    setSelectedJob(job);
    setIsViewOpen(true);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Title</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Salary</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Posted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                  No jobs yet. Post your first job!
                </TableCell>
              </TableRow>
            ) : (
              jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell>{job.salary ? `₦${job.salary}` : '—'}</TableCell>
                  <TableCell>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${job.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {job.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(job.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => openView(job)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => openEdit(job)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDelete(job.id)}
                      disabled={deletingId === job.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* View Modal */}
      <JobDetailModal 
        job={selectedJob} 
        open={isViewOpen} 
        onClose={() => setIsViewOpen(false)} 
      />

      {/* Edit Modal */}
      <EditJobModal 
        job={selectedJob} 
        open={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
      />
    </>
  );
}