import { Sample } from '../samples';
import { Experiment, ExperimentBase, ExperimentDocument } from './experiments.model';

export class ExperimentService {
  createExperiment(body: ExperimentBase): Promise<ExperimentDocument> {
    return Experiment.create(body);
  }
  async updateExperiment(_id: string, body: Partial<ExperimentDocument>): Promise<boolean> {
    await Experiment.updateOne({ _id }, body).exec();
    return true;
  }
  async deleteExperiment(_id: string): Promise<boolean> {
    await Experiment.updateOne({ _id }, { deletedAt: new Date() }).exec();
    return true;
  }
  findExperiments(query: Partial<ExperimentDocument>): Promise<ExperimentDocument[]> {
    return Experiment.find({ ...query, deletedAt: undefined }).exec();
  }
  findExperimentById(id: string): Promise<ExperimentDocument | null> {
    return Experiment.findById(id).populate({ path: 'sample', model: Sample }).exec();
  }
  async createExperiments(value: ExperimentBase[]): Promise<ExperimentDocument[]> {
    return Experiment.insertMany(value);
  }
}
