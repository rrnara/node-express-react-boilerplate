const crypto = require('crypto');
const argument = process.argv[2] || '48';
const bytes = Number.parseInt(argument);

if (Number.isInteger(bytes)) {
  crypto.randomBytes(bytes, function(err, buffer) {
    if (err) {
      console.error(err);
    } else {
      const token = buffer.toString('hex');
      console.log(token);
    }
  });
} else {
  console.error('Specify a number as argument');
}
