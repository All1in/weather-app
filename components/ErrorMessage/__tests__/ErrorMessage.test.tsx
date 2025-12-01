import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorMessage } from '../ErrorMessage';

describe('ErrorMessage', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders error message correctly', () => {
    render(<ErrorMessage message="Test error" onClose={mockOnClose} />);

    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<ErrorMessage message="Test error" onClose={mockOnClose} />);

    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('handles long error messages', () => {
    const longMessage = 'A'.repeat(500);
    render(<ErrorMessage message={longMessage} onClose={mockOnClose} />);

    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });

  it('handles special characters in error message', () => {
    const specialMessage = 'Error: <script>alert("XSS")</script>';
    render(<ErrorMessage message={specialMessage} onClose={mockOnClose} />);

    expect(screen.getByText(specialMessage)).toBeInTheDocument();
  });

  it('handles empty error message', () => {
    render(<ErrorMessage message="" onClose={mockOnClose} />);

    expect(screen.getByLabelText('Close')).toBeInTheDocument();
  });

  it('renders close button with correct aria-label', () => {
    render(<ErrorMessage message="Test error" onClose={mockOnClose} />);

    const closeButton = screen.getByLabelText('Close');
    expect(closeButton).toBeInTheDocument();
  });
});

