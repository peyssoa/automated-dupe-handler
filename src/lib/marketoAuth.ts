import axios from 'axios';

// Generate the marketo access token
export const generateAccessToken = async () => {
  const baseUrl = process.env.MARKETO_BASE_URL;
  const CLIENT_ID = process.env.MARKETO_CLIENT_ID;
  const CLIENT_SECRET = process.env.MARKETO_CLIENT_SECRET;

  const url = `${baseUrl}/identity/oauth/token?grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`;

  const response = await axios.get(url);
  const data = response.data;

  if (response.status !== 200) {
    throw new Error(
      `Problem when getting Marketo access token: ${JSON.stringify(response)}`
    );
  }
  // calculate the TOKEN_EXPIRY time
  const tokenExpiry = new Date(new Date().getTime() + data.expires_in * 1000);
  const accessToken = data.access_token;

  return {
    accessToken,
    tokenExpiry,
  };
};
