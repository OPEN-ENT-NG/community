# À propos de l'application Communautés

* Licence : [AGPL v3](http://www.gnu.org/licenses/agpl.txt) - Copyright Conseil Régional Nord Pas de Calais - Picardie, Conseil départemental de l'Essonne, Conseil régional d'Aquitaine-Limousin-Poitou-Charentes
* Développeur(s) : ATOS
* Financeur(s) : Région Nord Pas de Calais-Picardie,  Département 91, Région Aquitaine-Limousin-Poitou-Charentes

* Description : Application qui permet d'organiser l'ENT en espaces de travail collaboratifs appelés "Communautés". Ces espaces de travail sont paramétrables par l'utilisateur (membres, droits, services disponibles).


# Documentation technique

## Construction

<pre>
		gradle copyMod
</pre>

## Déployer dans ent-core


## Configuration

Dans le fichier `/community/deployment/community/conf.json.template` :

Déclarer l'application dans la liste :
<pre>
{
   "name": "net.atos~community~0.1-SNAPSHOT",
      "config": {
        "main" : "net.atos.entng.community.Community",
        "port" : 8078,
        "app-name" : "Community",
        "app-address" : "/community",
        "app-icon" : "community-large",
        "host": "${host}",
        "ssl" : $ssl,
        "auto-redeploy": false,
        "userbook-host": "${host}",
        "mode" : "${mode}"
      }
}
</pre>

Associer une route d'entée à la configuration du module proxy intégré (`"name": "net.atos~community~0.1-SNAPSHOT"`) :
<pre>
	{
		"location": "/community",
		"proxy_pass": "http://localhost:8078"
	}
</pre>

# Présentation du module

## Fonctionnalités

Communautés permet de rassembler un groupe d’utilisateurs autour d’un intérêt commun pour communiquer, partager ou collaborer en utilisant différentes applis (Blog, Forum, Wiki, Documents...).

Des permissions sur les différentes actions possibles sur les communautés, dont la contribution et la gestion, sont directement configurables dans l'application.
Le droit de lecture, correspondant à qui peut consulter l'espace de travail est également configuré de cette manière.

## Modèle de persistance

Les données du module sont stockées dans le graph neo4j dans différents nœuds dont `Community` et`CommunityGroup`.

## Modèle serveur

Le module serveur utilise un contrôleur de déclaration :

* `CommunityController` : Point d'entrée à l'application, Routage des vues, sécurité globale et déclaration de l'ensemble des comportements relatifs aux communautés (liste, création, modification, destruction et partage)

Des manipulations spécifiques dans le graph sont réalisées par l'intermédiaire d'un service :

* `CommunityService` : Concernant les comportements relatifs à la gestion des communautés

Des jsonschemas permettent de vérifier les données reçues par le serveur, ils se trouvent dans le dossier "src/main/resources/jsonschema".

## Modèle front-end

Le modèle Front-end manipule un objet models :

* `Communities` : Correspondant aux communautés

Il y a une collection globale :

* `model.communities.all` qui contient l'ensemble des objets `community` synchronisé depuis le serveur.
