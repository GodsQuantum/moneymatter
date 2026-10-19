# French (France) — guide de localisation MoneyMatter

Ce guide complète les règles communes de traduction (`shared.md`). Destination : `fr-FR`, code de langue `fr`. Ton : professionnel, clair, direct et accessible, y compris sur mobile. **Vouvoiement constant** dans les phrases adressées à l'utilisateur ; infinitif pour les boutons : « Enregistrer », « Ajouter », « Supprimer », « Annuler ».

## Lexique financier

| Anglais | Français de France | Précision |
|---|---|---|
| Account | Compte | Compte bancaire ou financier ; « compte utilisateur » pour login |
| Checking account | Compte courant | Jamais « compte chèque » pour la France |
| Joint account | Compte joint | Partage de compte, pas household |
| Savings account | Compte d’épargne, livret | « Livret A » seulement si identifié |
| Balance | Solde | Solde d’un compte |
| Transaction | Opération | « Transaction » uniquement si convention technique précise |
| Income | Revenu | Ne pas assimiler un virement interne à un revenu |
| Expense | Dépense | Consommation / frais |
| Transfer (bank accounts) | Virement | Entre deux comptes financiers |
| Transfer (portfolio assets) | Transfert | Pour déplacement d’avoirs |
| Payee / counterparty | Tiers | Neutre aussi bien pour un paiement que pour un encaissement |
| Merchant | Commerçant | Le commerçant de l’achat carte |
| Beneficiary | Bénéficiaire | Quand le sens est explicitement le destinataire |
| Debit / Credit | Débit / Crédit | Éviter de confondre sens bancaire et revenu/dépense |
| Direct debit | Prélèvement | Si SEPA, « prélèvement SEPA » |
| Recurring payment | Paiement récurrent | Selon le contexte « prélèvement récurrent » |
| Subscription | Abonnement | Différent d’une facture récurrente |
| Bill | Facture | « Facture à payer » si échéance |
| Refund | Remboursement | Différent du rendement des investissements |
| Fees | Frais | Frais bancaires, frais de gestion |
| Net worth | Patrimoine net | Actifs diminués des dettes |
| Assets / liabilities | Actifs / Passifs | Bilan patrimonial |
| Cash flow | Flux de trésorerie | Éviter « cashflow » |
| Envelope budget | Budget par enveloppes | Allocations par postes |
| Budget plan | Plan budgétaire | Ensembles d’enveloppes |
| Tracker | Suivi (de dépenses) | Tracker partagé : « suivi partagé » |
| Household | Foyer | **Attention** : partage de tous les comptes, différent du compte joint |
| Account group | Groupe de comptes | Classement visuel ; pas un partage |
| Sharing | Partage d’accès | Gestion fine des permissions |
| Read / Write / Manage | Lecture / Modification / Gestion | Distincts dans l’interface |
| Tag | Étiquette | Étiquette transversale distincte des catégories |
| Category | Catégorie | Classement des dépenses et revenus |
| Payoff projection | Prévision de remboursement | Emprunt et dette |
| Reconciliation | Rapprochement bancaire | Vérifier les écritures |
| Split transaction | Ventiler une opération | Répartir dans plusieurs catégories |
| Equity / security | Action / titre financier | Pas « sécurité » |
| Holding | Position | Ligne de portefeuille d’investissement |
| Share (unit) | Part / unité | Distinguer du partage de compte |
| Base currency | Devise de référence | Monnaie de synthèse des tableaux |
| Bank sync | Synchronisation bancaire | Préciser « connexion bancaire » pour une liaison |
| Pending | En attente | Statut |
| Scheduled | Programmé / prévu | Une opération programmée n’est pas nécessairement débitée |

## Typographie et grammaire

- Utiliser les guillemets français « … » et l’apostrophe typographique si cohérente ; laisser les noms d’API et les chemins tels quels.
- Conserver chaque variable (`{amount}`, `{{count}}`, `{name}`), chaque balise et le nombre de branches des pluriels séparées par ` | `.
- Aucun point à la fin d’un simple bouton ou d’un libellé. Ponctuer les phrases complètes.
- Maintenir les séparateurs « · », les devises et les codes ISO.
- Ne pas inventer de sexe grammatical pour les noms propres, comptes ou utilisateurs.
- Ne pas traduire les marques, noms des fournisseurs bancaires ni acronymes techniques (LCL, SEPA, IBAN, ETF, CSV, OFX, GitHub).
- Les montants et dates sont déjà formatés par le logiciel : traduire les mots, pas les codes.
- Les erreurs doivent être compréhensibles, non alarmistes : « Impossible de… », avec action corrective explicite quand prévue.
- Dans un bouton court, privilégier « Afficher » plutôt que « Visualiser », « Modifier » plutôt que « Éditer ».

## Attention aux contresens

**System’Épargne LCL** : un versement d’arrondi vers un livret est une épargne/transfert, non du carburant, même si la carte a payé dans une station. La mention annexée à un achat ne fait pas de cet achat un versement d’épargne.

**Compte joint et foyer** : le partage d’un compte précis n’est pas le partage Household de tous les comptes. Traduire ces mécanismes de façon à rappeler leur portée.

**Dépenses professionnelles** : un « suivi » peut repérer des opérations à examiner sans attester de leur déductibilité fiscale. Éviter tout vocabulaire affirmant la fiscalité sans vérification.

**Accessibilité cognitive** : titres courts, verbes concrets, labels cohérents, avertissements précis ; éviter les mots anglais inutiles, le jargon accumulé et les formulations moralisatrices.
