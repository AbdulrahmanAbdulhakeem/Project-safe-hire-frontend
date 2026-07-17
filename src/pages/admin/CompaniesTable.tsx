/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit2, Eye, Trash2 } from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';
import { toast } from 'sonner';
import ViewCompanyModal from './ViewCompanyModal';
import EditCompanyModal from './EditCompanyModal';

export default function CompaniesTable({ companies }: { companies: any[] }) {
  const { deleteCompany } = useAdminStore();
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (userId: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    setDeletingId(userId);
    try {
      await deleteCompany(userId);
      toast.success('Company deleted');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error('Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };

  const openView = (company: any) => {
    setSelectedCompany(company);
    setIsViewOpen(true);
  };

  const openEdit = (company: any) => {
    setSelectedCompany(company);
    setIsEditOpen(true);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company Name</TableHead>
              <TableHead>CAC RC</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-gray-500">
                  No companies yet.
                </TableCell>
              </TableRow>
            ) : (
              companies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell className="font-medium">{company.name}</TableCell>
                  <TableCell className="font-mono">{company.cacRc}</TableCell>
                  <TableCell>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${company.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {company.status}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(company.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => openView(company)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => openEdit(company)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDelete(company.userId || company.id, company.name)}
                      disabled={deletingId === company.id}
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

      <ViewCompanyModal 
        company={selectedCompany} 
        open={isViewOpen} 
        onClose={() => setIsViewOpen(false)} 
      />

      <EditCompanyModal 
        company={selectedCompany} 
        open={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
      />
    </>
  );
}