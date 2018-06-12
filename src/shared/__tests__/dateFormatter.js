import { formatTime } from '../dateFormatter';

describe('formatTime', () => {
  it('returns proper full time', () => {
    const date = new Date(2017, 1, 1, 13, 27);

    const formattedTime = formatTime(date, 'en-US');

    expect(formattedTime).toBe('1:27:00 PM');
  });
});
