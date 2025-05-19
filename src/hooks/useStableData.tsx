
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

// Generic hook for stable data fetching
export function useStableData<T>(
  fetchFn: (userId: string) => Promise<{ data: T[] | null; error: Error | null }>,
  initialValue: T[] = [],
  dependencies: any[] = []
) {
  const [data, setData] = useState<T[]>(initialValue);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const isMounted = useRef(true);
  const dataRef = useRef<T[]>(initialValue);

  useEffect(() => {
    isMounted.current = true;
    
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      
      try {
        const { data: fetchedData, error } = await fetchFn(user.id);
        
        if (error && isMounted.current) {
          console.error('Error fetching data:', error);
          toast({
            title: "Error!",
            description: "Failed to load data. Please try again.",
            variant: "destructive",
          });
        } else if (fetchedData && isMounted.current) {
          // Store in ref to prevent unnecessary re-renders
          dataRef.current = fetchedData;
          setData(fetchedData);
        }
      } catch (error) {
        if (isMounted.current) {
          console.error('Unexpected error:', error);
          toast({
            title: "Error!",
            description: "An unexpected error occurred",
            variant: "destructive",
          });
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    fetchData();

    // Critical cleanup function to prevent state updates after unmount
    return () => {
      isMounted.current = false;
    };
  }, [user, ...dependencies]);

  return {
    data,
    dataRef: dataRef.current,
    loading,
    setData: (newData: T[]) => {
      // Update both the ref and the state
      dataRef.current = newData;
      setData(newData);
    }
  };
}
