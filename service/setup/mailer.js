const path = require('path');
const fs = require('fs');
const mailgun = require('mailgun-js');
const globalCache = require('global-cache');

module.exports = function() {
  const config = globalCache.get('config');
  const logger = globalCache.get('logger');
  const mg = mailgun(config.get('mailgun'));
  const sendTokenEmail = async (email, tokenType, tokenValue) => {
    // TODO: add root URL also to be easily replacable
    const emailHtml = fs.readFileSync(path.join(__dirname, '../mails', 'Welcome.html'), 'utf8')
                      .replace('#authPath#', tokenType)
                      .replace('#authEmail#', email)
                      .replace('#authToken#', tokenValue);
    const data = {
      from: 'TestServer <system@testserver.org>',
      to: email,
      subject: 'Welcome to TestServer',
      html: emailHtml
    };
    const response = await mg.messages().send(data);
     // TODO: Look at response and retry using https://github.com/OptimalBits/bull
    logger.info(`Email response: ${JSON.stringify(response)}`);
    return response;
  };

  return {
    mg,
    sendTokenEmail
  };
};
