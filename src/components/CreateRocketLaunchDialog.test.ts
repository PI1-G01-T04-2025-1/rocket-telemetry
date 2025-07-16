import { z } from 'zod';

// Replicar o schema do componente para teste isolado
const schema = z.object({
  distance: z.coerce.number().min(0.1, 'A distância deve ser um número positivo'),
  pressure: z.coerce.number().min(0.1, 'A pressão deve ser um número positivo'),
  water: z.coerce.number().min(0.1, 'A quantidade de água deve ser um número positivo'),
});

describe('Validação dos dados manuais (schema Zod)', () => {
  it('aceita valores válidos', () => {
    const data = { distance: 10, pressure: 2, water: 100 };
    expect(() => schema.parse(data)).not.toThrow();
  });

  it('rejeita valores negativos', () => {
    expect(() => schema.parse({ distance: -1, pressure: 2, water: 100 })).toThrow();
    expect(() => schema.parse({ distance: 10, pressure: -2, water: 100 })).toThrow();
    expect(() => schema.parse({ distance: 10, pressure: 2, water: -100 })).toThrow();
  });

  it('rejeita valores zero', () => {
    expect(() => schema.parse({ distance: 0, pressure: 2, water: 100 })).toThrow();
    expect(() => schema.parse({ distance: 10, pressure: 0, water: 100 })).toThrow();
    expect(() => schema.parse({ distance: 10, pressure: 2, water: 0 })).toThrow();
  });

  it('rejeita valores vazios', () => {
    expect(() => schema.parse({ distance: '', pressure: 2, water: 100 })).toThrow();
    expect(() => schema.parse({ distance: 10, pressure: '', water: 100 })).toThrow();
    expect(() => schema.parse({ distance: 10, pressure: 2, water: '' })).toThrow();
  });

  it('rejeita valores não numéricos', () => {
    expect(() => schema.parse({ distance: 'abc', pressure: 2, water: 100 })).toThrow();
    expect(() => schema.parse({ distance: 10, pressure: 'xyz', water: 100 })).toThrow();
    expect(() => schema.parse({ distance: 10, pressure: 2, water: 'foo' })).toThrow();
  });
}); 