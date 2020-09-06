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
