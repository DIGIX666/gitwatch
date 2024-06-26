import axios from "axios";

const GITHUB_API_URL = "https://api.github.com";

export const fetchGitHubProjects = async (page = 1, language = '', topic = '') => {
  const today = new Date();
  const threeMonthsAgo = new Date(today.setMonth(today.getMonth() - 3)).toISOString().split('T')[0];

  let query = `stars:>100 pushed:>=${threeMonthsAgo}`;
  if (language) query += ` language:${language}`;
  if (topic) query += ` topic:${topic}`;

  try {
    const response = await axios.get(`${GITHUB_API_URL}/search/repositories`, {
      params: {
        q: query,
        sort: 'stars',
        order: 'desc',
        page,
        per_page: 30,  // You can adjust the number of items per page if needed
      },
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
    });

    return response.data.items || [];
  } catch (error) {
    console.error('Failed to fetch data from GitHub', error);
    return [];
  }
};

export const fetchRecentGitHubProjects = async () => {
  try {
    const now = new Date();
    const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60000).toISOString();

    const query = `pushed:>${fifteenMinutesAgo} stars:>=10 forks:>=10`;

    const response = await axios.get(`${GITHUB_API_URL}/search/repositories`, {
      params: {
        q: query,
        sort: 'updated',
        order: 'desc',
        per_page: 6,
      },
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
    });

    return response.data.items || [];
  } catch (error) {
    console.error('Error fetching recent GitHub projects:', error);
    return [];
  }
};
