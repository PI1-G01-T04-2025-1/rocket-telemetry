import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { SVGProps } from 'react';

interface SuccessCreatedDialogProps {
  open?: boolean;
  handleRequestClose?: () => void;
}

export default function SuccessCreatedDialog({
  open,
  handleRequestClose,
}: SuccessCreatedDialogProps) {
  return (
    <Dialog open={open}>
      <DialogContent className='sm:max-w-[425px]'>
        <div className='flex flex-col items-center space-y-4 py-8'>
          <div className='rounded-full bg-green-100 p-4 dark:bg-green-900'>
            <CheckIcon className='h-6 w-6 text-green-500 dark:text-green-400' />
          </div>
          <div className='space-y-2 text-center'>
            <DialogTitle>Sucesso!</DialogTitle>
            <DialogDescription>
              Seu lançamento foi criado com sucesso. Você pode visualizar os
              detalhes do lançamento na sua lista de lançamentos.
            </DialogDescription>
          </div>
          <div className='flex flex-row gap-3'>
            <DialogClose asChild>
              <Button
                variant='outline'
                onClick={handleRequestClose}
                className='cursor-pointer'
              >
                Ok
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M20 6 9 17l-5-5' />
    </svg>
  );
}
