import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useEquipment(filters?: { status?: string; type?: string }) {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
  }

  const { data, error, mutate, isLoading } = useSWR(
    `/api/atlvs/equipment?${params}`,
    fetcher
  );

  return {
    equipment: data?.equipment,
    isLoading,
    isError: error,
    mutate,
  };
}
