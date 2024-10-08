'use client';

import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { formUrlQuery } from '@/lib/utils';
import {
  useRouter,
  useSearchParams
} from 'next/navigation';

interface Props {
  filters: {
    name: string;
    value: string;
  }[];
  otherClasses?: string;
  containerClasses?: string;
}

const Filter = ({
  filters,
  otherClasses,
  containerClasses
}: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const paramsFilter = searchParams.get('filter');

  const handleUpdateParams = (value: string) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: 'filter',
      value
    });

    router.push(newUrl, { scroll: false });
  };

  return (
    <div className={`relative ${containerClasses}`}>
      <Select
        onValueChange={handleUpdateParams}
        defaultValue={paramsFilter || undefined}
      >
        <SelectTrigger
          className={`${otherClasses} body-regular light-border background-light800_darkgradient text-dark500_light700 border px-5 py-2.5`}
        >
          <div className='line-clamp-1 flex-1 text-left'>
            <SelectValue placeholder='Select a Filter' />
          </div>
        </SelectTrigger>
        <SelectContent className='bg-light-900 dark:border-dark-400 dark:bg-dark-300'>
          <SelectGroup>
            {filters.map((item) => (
              <SelectItem
                key={item.value}
                value={item.value}
                className='text-dark500_light700 focus:bg-light-800 dark:focus:bg-dark-400'
              >
                {item.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filter;
