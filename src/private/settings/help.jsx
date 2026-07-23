import React, { useState } from 'react'
import AppLayout from '@layouts/appLayout'
import Header from '@components/header'
import {
  ShoppingBasket, ClipboardList, Users, CircleDollarSign, ChartBarStacked,
  Wallet, SquarePen, Lock, ChevronDown, Phone, Mail, BookOpen,
  PackagePlus, ReceiptText, UserCog, BadgeCent, RefreshCcw
} from 'lucide-react'

const PRIMARY = '#10518E';
const SUCCESS = '#109d74';

/* ---------- composant accordion interne ---------- */
function Faq({ question, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      borderBottom: '1px solid #e5e7eb',
      padding: '0',
    }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', padding: '14px 0', background: 'none',
          border: 'none', cursor: 'pointer', textAlign: 'left',
          fontSize: '15px', fontWeight: '600', color: '#1f2937',
        }}
      >
        {question}
        <ChevronDown
          size={18}
          color={PRIMARY}
          style={{ flexShrink: 0, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
      {open && (
        <div style={{ paddingBottom: '14px', fontSize: '14px', color: '#4b5563', lineHeight: '1.7' }}>
          {children}
        </div>
      )}
    </div>
  );
}

/* ---------- carte de section ---------- */
function Section({ icon: Icon, color, title, children }) {
  return (
    <div style={{
      background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: '20px', overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '16px 20px', borderBottom: '1px solid #f3f4f6',
        background: '#f9fafb',
      }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '8px',
          background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={18} color={color} />
        </div>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#111827' }}>{title}</h3>
      </div>
      <div style={{ padding: '0 20px' }}>
        {children}
      </div>
    </div>
  );
}

/* ---------- carte de raccourci ---------- */
function QuickCard({ icon: Icon, color, title, desc }) {
  return (
    <div style={{
      background: '#fff', borderRadius: '10px', border: '1px solid #e5e7eb',
      padding: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start',
    }}>
      <div style={{
        width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
        background: color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={20} color={color} />
      </div>
      <div>
        <div style={{ fontWeight: '700', fontSize: '14px', color: '#111827', marginBottom: '4px' }}>{title}</div>
        <div style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.5' }}>{desc}</div>
      </div>
    </div>
  );
}

export default function Help() {
  return (
    <AppLayout>
      <div className="content-wrapper mt-10" style={{ maxWidth: '100%' }}>
        <Header title="Centre d'aide" />

        {/* Hero */}
        <div style={{
          background: `linear-gradient(135deg, ${PRIMARY}, #109d74)`,
          borderRadius: '14px', padding: '32px', marginBottom: '28px', color: '#fff',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
            <BookOpen size={32} color="rgba(255,255,255,0.9)" />
            <div>
              <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800' }}>Bienvenue dans MyPharma</h2>
              <p style={{ margin: 0, fontSize: '14px', opacity: 0.85 }}>
                Guide complet pour maîtriser toutes les fonctionnalités de votre logiciel de gestion pharmaceutique.
              </p>
            </div>
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '10px', marginTop: '20px',
          }}>
            {[
              { label: 'Commandes', val: 'Créer & encaisser' },
              { label: 'Stock', val: 'Entrées & produits' },
              { label: 'Clients', val: 'Suivi & créances' },
              { label: 'Caisse', val: 'Paiements & récaps' },
            ].map(item => (
              <div key={item.label} style={{
                background: 'rgba(255,255,255,0.15)', borderRadius: '8px',
                padding: '10px 14px', backdropFilter: 'blur(8px)',
              }}>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>{item.label}</div>
                <div style={{ fontSize: '13px', fontWeight: '700' }}>{item.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Raccourcis fonctionnalités */}
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '14px' }}>
          Aperçu des modules
        </h3>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '12px', marginBottom: '28px',
        }}>
          <QuickCard icon={ClipboardList} color={PRIMARY}   title="Commandes"       desc="Créez, déstockez, encaissez et imprimez les factures en quelques clics." />
          <QuickCard icon={ShoppingBasket} color="#7c3aed"  title="Produits & Lots"  desc="Gérez l'inventaire, les catégories et les lots avec dates d'expiration." />
          <QuickCard icon={PackagePlus}  color={SUCCESS}     title="Entrées en Stock" desc="Enregistrez les arrivées fournisseurs et générez les bons d'entrée." />
          <QuickCard icon={Users}        color="#d97706"     title="Clients"          desc="Créez des fiches clients et suivez leurs créances et historiques." />
          <QuickCard icon={CircleDollarSign} color="#059669" title="Caisse"          desc="Consultez les recettes journalières et les modes de paiement." />
          <QuickCard icon={Wallet}       color="#dc2626"     title="Dépenses"         desc="Saisissez et catégorisez toutes les sorties financières." />
          <QuickCard icon={ReceiptText}  color="#0891b2"     title="Créances"         desc="Suivez les commandes impayées et relancez les clients débiteurs." />
          <QuickCard icon={UserCog}      color="#6366f1"     title="Utilisateurs"     desc="Gérez les accès par degré : Admin, Gestionnaire, Caissier." />
        </div>

        {/* Sections FAQ */}
        <Section icon={ClipboardList} color={PRIMARY} title="Gestion des Commandes">
          <Faq question="Comment créer une nouvelle commande ?">
            Cliquez sur <strong>Nouvelle commande</strong> depuis le menu <em>Commandes</em> ou via le bouton rapide en haut à droite.
            Ajoutez les produits souhaités, vérifiez les quantités disponibles (stock en temps réel), puis validez.
            La commande est créée en état <em>Impayé et non déstocké</em>.
          </Faq>
          <Faq question="Quelles sont les étapes d'une commande jusqu'à la facture ?">
            <ol style={{ margin: '4px 0', paddingLeft: '18px' }}>
              <li><strong>Créer</strong> la commande → état <em>Impayé et non déstocké</em></li>
              <li>Cliquer <strong>Tirer le Bon</strong> → déstockage + impression du bon de commande</li>
              <li>Cliquer <strong>Payer</strong> → sélectionner le mode de paiement → impression de la facture</li>
            </ol>
          </Faq>
          <Faq question="Quels modes de paiement sont disponibles ?">
            Espèces, Orange Money (OM), MTN MOMO, Offre, ainsi que les modes mixtes :
            <strong> OM + Espèces</strong> et <strong>MOMO + Espèces</strong> (vous saisissez les deux montants séparément).
          </Faq>
          <Faq question="Comment assigner un client à une commande ?">
            Dans la liste des commandes, cliquez sur la <strong>référence en bleu</strong> de la commande.
            Une fenêtre s'ouvre avec un champ de recherche : tapez le nom, le téléphone ou l'e-mail du client pour le trouver rapidement.
          </Faq>
          <Faq question="Comment passer une commande en créance (dette) ?">
            Sur une commande déstockée, cliquez sur le bouton <strong>Créance</strong>.
            La commande bascule en état <em>Dette</em> et une facture dette est automatiquement générée et imprimée.
          </Faq>
          <Faq question="Qu'est-ce qu'un récapitulatif de commandes ?">
            Sélectionnez au moins 2 commandes déstockées via les cases à cocher, puis cliquez sur <strong>Faire un Recap</strong>.
            Un document consolidé regroupant les produits et montants totaux est généré.
          </Faq>
        </Section>

        <Section icon={ShoppingBasket} color="#7c3aed" title="Produits & Inventaire">
          <Faq question="Comment ajouter un nouveau produit ?">
            Allez dans <em>Produits → Inventaire</em> et cliquez sur <strong>Nouveau produit</strong>.
            Renseignez la référence, le nom, la catégorie, le prix de vente et la photo (optionnelle).
          </Faq>
          <Faq question="Comment gérer les lots et dates d'expiration ?">
            Chaque produit peut avoir plusieurs <strong>lots</strong> avec un numéro de lot, une date d'expiration et une quantité disponible.
            Ces informations sont visibles directement dans la colonne <em>Lots</em> de la liste des produits.
          </Faq>
          <Faq question="Comment filtrer et trier les produits ?">
            Utilisez le bouton <strong>Filtres</strong> pour filtrer par catégorie, état du stock (en stock, faible, rupture)
            ou gamme de prix. Le tri alphabétique par nom ou référence est aussi disponible.
          </Faq>
          <Faq question="Comment gérer les catégories ?">
            Rendez-vous dans <em>Produits → Catégories</em>. Vous pouvez créer, modifier et supprimer des catégories.
            Chaque catégorie possède un nom et une description.
          </Faq>
        </Section>

        <Section icon={PackagePlus} color={SUCCESS} title="Entrées en Stock">
          <Faq question="Comment enregistrer une nouvelle entrée en stock ?">
            Allez dans <em>Gestion → Entrées Stock</em> et cliquez sur <strong>Nouvelle entrée</strong>.
            Sélectionnez le fournisseur, renseignez le numéro de facture, puis ajoutez chaque produit reçu avec sa quantité et son lot.
          </Faq>
          <Faq question="Comment filtrer les entrées par date ?">
            Utilisez les champs <strong>Du</strong> et <strong>Au</strong> en haut de la liste, puis cliquez sur <strong>Filtrer</strong>.
            Par défaut, la liste affiche les entrées du jour.
          </Faq>
          <Faq question="Comment imprimer le détail d'une entrée ?">
            Dans la liste des entrées, cliquez sur <strong>Voir</strong> à droite de la ligne concernée.
            Le détail complet de l'entrée s'affiche et peut être imprimé.
          </Faq>
        </Section>

        <Section icon={Users} color="#d97706" title="Clients & Créances">
          <Faq question="Comment créer une fiche client ?">
            Allez dans <em>Gestion → Clients</em> et cliquez sur <strong>Nouveau client</strong>.
            Renseignez le nom, le prénom, le téléphone, l'e-mail, le statut et la profession. Un matricule est généré automatiquement.
          </Faq>
          <Faq question="Comment suivre les créances d'un client ?">
            Dans <em>Gestion → Créances</em>, toutes les commandes en état <em>Dette</em> sont listées avec le nom du client, le montant et la date.
            Filtrez par période pour visualiser les impayés sur une plage de dates.
          </Faq>
          <Faq question="Comment désactiver un client ?">
            Dans la liste des clients, cliquez sur <strong>Modifier</strong> et changez le statut de <em>Actif</em> à <em>Inactif</em>.
          </Faq>
        </Section>

        <Section icon={BadgeCent} color="#059669" title="Caisse & Dépenses">
          <Faq question="Que montre la Caisse ?">
            La caisse affiche le récapitulatif des encaissements du jour : total des ventes, répartition par mode de paiement
            (Espèces, OM, MOMO, Offre) et la liste des commandes payées.
          </Faq>
          <Faq question="Comment saisir une dépense ?">
            Allez dans <em>Gestion → Dépenses</em> et cliquez sur <strong>Nouvelle dépense</strong>.
            Saisissez le libellé, la catégorie, le montant et la date. Les dépenses sont filtrables par période.
          </Faq>
        </Section>

        <Section icon={UserCog} color="#6366f1" title="Utilisateurs & Rôles">
          <Faq question="Quels sont les niveaux d'accès ?">
            <ul style={{ margin: '4px 0', paddingLeft: '18px' }}>
              <li><strong>Degré 1 – Administrateur</strong> : accès complet (produits, stats, utilisateurs, administration)</li>
              <li><strong>Degré 2 – Gestionnaire</strong> : gestion des produits, entrées, commandes et statistiques</li>
              <li><strong>Degré 3+ – Caissier / Autre</strong> : création de commandes uniquement</li>
            </ul>
          </Faq>
          <Faq question="Comment activer ou désactiver un utilisateur ?">
            Dans <em>Administration → Utilisateurs</em>, cliquez sur le bouton <strong>⇄</strong> (changer l'état) sur la ligne de l'utilisateur.
            Choisissez <em>Activer</em> ou <em>Désactiver</em> selon le besoin.
          </Faq>
          <Faq question="Comment ajouter un nouvel utilisateur ?">
            Cliquez sur <strong>Nouvel utilisateur</strong> en haut de la liste. Renseignez les informations du compte
            (nom, e-mail, rôle, degré) et enregistrez. L'utilisateur recevra ses identifiants de connexion.
          </Faq>
        </Section>

        <Section icon={Lock} color="#ef4444" title="Compte & Sécurité">
          <Faq question="Comment réinitialiser son mot de passe ?">
            Sur la page de connexion, cliquez sur <strong>Mot de passe oublié</strong>.
            Saisissez votre adresse e-mail, récupérez le code reçu et entrez-le pour définir un nouveau mot de passe.
          </Faq>
          <Faq question="Comment changer son mot de passe depuis l'application ?">
            Allez dans <em>Compte → Paramètres</em>. Saisissez votre ancien mot de passe, puis le nouveau deux fois, et validez.
          </Faq>
          <Faq question="Comment mettre à jour sa photo de profil ?">
            Allez dans <em>Compte → Profil</em> et cliquez sur votre avatar pour télécharger une nouvelle image.
          </Faq>
        </Section>

        <Section icon={RefreshCcw} color="#0891b2" title="Abonnement & Forfait">
          <Faq question="Comment renouveler mon abonnement ?">
            Rendez-vous dans <em>Forfait</em> depuis le menu de navigation. Vous y trouverez le nombre de jours restants
            et les instructions pour renouveler votre accès.
          </Faq>
          <Faq question="Que se passe-t-il quand l'abonnement expire ?">
            Un avertissement apparaît dans la barre de navigation à partir de 10 jours restants.
            À expiration, l'accès à l'application est suspendu jusqu'au renouvellement.
          </Faq>
        </Section>

        {/* Contact support */}
        <div style={{
          background: '#f0f9ff', borderRadius: '12px', border: '1px solid #bae6fd',
          padding: '24px', display: 'flex', gap: '24px', flexWrap: 'wrap',
          alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px',
        }}>
          <div>
            <h3 style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: '700', color: '#0c4a6e' }}>
              Besoin d'une assistance supplémentaire ?
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#0369a1' }}>
              Notre équipe support Kokitech Group est disponible pour vous accompagner.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <a
              href="tel:+237698495395"
              style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                padding: '10px 16px', borderRadius: '8px', background: PRIMARY,
                color: '#fff', textDecoration: 'none', fontWeight: '600', fontSize: '14px',
              }}
            >
              <Phone size={15} /> Appeler
            </a>
            <a
              href="mailto:deniskemayo@kokitechgroup.com"
              style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                padding: '10px 16px', borderRadius: '8px', background: '#fff',
                color: PRIMARY, border: `1.5px solid ${PRIMARY}`,
                textDecoration: 'none', fontWeight: '600', fontSize: '14px',
              }}
            >
              <Mail size={15} /> Envoyer un e-mail
            </a>
          </div>
        </div>

      </div>
    </AppLayout>
  )
}
