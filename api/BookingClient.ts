import type { APIRequestContext } from "@playwright/test";

export interface Booking {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: {
    checkin: string;
    checkout: string;
  };
  additionalneeds?: string;
}

export class BookingClient {
  constructor(private readonly request: APIRequestContext) {}

  async authenticate(): Promise<string> {
    const response = await this.request.post("/auth", {
      data: {
        username: "admin",
        password: "password123",
      },
    });

    if (!response.ok()) {
      throw new Error(`Authentication failed: ${response.status()}`);
    }

    const body = await response.json();

    if (!body.token) {
      throw new Error("Authentication response did not contain a token");
    }

    return body.token as string;
  }

  async createBooking(booking: Booking) {
    return this.request.post("/booking", {
      data: booking,
    });
  }

  async getBooking(id: number) {
    return this.request.get(`/booking/${id}`);
  }

  async updateBooking(id: number, token: string, booking: Booking) {
    return this.request.put(`/booking/${id}`, {
      headers: {
        Cookie: `token=${token}`,
      },
      data: booking,
    });
  }

  async deleteBooking(id: number, token: string) {
    return this.request.delete(`/booking/${id}`, {
      headers: {
        Cookie: `token=${token}`,
      },
    });
  }
}