/**
 * Calculates the distance between two points on the Earth specified by latitude and longitude using the Haversine formula.
 *
 * @author David
 *
 * @link https://en.wikipedia.org/wiki/Haversine_formula
 * @link https://pt.wikipedia.org/wiki/F%C3%B3rmula_de_haversine
 *
 *
 * @param lat1 lat for first point
 * @param lon1 lat for first point
 * @param lat2 lat for second point
 * @param lon2 lon for second point
 * @returns distance in meters
 */
export const haversine = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const toRadians = (angle: number) => (angle * Math.PI) / 180;

  const R = 6371e3; // Earth Radius (meters)
  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);
  const Δφ = toRadians(lat2 - lat1);
  const Δλ = toRadians(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};
