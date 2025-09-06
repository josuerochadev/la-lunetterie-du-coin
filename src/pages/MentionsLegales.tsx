import LegalPageLayout from '@/components/legal/LegalPageLayout';
import TableOfContents from '@/components/legal/TableOfContents';
import HighlightBox from '@/components/legal/HighlightBox';
import PrintButton from '@/components/legal/PrintButton';
import { OptimizedAnimateItem } from '@/components/motion/OptimizedAnimateItem';
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

const sections = [
  { id: 'editeur', title: 'Éditeur du site' },
  { id: 'contact', title: 'Contact' },
  { id: 'hebergeur', title: 'Hébergeur' },
  { id: 'propriete-intellectuelle', title: 'Propriété intellectuelle' },
  { id: 'donnees-personnelles', title: 'Données personnelles & cookies' },
  { id: 'mediation', title: 'Médiation de la consommation' },
];

export default function MentionsLegales() {
  return (
    <LegalPageLayout
      title="Mentions légales"
      seoDescription="Informations légales de La Lunetterie Du Coin Neuf & Occasion."
      canonicalPath="/mentions-legales"
      lastUpdated="Décembre 2024"
    >
      <TableOfContents sections={sections} />

      <OptimizedAnimateItem index={0} type="slide-down" threshold={0.35}>
        <section className="space-y-md">
          <h2
            id="editeur"
            className="font-serif text-title-lg font-bold text-primary"
            tabIndex={-1}
          >
            Éditeur du site
          </h2>

          <div className="space-y-sm">
            <div className="grid grid-cols-1 gap-md md:grid-cols-2">
              <div>
                <p className="text-body leading-relaxed">
                  <strong className="font-semibold text-primary">Nom :</strong>
                  <br />
                  {COMPANY_NAME}
                </p>
              </div>
              <div>
                <p className="text-body leading-relaxed">
                  <strong className="font-semibold text-primary">Forme juridique :</strong>
                  <br />
                  {COMPANY_LEGAL_FORM}{' '}
                  {COMPANY_SHARE_CAPITAL ? `(capital social : ${COMPANY_SHARE_CAPITAL})` : ''}
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <p className="text-body leading-relaxed">
                <strong className="font-semibold text-primary">Siège social :</strong>
                <br />
                {COMPANY_ADDRESS}
              </p>
              <p className="text-body leading-relaxed">
                <strong className="font-semibold text-primary">SIRET :</strong> {COMPANY_SIRET}
                <span className="mx-4">•</span>
                <strong className="font-semibold text-primary">RCS :</strong> {COMPANY_RCS}
              </p>
              <p className="text-body leading-relaxed">
                <strong className="font-semibold text-primary">TVA intracommunautaire :</strong>{' '}
                {COMPANY_VAT || 'N/A'}
              </p>
              <p className="text-body leading-relaxed">
                <strong className="font-semibold text-primary">
                  Directeur de la publication :
                </strong>{' '}
                {PUBLICATION_DIRECTOR}
              </p>
            </div>
          </div>
        </section>
      </OptimizedAnimateItem>

      <OptimizedAnimateItem index={1} type="slide-down" threshold={0.35}>
        <section className="space-y-md">
          <h2
            id="contact"
            className="font-serif text-title-lg font-bold text-primary"
            tabIndex={-1}
          >
            Contact
          </h2>

          <HighlightBox title="Nous contacter" variant="info">
            <div className="grid grid-cols-1 gap-sm md:grid-cols-2">
              <p className="text-primary">
                <strong>Email :</strong>
                <br />
                <a
                  href={`mailto:${COMPANY_EMAIL}`}
                  className="font-normal text-primary underline underline-offset-2 transition-all hover:font-semibold"
                >
                  {COMPANY_EMAIL}
                </a>
              </p>
              <p className="text-primary">
                <strong>Téléphone :</strong>
                <br />
                <a
                  href={`tel:${COMPANY_PHONE}`}
                  className="font-normal text-primary underline underline-offset-2 transition-all hover:font-semibold"
                >
                  {COMPANY_PHONE}
                </a>
              </p>
            </div>
          </HighlightBox>
        </section>
      </OptimizedAnimateItem>

      <OptimizedAnimateItem index={2} type="slide-down" threshold={0.35}>
        <section className="space-y-md">
          <h2
            id="hebergeur"
            className="font-serif text-title-lg font-bold text-primary"
            tabIndex={-1}
          >
            Hébergeur
          </h2>

          <div className="space-y-3">
            <p className="text-body leading-relaxed">
              <strong className="font-semibold text-primary">{HOST_NAME}</strong>
            </p>
            <p className="text-body leading-relaxed text-primary/80">{HOST_ADDRESS}</p>
          </div>
        </section>
      </OptimizedAnimateItem>

      <OptimizedAnimateItem index={3} type="slide-down" threshold={0.35}>
        <section className="space-y-md">
          <h2
            id="propriete-intellectuelle"
            className="font-serif text-title-lg font-bold text-primary"
            tabIndex={-1}
          >
            Propriété intellectuelle
          </h2>

          <p className="text-body leading-relaxed">
            Le site et l'ensemble de ses contenus (textes, images, logos, éléments graphiques) sont
            protégés par le droit d'auteur. Toute reproduction ou représentation, totale ou
            partielle, sans autorisation préalable, est interdite.
          </p>
        </section>
      </OptimizedAnimateItem>

      <OptimizedAnimateItem index={4} type="slide-down" threshold={0.35}>
        <section className="space-y-md">
          <h2
            id="donnees-personnelles"
            className="font-serif text-title-lg font-bold text-primary"
            tabIndex={-1}
          >
            Données personnelles & cookies
          </h2>

          <p className="text-body leading-relaxed">
            Pour toute demande relative à la protection des données, contactez l'éditeur aux
            coordonnées ci-dessus. Si des traceurs/cookies tiers sont utilisés, une politique de
            confidentialité et une bannière cookies doivent être mises en place.
          </p>
        </section>
      </OptimizedAnimateItem>

      <OptimizedAnimateItem index={5} type="slide-down" threshold={0.35}>
        <section className="space-y-md">
          <h2
            id="mediation"
            className="font-serif text-title-lg font-bold text-primary"
            tabIndex={-1}
          >
            Médiation de la consommation
          </h2>

          <p className="mb-md text-body leading-relaxed">
            Conformément à l'article L.612-1 du Code de la consommation, le client peut recourir à
            un médiateur de la consommation gratuitement.
          </p>

          <HighlightBox title="Médiateur compétent" variant="important">
            <div className="space-y-3">
              <p className="font-medium text-primary">
                <strong>{MEDIATOR_NAME}</strong>
              </p>
              <p className="leading-relaxed text-primary/80">{MEDIATOR_ADDRESS}</p>
              <p>
                <a
                  href={MEDIATOR_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary underline underline-offset-2 transition-all hover:font-semibold"
                >
                  Plus d'informations sur la médiation →
                </a>
              </p>
            </div>
          </HighlightBox>
        </section>
      </OptimizedAnimateItem>

      <PrintButton />
    </LegalPageLayout>
  );
}
