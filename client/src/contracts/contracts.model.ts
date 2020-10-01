import { Dayjs } from 'dayjs';
import { Model } from '../components/Model';
import { Customer } from '../customers/Customer';
import { Sample } from '../samples';

export interface Contract extends Model {
  samples: Sample[];
  customer: Partial<Customer>;
  customerId: string;

  samplingLocation: string;
  sampleReceivedDate: Dayjs;
  resultReturnDate: Dayjs;

  readBy?: string[];
}
