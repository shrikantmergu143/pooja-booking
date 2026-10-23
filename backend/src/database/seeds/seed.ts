import { DataSource } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Pooja } from '../../poojas/entities/pooja.entity';
import { Package } from '../../packages/entities/package.entity';
import { PackageInclusion } from '../../packages/entities/package-inclusion.entity';
import { AppDataSource } from '../data-source';

export async function runCatalogSeed(dataSource: DataSource = AppDataSource) {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }

  const categoryRepo = dataSource.getRepository(Category);
  const poojaRepo = dataSource.getRepository(Pooja);
  const packageRepo = dataSource.getRepository(Package);
  const inclusionRepo = dataSource.getRepository(PackageInclusion);

  const existingCount = await categoryRepo.count();
  if (existingCount > 0) {
    console.log('Database already has categories seeded. Skipping seed.');
    return;
  }

  // 1. Create Categories
  const catHoma = categoryRepo.create({
    name: 'Homa & Havans',
    slug: 'homa-havans',
    description: 'Sacred fire rituals invoking celestial energy for peace, health, and prosperity.',
    sortOrder: 1,
    isActive: true,
  });

  const catGriha = categoryRepo.create({
    name: 'Griha Pravesh & Vastu',
    slug: 'griha-pravesh-vastu',
    description: 'Auspicious house-warming rituals to infuse positive energy into your new residence.',
    sortOrder: 2,
    isActive: true,
  });

  const catSpecial = categoryRepo.create({
    name: 'Special Occasions & Festivals',
    slug: 'special-occasions',
    description: 'Celebrate sacred milestones, festivals, and personal vows with traditional pandits.',
    sortOrder: 3,
    isActive: true,
  });

  await categoryRepo.save([catHoma, catGriha, catSpecial]);

  // 2. Create Satyanarayan Pooja
  const satyanarayan = poojaRepo.create({
    category: catSpecial,
    name: 'Sri Satyanarayan Pooja & Katha',
    slug: 'satyanarayan-pooja',
    shortDescription: 'Sacred monthly or milestone ceremony invoking Lord Vishnu for home harmony and prosperity.',
    description: 'The Sri Satyanarayan Pooja is dedicated to Lord Vishnu in His benign form as Satyanarayan. Devotees perform this sacred Katha to express gratitude and seek divine grace.',
    purpose: 'Brings immense peace, resolves family disputes, and ensures spiritual well-being.',
    instructions: 'Keep fresh fruits, flowers, and panchamrit ingredients ready prior to priest arrival.',
    durationMinutes: 150,
    supportedModes: ['HOME', 'VENUE', 'ONLINE'],
    supportedLanguages: ['Hindi', 'Sanskrit', 'Telugu', 'Tamil'],
    isActive: true,
  });

  // 3. Create Maha Ganapati Homa
  const ganapati = poojaRepo.create({
    category: catHoma,
    name: 'Maha Ganapati Homa',
    slug: 'ganapati-homa',
    shortDescription: 'Potent Vedic fire ritual dedicated to Lord Ganesha to eradicate roadblocks.',
    description: 'Performed before starting any new venture, building project, or career milestone.',
    purpose: 'Removes obstacles, grants clarity of intellect, and ensures triumphant success.',
    instructions: 'Prepare ghee, modak, durva grass, and coconut offerings before invocation.',
    durationMinutes: 120,
    supportedModes: ['HOME', 'VENUE'],
    supportedLanguages: ['Hindi', 'Sanskrit', 'Kannada'],
    isActive: true,
  });

  // 4. Create Griha Pravesh
  const griha = poojaRepo.create({
    category: catGriha,
    name: 'Griha Pravesh & Vastu Shanti',
    slug: 'griha-pravesh',
    shortDescription: 'Consecration of new residential homes or renovated estates.',
    description: 'Multi-priest ceremonial blessing including Vastu devata puja, Gau puja, Navagraha homa, and milk boiling ceremony.',
    purpose: 'Neutralizes directional Vastu defects and shields the home in auspicious vibrations.',
    instructions: 'Clean entrance threshold with turmeric-kumkum and prepare cow milk pot.',
    durationMinutes: 240,
    supportedModes: ['HOME'],
    supportedLanguages: ['Hindi', 'Sanskrit', 'Telugu', 'Bengali'],
    isActive: true,
  });

  await poojaRepo.save([satyanarayan, ganapati, griha]);

  // 5. Create Packages for Satyanarayan
  const pkgSatyaSimple = packageRepo.create({
    pooja: satyanarayan,
    name: 'Simple Ritual (Online/Virtual)',
    description: 'Live interactive video stream puja conducted by certified Vedic scholar.',
    price: 3100.0,
    panditCount: 1,
    durationMinutes: 90,
    includesSamagri: false,
    includesDakshina: true,
    sortOrder: 1,
  });

  const pkgSatyaStd = packageRepo.create({
    pooja: satyanarayan,
    name: 'Standard Package (Most Popular)',
    description: 'Complete home ceremony with 1 experienced pandit, premium samagri, and Prasad prep.',
    price: 5100.0,
    panditCount: 1,
    durationMinutes: 150,
    includesSamagri: true,
    includesDakshina: true,
    sortOrder: 2,
  });

  const pkgSatyaGrand = packageRepo.create({
    pooja: satyanarayan,
    name: 'Grand Family Celebration',
    description: '2 senior priests with elaborate floral altar decor, full samagri kit, and Hawan kund.',
    price: 8500.0,
    panditCount: 2,
    durationMinutes: 180,
    includesSamagri: true,
    includesDakshina: true,
    sortOrder: 3,
  });

  await packageRepo.save([pkgSatyaSimple, pkgSatyaStd, pkgSatyaGrand]);

  // 6. Inclusions
  const inc1 = inclusionRepo.create({
    package: pkgSatyaStd,
    title: '1 Certified Senior Acharya for 2.5 hours',
    itemText: '1 Certified Senior Acharya for 2.5 hours',
    sortOrder: 1,
  });
  const inc2 = inclusionRepo.create({
    package: pkgSatyaStd,
    title: 'Complete sacred samagri kit (Ghee, camphor, roli, chandan, sacred threads)',
    itemText: 'Complete sacred samagri kit (Ghee, camphor, roli, chandan, sacred threads)',
    sortOrder: 2,
  });
  const inc3 = inclusionRepo.create({
    package: pkgSatyaStd,
    title: 'Full Sri Satyanarayan Katha recital with musical bell chanting',
    itemText: 'Full Sri Satyanarayan Katha recital with musical bell chanting',
    sortOrder: 3,
  });
  const inc4 = inclusionRepo.create({
    package: pkgSatyaStd,
    title: 'Dakshina included in package fee',
    itemText: 'Dakshina included in package fee',
    sortOrder: 4,
  });

  await inclusionRepo.save([inc1, inc2, inc3, inc4]);

  console.log('Seeded initial categories, poojas, packages, and inclusions successfully!');
}
