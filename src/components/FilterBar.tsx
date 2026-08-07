import React from 'react';

interface FilterBarProps {
  activeFilter: string;
  onSelectFilter: (filterId: string) => void;
}

interface FilterChip {
  id: string;
  label: string;
  subLabel?: string;
}

const FILTER_CHIPS: FilterChip[] = [
  { id: 'all', label: 'ทั้งหมด' },
  { id: '75mm', label: '75mm', subLabel: '(มาตรฐาน)' },
  { id: '100mm', label: '100mm', subLabel: '(จัมโบ้)' },
  { id: 'white', label: 'สีขาว' },
  { id: 'elbow', label: 'ข้องอ 90°' },
  { id: 'joint', label: 'ข้อต่อตรง' },
  { id: 'wall', label: 'ฝาครอบผนัง' },
  { id: 'flex', label: 'ท่อยืดหยุ่น' },
  { id: 'cream', label: 'สีครีม' },
  { id: 'gray', label: 'สีเทา' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  activeFilter,
  onSelectFilter
}) => {
  return (
    <div className="px-4 py-2 bg-[#F5F3EC]">
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
        {FILTER_CHIPS.map((chip) => {
          const isActive = activeFilter === chip.id;
          return (
            <button
              key={chip.id}
              onClick={() => onSelectFilter(chip.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-2xl text-xs font-semibold transition-all duration-200 border ${
                isActive
                  ? 'bg-[#1C1C1E] text-white border-[#1C1C1E] shadow-sm'
                  : 'bg-white text-neutral-800 border-neutral-200/90 hover:border-neutral-300 active:bg-neutral-50'
              }`}
            >
              <span>{chip.label}</span>
              {chip.subLabel && (
                <span className={`ml-1 text-[11px] font-normal ${isActive ? 'text-neutral-300' : 'text-neutral-500'}`}>
                  {chip.subLabel}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
