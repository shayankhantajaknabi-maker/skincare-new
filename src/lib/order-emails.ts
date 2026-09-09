import { Resend } from "resend";

type EmailOrderItem = {
  name: string;
  price: number;
  quantity: number;
};

type EmailShippingData = {
  courier: string;
  shippingMethod: string;
  trackingNumber: string;
};

type OrderEmailData = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  items: EmailOrderItem[];
  shipping?: EmailShippingData;
};

function getResend() {
  const apiKey =
    process.env.RESEND_API_KEY;

  if (!apiKey) {
    return null;
  }

  return new Resend(apiKey);
}

function getFromEmail() {
  return (
    process.env.ORDER_EMAIL_FROM ||
    process.env.RESEND_FROM_EMAIL ||
    "ORINOCA NATURAL <onboarding@resend.dev>"
  );
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function money(value: number) {
  return `Rs. ${Number(
    value || 0
  ).toLocaleString("en-PK")}`;
}

function itemsHtml(
  items: EmailOrderItem[]
) {
  return items
    .map(
      (item) => `
        <tr>
          <td style="padding:14px 0;border-bottom:1px solid #eee;">
            <strong>
              ${escapeHtml(item.name)}
            </strong>

            <br />

            <span style="font-size:13px;color:#777;">
              Qty: ${item.quantity}
            </span>
          </td>

          <td
            align="right"
            style="padding:14px 0;border-bottom:1px solid #eee;"
          >
            ${money(
              item.price *
                item.quantity
            )}
          </td>
        </tr>
      `
    )
    .join("");
}

function emailLayout(
  content: string
) {
  return `
    <!doctype html>

    <html>
      <body
        style="
          margin:0;
          background:#f5f2eb;
          font-family:Arial,sans-serif;
          color:#17352d;
        "
      >
        <div style="padding:35px 15px;">

          <div
            style="
              max-width:620px;
              margin:auto;
              background:white;
              border-radius:22px;
              overflow:hidden;
              box-shadow:0 10px 40px rgba(0,0,0,.06);
            "
          >

            <div
              style="
                background:#073c31;
                padding:28px;
                text-align:center;
                color:white;
              "
            >
              <div
                style="
                  font-size:28px;
                  font-weight:700;
                "
              >
                ORINOCA
              </div>

              <div
                style="
                  margin-top:6px;
                  font-size:10px;
                  letter-spacing:4px;
                  color:#d9c88e;
                "
              >
                NATURAL
              </div>
            </div>

            <div style="padding:32px;">
              ${content}
            </div>

            <div
              style="
                padding:20px 32px;
                background:#faf8f2;
                color:#718079;
                font-size:12px;
                text-align:center;
              "
            >
              ORINOCA NATURAL · Pakistan
            </div>

          </div>
        </div>
      </body>
    </html>
  `;
}

export async function sendOrderPlacedEmail(
  order: OrderEmailData
) {
  if (!order.customerEmail) {
    return;
  }

  const resend = getResend();

  if (!resend) {
    console.warn(
      "RESEND_API_KEY missing. Order email skipped."
    );
    return;
  }

  const html = emailLayout(`
    <h1
      style="
        margin-top:0;
        font-size:27px;
      "
    >
      Thank you for your order!
    </h1>

    <p
      style="
        line-height:1.7;
        color:#68716d;
      "
    >
      Hi ${escapeHtml(
        order.customerName
      )}, your ORINOCA NATURAL
      order has been received
      successfully.
    </p>

    <div
      style="
        margin:25px 0;
        padding:18px;
        border-radius:14px;
        background:#f5f2eb;
      "
    >
      <div
        style="
          font-size:12px;
          color:#7f8984;
        "
      >
        ORDER NUMBER
      </div>

      <div
        style="
          margin-top:5px;
          font-size:20px;
          font-weight:700;
          color:#073c31;
        "
      >
        ${escapeHtml(
          order.orderNumber
        )}
      </div>
    </div>

    <table
      width="100%"
      cellspacing="0"
      cellpadding="0"
      style="border-collapse:collapse;"
    >
      ${itemsHtml(order.items)}
    </table>

    <div
      style="
        margin-top:22px;
        padding-top:18px;
        border-top:2px solid #073c31;
      "
    >
      <strong
        style="font-size:18px;"
      >
        Total:
        ${money(order.total)}
      </strong>
    </div>

    <p
      style="
        margin-top:28px;
        line-height:1.7;
        color:#68716d;
      "
    >
      Payment method:
      Cash on Delivery.

      <br />

      Estimated delivery:
      2–4 working days.
    </p>
  `);

  const { error } =
    await resend.emails.send(
      {
        from: getFromEmail(),

        to: [
          order.customerEmail,
        ],

        subject:
          `Order confirmed · ${order.orderNumber}`,

        html,
      },
      {
        idempotencyKey:
          `order-placed/${order.orderNumber}`,
      }
    );

  if (error) {
    throw new Error(
      `Order email failed: ${error.message}`
    );
  }
}

export async function sendOrderStatusEmail(
  order: OrderEmailData,
  status:
    | "shipped"
    | "delivered"
) {
  if (!order.customerEmail) {
    return;
  }

  const resend = getResend();

  if (!resend) {
    console.warn(
      "RESEND_API_KEY missing. Status email skipped."
    );

    return;
  }

  const shipped =
    status === "shipped";

  const title = shipped
    ? "Your order is on the way!"
    : "Your order has been delivered!";

  const description = shipped
    ? `Your ORINOCA NATURAL order ${escapeHtml(
        order.orderNumber
      )} has been dispatched and is on its way to you.`
    : `Your ORINOCA NATURAL order ${escapeHtml(
        order.orderNumber
      )} has been marked as delivered. We hope you love it.`;

  const shippingDetails =
    shipped && order.shipping
      ? `
        <div
          style="
            margin:25px 0;
            border:1px solid #e7e3da;
            border-radius:16px;
            overflow:hidden;
          "
        >

          <div
            style="
              padding:16px 18px;
              background:#073c31;
              color:white;
              font-size:15px;
              font-weight:700;
            "
          >
            Shipping Details
          </div>

          <div
            style="
              padding:20px;
              background:#faf8f2;
            "
          >

            <div
              style="
                margin-bottom:15px;
              "
            >
              <div
                style="
                  font-size:11px;
                  color:#8a938f;
                  text-transform:uppercase;
                  letter-spacing:1px;
                "
              >
                Courier
              </div>

              <div
                style="
                  margin-top:4px;
                  font-weight:700;
                  color:#073c31;
                "
              >
                ${escapeHtml(
                  order.shipping.courier
                )}
              </div>
            </div>

            <div
              style="
                margin-bottom:15px;
              "
            >
              <div
                style="
                  font-size:11px;
                  color:#8a938f;
                  text-transform:uppercase;
                  letter-spacing:1px;
                "
              >
                Shipping Method
              </div>

              <div
                style="
                  margin-top:4px;
                  font-weight:700;
                  color:#073c31;
                "
              >
                ${escapeHtml(
                  order.shipping
                    .shippingMethod
                )}
              </div>
            </div>

            <div>
              <div
                style="
                  font-size:11px;
                  color:#8a938f;
                  text-transform:uppercase;
                  letter-spacing:1px;
                "
              >
                Tracking / CN Number
              </div>

              <div
                style="
                  margin-top:6px;
                  font-size:19px;
                  font-weight:700;
                  color:#073c31;
                  letter-spacing:.5px;
                "
              >
                ${escapeHtml(
                  order.shipping
                    .trackingNumber
                )}
              </div>
            </div>

          </div>
        </div>
      `
      : "";

  const html = emailLayout(`
    <h1
      style="
        margin-top:0;
        font-size:27px;
      "
    >
      ${title}
    </h1>

    <p
      style="
        line-height:1.7;
        color:#68716d;
      "
    >
      Hi ${escapeHtml(
        order.customerName
      )},
    </p>

    <p
      style="
        line-height:1.7;
        color:#68716d;
      "
    >
      ${description}
    </p>

    <div
      style="
        margin:25px 0;
        padding:18px;
        border-radius:14px;
        background:#f5f2eb;
      "
    >
      <div
        style="
          font-size:12px;
          color:#7f8984;
        "
      >
        ORDER NUMBER
      </div>

      <div
        style="
          margin-top:5px;
          font-size:20px;
          font-weight:700;
          color:#073c31;
        "
      >
        ${escapeHtml(
          order.orderNumber
        )}
      </div>
    </div>

    ${shippingDetails}

    ${
      shipped
        ? `
          <p
            style="
              line-height:1.7;
              color:#68716d;
            "
          >
            Please keep your phone
            available for the courier.

            Payment will be collected
            on delivery.
          </p>
        `
        : `
          <p
            style="
              line-height:1.7;
              color:#68716d;
            "
          >
            Thank you for choosing
            ORINOCA NATURAL.
          </p>
        `
    }
  `);

  const { error } =
    await resend.emails.send(
      {
        from: getFromEmail(),

        to: [
          order.customerEmail,
        ],

        subject: shipped
          ? `Your ORINOCA order has been dispatched · ${order.orderNumber}`
          : `Order delivered · ${order.orderNumber}`,

        html,
      },
      {
        idempotencyKey:
          `order-${status}/${order.orderNumber}`,
      }
    );

  if (error) {
    throw new Error(
      `Status email failed: ${error.message}`
    );
  }
}