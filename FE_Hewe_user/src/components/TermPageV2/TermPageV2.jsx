import Header from "../HomePage/Header";
import Footer from "../HomePage/Footer";
import React, { useEffect, useState } from "react";

export default function TermPageV2({ history }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  });

  return (
    <>
      <Header />
      <section className="termpageV2Content">
        <h2 className="text-center mb-5">Terms and Conditions</h2>
        <p>
          1. Introduction
          <div className="mt-2">
            Welcome to HEWE Crypto Card ("we," "us," or "our"), a platform that
            provides users with access to virtual and physical crypto cards for
            spending cryptocurrency at millions of merchants worldwide. These
            Terms of Service ("Terms") govern your access to and use of our
            website, mobile applications, and all related services
            (collectively, the "Services"). By accessing or using the Services,
            you agree to be bound by these Terms. If you do not agree to these
            Terms, please do not use the Services.
          </div>
        </p>
        <p>
          2. Eligibility
          <div className="mt-2">
            You must be at least [18] years old to use the Services. By using
            the Services, you represent and warrant that you meet these
            requirements.
          </div>
        </p>
        <p>
          3. Account Registration
          <div className="mt-2">
            To use certain features of the Services, you may need to create an
            account. You are responsible for maintaining the confidentiality of
            your account credentials and for all activities that occur under
            your account. You agree to notify HEWE Crypto Card immediately of
            any unauthorized use of your account or any other breach of
            security.
          </div>
        </p>
        <p>
          4. Use of Services
          {/* 1 */}
          <div className="mb-1 mt-2">
            * Permitted Use: You may use the Services only for lawful purposes
            and in accordance with these Terms. You agree not to:
          </div>
          <div className="mb-1" style={{ marginLeft: 20 }}>
            * Use the Services for any illegal or unauthorized purpose.
          </div>
          <div className="mb-1" style={{ marginLeft: 20 }}>
            * Interfere with or disrupt the integrity or performance of the HEWE
            Crypto Card Services.
          </div>
          <div className="mb-1" style={{ marginLeft: 20 }}>
            * [Rest of the prohibitions] Crypto Card Services.
          </div>
          {/* 2 */}
          <div className="mb-1 mt-2">* Cryptocurrency Transactions:</div>
          <div className="mb-1" style={{ marginLeft: 20 }}>
            * You are solely responsible for the security and management of your
            cryptocurrency holdings.
          </div>
          <div className="mb-1" style={{ marginLeft: 20 }}>
            * HEWE Crypto Card is not responsible for any losses or damages
            arising from unauthorized transactions, hacking, or other security
            breaches related to your cryptocurrency.
          </div>
          <div style={{ marginLeft: 20 }}>
            * HEWE Crypto Card may suspend or limit your use of the Services if
            we suspect any fraudulent or suspicious activity.
          </div>
        </p>
        <p>
          5. Fees and Charges
          <div className="mb-1 mt-2">
            * Card Fees: HEWE Crypto Card may charge fees for issuing and using
            crypto cards, including transaction fees, currency conversion fees,
            and maintenance fees.
          </div>
          <div className="mb-1 mt-2">
            * Other Fees: HEWE Crypto Card may charge fees for other services,
            such as account upgrades or customer support.
          </div>
          <div className="mt-2">
            * Fee Changes: HEWE Crypto Card may update our fee schedule from
            time to time. We will provide you with reasonable notice of any fee
            changes.
          </div>
        </p>
        <p>
          6. Disclaimer of Warranties
          <div className="mt-2">
            THE HEWE CRYPTO CARD SERVICES ARE PROVIDED "AS IS" AND "AS
            AVAILABLE" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
            INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF
            MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
            NON-INFRINGEMENT. HEWE CRYPTO CARD DOES NOT WARRANT THAT THE
            SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE, OR THAT
            DEFECTS WILL BE CORRECTED.
          </div>
        </p>
        <p>
          7. Limitation of Liability
          <div className="mt-2">
            IN NO EVENT SHALL HEWE CRYPTO CARD BE LIABLE FOR ANY INDIRECT,
            INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING
            BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER
            INTANGIBLE LOSSES, RESULTING FROM YOUR USE OF OR INABILITY TO USE
            THE SERVICES, WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING
            NEGLIGENCE), OR ANY OTHER LEGAL THEORY, AND WHETHER OR NOT HEWE
            CRYPTO CARD HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
          </div>
        </p>
        <p>
          8. Indemnification
          <div className="mt-2">
            You agree to indemnify and hold HEWE Crypto Card harmless from any
            claims, liabilities, damages, losses, and expenses, including
            attorneys' fees, arising out of or related to your use of the
            Services, your violation of these Terms, or your infringement of any
            third-party rights.
          </div>
        </p>
        <p>
          9. Intellectual Property
          <div className="mt-2">
            All intellectual property rights in and to the Services, including
            but not limited to trademarks, copyrights, and patents, are owned by
            HEWE Crypto Card or our licensors. You agree not to use any of our
            trademarks or logos without our prior written consent.
          </div>
        </p>
        <p>
          10. Changes to Terms
          <div className="mt-2">
            HEWE Crypto Card may update these Terms from time to time. We will
            notify you of any material changes by posting the updated Terms on
            our website or by other reasonable means.
          </div>
        </p>
      </section>
      <Footer />
    </>
  );
}
