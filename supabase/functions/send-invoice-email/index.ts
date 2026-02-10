import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { PDFDocument, rgb, PDFFont, PDFPage } from "npm:pdf-lib@1.17.1";
import fontkit from "npm:@pdf-lib/fontkit@1.1.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface InvoiceRequest {
  customerEmail: string;
  customerName: string;
  planType: string;
  planName: string;
  amount: number;
  currency: string;
  orderNumber: string;
  orderDate: string;
}

function stripDiacritics(text: string): string {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

async function fetchFont(): Promise<Uint8Array | null> {
  try {
    const cssResp = await fetch(
      "https://fonts.googleapis.com/css?family=Roboto:400,700",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Linux; U; Android 2.2; en-us; Nexus One Build/FRF91) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1",
        },
      }
    );
    const css = await cssResp.text();
    const urlMatch = css.match(/url\(([^)]+)\)/);
    if (!urlMatch) return null;
    const fontResp = await fetch(urlMatch[1]);
    if (!fontResp.ok) return null;
    return new Uint8Array(await fontResp.arrayBuffer());
  } catch {
    return null;
  }
}

async function fetchBoldFont(): Promise<Uint8Array | null> {
  try {
    const cssResp = await fetch(
      "https://fonts.googleapis.com/css?family=Roboto:700",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Linux; U; Android 2.2; en-us; Nexus One Build/FRF91) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1",
        },
      }
    );
    const css = await cssResp.text();
    const urlMatch = css.match(/url\(([^)]+)\)/);
    if (!urlMatch) return null;
    const fontResp = await fetch(urlMatch[1]);
    if (!fontResp.ok) return null;
    return new Uint8Array(await fontResp.arrayBuffer());
  } catch {
    return null;
  }
}

interface DrawHelpers {
  font: PDFFont;
  boldFont: PDFFont;
  useFallback: boolean;
}

function t(text: string, useFallback: boolean): string {
  return useFallback ? stripDiacritics(text) : text;
}

function drawLine(
  page: PDFPage,
  x1: number,
  y: number,
  x2: number,
  thickness = 0.5
) {
  page.drawLine({
    start: { x: x1, y },
    end: { x: x2, y },
    thickness,
    color: rgb(0.75, 0.75, 0.75),
  });
}

function drawRect(
  page: PDFPage,
  x: number,
  y: number,
  w: number,
  h: number,
  fillColor = rgb(0.97, 0.97, 0.97)
) {
  page.drawRectangle({
    x,
    y,
    width: w,
    height: h,
    color: fillColor,
    borderColor: rgb(0.85, 0.85, 0.85),
    borderWidth: 0.5,
  });
}

async function generateInvoicePDF(data: InvoiceRequest): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  let font: PDFFont;
  let boldFont: PDFFont;
  let useFallback = false;

  try {
    const [regularBytes, boldBytes] = await Promise.all([
      fetchFont(),
      fetchBoldFont(),
    ]);
    if (regularBytes && boldBytes) {
      font = await pdfDoc.embedFont(regularBytes);
      boldFont = await pdfDoc.embedFont(boldBytes);
    } else {
      throw new Error("Font fetch failed");
    }
  } catch {
    const { StandardFonts } = await import("npm:pdf-lib@1.17.1");
    font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    useFallback = true;
  }

  const page = pdfDoc.addPage([595.28, 841.89]);
  const { width, height } = page.getSize();
  const margin = 50;
  const contentWidth = width - margin * 2;
  let y = height - margin;

  const black = rgb(0, 0, 0);
  const darkGray = rgb(0.2, 0.2, 0.2);
  const medGray = rgb(0.4, 0.4, 0.4);
  const lightGray = rgb(0.6, 0.6, 0.6);
  const accentColor = rgb(0.13, 0.55, 0.13);

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat("cs-CZ", {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formattedPrice = formatPrice(data.amount, data.currency);
  const priceText = useFallback ? stripDiacritics(formattedPrice) : formattedPrice;

  page.drawRectangle({
    x: 0,
    y: height - 90,
    width,
    height: 90,
    color: rgb(0.15, 0.15, 0.15),
  });

  page.drawText(t("Fyzioterapie Kurzy", useFallback), {
    x: margin,
    y: height - 40,
    size: 16,
    font: boldFont,
    color: rgb(1, 1, 1),
  });

  page.drawText("txrxo.troxx@gmail.com", {
    x: margin,
    y: height - 58,
    size: 9,
    font,
    color: rgb(0.7, 0.7, 0.7),
  });

  page.drawText("FAKTURA", {
    x: width - margin - boldFont.widthOfTextAtSize("FAKTURA", 22),
    y: height - 40,
    size: 22,
    font: boldFont,
    color: rgb(1, 1, 1),
  });

  const invoiceNumText = t(`c. ${data.orderNumber}`, useFallback);
  page.drawText(invoiceNumText, {
    x: width - margin - font.widthOfTextAtSize(invoiceNumText, 9),
    y: height - 58,
    size: 9,
    font,
    color: rgb(0.7, 0.7, 0.7),
  });

  y = height - 120;

  const colWidth = (contentWidth - 20) / 2;

  drawRect(page, margin, y - 80, colWidth, 80);
  page.drawText(t("Dodavatel:", useFallback), {
    x: margin + 12,
    y: y - 18,
    size: 8,
    font,
    color: lightGray,
  });
  page.drawText(t("Fyzioterapie Kurzy", useFallback), {
    x: margin + 12,
    y: y - 34,
    size: 10,
    font: boldFont,
    color: darkGray,
  });
  page.drawText("txrxo.troxx@gmail.com", {
    x: margin + 12,
    y: y - 50,
    size: 9,
    font,
    color: medGray,
  });

  const rightColX = margin + colWidth + 20;
  drawRect(page, rightColX, y - 80, colWidth, 80);
  page.drawText(t("Odberatel:", useFallback), {
    x: rightColX + 12,
    y: y - 18,
    size: 8,
    font,
    color: lightGray,
  });
  page.drawText(t(data.customerName, useFallback), {
    x: rightColX + 12,
    y: y - 34,
    size: 10,
    font: boldFont,
    color: darkGray,
  });
  page.drawText(data.customerEmail, {
    x: rightColX + 12,
    y: y - 50,
    size: 9,
    font,
    color: medGray,
  });

  y -= 105;

  drawRect(page, margin, y - 50, contentWidth, 50);
  const dateLabels = [
    [t("Datum vystaveni:", useFallback), data.orderDate],
    [t("Typ predplatneho:", useFallback), t(data.planType, useFallback)],
  ];
  dateLabels.forEach(([label, value], i) => {
    const labelX = margin + 12 + i * (contentWidth / 2);
    page.drawText(label, {
      x: labelX,
      y: y - 18,
      size: 8,
      font,
      color: lightGray,
    });
    page.drawText(value, {
      x: labelX,
      y: y - 34,
      size: 10,
      font: boldFont,
      color: darkGray,
    });
  });

  y -= 80;

  const tableHeaderH = 30;
  const tableRowH = 35;
  const col1W = 40;
  const col2W = contentWidth - 40 - 100 - 50 - 100;
  const col3W = 100;
  const col4W = 50;
  const col5W = 100;

  page.drawRectangle({
    x: margin,
    y: y - tableHeaderH,
    width: contentWidth,
    height: tableHeaderH,
    color: rgb(0.15, 0.15, 0.15),
  });

  const headerY = y - 20;
  const headers = [
    { text: "#", x: margin + 12, w: col1W },
    { text: t("Popis", useFallback), x: margin + col1W + 12, w: col2W },
    {
      text: t("Cena/ks", useFallback),
      x: margin + col1W + col2W + 12,
      w: col3W,
    },
    { text: "Ks", x: margin + col1W + col2W + col3W + 12, w: col4W },
    {
      text: t("Celkem", useFallback),
      x: margin + col1W + col2W + col3W + col4W + 12,
      w: col5W,
    },
  ];

  headers.forEach((h) => {
    page.drawText(h.text, {
      x: h.x,
      y: headerY,
      size: 8,
      font: boldFont,
      color: rgb(1, 1, 1),
    });
  });

  const rowY = y - tableHeaderH - tableRowH;
  drawRect(page, margin, rowY, contentWidth, tableRowH, rgb(1, 1, 1));

  const cellY = rowY + 12;
  page.drawText("1", {
    x: margin + 12,
    y: cellY,
    size: 9,
    font,
    color: darkGray,
  });
  page.drawText(t(data.planName, useFallback), {
    x: margin + col1W + 12,
    y: cellY,
    size: 9,
    font: boldFont,
    color: darkGray,
  });
  page.drawText(priceText, {
    x: margin + col1W + col2W + 12,
    y: cellY,
    size: 9,
    font,
    color: darkGray,
  });
  page.drawText("1", {
    x: margin + col1W + col2W + col3W + 12,
    y: cellY,
    size: 9,
    font,
    color: darkGray,
  });

  const totalCellX = margin + col1W + col2W + col3W + col4W + 12;
  page.drawText(priceText, {
    x: totalCellX,
    y: cellY,
    size: 9,
    font: boldFont,
    color: darkGray,
  });

  drawLine(page, margin, rowY, margin + contentWidth);

  y = rowY - 30;

  const summaryX = margin + contentWidth - 220;
  const summaryValueX = margin + contentWidth - 10;

  const summaryRows = [
    [t("Celkem za produkty:", useFallback), priceText, false],
    [t("Zpusob platby:", useFallback), "Stripe", false],
    [t("Celkem:", useFallback), priceText, true],
  ] as const;

  summaryRows.forEach(([label, value, isBold], i) => {
    const rowYPos = y - i * 22;
    const labelFont = isBold ? boldFont : font;
    const valueFont = isBold ? boldFont : font;
    const fontSize = isBold ? 12 : 9;
    const color = isBold ? accentColor : darkGray;

    page.drawText(label as string, {
      x: summaryX,
      y: rowYPos,
      size: fontSize,
      font: labelFont,
      color: isBold ? darkGray : medGray,
    });

    const valWidth = valueFont.widthOfTextAtSize(value as string, fontSize);
    page.drawText(value as string, {
      x: summaryValueX - valWidth,
      y: rowYPos,
      size: fontSize,
      font: valueFont,
      color,
    });
  });

  y -= 90;

  drawLine(page, margin, y, margin + contentWidth);

  y -= 25;

  page.drawText(t("Dekujeme za vas nakup!", useFallback), {
    x: margin,
    y,
    size: 11,
    font: boldFont,
    color: darkGray,
  });

  y -= 18;
  page.drawText(
    t(
      "Mate-li jakekoliv dotazy, nevahejte nas kontaktovat.",
      useFallback
    ),
    {
      x: margin,
      y,
      size: 9,
      font,
      color: medGray,
    }
  );

  y -= 14;
  page.drawText("txrxo.troxx@gmail.com", {
    x: margin,
    y,
    size: 9,
    font,
    color: medGray,
  });

  const footerY = margin + 10;
  const genText = t(
    `Vygenerovano: ${new Date().toLocaleString("cs-CZ")}`,
    useFallback
  );
  page.drawText(genText, {
    x: margin,
    y: footerY,
    size: 7,
    font,
    color: lightGray,
  });

  const docIdText = t(`Dokument: ${data.orderNumber}`, useFallback);
  const docIdWidth = font.widthOfTextAtSize(docIdText, 7);
  page.drawText(docIdText, {
    x: width - margin - docIdWidth,
    y: footerY,
    size: 7,
    font,
    color: lightGray,
  });

  drawLine(page, margin, footerY + 15, margin + contentWidth);

  return pdfDoc.save();
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const OWNER_EMAIL = "txrxo.troxx@gmail.com";

    const {
      customerEmail,
      customerName,
      planType,
      planName,
      amount,
      currency,
      orderNumber,
      orderDate,
    }: InvoiceRequest = await req.json();

    const formatPrice = (amount: number, currency: string) => {
      return new Intl.NumberFormat("cs-CZ", {
        style: "currency",
        currency: currency.toUpperCase(),
      }).format(amount);
    };

    const pdfBytes = await generateInvoicePDF({
      customerEmail,
      customerName,
      planType,
      planName,
      amount,
      currency,
      orderNumber,
      orderDate,
    });

    const base64PDF = btoa(
      Array.from(new Uint8Array(pdfBytes))
        .map((b) => String.fromCharCode(b))
        .join("")
    );

    const customerEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f4f4f4; }
    .wrapper { max-width: 600px; margin: 0 auto; padding: 20px; }
    .card { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
    .header { background: #1a1a1a; color: #fff; padding: 32px 30px 24px; }
    .header h1 { margin: 0 0 4px; font-size: 22px; font-weight: 700; }
    .header p { margin: 0; font-size: 13px; color: #aaa; }
    .body { padding: 30px; }
    .greeting { font-size: 15px; margin-bottom: 20px; }
    .details { border: 1px solid #eee; border-radius: 8px; overflow: hidden; margin: 20px 0; }
    .detail-row { display: flex; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
    .detail-row:last-child { border-bottom: none; }
    .detail-row .label { color: #888; }
    .detail-row .value { font-weight: 600; color: #333; }
    .total-row { background: #f8f8f8; }
    .total-row .value { color: #1a8c1a; font-size: 16px; }
    .note { font-size: 13px; color: #666; margin-top: 20px; padding: 16px; background: #f9f9f9; border-radius: 8px; }
    .footer { text-align: center; padding: 20px 30px; font-size: 12px; color: #999; border-top: 1px solid #f0f0f0; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header">
        <h1>Potvrzeni objednavky</h1>
        <p>Faktura ${orderNumber}</p>
      </div>
      <div class="body">
        <p class="greeting">Dobry den ${customerName},</p>
        <p style="font-size:14px;color:#555;">Vase platba byla uspesne zpracovana. Nize naleznete detaily vasi objednavky:</p>
        <div class="details">
          <div class="detail-row">
            <span class="label">Cislo objednavky</span>
            <span class="value">${orderNumber}</span>
          </div>
          <div class="detail-row">
            <span class="label">Datum</span>
            <span class="value">${orderDate}</span>
          </div>
          <div class="detail-row">
            <span class="label">Produkt</span>
            <span class="value">${planName}</span>
          </div>
          <div class="detail-row">
            <span class="label">Typ</span>
            <span class="value">${planType}</span>
          </div>
          <div class="detail-row total-row">
            <span class="label" style="font-weight:600;color:#333;">Celkova castka</span>
            <span class="value">${formatPrice(amount, currency)}</span>
          </div>
        </div>
        <div class="note">
          Vas pristup byl aktivovan a muzete zacit pouzivat vsechny funkce vaseho planu. Faktura ve formatu PDF je prilozena k tomuto emailu.
        </div>
      </div>
      <div class="footer">
        <p>Mate-li jakekoliv dotazy, nevahejte nas kontaktovat.</p>
        <p>S pozdravem, Tym Fyzioterapie Kurzy</p>
      </div>
    </div>
  </div>
</body>
</html>
    `;

    const ownerEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f4f4f4; }
    .wrapper { max-width: 600px; margin: 0 auto; padding: 20px; }
    .card { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
    .header { background: #10b981; color: #fff; padding: 24px 30px; }
    .header h2 { margin: 0; font-size: 18px; }
    .body { padding: 24px 30px; }
    .details { border: 1px solid #eee; border-radius: 8px; overflow: hidden; }
    .detail-row { padding: 10px 16px; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
    .detail-row:last-child { border-bottom: none; }
    .detail-row strong { display: inline-block; min-width: 140px; color: #555; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header">
        <h2>Novy nakup!</h2>
      </div>
      <div class="body">
        <p><strong>Nova objednavka byla prave dokoncena:</strong></p>
        <div class="details">
          <div class="detail-row"><strong>Zakaznik:</strong> ${customerName}</div>
          <div class="detail-row"><strong>Email:</strong> ${customerEmail}</div>
          <div class="detail-row"><strong>Plan:</strong> ${planName}</div>
          <div class="detail-row"><strong>Typ:</strong> ${planType}</div>
          <div class="detail-row"><strong>Castka:</strong> ${formatPrice(amount, currency)}</div>
          <div class="detail-row"><strong>Cislo objednavky:</strong> ${orderNumber}</div>
          <div class="detail-row"><strong>Datum:</strong> ${orderDate}</div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
    `;

    const brevoApiKey = Deno.env.get("BREVO_API_KEY");
    const fromEmail = Deno.env.get("FROM_EMAIL") || "noreply@example.com";
    const fromName = Deno.env.get("FROM_NAME") || "App";

    if (!brevoApiKey) {
      throw new Error("Brevo API key not configured");
    }

    const customerResponse = await fetch(
      "https://api.brevo.com/v3/smtp/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": brevoApiKey,
        },
        body: JSON.stringify({
          sender: { email: fromEmail, name: fromName },
          to: [{ email: customerEmail }],
          subject: `Faktura za vas nakup - ${orderNumber}`,
          htmlContent: customerEmailHtml,
          attachment: [
            {
              content: base64PDF,
              name: `Faktura-${orderNumber}.pdf`,
            },
          ],
        }),
      }
    );

    if (!customerResponse.ok) {
      const error = await customerResponse.text();
      throw new Error(`Failed to send customer email: ${error}`);
    }

    const ownerResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": brevoApiKey,
      },
      body: JSON.stringify({
        sender: { email: fromEmail, name: fromName },
        to: [{ email: OWNER_EMAIL }],
        subject: `Novy nakup: ${planName} - ${formatPrice(amount, currency)}`,
        htmlContent: ownerEmailHtml,
      }),
    });

    if (!ownerResponse.ok) {
      const error = await ownerResponse.text();
      console.error(`Failed to send owner notification: ${error}`);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Emails sent successfully" }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error sending invoice emails:", error);
    return new Response(
      JSON.stringify({
        error:
          error instanceof Error ? error.message : "Internal server error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
