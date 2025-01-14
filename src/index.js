import { setupServer } from './server.js';
import { initMongoDB } from './db/initMongoDB.js';

import { createDirifNotExist } from './utils/createDirifNotExist.js';
import { TEMPLATES_DIR, TEMP_UPLOAD_DIR } from './constants/index.js';

const boostrap = async () => {
  await createDirifNotExist(TEMP_UPLOAD_DIR);
  await createDirifNotExist(TEMPLATES_DIR);

  await initMongoDB();

  setupServer();
};

boostrap();

