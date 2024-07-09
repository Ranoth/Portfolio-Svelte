<svelte:head>
	<title>Qui suis-je</title>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="description" content="Mon CV">
</svelte:head>

<article class="container rounded-xl border border-accent bg-base-300">
	<div class="container mb-0 rounded-xl border-b border-accent p-3 pb-5 bg-base-100">
		<h3 class="p-2 text-3xl font-bold">A propos de moi</h3>
		<p class="p-2">
			Depuis aussi loin que je me souvienne, je suis intéressé par
			l'informatique, en général. En effet je m'intéressai souvent à la manière
			dont les choses sont faites, c'est ainsi que j'ouvris pour la première
			fois les outils de développeur du navigateur Chrome de Google et commençai
			à fouiller dans le HTML de la page sur laquelle je me trouvais.
		</p>
		<span class="p-2 font-bold">Cette curiosité ne m'a jamais quitté.</span>
	</div>
	<div class="flex flex-col lg:flex-row">
		<div class="flex-wrap rounded-xl border-accent px-3 pb-2 pt-8 lg:border-r">
			<img
				height="500"
				width="500"
				class="mx-auto rounded-full"
				src="https://via.placeholder.com/500"
				alt="Trombine" />
			<ul class="grid gap-y-1 pl-7 pt-5">
				<li>
					<iconify-icon
						icon="ic:twotone-mail"
						class="mr-1 scale-110"
						inline />contact@leobuhot.com
				</li>
				<li>
					<iconify-icon
						icon="material-symbols:location-on-outline"
						class="mr-1 scale-110"
						inline />Le Mesnil St Denis, 78320
				</li>
				<li>
					<iconify-icon
						icon="ic:outline-directions-car-filled"
						class="mr-1 scale-110"
						inline />Permis B
				</li>
				<li>
					<iconify-icon icon="bx:handicap" class="mr-1 scale-110" inline />Reconnaissance
					RQTH
				</li>
				<li>
					<a
						href="https://github.com/Ranoth"
						class="link-primary hover:link-hover visited:text-pink-500 hover:text-primary-focus"
						target="_blank">
						<iconify-icon icon="mdi:github" class="mr-1 scale-110" inline />Profil GitHub</a>
				</li>
				<li>
					<a
						href="https://www.linkedin.com/"
						class="link-primary hover:link-hover visited:text-pink-500 hover:text-primary-focus"
						target="_blank"
						><iconify-icon icon="ph:linkedin-logo" class="mr-1 scale-110" inline />Profil
						LinkedIn</a>
				</li>
			</ul>
			<h3
				class=" mx-7 my-2 rounded-r-xl border-b border-accent text-3xl font-bold">
				Langues
			</h3>
			<p class="mx-7">Anglais (courant)</p>
			<h3
				class=" mx-7 my-2 rounded-r-xl border-b border-accent text-3xl font-bold">
				Centres d'intérêt
			</h3>
			<p class="mx-7">
				Intérêt pour les sciences sociales et le développement durable. Jeux
				vidéos, musique, guitare, roller, cinéma, séjours dans des pays
				anglophones (USA et Royaume-Uni).
			</p>
		</div>
		<div class="px-10 pb-5 pt-2">
			<h3 class="my-2 rounded-r-xl border-b border-accent text-3xl font-bold">
				Expériences professionnelles
			</h3>
			<ol class="list-disc space-y-2 pl-8">
				<li>
					<strong>Janvier - Mars 2022 :</strong> A-Systems (huit semaines) au sein
					d'une équipe de développement logiciel. Continuation du développement du
					logiciel d'administration interne de l'entreprise en C# en contact avec
					les utilisateurs de ce dernier.
				</li>
				<li>
					<strong>Juin - Juillet 2021 :</strong> Westermo (six semaines), filiale
					d'un groupe Suédois Beijer Electronics, au sein du service technique pour
					des opérations de maintenance et support client impliquant du Python et
					des scripts Bash et du shell Linux. Manipulation des produits de l'entreprise
					: routeurs, switchs, répéteurs réseau de qualité industrielle capables
					de résister à des conditions d'exploitation difficiles installés par exemple
					dans des trains, avions, mines, usines ou réseaux autoroutiers.
				</li>
				<li>
					<strong>Juin 2016 :</strong> Enodo (deux semaines), start-up de conception
					3D temps réel destiné à l'accompagnement et au développement de design
					industriel en utilisant le support du jeu vidéo sous licence Crytek. Participation
					aux méthodes de travail et développement de leur jeu immersif en développement
					durable : « The Architect », avec le recensement des bâtiments. Mon travail
					a donc pu être utilisé afin de construire la carte du jeu.
				</li>
				<li>
					<strong>Février 2015 :</strong> Eiffage branche métal (une semaine), découverte
					des métiers de l'informatique et du développement durable (MOA DSI, CAO
					DAO, BET, Web-master, Assistance informatique, Automaticien, Gestion de
					base de données RH, Direction Développement Durable et Innovation).
				</li>
			</ol>
			<h3 class="my-2 rounded-r-xl border-b border-accent text-3xl font-bold">
				Formation
			</h3>
			<ol class="list-disc space-y-2 pl-8">
				<li>
					<strong>2020 - 2022 :</strong> BTS SIO option SLAM (Services Informatiques
					aux organisations option Solutions Logicielles et Applications Métiers)
				</li>
				<li>
					<strong>2016 - 2018 :</strong> BAC STI2D option SIN (Sciences et Technologie
					de l'Industrie et du Développement Durable spécialité Systèmes d'Information
					et Numérique)
				</li>
				<li>
					<strong>Juin 2016 :</strong> Enodo (deux semaines), start-up de conception
					3D temps réel destiné à l'accompagnement et au développement de design
					industriel en utilisant le support du jeu vidéo sous licence Crytek. Participation
					aux méthodes de travail et développement de leur jeu immersif en développement
					durable : « The Architect », avec le recensement des bâtiments. Mon travail
					a donc pu être utilisé afin de construire la carte du jeu.
				</li>
				<li>
					<strong>Février 2015 :</strong> Eiffage branche métal (une semaine), découverte
					des métiers de l'informatique et du développement durable (MOA DSI, CAO
					DAO, BET, Web-master, Assistance informatique, Automaticien, Gestion de
					base de données RH, Direction Développement Durable et Innovation).
				</li>
			</ol>
			<h3
				class="mb-4 mt-2 rounded-r-xl border-b border-accent text-3xl font-bold">
				Compétences
			</h3>
			<div class="overflow-auto rounded-lg bg-inherit">
				<table class="w-full table-auto border-separate border-spacing-1">
					<thead class="bg-base-100 rounded-lg">
						<tr>
							<th class="border border-accent rounded-lg">Langages de programmation</th>
							<th class="border border-accent rounded-lg">Frameworks</th>
							<th class="border border-accent rounded-lg">Outils</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td class="border border-accent rounded-lg">
								<ol class="list-disc px-8">
									<li>C#</li>
									<li>HTML & CSS</li>
									<li>JavaScript (TypeScript)</li>
									<li>SQL</li>
									<li>PHP</li>
									<li>Python</li>
									<li>C (Arduino)</li>
								</ol>
							</td>
							<td class="border border-accent rounded-lg">
								<ol class="list-disc px-8">
									<li>.NET</li>
									<li>Angular</li>
									<li>Bootstrap</li>
									<li>Blazor</li>
									<li>Three.js</li>
									<li>Symfony</li>
								</ol>
							</td>
							<td class="border border-accent rounded-lg">
								<ol class="list-disc px-8">
									<li>Visual Studio 2019 &amp; Visual Studio 2022</li>
									<li>Visual Studio Code</li>
									<li>Linux (Debian, Ubuntu)</li>
									<li>Docker</li>
									<li>Github</li>
									<li>HeidiSQL</li>
									<li>SQL Server</li>
									<li>Laragon</li>
									<li>Postman</li>
									<li>Mozilla Thunderbird</li>
									<li>Suite Office</li>
								</ol>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</article>
