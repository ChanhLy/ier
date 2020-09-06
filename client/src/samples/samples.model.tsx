export interface Sample {
  symbol: string;
  location: string;
  amount: string;
  description: string;
  type: string;
  experiments: [
    {
      method: string;
      targets: string[];
    }
  ];
}

export const SYMBOLS = [
  {
    label: 'NT',
    value: 'Nước thải',
  },
  {
    label: 'NC',
    value: 'Nước cấp',
  },
  {
    label: 'KK',
    value: 'Không khí',
  },
  {
    label: 'VB',
    value: 'Bùn thải',
  },
  {
    label: 'VD',
    value: 'Đất thải',
  },
  {
    label: 'VCTR',
    value: 'Chất thải rắn',
  },
];
