'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusIcon } from 'lucide-react';
import { z } from 'zod';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import SuccessCreatedDialog from './SuccessCreatedDialog';
import { useDisclose } from '@/hooks';
import { queryClient } from '@/lib';
import { useMutation } from '@tanstack/react-query';
import { createRocketLaunch } from '@/services/rocket/create-launch';

const schema = z.object({
  distance: z.coerce
    .number()
    .min(0.1, 'A distância deve ser um número positivo'),
  pressure: z.coerce.number().min(0.1, 'A pressão deve ser um número positivo'),
  water: z.coerce
    .number()
    .min(0.1, 'A quantidade de água deve ser um número positivo'),
});

type Schema = z.infer<typeof schema>;

export function CreateRocketLaunchDialog() {
  const { isOpen, onClose, onOpen } = useDisclose();
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: createRocketLaunch,
  });

  const onSubmit: SubmitHandler<Schema> = (data) => {
    mutation.mutate(
      {
        rocketId: '1',
        expectedDistance: data.distance,
        pressure: data.pressure,
        water: data.water,
      },
      {
        onSuccess: () => {
          setSuccessDialogOpen(true);
        },
        onError: (error) => {
          alert(error);
        },
      },
    );
  };

  const handleSuccessDialogClose = () => {
    if (setSuccessDialogOpen) setSuccessDialogOpen(false);
    reset();
    queryClient.invalidateQueries({
      queryKey: ['rocketLaunches'],
    });
    onClose();
  };

  return (
    <>
      <SuccessCreatedDialog
        open={successDialogOpen}
        handleRequestClose={handleSuccessDialogClose}
      />
      <Dialog
        open={isOpen}
        onOpenChange={(open) => (open ? onOpen() : onClose())}
      >
        <DialogTrigger asChild>
          <Button>
            <PlusIcon />
            Lançamento
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Criar lançamento</DialogTitle>
            <DialogDescription>
              Insira as infomações inicais do lançamento do foguete e buscaremos
              o resto para você.
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4'>
            <div className='grid gap-3'>
              <Label htmlFor='distance-1-select'>Distância</Label>

              <Controller
                control={control}
                name='distance'
                render={({ field }) => (
                  <>
                    <Select
                      value={field.value ? String(field.value) : ''}
                      onValueChange={(value) => {
                        field.onChange(Number(value));
                        field.onBlur();
                      }}
                      {...(errors.distance && {
                        'aria-invalid': true,
                        'aria-describedby': 'distance-error',
                      })}
                    >
                      <SelectTrigger id='distance-1-select'>
                        <SelectValue placeholder='Distância' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Distância</SelectLabel>
                          {[10, 20, 30].map((distance) => (
                            <SelectItem key={distance} value={String(distance)}>
                              {distance}m
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {errors.distance && (
                      <p
                        id='distance-error'
                        className='peer-aria-invalid:text-destructive mt-2 text-xs text-red-400'
                        role='alert'
                        aria-live='polite'
                      >
                        {errors.distance.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
            <div className='grid gap-3'>
              <Label htmlFor='pressure'>Pressão</Label>
              <div className='relative'>
                <Input
                  id='pressure'
                  className='peer pe-12'
                  placeholder='1'
                  type='number'
                  min={0}
                  step={0.1}
                  {...register('pressure')}
                  {...(errors.pressure && {
                    'aria-invalid': true,
                    'aria-describedby': 'pressure-error',
                  })}
                />
                <span className='text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm peer-disabled:opacity-50'>
                  psi
                </span>
              </div>

              {errors.pressure && (
                <p
                  id='pressure-error'
                  className='peer-aria-invalid:text-destructive mt-2 text-xs text-red-400'
                  role='alert'
                  aria-live='polite'
                >
                  {errors.pressure.message}
                </p>
              )}
            </div>
            <div className='grid gap-3'>
              <Label htmlFor='pressure'>Quantidade de água</Label>
              <div className='relative'>
                <Input
                  id='water'
                  className='peer pe-12'
                  placeholder='1'
                  type='number'
                  min={0}
                  step={0.1}
                  {...register('water')}
                  {...(errors.water && {
                    'aria-invalid': true,
                    'aria-describedby': 'water-error',
                  })}
                />
                <span className='text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm peer-disabled:opacity-50'>
                  ml
                </span>
              </div>
              {errors.water && (
                <p
                  id='water-error'
                  className='peer-aria-invalid:text-destructive mt-2 text-xs text-red-400'
                  role='alert'
                  aria-live='polite'
                >
                  {errors.water.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant='outline'
                className='cursor-pointer'
                onClick={() => {
                  reset();
                }}
                disabled={!mutation.isIdle}
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type='submit'
              className='cursor-pointer'
              onClick={handleSubmit(onSubmit)}
              isLoading={mutation.isPending}
            >
              Criar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
