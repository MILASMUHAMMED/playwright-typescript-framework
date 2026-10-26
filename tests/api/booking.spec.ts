import { test, expect } from "@fixtures/test";
import type { Booking } from "@api/BookingClient";

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

test("creates, reads, updates, and deletes a booking", { tag: ["@api", "@smoke"] }, async ({
  bookingClient,
}) => {
  const token = await test.step("Authenticate", async () => {
    return bookingClient.authenticate();
  });

  const bookingId = await test.step("Create booking", async () => {
    const res = await bookingClient.createBooking(booking);
    expect(res.status()).toBe(200);

    const created = await res.json();
    expect(created).toMatchObject({ booking });
    expect(created.bookingid).toEqual(expect.any(Number));

    return created.bookingid as number;
  });

  await test.step("Read booking", async () => {
    const res = await bookingClient.getBooking(bookingId);
    expect(res.status()).toBe(200);
    expect(await res.json()).toMatchObject({ ...booking });
  });

  await test.step("Update booking", async () => {
    const updatedBooking: Booking = {
      ...booking,
      firstname: "Updated",
      totalprice: 250,
    };

    const res = await bookingClient.updateBooking(bookingId, token, updatedBooking);
    expect(res.status()).toBe(200);
    expect(await res.json()).toMatchObject({ ...updatedBooking });
  });

  await test.step("Delete booking", async () => {
    const res = await bookingClient.deleteBooking(bookingId, token);
    expect(res.status()).toBe(201);
  });

  await test.step("Verify booking is deleted", async () => {
    const res = await bookingClient.getBooking(bookingId);
    expect(res.status()).toBe(404);
  });
});

test("rejects update without a token", { tag: ["@api", "@regression"] }, async ({
  bookingClient,
}) => {
  const res = await bookingClient.updateBooking(1, "invalid-token", booking);
  expect(res.status()).toBe(403);
});
