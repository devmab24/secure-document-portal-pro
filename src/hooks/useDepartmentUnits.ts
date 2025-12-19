import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface DepartmentUnit {
  id: string;
  name: string;
  code: string | null;
  description: string | null;
  department_id: string;
  head_user_id: string | null;
  staff_count: number | null;
  location: string | null;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  head_user?: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string;
  } | null;
}

export interface Department {
  id: string;
  name: string;
  code: string | null;
  description: string | null;
  service_type: 'clinical' | 'non_clinical' | 'administrative' | null;
  level: number | null;
  parent_id: string | null;
  head_user_id: string | null;
  staff_count: number | null;
  location: string | null;
  is_active: boolean | null;
}

export function useDepartmentUnits() {
  const [units, setUnits] = useState<DepartmentUnit[]>([]);
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchDepartmentAndUnits = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // First, get the user's department from the users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('department')
        .eq('id', user.id)
        .single();

      if (userError) throw userError;

      if (!userData?.department) {
        setError('No department assigned to user');
        return;
      }

      // Get the department details by name
      const { data: deptData, error: deptError } = await supabase
        .from('departments')
        .select('*')
        .eq('name', userData.department)
        .eq('is_active', true)
        .single();

      if (deptError) {
        // Department might not exist in the departments table yet
        console.warn('Department not found:', userData.department);
        setDepartment(null);
      } else {
        setDepartment(deptData);

        // Fetch units for this department
        const { data: unitsData, error: unitsError } = await supabase
          .from('department_units')
          .select(`
            *,
            head_user:users!department_units_head_user_id_fkey(
              id,
              first_name,
              last_name,
              email
            )
          `)
          .eq('department_id', deptData.id)
          .eq('is_active', true)
          .order('name');

        if (unitsError) throw unitsError;
        setUnits(unitsData || []);
      }
    } catch (err: any) {
      console.error('Error fetching department units:', err);
      setError(err.message || 'Failed to fetch department units');
      toast({
        title: 'Error',
        description: 'Failed to load department units',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartmentAndUnits();
  }, [user]);

  const refetch = () => {
    fetchDepartmentAndUnits();
  };

  return {
    units,
    department,
    loading,
    error,
    refetch,
  };
}
