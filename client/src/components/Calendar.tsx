import generateCalendar from 'antd/es/calendar/generateCalendar';
import 'antd/es/calendar/style';
import { Dayjs } from 'dayjs';
import dayjsGenerateConfig from 'rc-picker/lib/generate/dayjs';

const Calendar = generateCalendar<Dayjs>(dayjsGenerateConfig);

export default Calendar;
