"use client";

import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function IntegritetPage() {
  return (
    <main
      className={`${inter.className} min-h-screen bg-[#f4ede3] text-[#1f2933] pt-24 pb-16 px-4`}
    >
      <div className="max-w-3xl mx-auto bg-[#fffaf2] border border-[#fde68a] rounded-3xl shadow-md p-8 space-y-6">
        <h1 className="text-3xl font-bold text-[#ea580c] mb-2">
          Integritet & cookies
        </h1>

        <p className="text-sm text-[#4b5563]">
          Vi bryr oss om din integritet. På den här sidan beskriver vi kort hur
          BuildWise hanterar personuppgifter, cookies och annan information när du
          använder tjänsten.
        </p>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-[#f97316]">
            Vem ansvarar för sidan?
          </h2>
          <p className="text-sm text-[#4b5563]">
            BuildWise drivs som ett projekt för att hjälpa användare att planera,
            uppgradera och skapa datorbyggen med hjälp av AI-rådgivning.
            Om du har frågor om integritet eller datahantering kan du alltid kontakta
            oss på <span className="font-medium">info@buildwise.se</span>.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-[#f97316]">
            Vilken information samlar vi in?
          </h2>
          <ul className="list-disc list-inside text-sm text-[#4b5563] space-y-1">
            <li>
              <span className="font-medium">Uppgifter du själv lämnar</span> –
              till exempel namn, e-postadress och meddelande när du kontaktar oss
              via kontaktformuläret.
            </li>
            <li>
              <span className="font-medium">Teknisk information</span> – som
              webbläsare, enhetstyp och ungefärlig användning av sidan. Detta
              används endast för drift, felsökning och för att förbättra tjänsten.
            </li>
            <li>
              <span className="font-medium">Lokal lagring</span> – vissa val du gör
              (t.ex. sparade datorbyggen eller inloggningssessioner) kan lagras
              lokalt i din webbläsare genom lokal lagring eller tekniskt nödvändiga
              cookies.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-[#f97316]">
            Cookies & lokal lagring
          </h2>
          <p className="text-sm text-[#4b5563]">
            BuildWise använder främst cookies och lokal lagring för att få
            grundläggande funktioner att fungera – till exempel att komma ihåg om du
            är inloggad eller spara ditt bygge på den enhet du använder.
          </p>
          <p className="text-sm text-[#4b5563]">
            I framtiden kan vi komma att lägga till enkla analystjänster (till
            exempel för att se hur många som använder sidan och vilka funktioner som
            används mest). I så fall försöker vi göra det på ett sätt som respekterar
            din integritet och endast använder aggregerad statistik.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-[#f97316]">
            Länkar till andra webbplatser & affiliatelänkar
          </h2>
          <p className="text-sm text-[#4b5563]">
            BuildWise kan länka vidare till externa återförsäljare av dator­komponenter,
            till exempel butiker som säljer CPU, grafikkort eller andra delar.
          </p>
          <p className="text-sm text-[#4b5563]">
            I framtiden kan vissa av dessa länkar vara så kallade affiliatelänkar.
            Det innebär att återförsäljaren kan se att du kommer från BuildWise och
            vi kan få ersättning om du genomför ett köp – utan extra kostnad för dig.
            När vi använder affiliatelänkar kommer vi att vara tydliga med det.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-[#f97316]">
            Dina rättigheter
          </h2>
          <p className="text-sm text-[#4b5563]">
            Om du har kontaktat oss med namn eller e-postadress har du rätt att:
          </p>
          <ul className="list-disc list-inside text-sm text-[#4b5563] space-y-1">
            <li>få veta vilken information vi har sparat om dig,</li>
            <li>begära rättelse om något är fel,</li>
            <li>begära att vi raderar dina uppgifter om de inte längre behövs.</li>
          </ul>
          <p className="text-sm text-[#4b5563]">
            Hör av dig till <span className="font-medium">info@buildwise.se</span>{" "}
            om du vill utnyttja någon av dessa rättigheter.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-[#f97316]">
            Kontakt
          </h2>
          <p className="text-sm text-[#4b5563]">
            Har du frågor om integritet, cookies eller hur vi hanterar data?
            Tveka inte att kontakta oss:
          </p>
          <p className="text-sm text-[#4b5563]">
            E-post: <span className="font-medium">info@buildwise.se</span>
          </p>
        </section>
      </div>

      <div className="mt-8 text-center text-xs text-[#9ca3af]">
        <Link href="/" className="underline underline-offset-2 hover:text-[#f97316]">
          ← Tillbaka till startsidan
        </Link>
      </div>
    </main>
  );
}
