import { Experiment, Sample } from '..';
import {
  AMOUNT,
  NOTE,
  SAMPLE_DESCRIPTION,
  SAMPLE_ID,
  SAMPLE_SYMBOL,
  SAMPLE_TYPE,
  SAMPLING_LOCATION,
  TARGET_AND_METHOD,
  UNIT,
} from '../../utils/constants';

export const symbolColumn = { title: SAMPLE_SYMBOL, dataIndex: 'symbol' };
export const locationColumn = { title: SAMPLING_LOCATION, dataIndex: 'location' };
export const descriptionColumn = { title: SAMPLE_DESCRIPTION, dataIndex: 'description' };
export const amountColumn = { title: AMOUNT, dataIndex: 'amount' };
export const unitColumn = { title: UNIT, dataIndex: 'unit' };
export const typeColumn = { title: SAMPLE_TYPE, dataIndex: 'type' };
export const experimentsColumn = {
  title: TARGET_AND_METHOD,
  dataIndex: 'experiments',
  render: (value: Experiment[], record: Sample, index: number) => {
    return toTargetAndMethods(value);
  },
};
export const noteColumn = { title: NOTE, dataIndex: 'note' };

function toTargetAndMethods(value: Experiment[]) {
  return (
    value
      .map((experiment) => {
        console.log(experiment);
        const target = experiment.target;
        const methods = experiment.methods?.join(',');
        return target + (methods ? ` (${methods})` : '');
      })
      .join(', ') + ` (${value.length} chỉ tiêu)`
  );
}
export const idColumn = { title: SAMPLE_ID, dataIndex: '_id' };
