import { Sample } from '../samples';
import { Experiment, ExperimentBase, ExperimentDocument } from './experiments.model';

export class ExperimentService {
  async seenAllByUser(userId: string): Promise<unknown> {
    const results = await Experiment.updateMany(
      { readBy: { $ne: userId } },
      { $push: { readBy: userId } },
      { timestamps: false }
    ).exec();
    console.log(results);

    return results;
  }
  createExperiment(body: ExperimentBase): Promise<ExperimentDocument> {
    return Experiment.create(body);
  }

  async updateExperiment(_id: string, body: Partial<ExperimentDocument>): Promise<boolean> {
    await Experiment.updateOne({ _id }, { ...body, readBy: [] }).exec();
    return true;
  }

  async deleteExperiment(_id: string): Promise<boolean> {
    await Experiment.updateOne({ _id }, { deletedAt: new Date() }).exec();
    return true;
  }

  findExperiments(query: Partial<ExperimentDocument>): Promise<ExperimentDocument[]> {
    return Experiment.find({ ...query, deletedAt: undefined })
      .sort({ updatedAt: 'desc' })
      .exec();
  }

  findExperimentById(id: string): Promise<ExperimentDocument | null> {
    return Experiment.findById(id).populate({ path: 'sample', model: Sample }).exec();
  }

  async createExperiments(value: ExperimentBase[]): Promise<ExperimentDocument[]> {
    return Experiment.insertMany(value);
  }

  async addReadByUser(experiment: ExperimentDocument, userId: string): Promise<ExperimentDocument> {
    if (!experiment.readBy.includes(userId)) {
      experiment.readBy.push(userId);
      return experiment.save({ timestamps: false });
    }
    return experiment;
  }
}
