import { Experiment, ExperimentBase, ExperimentDocument } from './experiments.model';

export class ExperimentService {
  async createExperiments(value: ExperimentBase[]): Promise<ExperimentDocument[]> {
    return Experiment.insertMany(value);
  }
}
