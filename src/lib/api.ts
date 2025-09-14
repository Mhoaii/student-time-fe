export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

export function authHeader(): Record<string, string> {
  const t = localStorage.getItem("token");
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export async function apiPOST<T>(endpoint: string, body: any): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(), // 👈 đảm bảo dòng này có mặt
    } as HeadersInit,
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data as T;
}

export async function apiGET<T>(
  endpoint: string,
  params?: Record<string, any>
): Promise<T> {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v != null) url.searchParams.append(k, String(v));
    });
  }
  const res = await fetch(url.toString(), {
    headers: authHeader() as HeadersInit, // 👈 ép kiểu
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data as T;
}

// export async function apiPOST<T>(
//   endpoint: string,
//   body: any
// ): Promise<T> {
//   const res = await fetch(`${API_BASE_URL}${endpoint}`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       ...authHeader(),
//     } as HeadersInit, // 👈 ép kiểu
//     body: JSON.stringify(body),
//   });
//   const data = await res.json();
//   if (!res.ok) throw new Error(data.error || "Request failed");
//   return data as T;
// }

export async function apiPATCH<T>(
  endpoint: string,
  body: any
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    } as HeadersInit, 
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data as T;
}

export async function apiDELETE(endpoint: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "DELETE",
    headers: authHeader() as HeadersInit,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Request failed");
  }
}


// const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";
// export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

// export function authHeader() {
//   const t = localStorage.getItem("token"); // bạn đã lưu khi login
//   return t ? { Authorization: `Bearer ${t}` } : {};
// }

// export async function apiGET<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
//   const url = new URL(`${API_BASE_URL}${endpoint}`);
//   if (params) Object.entries(params).forEach(([k, v]) => v != null && url.searchParams.append(k, String(v)));
//   const res = await fetch(url.toString(), { headers: { ...authHeader() } });
//   const data = await res.json();
//   if (!res.ok) throw new Error(data.error || "Request failed");
//   return data as T;
// }


// export async function apiPOST<T>(path: string, body: unknown): Promise<T> {
//   const res = await fetch(`${BASE_URL}${path}`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(body),
//   });
//   if (!res.ok) {
//     const err = await res.json().catch(() => ({}));
//     throw new Error(err?.error?.message || `Request failed: ${res.status}`);
//   }
//   return res.json();
// }





// export async function apiPATCH<T>(endpoint: string, body: any): Promise<T> {
//   const res = await fetch(`${API_BASE_URL}${endpoint}`, {
//     method: "PATCH",
//     headers: { "Content-Type": "application/json", ...authHeader() },
//     body: JSON.stringify(body),
//   });
//   const data = await res.json();
//   if (!res.ok) throw new Error(data.error || "Request failed");
//   return data as T;
// }

// export async function apiDELETE(endpoint: string): Promise<void> {
//   const res = await fetch(`${API_BASE_URL}${endpoint}`, {
//     method: "DELETE",
//     headers: { ...authHeader() },
//   });
//   if (!res.ok) {
//     const data = await res.json().catch(() => ({}));
//     throw new Error(data.error || "Request failed");
//   }
// }
