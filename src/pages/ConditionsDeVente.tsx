import LegalPageLayout from '@/components/legal/LegalPageLayout';
import { SimpleAnimation } from '@/components/motion/SimpleAnimation';

export default function ConditionsDeVente() {
  return (
    <LegalPageLayout
      title="Conditions Générales de Vente"
      seoDescription="Conditions de vente, politique de retour et garanties de La Lunetterie Du Coin Neuf & Occasion."
      canonicalPath="/conditions-de-vente"
      lastUpdated="Décembre 2024"
    >
      <SimpleAnimation type="slide-up" delay={0}>
        <section className="space-y-6" aria-labelledby="fabrication-qualite">
          <h2 id="fabrication-qualite" className="heading-section">
            Fabrication et qualité
          </h2>

          <div className="space-y-4 text-body leading-relaxed text-stone">
            <p>
              Les lunettes sont manufacturées par nos spécialistes expérimentés et conçues à partir
              de matériaux nobles. Il est important de traiter vos lunettes avec délicatesse.
            </p>

            <div className="border-t border-stone/20 pt-8">
              <h3 className="heading-subsection mb-4">Services gratuits inclus</h3>
              <ul className="space-y-2">
                <li>• Ajustages personnalisés</li>
                <li>• Nettoyages professionnels</li>
                <li>• Remplacement des plaquettes et visseries</li>
              </ul>
            </div>
          </div>
        </section>
      </SimpleAnimation>

      <SimpleAnimation type="slide-up" delay={100}>
        <section className="space-y-6" aria-labelledby="politique-retour">
          <h2 id="politique-retour" className="heading-section">
            Politique de retour
          </h2>

          <div className="border-l-4 border-accent/30 bg-accent/5 p-8">
            <h3 className="heading-subsection mb-6">Points essentiels à retenir</h3>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center">
                <p className="mb-2 text-title-sm font-medium text-text">0</p>
                <p className="text-body-sm text-stone">
                  droit de rétractation pour produits personnalisés
                </p>
              </div>
              <div className="text-center">
                <p className="mb-2 text-title-sm font-medium text-text">30</p>
                <p className="text-body-sm text-stone">jours pour retours produits neufs</p>
              </div>
              <div className="text-center">
                <p className="mb-2 text-title-sm font-medium text-text">✗</p>
                <p className="text-body-sm text-stone">montures personnalisées non retournables</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-body leading-relaxed text-stone">
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

      <SimpleAnimation type="slide-up" delay={200}>
        <section className="space-y-6" aria-labelledby="changement-verres">
          <h2 id="changement-verres" className="heading-section">
            Changement de puissance des verres
          </h2>

          <div className="space-y-6 text-body leading-relaxed text-stone">
            <p>
              En cas de changement de puissance des verres dans les trente (30) jours suivant la
              livraison, des frais de montage s'appliquent pour l'ensemble de la commande.
            </p>

            <div className="border-t border-stone/20 pt-8">
              <h3 className="heading-subsection mb-6">Tarifs des frais de montage</h3>
              <div className="grid gap-8 md:grid-cols-2">
                <div className="text-center">
                  <p className="mb-2 text-title-md font-medium text-accent">90€</p>
                  <p className="mb-1 font-medium text-text">Verres progressifs</p>
                  <p className="text-body-sm text-stone">Frais de montage</p>
                </div>
                <div className="text-center">
                  <p className="mb-2 text-title-md font-medium text-accent">45€</p>
                  <p className="mb-1 font-medium text-text">Verres unifocaux</p>
                  <p className="text-body-sm text-stone">Frais de montage</p>
                </div>
              </div>
              <p className="mt-6 text-center text-body-sm text-stone">
                Délai : 30 jours après livraison
              </p>
            </div>
          </div>
        </section>
      </SimpleAnimation>

      <SimpleAnimation type="slide-up" delay={300}>
        <section className="space-y-6" aria-labelledby="reglement">
          <h2 id="reglement" className="heading-section">
            Règlement par chèque et tiers payant
          </h2>

          <div className="space-y-4 text-body leading-relaxed text-stone">
            <p>
              <strong className="font-medium text-text">Règlement par chèque :</strong>
              <br />
              Accepté sur présentation d'une pièce d'identité concordante.
            </p>
            <p>
              <strong className="font-medium text-text">Tiers payant :</strong>
              <br />
              Nous nous réservons le droit d'annuler le règlement par tiers payant.
            </p>
          </div>
        </section>
      </SimpleAnimation>

      <SimpleAnimation type="slide-up" delay={400}>
        <section className="space-y-6" aria-labelledby="lentilles-essai">
          <h2 id="lentilles-essai" className="heading-section">
            Lentilles d'essai
          </h2>

          <p className="text-body leading-relaxed text-stone">
            Une participation aux frais de transport et logistique de <strong>7€</strong> est
            demandée pour toute commande de lentilles d'essai.
          </p>
        </section>
      </SimpleAnimation>

      <SimpleAnimation type="slide-up" delay={500}>
        <section className="space-y-6" aria-labelledby="offres-commerciales">
          <h2 id="offres-commerciales" className="heading-section">
            Offres commerciales
          </h2>

          <div className="border-l-4 border-accent/30 bg-accent/5 p-8">
            <p className="text-body text-text">
              Ces offres ne sont pas cumulables avec d'autres promotions exceptionnelles et sont
              soumises aux conditions détaillées ci-dessous.
            </p>
          </div>

          <div className="space-y-12">
            <div>
              <h3 className="heading-subsection mb-4">01. Remise à la reprise</h3>
              <div className="space-y-3 border-l-4 border-stone/30 pl-6 text-body leading-relaxed text-stone">
                <p>
                  <strong className="text-text">Limitation :</strong> une monture par transaction
                </p>
                <p>
                  <strong className="text-text">Condition :</strong> valable uniquement avec l'achat
                  d'un équipement de classe B
                </p>
                <p>
                  <strong className="text-text">Cumul :</strong> non cumulable avec d'autres
                  promotions exceptionnelles
                </p>
              </div>
            </div>

            <div>
              <h3 className="heading-subsection mb-4">02. Seconde paire</h3>
              <div className="space-y-3 border-l-4 border-stone/30 pl-6 text-body leading-relaxed text-stone">
                <p>
                  <strong className="text-text">Tarification :</strong> valable sur la monture la
                  moins coûteuse
                </p>
                <p>
                  <strong className="text-text">Condition :</strong> pour l'achat d'un équipement de
                  classe B
                </p>
                <p>
                  <strong className="text-text">Cumul :</strong> cumulable avec la remise à la
                  reprise
                </p>
                <p>
                  <strong className="text-text">Exclusions :</strong> non valable pour double
                  équipement Komono et Myorelax
                </p>
                <p>
                  <strong className="text-text">Options (+40€) :</strong> polarisation solaires ou
                  double CozyLens
                </p>
              </div>
            </div>
          </div>
        </section>
      </SimpleAnimation>
    </LegalPageLayout>
  );
}
