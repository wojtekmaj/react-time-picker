const fs = require('fs');

fs.copyFile('src/TimePicker.less', 'dist/TimePicker.less', (error) => {
  if (error) {
    throw error;
  }
  // eslint-disable-next-line no-console
  console.log('TimePicker.less copied successfully.');
});

fs.copyFile('src/TimePicker.css', 'dist/TimePicker.css', (error) => {
  if (error) {
    throw error;
  }
  // eslint-disable-next-line no-console
  console.log('TimePicker.css copied successfully.');
});
