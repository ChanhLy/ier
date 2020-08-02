import { Model } from '../components/Model';
import { Customer } from '../customers/Customer';

export interface Contract extends Model {
  customer: Partial<Customer>;

  samplingLocation: string;
  sampleReceivedDate: Date;
  resultReturnDate: Date;

  numberInMonth: number;
  date: string;
}
