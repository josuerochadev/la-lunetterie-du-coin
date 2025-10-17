import LegalPageLayout from '@/components/legal/LegalPageLayout';
import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import {
  COMPANY_NAME,
  COMPANY_LEGAL_FORM,
  COMPANY_ADDRESS,
  COMPANY_SIRET,
  COMPANY_RCS,
  PUBLICATION_DIRECTOR,
  COMPANY_EMAIL,
  COMPANY_PHONE,
  COMPANY_SHARE_CAPITAL,
  COMPANY_VAT,
  HOST_NAME,
  HOST_ADDRESS,
  MEDIATOR_NAME,
  MEDIATOR_URL,
  MEDIATOR_ADDRESS,
} from '@/config/constants';

export default function MentionsLegales() {
  return (
    <LegalPageLayout
      title="Mentions légales"
      seoDescription="Informations légales de La Lunetterie Du Coin Neuf & Occasion."
      canonicalPath="/mentions-legales"
      lastUpdated="Décembre 2024"
    >
      <SimpleAnimation type="slide-up" delay={0}>
        <section className="space-y-6">
          <h2 className="heading-section">Éditeur du site</h2>

          <div className="space-y-4 text-body leading-relaxed text-stone">
            <p>
              <strong className="font-medium text-text">Nom :</strong>
              <br />
              {COMPANY_NAME}
            </p>

            <p>
              <strong className="font-medium text-text">Forme juridique :</strong>
              <br />
              {COMPANY_LEGAL_FORM}{' '}
              {COMPANY_SHARE_CAPITAL ? `(capital social : ${COMPANY_SHARE_CAPITAL})` : ''}
            </p>

            <p>
              <strong className="font-medium text-text">Siège social :</strong>
              <br />
              {COMPANY_ADDRESS}
            </p>

            <p>
              <strong className="font-medium text-text">SIRET :</strong> {COMPANY_SIRET}
              <span className="mx-4">•</span>
              <strong className="font-medium text-text">RCS :</strong> {COMPANY_RCS}
            </p>

            <p>
              <strong className="font-medium text-text">TVA intracommunautaire :</strong>{' '}
              {COMPANY_VAT || 'N/A'}
            </p>

            <p>
              <strong className="font-medium text-text">Directeur de la publication :</strong>{' '}
              {PUBLICATION_DIRECTOR}
            </p>
          </div>
        </section>
      </SimpleAnimation>

      <SimpleAnimation type="slide-up" delay={100}>
        <section className="space-y-6">
          <h2 className="heading-section">Contact</h2>

          <div className="border-t border-stone/20 pt-8">
            <div className="space-y-4 text-body leading-relaxed text-stone">
              <p>
                <strong className="font-medium text-text">Email :</strong>
                <br />
                <a
                  href={`mailto:${COMPANY_EMAIL}`}
                  className="text-accent transition-colors hover:text-text"
                >
                  {COMPANY_EMAIL}
                </a>
              </p>

              <p>
                <strong className="font-medium text-text">Téléphone :</strong>
                <br />
                <a
                  href={`tel:${COMPANY_PHONE}`}
                  className="text-accent transition-colors hover:text-text"
                >
                  {COMPANY_PHONE}
                </a>
              </p>
            </div>
          </div>
        </section>
      </SimpleAnimation>

      <SimpleAnimation type="slide-up" delay={200}>
        <section className="space-y-6">
          <h2 className="heading-section">Hébergeur</h2>

          <div className="space-y-4 text-body leading-relaxed text-stone">
            <p>
              <strong className="font-medium text-text">{HOST_NAME}</strong>
            </p>
            <p>{HOST_ADDRESS}</p>
          </div>
        </section>
      </SimpleAnimation>

      <SimpleAnimation type="slide-up" delay={300}>
        <section className="space-y-6">
          <h2 className="heading-section">Propriété intellectuelle</h2>

          <p className="text-body leading-relaxed text-stone">
            Le site et l'ensemble de ses contenus (textes, images, logos, éléments graphiques) sont
            protégés par le droit d'auteur. Toute reproduction ou représentation, totale ou
            partielle, sans autorisation préalable, est interdite.
          </p>
        </section>
      </SimpleAnimation>

      <SimpleAnimation type="slide-up" delay={400}>
        <section className="space-y-6">
          <h2 className="heading-section">Données personnelles & cookies</h2>

          <p className="text-body leading-relaxed text-stone">
            Pour toute demande relative à la protection des données, contactez l'éditeur aux
            coordonnées ci-dessus. Si des traceurs/cookies tiers sont utilisés, une politique de
            confidentialité et une bannière cookies doivent être mises en place.
          </p>
        </section>
      </SimpleAnimation>

      <SimpleAnimation type="slide-up" delay={500}>
        <section className="space-y-6">
          <h2 className="heading-section">Médiation de la consommation</h2>

          <p className="mb-6 text-body leading-relaxed text-stone">
            Conformément à l'article L.612-1 du Code de la consommation, le client peut recourir à
            un médiateur de la consommation gratuitement.
          </p>

          <div className="border-t border-stone/20 pt-8">
            <h3 className="heading-subsection mb-4">Médiateur compétent</h3>
            <div className="space-y-4 text-body leading-relaxed text-stone">
              <p>
                <strong className="font-medium text-text">{MEDIATOR_NAME}</strong>
              </p>
              <p>{MEDIATOR_ADDRESS}</p>
              <p>
                <a
                  href={MEDIATOR_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent transition-colors hover:text-text"
                >
                  Plus d'informations sur la médiation →
                </a>
              </p>
            </div>
          </div>
        </section>
      </SimpleAnimation>
    </LegalPageLayout>
  );
}
