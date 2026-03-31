import LegalPageLayout from '@/components/legal/LegalPageLayout';
import TableOfContents from '@/components/legal/TableOfContents';
import PrintButton from '@/components/legal/PrintButton';
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
} from '@/config/legal';

const SECTIONS = [
  { id: 'editeur', title: 'Éditeur du site' },
  { id: 'contact', title: 'Contact' },
  { id: 'hebergeur', title: 'Hébergeur' },
  { id: 'propriete', title: 'Propriété intellectuelle' },
  { id: 'donnees', title: 'Données personnelles & cookies' },
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
      <TableOfContents sections={SECTIONS} />

      <SimpleAnimation type="fade">
        <section className="space-y-4" aria-labelledby="editeur">
          <h2 id="editeur" className="heading-section">
            Éditeur du site
          </h2>
          <dl className="grid gap-x-8 gap-y-3 text-body sm:grid-cols-[auto_1fr]">
            <dt className="font-medium text-text">Nom</dt>
            <dd className="text-black">{COMPANY_NAME}</dd>

            <dt className="font-medium text-text">Forme juridique</dt>
            <dd className="text-black">
              {COMPANY_LEGAL_FORM}
              {COMPANY_SHARE_CAPITAL ? ` — capital social : ${COMPANY_SHARE_CAPITAL}` : ''}
            </dd>

            <dt className="font-medium text-text">Siège social</dt>
            <dd className="text-black">{COMPANY_ADDRESS}</dd>

            <dt className="font-medium text-text">SIRET</dt>
            <dd className="text-black">{COMPANY_SIRET}</dd>

            <dt className="font-medium text-text">RCS</dt>
            <dd className="text-black">{COMPANY_RCS}</dd>

            <dt className="font-medium text-text">TVA intracommunautaire</dt>
            <dd className="text-black">{COMPANY_VAT || 'N/A'}</dd>

            <dt className="font-medium text-text">Directeur de la publication</dt>
            <dd className="text-black">{PUBLICATION_DIRECTOR}</dd>
          </dl>
        </section>
      </SimpleAnimation>

      <SimpleAnimation type="fade">
        <section className="space-y-4" aria-labelledby="contact">
          <h2 id="contact" className="heading-section">
            Contact
          </h2>
          <dl className="grid gap-x-8 gap-y-3 text-body sm:grid-cols-[auto_1fr]">
            <dt className="font-medium text-text">Email</dt>
            <dd>
              <a
                href={`mailto:${COMPANY_EMAIL}`}
                className="text-black underline underline-offset-4 transition-colors hover:text-text"
              >
                {COMPANY_EMAIL}
              </a>
            </dd>

            <dt className="font-medium text-text">Téléphone</dt>
            <dd>
              <a
                href={`tel:${COMPANY_PHONE}`}
                className="text-black underline underline-offset-4 transition-colors hover:text-text"
              >
                {COMPANY_PHONE}
              </a>
            </dd>
          </dl>
        </section>
      </SimpleAnimation>

      <SimpleAnimation type="fade">
        <section className="space-y-4" aria-labelledby="hebergeur">
          <h2 id="hebergeur" className="heading-section">
            Hébergeur
          </h2>
          <div className="text-body text-black">
            <p className="font-medium text-text">{HOST_NAME}</p>
            <p>{HOST_ADDRESS}</p>
          </div>
        </section>
      </SimpleAnimation>

      <SimpleAnimation type="fade">
        <section className="space-y-4" aria-labelledby="propriete">
          <h2 id="propriete" className="heading-section">
            Propriété intellectuelle
          </h2>
          <p className="text-body text-black">
            Le site et l'ensemble de ses contenus (textes, images, logos, éléments graphiques) sont
            protégés par le droit d'auteur. Toute reproduction ou représentation, totale ou
            partielle, sans autorisation préalable, est interdite.
          </p>
        </section>
      </SimpleAnimation>

      <SimpleAnimation type="fade">
        <section className="space-y-4" aria-labelledby="donnees">
          <h2 id="donnees" className="heading-section">
            Données personnelles & cookies
          </h2>
          <p className="text-body text-black">
            Pour toute demande relative à la protection des données, contactez l'éditeur aux
            coordonnées ci-dessus. Si des traceurs/cookies tiers sont utilisés, une politique de
            confidentialité et une bannière cookies doivent être mises en place.
          </p>
        </section>
      </SimpleAnimation>

      <SimpleAnimation type="fade">
        <section className="space-y-4" aria-labelledby="mediation">
          <h2 id="mediation" className="heading-section">
            Médiation de la consommation
          </h2>
          <p className="text-body text-black">
            Conformément à l'article L.612-1 du Code de la consommation, le client peut recourir à
            un médiateur de la consommation gratuitement.
          </p>

          <div className="mt-4">
            <h3 className="heading-subsection mb-3">Médiateur compétent</h3>
            <div className="space-y-1 text-body text-black">
              <p className="font-medium text-text">{MEDIATOR_NAME}</p>
              <p>{MEDIATOR_ADDRESS}</p>
              <p className="mt-3">
                <a
                  href={MEDIATOR_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 transition-colors hover:text-text"
                >
                  Plus d'informations sur la médiation →
                </a>
              </p>
            </div>
          </div>
        </section>
      </SimpleAnimation>

      <PrintButton />
    </LegalPageLayout>
  );
}
