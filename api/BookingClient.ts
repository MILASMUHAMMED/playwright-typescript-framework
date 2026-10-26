import type { APIRequestContext, APIResponse } from "@playwright/test";
import { env } from "@config/env";

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
        username: env.apiUsername,
        password: env.apiPassword,
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

  async createBooking(booking: Booking): Promise<APIResponse> {
    return this.request.post("/booking", {
      data: booking,
    });
  }

  async getBooking(id: number): Promise<APIResponse> {
    return this.request.get(`/booking/${id}`);
  }

  async updateBooking(id: number, token: string, booking: Booking): Promise<APIResponse> {
    return this.request.put(`/booking/${id}`, {
      headers: {
        Cookie: `token=${token}`,
      },
      data: booking,
    });
  }

  async deleteBooking(id: number, token: string): Promise<APIResponse> {
    return this.request.delete(`/booking/${id}`, {
      headers: {
        Cookie: `token=${token}`,
      },
    });
  }
}
