import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Header from "../HomePage/Header";
import Footer from "../HomePage/Footer";

export default function TermPage({ history }) {
  // drawer
  const [open, setOpen] = useState(false);
  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);
  const closeDrawer = () => setOpen(false);

  // top button
  const [showButton, setShowButton] = useState(false);

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  });

  return (
    <>
      <Header />
      <section className="content">
        <h2 className="text-center mb-5">TERMS and CONDITIONS</h2>
        <p>
          PLEASE READ THESE TERMS AND CONDITIONS ("TERMS") CAREFULLY BEFORE
          USING THE SERVICES DESCRIBED HEREIN. BY UTILIZING THE WEBSITE LOCATED
          AT WWW.HEWE.IO ("WEBSITE OR APP") AND PRODUCTS THEREIN, YOU
          ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS AND CONDITIONS AND THAT YOU
          AGREE TO BE BOUND BY THEM. IF YOU DO NOT AGREE TO ALL OF THE TERMS AND
          CONDITIONS OF THIS AGREEMENT, YOU ARE NOT AN AUTHORIZED USER OF THESE
          SERVICES AND YOU SHOULD NOT USE THIS WEBSITE NOR ITS PRODUCTS. YOU MAY
          BE REFERRED TO YOU OR THE ENTITY YOU REPRESENT. AMERITEC JSC RESERVES
          THE RIGHT TO CHANGE, MODIFY, ADD OR REMOVE PORTIONS OF THESE TERMS AT
          ANY TIME FOR ANY REASON. WE SUGGEST THAT YOU REVIEW THESE TERMS
          PERIODICALLY FOR CHANGES. SUCH CHANGES SHALL BE EFFECTIVE IMMEDIATELY
          UPON POSTING. YOU ACKNOWLEDGE THAT BY ACCESSING OUR WEBSITE AFTER WE
          HAVE POSTED CHANGES TO THESE TERMS, YOU ARE AGREEING TO THE MODIFIED
          TERMS. THIS DISCLAIMER OR ANY OTHER DOCUMENT, PRODUCED AND SIGNED BY
          AMERITEC JSC, DOES NOT CONSTITUTE AN OFFER OR SOLICITATION TO SELL ANY
          SHARES OR SECURITIES OR THE PRODUCTS OFFERED THERETO. NONE OF THE
          INFORMATION OR ANALYSES PRESENTED ARE INTENDED TO FORM THE BASIS FOR
          ANY INVESTMENT DECISION, AND NO SPECIFIC RECOMMENDATIONS ARE INTENDED,
          AND AMERITEC JSC SERVICES AND THE WEBSITE ARE NOT, DO NOT OFFER AND
          SHALL NOT BE CONSTRUED AS INVESTMENT OR FINANCIAL PRODUCTS.
          ACCORDINGLY, AMERITEC JSC DOES NOT PROVIDE INVESTMENT ADVICE OR
          COUNSEL OR SOLICITATION FOR INVESTMENT IN ANY SECURITY AND SHALL NOT
          BE CONSTRUED IN THAT WAY. AMERITEC JSC EXPRESSLY DISCLAIMS ANY AND ALL
          RESPONSIBILITY FOR ANY DIRECT OR CONSEQUENTIAL LOSS OR DAMAGE OF ANY
          KIND WHATSOEVER ARISING DIRECTLY OR INDIRECTLY FROM: (I) RELIANCE ON
          ANY INFORMATION PRODUCED BY AMERITEC JSC, (II) ANY ERROR, OMISSION OR
          INACCURACY IN ANY SUCH INFORMATION OR (III) ANY ACTION RESULTING
          THEREFROM, (IV) USAGE OR ACQUISITION OF PRODUCTS, AVAILABLE THROUGH
          THE WEBSITE. Digital Asset Arrays The AMERITEC JSC Core HEWE is a
          cryptographic token solution, developed by AMERITEC JSC, which
          operates on the AmChain public blockchain. HEWE is a software product
          as its content presents a source code, including elements of a smart
          contract and application features. HEWE can be custom fit for a wide
          arrange of purposes. HEWE may include a number of chosen Digital
          Assets. Consequently, its main feature is that it saves time and
          transaction costs to those users, who wish to obtain cryptographic
          tokens of different digital assets (public blockchains). HEWES is not
          an investment product and any action, notice, communication, message,
          decision, managerial act, or omission of the mentioned, is not an
          investment advice and shall not be understood and interpreted as such.
          Any such content shall be regarded solely as statement of facts or
          observation and in no case as investment advice. HEWE is not a
          security. AMERITEC and HEWE gives no guarantees as to the value of any
          of the HEWE and explicitly warns users that there is no guarantees
          that HEWE will increase in value, and they might also decrease in
          value or lose their value entirely. If you choose to acquire HEWE
          through the HEWE platform, you will be bound by the Terms and
          Conditions set forth by HEWE. You agree and accept, that you are
          acquiring HEWE for your own personal use as technical means to
          acquiring tokens from different blockchains simultaneously and for
          your personal utility and not for investment or financial purposes.
          You also agree that you do not consider HEWE as security and you
          understand that HEWE may lose all their value and that you are not
          acquiring HEWE as an investment. This disclaimer or any other
          document, produced and signed by AMERITEC JSC, the Website and HEWE as
          such do not constitute an offer or solicitation to sell and shall not
          be construed in this way, and it may only be construed as an
          invitation to give offer, in all cases for purchase of HEWE as
          software solutions. Please read the Terms and Conditions found on
          WWW.HEWE.IO carefully before you decide to acquire any HEWE through
          their platform. Intellectual Property We retain all right, title and
          interest in all of our intellectual property, including inventions,
          discoveries, processes, marks, methods, compositions, formulae,
          techniques, information and data, whether or not patentable,
          copyrightable or protectable in trademark, and any trademarks,
          copyrights or patents based thereon. You may not use any of our
          intellectual property for any reason, except with our express, prior,
          written consent. All content included on the Website and associated
          products and services, such as, but not limited to, text, graphics,
          logos, and images is the property of AMERITEC JSC and protected by
          copyright, trademark and other laws that protect intellectual property
          and proprietary rights. You agree to observe and abide by all
          copyright and other proprietary notices, legends or other restrictions
          contained in any such content and will not make any changes thereto.
          Access to the Website. The Website is provided without warranty of any
          kind, either express or implied. We do not represent that the Website
          will be available 100% of the time to meet your needs. In case of
          interruptions, we take all reasonable actions to provide you with
          access to the Website as soon as possible, but there are no guarantees
          that access will not be interrupted, or that there will be no delays,
          failures, errors, omissions or loss of transmitted information. We may
          suspend use of the Website at any time for maintenance.
        </p>
      </section>
      <Footer />
    </>
  );
}
