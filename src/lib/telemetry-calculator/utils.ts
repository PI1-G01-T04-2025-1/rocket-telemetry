import { haversine } from './haversine';

export function convertCordinateToDecimal(coord: number, direction: string) {
  const degrees = Math.floor(coord / 100);
  const minutes = coord - degrees * 100;
  const decimal = degrees + minutes / 60;
  const auxiliary = direction === 'S' || direction === 'W' ? -1 : 1;

  return decimal * auxiliary;
}

/**
 *
 *  Calculates the total distance traveled based on an array of GPS cordinates
 *
 *
 * @param data - Array of GPS coordinates, each containing latitude and longitude.
 *
 * @returns {number} - Total distance in meters
 */

export function totalDistance(
  data: Array<{ lat: [number, string]; lon: [number, string] }>,
): number {
  let total = 0;

  for (let i = 0; i < data.length - 1; i++) {
    const lat1 = convertCordinateToDecimal(data[i].lat[0], data[i].lat[1]);
    const lon1 = convertCordinateToDecimal(data[i].lon[0], data[i].lon[1]);
    const lat2 = convertCordinateToDecimal(
      data[i + 1].lat[0],
      data[i + 1].lat[1],
    );
    const lon2 = convertCordinateToDecimal(
      data[i + 1].lon[0],
      data[i + 1].lon[1],
    );

    total += haversine(lat1, lon1, lat2, lon2);
  }

  return total;
}

/**
 *  Calculates the average speed based on total distance and total time.
 *
 * @param totalDistance - distance traveled in meters
 * @param totalTime - time taken in seconds
 *
 * @returns {number} - avg speed in m/s
 *
 * */

export function calculateAverageSpeed(
  totalDistance: number,
  totalTime: number,
): number {
  if (totalTime === 0) return 0;
  return totalDistance / totalTime;
}

export function GPGPADto(rawData: string) {
  const data = rawData.split(',');

  if (data.length < 6) {
    throw new Error('Invalid GPGGA data');
  }

  if (data[0] !== '$GPGGA') {
    throw new Error('Invalid GPGGA data');
  }

  const date = data[1];
  const lat = parseFloat(data[2]);
  const latDirection = data[3];
  const lon = parseFloat(data[4]);
  const lonDirection = data[5];

  const gpsQualityIndicator = parseInt(data[6], 10);
  const numSatellites = parseInt(data[7], 10);
  const hdop = parseFloat(data[8]);
  const altitude = parseFloat(data[9]);
  const geoidicSeparation = parseFloat(data[11]);

  return {
    date,
    lat: [lat, latDirection],
    lon: [lon, lonDirection],
    gpsQualityIndicator,
    numSatellites,
    hdop,
    altitude,
    geoidicSeparation,
  };
}

export function hhMMSSssToSeconds(hhMMSSss: string): number {
  const splited = hhMMSSss.replace('.', '').split('');

  const hours = parseInt(splited.slice(0, 2).join(''), 10);
  const minutes = parseInt(splited.slice(2, 4).join(''), 10);
  const seconds = parseInt(splited.slice(4, 6).join(''), 10);
  const milliseconds = parseInt(splited.slice(6, 8).join(''), 10);
  return hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
}

export function hhmmssmsToDate(hhmmssms: string): Date {
  const splited = hhmmssms.replace('.', '').split('');

  const hours = parseInt(splited.slice(0, 2).join(''), 10);
  const minutes = parseInt(splited.slice(2, 4).join(''), 10);
  const seconds = parseInt(splited.slice(4, 6).join(''), 10);
  const milliseconds = parseInt(splited.slice(6, 8).join(''), 10);

  const date = new Date();
  date.setHours(hours, minutes, seconds, milliseconds);

  return date;
}

export function diferenceInSeconds(date1: Date, date2: Date): number {
  return Math.floor((date2.getTime() - date1.getTime()) / 1000);
}
