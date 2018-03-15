const fs = require('fs');

fs.copyFile('src/TimePicker.less', 'dist/TimePicker.less', (error) => {
  if (error) {
    throw error;
  }
  // eslint-disable-next-line no-console
  console.log('TimePicker.less copied successfully.');
});
