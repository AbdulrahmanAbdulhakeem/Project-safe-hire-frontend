import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useCompanyStore } from '../../store/companyStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function PostJob() {
  const navigate = useNavigate();
  const { createJob } = useCompanyStore();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    interviewAddress: '',
    salary: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createJob(formData);
      toast.success('Job posted successfully!');
      navigate('/dashboard/company');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error('Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Post New Job</CardTitle>
            <p className="text-gray-600">Fill in the details below</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label>Job Title</Label>
                <Input 
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange} 
                  placeholder="e.g. Senior Software Engineer"
                  required 
                />
              </div>

              <div>
                <Label>Job Description</Label>
                <Textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  placeholder="Describe the role, responsibilities, and requirements..."
                  rows={6}
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label>Location</Label>
                  <Input 
                    name="location" 
                    value={formData.location} 
                    onChange={handleChange} 
                    placeholder="e.g. Lagos, Nigeria"
                    required 
                  />
                </div>
                <div>
                  <Label>Salary Range (Optional)</Label>
                  <Input 
                    name="salary" 
                    value={formData.salary} 
                    onChange={handleChange} 
                    placeholder="e.g. 250,000 - 400,000"
                  />
                </div>
              </div>

              <div>
                <Label>Interview Address</Label>
                <Input 
                  name="interviewAddress" 
                  value={formData.interviewAddress} 
                  onChange={handleChange} 
                  placeholder="e.g. 12 Adeola Odeku Street, Victoria Island, Lagos"
                  required 
                />
              </div>

              <div className="flex gap-4 pt-6">
                <Button type="submit" disabled={loading} className="flex-1 h-14 text-lg bg-orange-600 hover:bg-orange-700">
                  {loading ? 'Posting Job...' : 'Post This Job'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/dashboard/company')} 
                  className="flex-1 h-14 text-lg"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}