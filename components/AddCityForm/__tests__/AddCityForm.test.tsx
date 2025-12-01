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
    mockUseCityStore.mockReturnValue({
      addCity: mockAddCity,
      cities: mockCities,
    } as any);
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

    const button = screen.getByText('Add City');
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
});

