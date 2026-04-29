import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ControlPanel from './ControlPanel';

describe('ControlPanel Component', () => {
  it('renders all sliders', () => {
    const mockHandlers = {
      onWindDirChange: () => {},
      onWindSpeedChange: () => {},
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

    expect(screen.getByDisplayValue('180')).toBeInTheDocument();
    expect(screen.getByDisplayValue('25')).toBeInTheDocument();
    expect(screen.getByDisplayValue('30')).toBeInTheDocument();
  });

  it('disables sliders when simulation is running', () => {
    const mockHandlers = {
      onWindDirChange: () => {},
      onWindSpeedChange: () => {},
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

    let inputs = screen.getAllByRole('slider');
    inputs.forEach((input) => {
      expect(input).not.toBeDisabled();
    });

    rerender(
      <ControlPanel
        windDir={180}
        windSpeed={25}
        userETA={30}
        isSimulationRunning={true}
        {...mockHandlers}
      />
    );

    inputs = screen.getAllByRole('slider');
    inputs.forEach((input) => {
      expect(input).toBeDisabled();
    });
  });

  it('shows correct button text based on isSimulationRunning', () => {
    const mockHandlers = {
      onWindDirChange: () => {},
      onWindSpeedChange: () => {},
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
