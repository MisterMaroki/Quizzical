import sanityclient from '@sanity/client';
import config from './config';
const client = sanityclient({
	projectId: config.projectId,
	dataset: config.dataset,
	useCdn: true,
});
export default client;
