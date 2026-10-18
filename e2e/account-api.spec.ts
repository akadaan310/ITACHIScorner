import { expect, test, type APIRequestContext, type APIResponse } from "@playwright/test";

const mutations = [
  "/api/account/profile", "/api/account/preferences", "/api/account/consent", "/api/account/links", "/api/account/delete",
  "/api/account/notes", "/api/account/saved-questions",
];
const authForms = ["/auth/request", "/auth/verify", "/auth/logout"];

function expectPrivate(response: APIResponse) {
  expect(response.headers()["cache-control"]).toMatch(/private/i);
  expect(response.headers()["cache-control"]).toMatch(/no-store/i);
}

async function requireUnconfiguredBackend(request: APIRequestContext) {
  // A runtime guard prevents the valid-looking auth payload below from ever
  // reaching an email provider if someone runs this suite against a configured app.
  const response = await request.get("/api/account/export", { maxRedirects: 0 });
  expect(response.status(), "This release suite requires the intentionally unconfigured account backend.").toBe(503);
  expect(await response.text()).toMatch(/not configured/i);
  expectPrivate(response);
}

for (const route of [...authForms, ...mutations]) {
  test(`hostile Origin is rejected before mutation at ${route}`, async ({ request }) => {
    const response = await request.post(route, {
      headers: { Origin: "https://hostile-origin.invalid" },
      form: { email: "invalid", confirmation: "DO-NOT-DELETE", next: "https://hostile-origin.invalid" },
      maxRedirects: 0,
    });
    expect(response.status()).toBe(403);
    expect(response.headers().location).toBeUndefined();
    expectPrivate(response);
  });
}

test("anonymous export fails closed and cannot be shared-cached", async ({ request }) => {
  const response = await request.get("/api/account/export", { maxRedirects: 0 });
  expect([401, 503]).toContain(response.status());
  expectPrivate(response);
  const body = await response.json();
  expect(body.error).toEqual(expect.any(String));
  expect(body).not.toHaveProperty("profiles");
  expect(body).not.toHaveProperty("journal");
});

for (const route of mutations) {
  test(`unconfigured same-origin ${route} reports unavailable without claiming success`, async ({ request, baseURL }) => {
    await requireUnconfiguredBackend(request);
    const response = await request.post(route, {
      headers: { Origin: new URL(baseURL!).origin },
      form: { nickname: "Unsubmitted", confirmation: "DO-NOT-DELETE", platform: "youtube", handle: "unsubmitted" },
      maxRedirects: 0,
    });
    expect(response.status()).toBe(503);
    expect(response.headers().location).toBeUndefined();
    expectPrivate(response);
    expect(await response.text()).toMatch(/not configured|unavailable/i);
  });
}

for (const route of authForms) {
  test(`unconfigured same-origin ${route} cannot create an authenticated success`, async ({ request, baseURL }) => {
    await requireUnconfiguredBackend(request);
    const response = await request.post(route, {
      headers: { Origin: new URL(baseURL!).origin },
      form: { email: "qa-never-send@example.invalid", token: "000000", next: "https://hostile-origin.invalid" },
      maxRedirects: 0,
    });
    expectPrivate(response);
    if (response.status() === 503) {
      expect(await response.text()).toMatch(/not configured|unavailable/i);
    } else {
      expect(response.status()).toBe(303);
      expect(response.headers().location).toBeTruthy();
      const location = new URL(response.headers().location!, baseURL);
      expect(location.origin).toBe(new URL(baseURL!).origin);
      expect(location.searchParams.get("notice")).toBe("unavailable");
      expect(location.pathname).toBe(route === "/auth/logout" ? "/me" : "/join");
    }
    expect(response.headers()["set-cookie"] || "").not.toMatch(/sb-[^=]*auth-token|access_token|refresh_token/i);
  });
}

for (const route of ["/auth/callback", "/auth/confirm"]) {
  for (const next of ["https://hostile-origin.invalid", "//hostile-origin.invalid", "/%2fhostile-origin.invalid"]) {
    test(`invalid ${route} keeps hostile next=${next} local and signed out`, async ({ request, baseURL }) => {
      await requireUnconfiguredBackend(request);
      const query = new URLSearchParams({ next, code: "invalid-code", token_hash: "invalid-token" });
      const response = await request.get(`${route}?${query}`, { maxRedirects: 0 });
      expect(response.status()).toBe(303);
      expectPrivate(response);
      expect(response.headers().location).toBeTruthy();
      const location = new URL(response.headers().location!, baseURL);
      expect(location.origin).toBe(new URL(baseURL!).origin);
      expect(location.pathname).toBe("/join");
      expect(location.searchParams.get("notice")).toMatch(/unavailable|expired-code/);
      expect(response.headers()["set-cookie"] || "").not.toMatch(/sb-[^=]*auth-token|access_token|refresh_token/i);
    });
  }
}
