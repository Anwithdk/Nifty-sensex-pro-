export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Content-Type": "application/json"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    if (!env.GROWW_ACCESS_TOKEN) {
      return new Response(
        JSON.stringify({ error: "GROWW_ACCESS_TOKEN not configured" }),
        { status: 503, headers: cors }
      );
    }

    try {
      const url =
        "https://api.groww.in/v1/live-data/ltp" +
        "?segment=CASH&exchange_symbols=NSE_NIFTY,BSE_SENSEX";

      const r = await fetch(url, {
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${env.GROWW_ACCESS_TOKEN}`,
          "X-API-VERSION": "1.0"
        }
      });

      const data = await r.json();

      return new Response(JSON.stringify(data), {
        status: r.status,
        headers: cors
      });
    } catch (e) {
      return new Response(
        JSON.stringify({ error: "Groww connection failed" }),
        { status: 500, headers: cors }
      );
    }
  }
};
