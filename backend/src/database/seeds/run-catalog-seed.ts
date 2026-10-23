import { AppDataSource } from '../data-source';
import { runCatalogSeed } from './seed';

async function main() {
  try {
    await runCatalogSeed(AppDataSource);
  } finally {
    if (AppDataSource.isInitialized) await AppDataSource.destroy();
  }
}

main().catch((error) => {
  console.error('Catalog seed failed:', error);
  process.exitCode = 1;
});
