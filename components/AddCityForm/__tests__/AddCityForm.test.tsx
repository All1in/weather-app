import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AddCityForm } from '../AddCityForm';
import { useCityStore } from '@/store/useCityStore';

jest.mock('@/store/useCityStore');

const mockUseCityStore = useCityStore as jest.MockedFunction<typeof useCityStore>;

describe('AddCityForm', () => {
  const mockAddCity = jest.fn();
  const mockCities = [
    {
      id: '1',
      name: 'Kyiv',
      country: 'UA',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCityStore.mockImplementation((selector) => {
      const state = {
        addCity: mockAddCity,
        cities: mockCities,
      };
      return selector(state as any);
    });
  });

  it('renders input and button', () => {
    render(<AddCityForm />);

    expect(
      screen.getByPlaceholderText(/Enter city name/i)
    ).toBeInTheDocument();
    expect(screen.getByText('Add City')).toBeInTheDocument();
  });

  it('calls addCity when form is submitted with valid city name', async () => {
    mockAddCity.mockResolvedValue(undefined);

    render(<AddCityForm />);

    const input = screen.getByPlaceholderText(/Enter city name/i);
    const button = screen.getByText('Add City');

    fireEvent.change(input, { target: { value: 'London' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockAddCity).toHaveBeenCalledWith('London');
    });
  });

  it('does not call addCity when input is empty', () => {
    render(<AddCityForm />);

    const button = screen.getByRole('button', { name: /Add City/i });
    expect(button).toBeDisabled();

    fireEvent.click(button);

    expect(mockAddCity).not.toHaveBeenCalled();
  });

  it('shows alert when trying to add duplicate city', async () => {
    window.alert = jest.fn();
    mockAddCity.mockResolvedValue(undefined);

    render(<AddCityForm />);

    const input = screen.getByPlaceholderText(/Enter city name/i);
    const button = screen.getByText('Add City');

    fireEvent.change(input, { target: { value: 'Kyiv' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        'This city is already in your list!'
      );
    });

    expect(mockAddCity).not.toHaveBeenCalled();
  });

  it('clears input after successful city addition', async () => {
    mockAddCity.mockResolvedValue(undefined);

    render(<AddCityForm />);

    const input = screen.getByPlaceholderText(/Enter city name/i) as HTMLInputElement;
    const button = screen.getByText('Add City');

    fireEvent.change(input, { target: { value: 'Paris' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockAddCity).toHaveBeenCalled();
      expect(input.value).toBe('');
    });
  });

  it('trims whitespace from city name', async () => {
    mockAddCity.mockResolvedValue(undefined);

    render(<AddCityForm />);

    const input = screen.getByPlaceholderText(/Enter city name/i);
    const button = screen.getByText('Add City');

    fireEvent.change(input, { target: { value: '  New York  ' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockAddCity).toHaveBeenCalledWith('New York');
    });
  });

  it('handles case-insensitive duplicate detection', async () => {
    window.alert = jest.fn();
    mockUseCityStore.mockImplementation((selector) => {
      const state = {
        addCity: mockAddCity,
        cities: [{ id: '1', name: 'Kyiv', country: 'UA' }],
      };
      return selector(state as any);
    });

    render(<AddCityForm />);

    const input = screen.getByPlaceholderText(/Enter city name/i);
    const button = screen.getByText('Add City');

    // Different cases
    fireEvent.change(input, { target: { value: 'KYIV' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalled();
      expect(mockAddCity).not.toHaveBeenCalled();
    });
  });

  it('handles special characters in city name', async () => {
    mockAddCity.mockResolvedValue(undefined);

    render(<AddCityForm />);

    const input = screen.getByPlaceholderText(/Enter city name/i);
    const button = screen.getByText('Add City');

    fireEvent.change(input, { target: { value: "São Paulo" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockAddCity).toHaveBeenCalledWith('São Paulo');
    });
  });

  it('handles very long city names', async () => {
    mockAddCity.mockResolvedValue(undefined);

    render(<AddCityForm />);

    const input = screen.getByPlaceholderText(/Enter city name/i);
    const button = screen.getByText('Add City');

    const longName = 'A'.repeat(100);
    fireEvent.change(input, { target: { value: longName } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockAddCity).toHaveBeenCalledWith(longName);
    });
  });

  it('disables button during submission', async () => {
    mockAddCity.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<AddCityForm />);

    const input = screen.getByPlaceholderText(/Enter city name/i);
    const button = screen.getByRole('button', { name: /Add City/i });

    fireEvent.change(input, { target: { value: 'London' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(button).toBeDisabled();
    });
  });

  it('handles API error during submission', async () => {
    const error = new Error('City not found');
    mockAddCity.mockRejectedValue(error);

    render(<AddCityForm />);

    const input = screen.getByPlaceholderText(/Enter city name/i) as HTMLInputElement;
    const button = screen.getByText('Add City');

    fireEvent.change(input, { target: { value: 'InvalidCity123' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockAddCity).toHaveBeenCalled();
      // Input should remain after error (not cleared)
      expect(input.value).toBe('InvalidCity123');
    });
  });

  it('handles form submission via Enter key', async () => {
    mockAddCity.mockResolvedValue(undefined);

    render(<AddCityForm />);

    const input = screen.getByPlaceholderText(/Enter city name/i);
    const form = input.closest('form');

    fireEvent.change(input, { target: { value: 'Paris' } });
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(mockAddCity).toHaveBeenCalledWith('Paris');
    });
  });

  it('does not submit on Enter when input is empty', () => {
    render(<AddCityForm />);

    const input = screen.getByPlaceholderText(/Enter city name/i);

    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(mockAddCity).not.toHaveBeenCalled();
  });

  it('handles only whitespace input', () => {
    render(<AddCityForm />);

    const input = screen.getByPlaceholderText(/Enter city name/i);
    const button = screen.getByRole('button', { name: /Add City/i });

    fireEvent.change(input, { target: { value: '   ' } });
    
    expect(button).toBeDisabled();
    fireEvent.click(button);

    expect(mockAddCity).not.toHaveBeenCalled();
  });

  it('handles numeric input', async () => {
    mockAddCity.mockResolvedValue(undefined);

    render(<AddCityForm />);

    const input = screen.getByPlaceholderText(/Enter city name/i);
    const button = screen.getByText('Add City');

    fireEvent.change(input, { target: { value: '123' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockAddCity).toHaveBeenCalledWith('123');
    });
  });
});

