import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ url }) => {
  const collection = url.searchParams.get("collection");
  const record = url.searchParams.get("record");
  const filename = url.searchParams.get("file");

  if (!collection || !record || !filename) {
    return new Response("Bad request", { status: 400 });
  }

  const fileUrl = `http://127.0.0.1:8082/api/files/${collection}/${record}/${filename}`;

  const res = await fetch(fileUrl);

  if (!res.ok) {
    return new Response("File not found", { status: 404 });
  }

  return new Response(await res.arrayBuffer(), {
    headers: {
      "Content-Type": res.headers.get("Content-Type") || "application/octet-stream",
      "Cache-Control": "public, max-age=86400",
    },
  });
};
