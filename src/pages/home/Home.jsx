import React from 'react'
import './home.css'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const navigate = useNavigate() ;

    const handleClick = () => {
        navigate('/auth/sign-in') ;
    }

  return (
    <div className='all'>
    <div class="background-curve"></div>
    
    <header class="header">
        <div class="logo">
            <img src="C:\Users\bsila\Downloads\e0c02a29-9539-4e13-a5ea-bf35195eef44-removebg.png" alt="Logo" height="90" />
        </div>
        <nav>
            <ul>
                <li><a href="#">Produits</a></li>
                <li><a href="#">Solutions</a></li>
                <li><a href="#">Experts-comptables</a></li>
                <li><a href="#">Partenaires</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Accompagnement</a></li>
            </ul>
        </nav>
        <div class="right-nav">
            <button class="search-btn"><i class="fas fa-search"></i></button>
            <button class="connect-btn" onClick={handleClick}>Connexion</button>
        </div>
    </header>
    
    <div class="hero">
        <h1>Pour chaque étape de votre activité</h1>
        <p>M7asbi fournit la technologie et l'assistance humaine indispensables</p>
        
        <div class="tabs">
            <button class="tab active">Petites entreprises</button>
            <button class="tab">Moyennes et grandes entreprises</button>
            <button class="tab">Expert-Comptables</button>
        </div>
    </div>
    
    <div class="cards">
        <div class="card">
            <h2>M7asbi 50</h2>
            <p>Comptabilité, devis, factures, gestion des stocks et trésorerie pour les petites entreprises.</p>
            <a href="#" class="card-btn">Découvrez M7asbi 50</a>
            <div class="card-image">
                <svg width="100%" height="168" viewBox="0 0 413 168">
                    <rect x="35" y="0" width="343" height="168" rx="8" fill="white" stroke="#E5E5E5"></rect>
                    <text x="50" y="30" fill="#333" font-size="16" font-weight="bold">Répartition des charges</text>
                   
                    <circle cx="206.5" cy="100" r="50" fill="none" stroke="#E5E5E5" stroke-width="20"/>                  
                    <path d="M206.5 50 A50 50 0 0 1 250 140" stroke="#b6d7a8" stroke-width="20" fill="none"/>
                    <path d="M250 140 A50 50 0 0 1 163 140" stroke="#2196F3" stroke-width="20" fill="none"/>
                    <path d="M163 140 A50 50 0 0 1 206.5 50" stroke="#FFC107" stroke-width="20" fill="none"/>
                    <text x="300" y="80" fill="#666" font-size="12">€15000</text>
                    <text x="300" y="110" fill="#666" font-size="12">€07000</text>
                    <text x="300" y="140" fill="#666" font-size="12">€06150</text>
                </svg>
            </div>
        </div>
        <div class="card">
            <h2>M7asbi 100 Paie & RH</h2>
            <p>Gestion de la paie et des RH en toute conformité pour les entreprises jusqu'à 200 salariés. Pilotez le capital humain de votre entreprise avec souplesse.</p>
            <a href="#" class="card-btn">Découvrez M7asbi 100 Paie & RH</a>
            <div class="card-image">
                <svg width="100%" height="168" viewBox="0 0 413 168">
                    <rect x="35" y="0" width="343" height="168" rx="8" fill="white" stroke="#E5E5E5"></rect>
                    <text x="50" y="30" fill="#333" font-size="16" font-weight="bold">Évolution des effectifs</text>
                    
                    <rect x="60" y="60" width="40" height="80" fill="#b6d7a8" opacity="0.8"/>
                    <rect x="110" y="80" width="40" height="60" fill="#2196F3" opacity="0.8"/>
                    <rect x="160" y="50" width="40" height="90" fill="#FFC107" opacity="0.8"/>
                    <rect x="210" y="70" width="40" height="70" fill="#FF5722" opacity="0.8"/>
                    
                    <line x1="50" y1="140" x2="300" y2="140" stroke="#666" stroke-width="1"/>
                   
                    <text x="70" y="155" fill="#666" font-size="10">T1</text>
                    <text x="120" y="155" fill="#666" font-size="10">T2</text>
                    <text x="170" y="155" fill="#666" font-size="10">T3</text>
                    <text x="220" y="155" fill="#666" font-size="10">T4</text>
                </svg>
            </div>
        </div>
    </div>
    
    <div class="footer">
        <p>Partenaires: LabelVie, SICAM, Nouvelair, La Mamounia...</p>
    </div>

    <section class="stats-section">
        <h2 class="stats-title">M7ASBI EN QUELQUES CHIFFRES</h2>
        <h3 class="stats-subtitle">Des entreprises du monde entier font confiance à M7asbi</h3>
        
        <div class="stats-container">
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-cog"></i>
                </div>
                <h4>Plus de 40 ans</h4>
                <p>à perfectionner des outils qui aident des entreprises comme la vôtre à réussir</p>
            </div>

            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-users"></i>
                </div>
                <h4>2 millions</h4>
                <p>d'entrepreneurs utilisent les logiciels M7asbi dans 26 pays</p>
            </div>

            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-headset"></i>
                </div>
                <h4>Plus de 40 000</h4>
                <p>partenaires nous permettent d'assurer une assistance exceptionnelle</p>
            </div>

            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-trophy"></i>
                </div>
                <h4>Plus de 100</h4>
                <p>récompenses décernées pour la qualité de notre service clients, nos innovations logicielles, et bien plus encore</p>
            </div>
        </div>
    </section>

    <section class="services-section">
        <div class="services-container">
            <div class="service-card">
                <div class="service-image">
                    <img src="https://placehold.co/120x120/00C853/FFFFFF.svg?text=Books" alt="Stack of books" class="service-icon" />
                </div>
                <h3>Des conseils avisés</h3>
                <p>Notre blog M7asbi vous prodigue des conseils sur tout ce qui a trait à la gestion d'une entreprise, notamment sur la manière de réussir une succession à la tête d'une entreprise.</p>
                <a href="#" class="service-btn">Accédez au blog</a>
            </div>

            <div class="service-card">
                <div class="service-image">
                    <img src="https://placehold.co/120x120/00C853/FFFFFF.svg?text=Partners" alt="Partner illustration" class="service-icon" />
                </div>
                <h3>Partenaires</h3>
                <p>Notre communauté de partenaires joue un rôle essentiel en fournissant des solutions et des services qui aident nos clients du monde entier à prospérer.</p>
                <a href="#" class="service-btn">Découvrez nos partenaires</a>
            </div>

            <div class="service-card">
                <div class="service-image">
                    <img src="https://placehold.co/120x120/00C853/FFFFFF.svg?text=Support" alt="24/7 Support illustration" class="service-icon" />
                </div>
                <h3>Assistance 24 h/24, 7 j/7</h3>
                <p>Nos experts peuvent vous aider rapidement grâce à une assistance produit en ligne ou par téléphone disponible 24 heures sur 24 et 7 jours sur 7.</p>
                <a href="#" class="service-btn">Découvrez l'assistance</a>
            </div>
        </div>
    </section>

    <section class="blog-section">
        <div class="blog-header">
            <h4 class="blog-subtitle">M7asbi Advice</h4>
            <h2 class="blog-title">Le blog des clés de la gestion d'entreprise</h2>
        </div>

        <div class="blog-slider">
            <button class="slider-arrow prev">
                <i class="fas fa-arrow-left"></i>
            </button>
            
            <div class="blog-cards">
                <article class="blog-card">
                    <div class="blog-image">
                        <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e" alt="Femme souriante au bureau" />
                    </div>
                    <div class="blog-content">
                        <h3>Les bonnes questions à poser pour choisir son logiciel de comptabilité</h3>
                        <p>Nul ne peut échapper aux tâches administratives. Alors si vous venez de créer votre entreprise ou si vous êtes à la tête d'une ent...</p>
                    </div>
                </article>

                <article class="blog-card">
                    <div class="blog-image">
                        <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998" alt="Réunion en visioconférence" />
                    </div>
                    <div class="blog-content">
                        <h3>L'évolution de l'activité comptable avec M7asbi FRP 1000cloud</h3>
                        <p>La clinique internationale du Parc Monceau a interfacé son outil de gestion des achats avec M7asbi FRP 1000cloud pour permettre l'é...</p>
                    </div>
                </article>

                <article class="blog-card">
                    <div class="blog-image">
                        <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf" alt="Équipe au travail" />
                    </div>
                    <div class="blog-content">
                        <h3>L'expertise comptable boostée par la digitalisation</h3>
                        <p>Découvrez comment gagner du temps avec les solutions en mode Saas. Diminuez les erreurs, améliorez le travail collectif et votre p...</p>
                    </div>
                </article>

                <article class="blog-card">
                    <div class="blog-image">
                        <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0" alt="Discussion professionnelle" />
                    </div>
                    <div class="blog-content">
                        <h3>Les bonnes pratiques du Fast Closing</h3>
                        <p>La clôture des comptes est un argument de communication sur la performance et le sérieux des entreprises. Elles souhaitent donc ré...</p>
                    </div>
                </article>
            </div>

            <button class="slider-arrow next">
                <i class="fas fa-arrow-right"></i>
            </button>
        </div>

        <div class="slider-dots">
            <span class="dot active"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
        </div>

        <div class="blog-cta">
            <a href="#" class="blog-btn">Accédez au blog</a>
        </div>
    </section>

    <footer class="main-footer">
        <div class="footer-container">
            <div class="footer-logo">
                <img src="C:\Users\bsila\Downloads\e0c02a29-9539-4e13-a5ea-bf35195eef44-removebg.png" alt="M7asbi" class="footer-logo-img" />
            </div>

            <div class="footer-content">
                <div class="footer-nav">
                    <div class="footer-col">
                        <h3>Segments</h3>
                        <ul>
                            <li><a href="#">Petites entreprises (TPE)</a></li>
                            <li><a href="#">Moyennes et grandes entreprises (PME et ETI)</a></li>
                            <li><a href="#">Experts-comptables</a></li>
                        </ul>
                    </div>

                    <div class="footer-col">
                        <h3>ENTREPRISE</h3>
                        <ul>
                            <li><a href="#">Aperçu</a></li>
                            <li><a href="#">Carrières</a></li>
                            <li><a href="#">Evènements</a></li>
                            <li><a href="#">Réseaux sociaux</a></li>
                            <li><a href="#">À propos de M7asbi</a></li>
                            <li><a href="#">M7asbi Foundation</a></li>
                            <li><a href="#">Investisseurs</a></li>
                            <li><a href="#">Actualités / Presse</a></li>
                            <li><a href="#">Durabilité et société</a></li>
                        </ul>
                    </div>

                    <div class="footer-col">
                        <h3>PRODUITS</h3>
                        <ul>
                            <li><a href="#">M7asbi 50</a></li>
                            <li><a href="#">M7asbi 100</a></li>
                            <li><a href="#">M7asbi X3</a></li>
                            <li><a href="#">Génération Expert Connect</a></li>
                            <li><a href="#">Afficher tous les produits</a></li>
                            <li><a href="#">Connexion</a></li>
                        </ul>
                    </div>

                    <div class="footer-col">
                        <h3>SERVICES ET ASSISTANCE</h3>
                        <ul>
                            <li><a href="#">Assistance</a></li>
                            <li><a href="#">Contact</a></li>
                            <li><a href="#">Blog</a></li>
                            <li><a href="#">Communauté</a></li>
                            <li><a href="#">Espace Partenaire</a></li>
                            <li><a href="#">Boutique Partenaire</a></li>
                        </ul>
                    </div>

                    <div class="footer-col">
                        <ul>
                            <li><a href="#">Nos opportunités de partenariat</a></li>
                            <li><a href="#">ISV éditeurs et alliances</a></li>
                            <li><a href="#">Nous rejoindre</a></li>
                            <li><a href="#">Revendeurs</a></li>
                            <li><a href="#">Intégrateurs</a></li>
                        </ul>
                    </div>
                </div>

                <div class="footer-social">
                    <a href="#" class="social-icon"><i class="fab fa-facebook-f"></i></a>
                    <a href="#" class="social-icon"><i class="fab fa-instagram"></i></a>
                    <a href="#" class="social-icon"><i class="fab fa-linkedin-in"></i></a>
                    <a href="#" class="social-icon"><i class="fab fa-twitter"></i></a>
                    <a href="#" class="social-icon"><i class="fab fa-youtube"></i></a>
                </div>
            </div>
        </div>
    </footer>
</div>
  )
}

export default Home