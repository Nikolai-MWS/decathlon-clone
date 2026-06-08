import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import HealthPage from './HealthPage';
import { apiClient } from '../../lib/apiClient';

vi.mock('../../lib/apiClient', () => ({
  apiClient: { getHealth: vi.fn() },
}));

function renderWithClient(ui: React.ReactElement) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

describe('HealthPage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows the API status once loaded', async () => {
    vi.mocked(apiClient.getHealth).mockResolvedValue({
      status: 'ok',
      service: 'api',
      timestamp: '2026-06-08T00:00:00.000Z',
    });
    renderWithClient(<HealthPage />);
    await waitFor(() => expect(screen.getByText(/api: ok/i)).toBeInTheDocument());
  });
});
