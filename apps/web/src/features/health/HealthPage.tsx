import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/apiClient';

export default function HealthPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['health'],
    queryFn: apiClient.getHealth,
  });

  if (isLoading) return <p>Checking…</p>;
  if (isError || !data) return <p>API unreachable</p>;

  return (
    <p>
      {data.service}: {data.status}
    </p>
  );
}
