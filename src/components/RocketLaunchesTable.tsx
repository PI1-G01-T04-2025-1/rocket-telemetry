/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  RowData,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  EyeIcon,
  SearchIcon,
} from 'lucide-react';
import { useId, useMemo, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from './ui/button';
import { RocketLaunchesResponse } from '@/services/rocket/get-launches';

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: 'text' | 'range' | 'select';
  }
}

type Item = {
  id: string;
  distance: number;
  water: number;
  pressure: number;
  date: string;
  details: string;
};

const columns: ColumnDef<Item>[] = [
  {
    header: '#',
    accessorKey: 'id',
    cell: ({ row }) => <div className='font-medium'>{row.getValue('id')}</div>,
  },
  {
    header: 'Qtd. água (ml)',
    accessorKey: 'water',
    cell: ({ row }) => (
      <div className='font-medium'>{row.getValue('water')}</div>
    ),
    meta: {
      filterVariant: 'range',
    },
  },
  {
    header: 'Distancia (m)',
    accessorKey: 'distance',
    cell: ({ row }) => {
      return <div className='flex gap-1'>{row.getValue('distance')}</div>;
    },
    enableSorting: false,
    meta: {
      filterVariant: 'select',
    },
    filterFn: (row, id, filterValue) => {
      const rowValue = row.getValue(id);
      return Number(rowValue) === Number(filterValue);
    },
  },
  {
    header: 'Pressão (psi)',
    accessorKey: 'pressure',
    cell: ({ row }) => {
      return row.getValue('pressure');
    },
    meta: {
      filterVariant: 'range',
    },
  },
  {
    header: 'Data',
    accessorKey: 'date',
    cell: ({ row }) => {
      const date = new Date(row.getValue('date'));
      return new Intl.DateTimeFormat('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(date);
    },
  },
  {
    header: 'Ações',
    accessorKey: 'details',
    cell: ({ row }) => (
      <Button variant='secondary' size='icon' className='h-8 w-8 p-0' asChild>
        <Link href={`/launch/${row.getValue('details')}`}>
          <EyeIcon className='h-4 w-4' />
        </Link>
      </Button>
    ),
    enableSorting: false,
  },
];

interface IProps {
  data: Item[];
}

export function RocketLaunchesTable({ data }: IProps) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'id',
      desc: false,
    },
  ]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
  });

  return (
    <div className='space-y-6'>
      {/* Filters */}
      <div className='flex flex-wrap gap-3'>
        <div className='w-44'>
          <Filter column={table.getColumn('id')!} />
        </div>
        <div className='w-44'>
          <Filter column={table.getColumn('distance')!} />
        </div>
        <div className='w-36'>
          <Filter column={table.getColumn('water')!} />
        </div>
        <div className='w-36'>
          <Filter column={table.getColumn('pressure')!} />
        </div>
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className='bg-muted/50'>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className='relative h-10 border-t select-none'
                    aria-sort={
                      header.column.getIsSorted() === 'asc'
                        ? 'ascending'
                        : header.column.getIsSorted() === 'desc'
                          ? 'descending'
                          : 'none'
                    }
                  >
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <div
                        className={cn(
                          header.column.getCanSort() &&
                            'flex h-full cursor-pointer items-center justify-between gap-2 select-none',
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                        onKeyDown={(e) => {
                          // Enhanced keyboard handling for sorting
                          if (
                            header.column.getCanSort() &&
                            (e.key === 'Enter' || e.key === ' ')
                          ) {
                            e.preventDefault();
                            header.column.getToggleSortingHandler()?.(e);
                          }
                        }}
                        tabIndex={header.column.getCanSort() ? 0 : undefined}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {{
                          asc: (
                            <ChevronUpIcon
                              className='shrink-0 opacity-60'
                              size={16}
                              aria-hidden='true'
                            />
                          ),
                          desc: (
                            <ChevronDownIcon
                              className='shrink-0 opacity-60'
                              size={16}
                              aria-hidden='true'
                            />
                          ),
                        }[header.column.getIsSorted() as string] ?? (
                          <span className='size-4' aria-hidden='true' />
                        )}
                      </div>
                    ) : (
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className='h-24 text-center'>
                Nenhum dado encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function Filter({ column }: { column: Column<any, unknown> }) {
  const id = useId();
  const columnFilterValue = column.getFilterValue();
  const { filterVariant } = column.columnDef.meta ?? {};
  const columnHeader =
    typeof column.columnDef.header === 'string' ? column.columnDef.header : '';
  const sortedUniqueValues = useMemo(() => {
    if (filterVariant === 'range') return [];

    // Get all unique values from the column
    const values = Array.from(column.getFacetedUniqueValues().keys());

    // If the values are arrays, flatten them and get unique items
    const flattenedValues = values.reduce((acc: string[], curr) => {
      if (Array.isArray(curr)) {
        return [...acc, ...curr];
      }
      return [...acc, curr];
    }, []);

    // Get unique values and sort them
    return Array.from(new Set(flattenedValues)).sort();
  }, [column.getFacetedUniqueValues(), filterVariant]);

  if (filterVariant === 'range') {
    return (
      <div className='*:not-first:mt-2'>
        <Label>{columnHeader}</Label>
        <div className='flex'>
          <Input
            id={`${id}-range-1`}
            className='flex-1 rounded-e-none [-moz-appearance:_textfield] focus:z-10 [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none'
            value={(columnFilterValue as [number, number])?.[0] ?? ''}
            onChange={(e) =>
              column.setFilterValue((old: [number, number]) => [
                e.target.value ? Number(e.target.value) : undefined,
                old?.[1],
              ])
            }
            placeholder='Min.'
            type='number'
            aria-label={`${columnHeader} min`}
          />
          <Input
            id={`${id}-range-2`}
            className='-ms-px flex-1 rounded-s-none [-moz-appearance:_textfield] focus:z-10 [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none'
            value={(columnFilterValue as [number, number])?.[1] ?? ''}
            onChange={(e) =>
              column.setFilterValue((old: [number, number]) => [
                old?.[0],
                e.target.value ? Number(e.target.value) : undefined,
              ])
            }
            placeholder='Máx.'
            type='number'
            aria-label={`${columnHeader} max`}
          />
        </div>
      </div>
    );
  }

  if (filterVariant === 'select') {
    return (
      <div className='*:not-first:mt-2'>
        <Label htmlFor={`${id}-select`}>{columnHeader}</Label>
        <Select
          value={columnFilterValue?.toString() ?? 'all'}
          onValueChange={(value) => {
            column.setFilterValue(value === 'all' ? undefined : value);
          }}
        >
          <SelectTrigger id={`${id}-select`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Todas</SelectItem>
            {sortedUniqueValues.map((value) => (
              <SelectItem key={String(value)} value={String(value)}>
                {String(value) + 'm'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className='*:not-first:mt-2'>
      <Label htmlFor={`${id}-input`}>{columnHeader}</Label>
      <div className='relative'>
        <Input
          id={`${id}-input`}
          className='peer ps-9'
          value={(columnFilterValue ?? '') as string}
          onChange={(e) => column.setFilterValue(e.target.value)}
          placeholder={`Buscar ${columnHeader.toLowerCase()}`}
          type='text'
        />
        <div className='text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50'>
          <SearchIcon size={16} />
        </div>
      </div>
    </div>
  );
}
