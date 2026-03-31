import LegalPageLayout from '@/components/legal/LegalPageLayout';
import TableOfContents from '@/components/legal/TableOfContents';
import HighlightBox from '@/components/legal/HighlightBox';
import PrintButton from '@/components/legal/PrintButton';
import { SimpleAnimation } from '@/components/motion/SimpleAnimation';

const SECTIONS = [
  { id: 'fabrication', title: 'Fabrication et qualité' },
  { id: 'retour', title: 'Politique de retour' },
  { id: 'verres', title: 'Changement de puissance des verres' },
  { id: 'reglement', title: 'Règlement par chèque et tiers payant' },
  { id: 'lentilles', title: 'Lentilles d\u2019essai' },
  { id: 'offres', title: 'Offres commerciales' },
];

export default function ConditionsDeVente() {
  return (
    <LegalPageLayout
      title="Conditions Générales de Vente"
      seoDescription="Conditions de vente, politique de retour et garanties de La Lunetterie Du Coin Neuf & Occasion."
      canonicalPath="/conditions-de-vente"
      lastUpdated="Décembre 2024"
    >
      <TableOfContents sections={SECTIONS} />

      <SimpleAnimation type="fade">
        <section className="space-y-6" aria-labelledby="fabrication">
          <h2 id="fabrication" className="heading-section">
            Fabrication et qualité
          </h2>

          <p className="text-body text-black">
            Les lunettes sont manufacturées par nos spécialistes expérimentés et conçues à partir de
            matériaux nobles. Il est important de traiter vos lunettes avec délicatesse.
          </p>

          <div className="mt-4">
            <h3 className="heading-subsection mb-3">Services gratuits inclus</h3>
            <ul className="space-y-2 text-body text-black">
              <li>• Ajustages personnalisés</li>
              <li>• Nettoyages professionnels</li>
              <li>• Remplacement des plaquettes et visseries</li>
            </ul>
          </div>
        </section>
      </SimpleAnimation>

      <SimpleAnimation type="fade">
        <section className="space-y-6" aria-labelledby="retour">
          <h2 id="retour" className="heading-section">
            Politique de retour
          </h2>

          <HighlightBox title="Points essentiels" variant="accent">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center">
                <p className="mb-1 text-title-sm font-medium text-text">0</p>
                <p className="text-body-sm text-black">
                  droit de rétractation pour produits personnalisés
                </p>
              </div>
              <div className="text-center">
                <p className="mb-1 text-title-sm font-medium text-text">30</p>
                <p className="text-body-sm text-black">jours pour retours produits neufs</p>
              </div>
              <div className="text-center">
                <p className="mb-1 text-title-sm font-medium text-text">&times;</p>
                <p className="text-body-sm text-black">montures personnalisées non retournables</p>
              </div>
            </div>
          </HighlightBox>

          <div className="space-y-3 text-body text-black">
            <p>
              Il n'existe aucun droit de rétractation pour l'achat de produits personnalisés en
              boutique.
            </p>
            <p>
              Seuls les produits neufs et en parfait état d'origine, accompagnés des accessoires,
              pourront être retournés contre un échange ou un avoir dans un délai de trente (30)
              jours à compter de la date d'achat.
            </p>
            <p>
              Les montures personnalisées et ajustées ne pourront pas être retournées. Cette
              politique s'ajoute aux garanties légales (conformité et vices cachés).
            </p>
          </div>
        </section>
      </SimpleAnimation>

      <SimpleAnimation type="fade">
        <section className="space-y-6" aria-labelledby="verres">
          <h2 id="verres" className="heading-section">
            Changement de puissance des verres
          </h2>

          <p className="text-body text-black">
            En cas de changement de puissance des verres dans les trente (30) jours suivant la
            livraison, des frais de montage s'appliquent pour l'ensemble de la commande.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-sm border border-black/10 p-6 text-center">
              <p className="mb-1 text-title-md font-medium text-secondary-orange">90€</p>
              <p className="font-medium text-text">Verres progressifs</p>
              <p className="text-body-sm text-black">Frais de montage</p>
            </div>
            <div className="rounded-sm border border-black/10 p-6 text-center">
              <p className="mb-1 text-title-md font-medium text-secondary-orange">45€</p>
              <p className="font-medium text-text">Verres unifocaux</p>
              <p className="text-body-sm text-black">Frais de montage</p>
            </div>
          </div>

          <p className="text-center text-body-sm text-black">Délai : 30 jours après livraison</p>
        </section>
      </SimpleAnimation>

      <SimpleAnimation type="fade">
        <section className="space-y-4" aria-labelledby="reglement">
          <h2 id="reglement" className="heading-section">
            Règlement par chèque et tiers payant
          </h2>

          <dl className="grid gap-x-8 gap-y-3 text-body sm:grid-cols-[auto_1fr]">
            <dt className="font-medium text-text">Chèque</dt>
            <dd className="text-black">
              Accepté sur présentation d'une pièce d'identité concordante.
            </dd>

            <dt className="font-medium text-text">Tiers payant</dt>
            <dd className="text-black">
              Nous nous réservons le droit d'annuler le règlement par tiers payant.
            </dd>
          </dl>
        </section>
      </SimpleAnimation>

      <SimpleAnimation type="fade">
        <section className="space-y-4" aria-labelledby="lentilles">
          <h2 id="lentilles" className="heading-section">
            Lentilles d'essai
          </h2>

          <p className="text-body text-black">
            Une participation aux frais de transport et logistique de{' '}
            <strong className="text-text">7€</strong> est demandée pour toute commande de lentilles
            d'essai.
          </p>
        </section>
      </SimpleAnimation>

      <SimpleAnimation type="fade">
        <section className="space-y-6" aria-labelledby="offres">
          <h2 id="offres" className="heading-section">
            Offres commerciales
          </h2>

          <HighlightBox variant="accent">
            <p className="text-text">
              Ces offres ne sont pas cumulables avec d'autres promotions exceptionnelles et sont
              soumises aux conditions détaillées ci-dessous.
            </p>
          </HighlightBox>

          <div className="space-y-10">
            <div>
              <h3 className="heading-subsection mb-4">01. Remise à la reprise</h3>
              <dl className="space-y-2 border-l-4 border-black/10 pl-6 text-body">
                <div>
                  <dt className="inline font-medium text-text">Limitation : </dt>
                  <dd className="inline text-black">une monture par transaction</dd>
                </div>
                <div>
                  <dt className="inline font-medium text-text">Condition : </dt>
                  <dd className="inline text-black">
                    valable uniquement avec l'achat d'un équipement de classe B
                  </dd>
                </div>
                <div>
                  <dt className="inline font-medium text-text">Cumul : </dt>
                  <dd className="inline text-black">
                    non cumulable avec d'autres promotions exceptionnelles
                  </dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="heading-subsection mb-4">02. Seconde paire</h3>
              <dl className="space-y-2 border-l-4 border-black/10 pl-6 text-body">
                <div>
                  <dt className="inline font-medium text-text">Tarification : </dt>
                  <dd className="inline text-black">valable sur la monture la moins coûteuse</dd>
                </div>
                <div>
                  <dt className="inline font-medium text-text">Condition : </dt>
                  <dd className="inline text-black">pour l'achat d'un équipement de classe B</dd>
                </div>
                <div>
                  <dt className="inline font-medium text-text">Cumul : </dt>
                  <dd className="inline text-black">cumulable avec la remise à la reprise</dd>
                </div>
                <div>
                  <dt className="inline font-medium text-text">Exclusions : </dt>
                  <dd className="inline text-black">
                    non valable pour double équipement Komono et Myorelax
                  </dd>
                </div>
                <div>
                  <dt className="inline font-medium text-text">Options (+40€) : </dt>
                  <dd className="inline text-black">polarisation solaires ou double CozyLens</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>
      </SimpleAnimation>

      <PrintButton />
    </LegalPageLayout>
  );
}
