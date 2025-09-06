// src/pages/ConditionsDeVente.tsx
import LegalPageLayout from '@/components/legal/LegalPageLayout';
import TableOfContents from '@/components/legal/TableOfContents';
import HighlightBox from '@/components/legal/HighlightBox';
import PrintButton from '@/components/legal/PrintButton';
import { OptimizedAnimateItem } from '@/components/motion/OptimizedAnimateItem';

const sections = [
  { id: 'introduction', title: 'Fabrication et qualité' },
  { id: 'politique-retour', title: 'Politique de retour' },
  { id: 'changement-puissance', title: 'Changement de puissance' },
  { id: 'reglement', title: 'Règlement et tiers payant' },
  { id: 'offres-commerciales', title: 'Offres commerciales' },
];

export default function ConditionsDeVente() {
  return (
    <LegalPageLayout
      title="Conditions Générales de Vente"
      seoDescription="Conditions de vente, politique de retour et garanties de La Lunetterie Du Coin Neuf & Occasion."
      canonicalPath="/conditions-de-vente"
      lastUpdated="Décembre 2024"
    >
      <TableOfContents sections={sections} />

      <OptimizedAnimateItem index={0} type="fade-down" threshold={0.3}>
        <section className="space-y-md">
          <h2
            id="introduction"
            className="font-serif text-title-lg font-bold text-primary"
            tabIndex={-1}
          >
            Fabrication et qualité
          </h2>

          <div className="space-y-sm">
            <p className="text-body leading-relaxed">
              Les lunettes sont manufacturées par nos spécialistes expérimentés et conçues à partir
              de matériaux nobles. Il est important de traiter vos lunettes avec délicatesse.
            </p>

            <HighlightBox title="Services gratuits inclus" variant="info">
              <ul className="space-y-xs text-primary">
                <li>
                  • <strong>Ajustages</strong> personnalisés
                </li>
                <li>
                  • <strong>Nettoyages</strong> professionnels
                </li>
                <li>
                  • <strong>Remplacement</strong> des plaquettes et visseries
                </li>
              </ul>
            </HighlightBox>
          </div>
        </section>
      </OptimizedAnimateItem>

      <OptimizedAnimateItem index={1} type="fade-down" threshold={0.3}>
        <section className="space-y-md">
          <h2
            id="politique-retour"
            className="font-serif text-title-lg font-bold text-primary"
            tabIndex={-1}
          >
            Politique de retour
          </h2>

          <HighlightBox title="Points essentiels à retenir" variant="warning">
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-sm md:grid-cols-3">
                <div className="text-center">
                  <p className="text-body-lg font-bold text-primary">0</p>
                  <p className="text-body-sm text-primary/80">
                    droit de rétractation pour produits personnalisés
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-body-lg font-bold text-primary">30</p>
                  <p className="text-body-sm text-primary/80">jours pour retours produits neufs</p>
                </div>
                <div className="text-center">
                  <p className="text-body-lg font-bold text-primary">✗</p>
                  <p className="text-body-sm text-primary/80">
                    montures personnalisées non retournables
                  </p>
                </div>
              </div>
            </div>
          </HighlightBox>

          <div className="space-y-sm">
            <p className="text-body leading-relaxed">
              Il n'existe aucun droit de rétractation pour l'achat de produits personnalisés en
              boutique.
            </p>
            <p className="text-body leading-relaxed">
              Seuls les produits neufs et en parfait état d'origine, accompagnés des accessoires,
              pourront être retournés contre un échange ou un avoir dans un délai de trente (30)
              jours à compter de la date d'achat.
            </p>
            <p className="text-body leading-relaxed">
              Les montures personnalisées et ajustées ne pourront pas être retournées. Cette
              politique s'ajoute aux garanties légales (conformité et vices cachés).
            </p>
          </div>
        </section>
      </OptimizedAnimateItem>

      <OptimizedAnimateItem index={2} type="fade-down" threshold={0.3}>
        <section className="space-y-md">
          <h2
            id="changement-puissance"
            className="font-serif text-title-lg font-bold text-primary"
            tabIndex={-1}
          >
            Changement de puissance des verres
          </h2>

          <div className="space-y-6">
            <p className="text-body leading-relaxed">
              En cas de changement de puissance des verres dans les trente (30) jours suivant la
              livraison, des frais de montage s'appliquent pour l'ensemble de la commande.
            </p>

            <HighlightBox title="Tarifs des frais de montage" variant="info">
              <div className="grid grid-cols-1 gap-md md:grid-cols-2">
                <div className="p-4 text-center">
                  <p className="text-title-md font-bold text-primary">90€</p>
                  <p className="font-semibold text-primary">Verres progressifs</p>
                  <p className="text-body-sm text-primary/80">Frais de montage</p>
                </div>
                <div className="p-4 text-center">
                  <p className="text-title-md font-bold text-primary">45€</p>
                  <p className="font-semibold text-primary">Verres unifocaux</p>
                  <p className="text-body-sm text-primary/80">Frais de montage</p>
                </div>
              </div>
              <p className="mt-4 text-center text-body-sm text-primary/80">
                <strong>Délai :</strong> 30 jours après livraison
              </p>
            </HighlightBox>
          </div>
        </section>
      </OptimizedAnimateItem>

      <OptimizedAnimateItem index={3} type="fade-down" threshold={0.3}>
        <section className="space-y-md">
          <h2
            id="reglement"
            className="font-serif text-title-lg font-bold text-primary"
            tabIndex={-1}
          >
            Règlement par chèque et tiers payant
          </h2>

          <div className="space-y-sm">
            <p className="text-body leading-relaxed">
              <strong className="font-semibold text-primary">Règlement par chèque :</strong>
              <br />
              Accepté sur présentation d'une pièce d'identité concordante.
            </p>
            <p className="text-body leading-relaxed">
              <strong className="font-semibold text-primary">Tiers payant :</strong>
              <br />
              Nous nous réservons le droit d'annuler le règlement par tiers payant.
            </p>
          </div>
        </section>
      </OptimizedAnimateItem>

      <OptimizedAnimateItem index={4} type="fade-down" threshold={0.3}>
        <section className="space-y-md">
          <h2
            id="offres-commerciales"
            className="font-serif text-title-lg font-bold text-primary"
            tabIndex={-1}
          >
            Offres commerciales
          </h2>

          <HighlightBox title="Conditions importantes" variant="important">
            <p className="text-primary">
              Ces offres ne sont pas cumulables avec d'autres promotions exceptionnelles et sont
              soumises aux conditions détaillées ci-dessous.
            </p>
          </HighlightBox>

          <div className="space-y-md">
            <div>
              <h3 className="mb-4 text-title-sm font-bold text-primary">01. Remise à la reprise</h3>
              <div className="border-dark-green space-y-3 border-l-2 pl-6">
                <p className="text-body leading-relaxed">
                  <strong className="text-primary">Limitation :</strong> une monture par transaction
                </p>
                <p className="text-body leading-relaxed">
                  <strong className="text-primary">Condition :</strong> valable uniquement avec
                  l'achat d'un équipement de classe B
                </p>
                <p className="text-body leading-relaxed">
                  <strong className="text-primary">Cumul :</strong> non cumulable avec d'autres
                  promotions exceptionnelles
                </p>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-title-sm font-bold text-primary">02. Seconde paire</h3>
              <div className="border-dark-green space-y-3 border-l-2 pl-6">
                <p className="text-body leading-relaxed">
                  <strong className="text-primary">Tarification :</strong> valable sur la monture la
                  moins coûteuse
                </p>
                <p className="text-body leading-relaxed">
                  <strong className="text-primary">Condition :</strong> pour l'achat d'un équipement
                  de classe B
                </p>
                <p className="text-body leading-relaxed">
                  <strong className="text-primary">Cumul :</strong> cumulable avec la remise à la
                  reprise
                </p>
                <p className="text-body leading-relaxed">
                  <strong className="text-primary">Exclusions :</strong> non valable pour double
                  équipement Komono et Myorelax
                </p>
                <p className="text-body leading-relaxed">
                  <strong className="text-primary">Options (+40€) :</strong> polarisation solaires
                  ou double CozyLens
                </p>
              </div>
            </div>
          </div>
        </section>
      </OptimizedAnimateItem>

      <OptimizedAnimateItem index={5} type="fade-down" threshold={0.3}>
        <PrintButton />
      </OptimizedAnimateItem>
    </LegalPageLayout>
  );
}
