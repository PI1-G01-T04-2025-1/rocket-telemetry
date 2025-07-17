// @jest-environment node
import { convertCordinateToDecimal, totalDistance, calculateAverageSpeed, GPGPADto } from './utils';

describe('convertCordinateToDecimal', () => {
  it('converte coordenada e direção corretamente', () => {
    expect(convertCordinateToDecimal(1559.39153, 'S')).toBeCloseTo(-15.9898588, 5);
    expect(convertCordinateToDecimal(4802.66657, 'W')).toBeCloseTo(-48.0444428, 5);
    expect(convertCordinateToDecimal(1559.39153, 'N')).toBeCloseTo(15.9898588, 5);
    expect(convertCordinateToDecimal(4802.66657, 'E')).toBeCloseTo(48.0444428, 5);
  });
});

describe('totalDistance', () => {
  it('calcula a distância total entre pontos GPS', () => {
    const data: { lat: [number, string]; lon: [number, string] }[] = [
      { lat: [1559.39153, 'S'], lon: [4802.66657, 'W'] },
      { lat: [1559.39149, 'S'], lon: [4802.66671, 'W'] },
    ];
    const dist = totalDistance(data);
    expect(dist).toBeGreaterThan(0);
  });
});

describe('calculateAverageSpeed', () => {
  it('calcula velocidade média corretamente', () => {
    expect(calculateAverageSpeed(100, 10)).toBe(10);
    expect(calculateAverageSpeed(0, 10)).toBe(0);
    expect(calculateAverageSpeed(100, 0)).toBe(0);
  });
});

describe('GPGPADto', () => {
  it('converte string NMEA GPGGA em objeto', () => {
    const raw = '$GPGGA,215611.00,1559.39153,S,04802.66657,W,1,08,1.02,1231.9,M,-11.7,M,,*45';
    const obj = GPGPADto(raw);
    expect(obj).toHaveProperty('date', '215611.00');
    expect(obj).toHaveProperty('lat');
    expect(obj).toHaveProperty('lon');
    expect(obj).toHaveProperty('altitude', 1231.9);
    expect(obj).toHaveProperty('gpsQualityIndicator', 1);
    expect(obj).toHaveProperty('numSatellites', 8);
  });

  it('lança erro para string inválida', () => {
    expect(() => GPGPADto('invalid')).toThrow();
    expect(() => GPGPADto('$GPGGA,1,2,3')).toThrow();
  });
}); 