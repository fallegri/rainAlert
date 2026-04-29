import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ControlPanel from './ControlPanel';

describe('ControlPanel Component', () => {
  it('renders wind info and ETA slider', () => {
    const mockHandlers = {
      onUserETAChange: () => {},
      onSimulationStart: () => {},
      onSimulationCancel: () => {}
    };

    render(
      <ControlPanel
        windDir={180}
        windSpeed={25}
        userETA={30}
        isSimulationRunning={false}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('180°')).toBeInTheDocument();
    expect(screen.getByText('25 km/h')).toBeInTheDocument();
    expect(screen.getByDisplayValue('30')).toBeInTheDocument();
  });

  it('disables ETA slider when simulation is running', () => {
    const mockHandlers = {
      onUserETAChange: () => {},
      onSimulationStart: () => {},
      onSimulationCancel: () => {}
    };

    const { rerender } = render(
      <ControlPanel
        windDir={180}
        windSpeed={25}
        userETA={30}
        isSimulationRunning={false}
        {...mockHandlers}
      />
    );

    let input = screen.getByRole('slider');
    expect(input).not.toBeDisabled();

    rerender(
      <ControlPanel
        windDir={180}
        windSpeed={25}
        userETA={30}
        isSimulationRunning={true}
        {...mockHandlers}
      />
    );

    input = screen.getByRole('slider');
    expect(input).toBeDisabled();
  });

  it('shows correct button text based on isSimulationRunning', () => {
    const mockHandlers = {
      onUserETAChange: () => {},
      onSimulationStart: () => {},
      onSimulationCancel: () => {}
    };

    const { rerender } = render(
      <ControlPanel
        windDir={180}
        windSpeed={25}
        userETA={30}
        isSimulationRunning={false}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('Iniciar simulación acelerada')).toBeInTheDocument();

    rerender(
      <ControlPanel
        windDir={180}
        windSpeed={25}
        userETA={30}
        isSimulationRunning={true}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('Detener simulación')).toBeInTheDocument();
  });
});
