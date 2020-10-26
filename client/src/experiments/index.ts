import { Sample } from '../samples';

export { ExperimentRoutes } from './components/ExperimentRoutes';

export interface Experiment {
  _id: string;
  sample: string | Sample;
  target: string;
  methods: string[];
}
