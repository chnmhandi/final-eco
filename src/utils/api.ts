const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://final-eco-2l4j.onrender.com/api";

export function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("aura_token");
  }
  return null;
}

export function setToken(token: string | null) {
  if (typeof window !== "undefined") {
    if (token) {
      localStorage.setItem("aura_token", token);
    } else {
      localStorage.removeItem("aura_token");
    }
  }
}

async function request<T>(
  method: string,
  path: string,
  body?: any,
  headers: Record<string, string> = {}
): Promise<T> {
  const token = getToken();
  const isFormData = typeof window !== "undefined" && body instanceof FormData;

  const requestHeaders: Record<string, string> = {
    ...headers,
  };

  if (!isFormData) {
    requestHeaders["Content-Type"] = "application/json";
  }

  if (token) {
    requestHeaders["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers: requestHeaders,
  };

  if (body) {
    config.body = isFormData ? body : JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${path}`, config);

  if (!response.ok) {
    let errorMessage = "An error occurred";
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorData.message || errorMessage;
    } catch {
      // JSON parsing failed, use statusText
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  // Handle empty responses
  if (response.status === 204) {
    return {} as T;
  }

  try {
    return await response.json();
  } catch {
    return {} as T;
  }
}

export const api = {
  get: <T>(path: string, headers?: Record<string, string>) =>
    request<T>("GET", path, undefined, headers),
  post: <T>(path: string, body?: any, headers?: Record<string, string>) =>
    request<T>("POST", path, body, headers),
  put: <T>(path: string, body?: any, headers?: Record<string, string>) =>
    request<T>("PUT", path, body, headers),
  delete: <T>(path: string, headers?: Record<string, string>) =>
    request<T>("DELETE", path, undefined, headers),
};

export function mapBackendProduct(p: any): any {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    price: Number(p.price),
    originalPrice: p.original_price ? Number(p.original_price) : undefined,
    rating: Number(p.rating),
    reviewCount: p.review_count,
    images: p.images,
    description: p.description,
    longDescription: p.long_description,
    colors: p.colors || [],
    sizes: p.sizes || [],
    specs: p.specs || [],
    reviews: (p.reviews || []).map((r: any) => ({
      id: String(r.id),
      userName: r.user_name || r.userName,
      rating: r.rating,
      date: r.date,
      comment: r.comment,
      helpfulCount: r.helpful_count || r.helpfulCount || 0
    })),
    stock: p.stock,
    isFeatured: p.is_featured,
    isTrending: p.is_trending,
    isBestSeller: p.is_bestseller,
    tag: p.tag
  };
}

export function mapBackendCategory(c: any): any {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description || "",
    image: c.image || "",
    itemCount: c.item_count || 0
  };
}

