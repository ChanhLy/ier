import { Experiment } from '../experiments';

export { CreateSamplesTable } from './components/CreateSamplesTable';
export { SampleForm } from './components/SampleForm';
export { SampleRoutes } from './components/SampleRoutes';
export { SampleTable } from './components/SampleTable';
export { ListSamplesPage } from './pages/ListSamplesPage';

export interface Sample {
  symbol: string;
  location: string;
  amount: string;
  description: string;
  type: string;
  experiments: [Experiment];
}
