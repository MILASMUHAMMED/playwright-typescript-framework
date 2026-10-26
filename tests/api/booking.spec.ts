
import { test, expect } from "@playwright/test";
import { BookingClient, type Booking } from "../../api/BookingClient";

test("creates, reads, updates, and deletes a booking", async ({ request }) => {
  const client = new BookingClient(request);
  const token = await client.authenticate();

  const booking: Booking = {
    firstname: "Test",
    lastname: "Tester",
    totalprice: 150,
    depositpaid: true,
    bookingdates: {
      checkin: "2026-11-01",
      checkout: "2026-11-05",
    },
    additionalneeds: "Breakfast",
  };

  // CREATE
  const createResponse = await client.createBooking(booking);
  expect(createResponse.status()).toBe(200);

  const created = await createResponse.json();
  expect(created).toMatchObject({ booking });

  const bookingId: number = created.bookingid;
  expect(bookingId).toEqual(expect.any(Number));

  // READ
  const readResponse = await client.getBooking(bookingId);
  expect(readResponse.status()).toBe(200);
  expect(await readResponse.json()).toMatchObject({ ...booking });

  // UPDATE
  const updatedBooking: Booking = {
    ...booking,
    firstname: "Updated",
    totalprice: 250,
  };

  const updateResponse = await client.updateBooking(
    bookingId,
    token,
    updatedBooking,
  );

  expect(updateResponse.status()).toBe(200);
  expect(await updateResponse.json()).toMatchObject({ ...updatedBooking });

  // DELETE
  const deleteResponse = await client.deleteBooking(bookingId, token);
  expect(deleteResponse.status()).toBe(201);

  // Verify deletion
  const verifyResponse = await client.getBooking(bookingId);
  expect(verifyResponse.status()).toBe(404);
});