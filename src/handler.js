/* eslint-disable no-undef */
const axios = require("axios");

const {
  STAGE: stage,
  APPLICATION: application,
  ENVIRONMENT: environment,
  CONFIGURATION: configuration,
} = process.env;

exports.feature = async () => {
  const url = `http://localhost:2772/applications/${application}/environments/${environment}/configurations/${configuration}`;

  console.log(`app config endpoint: ${url}`);
  console.log(`stage: ${stage}`);

  try {
    const config = await axios.get(url);

    const { featureEnabled = false } = config.data;

    // use this to enable/disable your feature
    const response = {
      statusCode: 200,
      body: `You have ${featureEnabled ? "enabled" : "disabled"} feature`,
    };

    return response;
  } catch (error) {
    console.error(error);

    const response = {
      statusCode: 500,
      body: `message: ${error.message}`,
    };

    return response;
  }
};
