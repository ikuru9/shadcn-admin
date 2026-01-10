import { http, HttpResponse } from "msw";
import { faker } from "@faker-js/faker";

// Set a fixed seed for consistent data generation
faker.seed(67890);

const photos = Array.from({ length: 500 }, () => ({
  albumId: faker.number.int(),
  id: faker.number.int(),
  title: faker.lorem.sentence(),
  url: faker.image.url(),
  thumbnailUrl: faker.image.url(),
}));

const comments = Array.from({ length: 500 }, () => ({
  postId: faker.number.int(),
  id: faker.number.int(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  body: faker.lorem.paragraph(),
}));

export default [
  http.get("https://example.com/sample-api/v1/photos", () => {
    return HttpResponse.json(photos);
  }),
  http.get("https://example.com/sample-api/v1/photos/:photoId", ({ params }) => {
    const { photoId } = params;
    const photo = photos.find(({ id }) => id === Number(photoId));

    return HttpResponse.json(photo);
  }),
  http.get("https://example.com/sample-api/v1/photos/:photoId/comments", () => {
    return HttpResponse.json(comments);
  }),
  http.get(
    "https://example.com/sample-api/v1/photos/:photoId/comments/:commentId",
    ({ params }) => {
      const { photoId: _photoId, commentId } = params;
      const comment = photos.find(({ id }) => id === Number(commentId));

      return HttpResponse.json(comment);
    },
  ),
];
