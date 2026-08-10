import Link from "next/link";

type StoreFooterProps = {
  ctaTitle?: string;
  ctaDescription?: string;
  ctaButtonText?: string;
  ctaHref?: string;
  showCta?: boolean;
};

export default function StoreFooter({
  ctaTitle = "Not sure which pack is right for you?",
  ctaDescription = "See full ingredients, usage steps and real reviews on the product page.",
  ctaButtonText = "View Full Product Details",
  ctaHref = "/shop",
  showCta = true,
}: StoreFooterProps) {
  return (
    <>
      {showCta ? (
        <section className="nm-footer-cta">
          <div className="nm-wrap">
            <h2>{ctaTitle}</h2>
            <p>{ctaDescription}</p>

            <Link href={ctaHref} className="nm-btn nm-btn-gold">
              {ctaButtonText}
            </Link>
          </div>
        </section>
      ) : null}

      <footer className="nm-footer">
        <div className="nm-wrap">
          <div className="nm-foot-grid">
            <div className="nm-foot-brand">
              <Link href="/" className="nm-logo">
                NM <span>Skin Care</span>
              </Link>

              <p>
                A pure &amp; natural skincare serum, formulated and lab-tested
                for everyday radiance. Proudly registered in Pakistan.
              </p>
            </div>

            <div className="nm-foot-col">
              <h3>Shop</h3>

              <ul>
                <li>
                  <Link href="/shop">All Packs</Link>
                </li>
                <li>
                  <Link href="/shop">Product Details</Link>
                </li>
                <li>
                  <Link href="/cart">Your Cart</Link>
                </li>
              </ul>
            </div>

            <div className="nm-foot-col">
              <h3>Support</h3>

              <ul>
                <li>
                  <Link href="/track-order">Order Tracking</Link>
                </li>
                <li>
                  <Link href="/shipping-returns">Delivery Info</Link>
                </li>
                <li>
                  <Link href="/contact">Contact Us</Link>
                </li>
              </ul>
            </div>

            <div className="nm-foot-col">
              <h3>Connect</h3>

              <div className="nm-foot-social">
                <a href="#" aria-label="Facebook">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  >
                    <path d="M15 8h-2a2 2 0 0 0-2 2v10M8 12h6" />
                  </svg>
                </a>

                <a href="#" aria-label="Instagram">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  >
                    <rect x="4" y="4" width="16" height="16" rx="4" />
                    <circle cx="12" cy="12" r="3.4" />
                  </svg>
                </a>

                <a href="#" aria-label="WhatsApp">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  >
                    <path d="M4 20l1.4-4A8 8 0 1 1 9 19l-5 1Z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="nm-foot-bottom">
            <span>
              © {new Date().getFullYear()} ORINOCA NATURAL. All rights reserved.
            </span>

            <span>
              Pure &amp; Natural · Lab Tested · Registered in Pakistan
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}