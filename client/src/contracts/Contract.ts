import { Dayjs } from 'dayjs';
import { Model } from '../components/Model';
import { Customer } from '../customers/Customer';

export interface Contract extends Model {
  customer: Partial<Customer>;

  samplingLocation: string;
  sampleReceivedDate: Dayjs;
  resultReturnDate: Dayjs;

  numberInMonth: number;
  date: string;
  readBy?: string[];
}
