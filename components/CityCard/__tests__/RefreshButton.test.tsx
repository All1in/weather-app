import { render, screen, fireEvent } from '@testing-library/react';
import { RefreshButton } from '../RefreshButton';

describe('RefreshButton', () => {
  const mockOnRefresh = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders refresh button correctly', () => {
    render(
      <RefreshButton
        onRefresh={mockOnRefresh}
        isLoading={false}
        lastUpdated={Date.now()}
      />
    );

    expect(screen.getByText('Refresh')).toBeInTheDocument();
  });

  it('calls onRefresh when clicked', () => {
    render(
      <RefreshButton
        onRefresh={mockOnRefresh}
        isLoading={false}
        lastUpdated={Date.now()}
      />
    );

    const button = screen.getByText('Refresh');
    fireEvent.click(button);

    expect(mockOnRefresh).toHaveBeenCalledTimes(1);
  });

  it('shows loading state correctly', () => {
    render(
      <RefreshButton
        onRefresh={mockOnRefresh}
        isLoading={true}
        lastUpdated={Date.now()}
      />
    );

    expect(screen.getByText('Updating...')).toBeInTheDocument();
    const button = screen.getByLabelText('Refresh weather data');
    expect(button).toBeDisabled();
  });

  it('displays "Just now" for recent updates', () => {
    render(
      <RefreshButton
        onRefresh={mockOnRefresh}
        isLoading={false}
        lastUpdated={Date.now() - 1000} // 1 second ago
      />
    );

    expect(screen.getByText('Just now')).toBeInTheDocument();
  });

  it('displays minutes ago correctly', () => {
    render(
      <RefreshButton
        onRefresh={mockOnRefresh}
        isLoading={false}
        lastUpdated={Date.now() - 5 * 60 * 1000} // 5 minutes ago
      />
    );

    expect(screen.getByText('5m ago')).toBeInTheDocument();
  });

  it('displays hours ago correctly', () => {
    render(
      <RefreshButton
        onRefresh={mockOnRefresh}
        isLoading={false}
        lastUpdated={Date.now() - 2 * 60 * 60 * 1000} // 2 hours ago
      />
    );

    expect(screen.getByText('2h ago')).toBeInTheDocument();
  });

  it('handles missing lastUpdated gracefully', () => {
    render(
      <RefreshButton
        onRefresh={mockOnRefresh}
        isLoading={false}
        lastUpdated={undefined}
      />
    );

    expect(screen.getByText('Refresh')).toBeInTheDocument();
    expect(screen.queryByText(/ago/i)).not.toBeInTheDocument();
  });

  it('prevents multiple clicks during loading', () => {
    render(
      <RefreshButton
        onRefresh={mockOnRefresh}
        isLoading={true}
        lastUpdated={Date.now()}
      />
    );

    const button = screen.getByText('Updating...');
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    // Should not call onRefresh when disabled
    expect(mockOnRefresh).not.toHaveBeenCalled();
  });

  it('handles very old lastUpdated', () => {
    render(
      <RefreshButton
        onRefresh={mockOnRefresh}
        isLoading={false}
        lastUpdated={Date.now() - 25 * 60 * 60 * 1000} // 25 hours ago
      />
    );

    expect(screen.getByText('25h ago')).toBeInTheDocument();
  });
});

