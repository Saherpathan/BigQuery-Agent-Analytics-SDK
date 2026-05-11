import { BigQuery } from '@google-cloud/bigquery';

// This runs on Vercel's servers
const bqClient = new BigQuery({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: {
    client_email: process.env.GCP_CLIENT_EMAIL,
    private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
});

export default async function handler(req: any, res: any) {
  // 1. Get the table coordinates from the headers SENT by the frontend
  const userProject = req.headers['x-gcp-project-id'];
  const userDataset = req.headers['x-bq-dataset'];
  const userTable = req.headers['x-bq-table'];
  const { timespan } = req.query;

  // 2. Validate
  if (!userProject || !userDataset || !userTable) {
    return res.status(400).json({ 
      error: "Missing Configuration: Ensure Project, Dataset, and Table IDs are entered." 
    });
  }

  // 3. Setup Timespan
  let interval = '24 HOUR';
  const map: Record<string, string> = {
    '1h': '1 HOUR', '24h': '24 HOUR', '7d': '7 DAY', '30d': '30 DAY', '90d': '90 DAY', '1y': '1 YEAR'
  };
  if (timespan && map[timespan as string]) interval = map[timespan as string];

  const tablePath = `\`${userProject}.${userDataset}.${userTable}\``;

  // 4. Execute BigQuery Query
  const query = `
    SELECT * FROM ${tablePath}
    WHERE timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL ${interval})
    ORDER BY timestamp DESC
    LIMIT 1000
  `;

  try {
    const [rows] = await bqClient.query({ query });
    res.status(200).json(rows);
  } catch (error: any) {
    console.error("BQ Error:", error.message);
    res.status(500).json({ error: error.message });
  }
}
