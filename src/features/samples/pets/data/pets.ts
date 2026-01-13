import { faker } from "@faker-js/faker";

// Set a fixed seed for consistent data generation
faker.seed(67891);

export const pets = Array.from({ length: 200 }, () => ({
  id: faker.number.int({ min: 1, max: 1000 }),
  name: faker.animal.petName(),
  category: {
    id: faker.number.int({ min: 1, max: 10 }),
    name: faker.helpers.arrayElement(["Mammal", "Bird", "Fish", "Reptile", "Other"]),
  },
  photoUrls: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () =>
    faker.image.url({ width: 200, height: 200 }),
  ),
  tags: Array.from({ length: faker.number.int({ min: 0, max: 3 }) }, () => ({
    id: faker.number.int({ min: 1, max: 20 }),
    name: faker.helpers.arrayElement(["Friendly", "Playful", "Cute", "Energetic", "Lazy"]),
  })),
  status: faker.helpers.arrayElement(["available", "pending", "sold"]),
}));
