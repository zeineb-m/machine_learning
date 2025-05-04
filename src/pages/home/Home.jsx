import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/auth/sign-in');
    };

    // Animation variants
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="bg-black text-white relative overflow-x-hidden">
            {/* Background curve */}
            <div className="fixed top-1/2 left-[-6%] w-[120%] h-[300px] transform -translate-y-1/2 bg-[url('C:/Users/bsila/Desktop/home-redesign-hero-bg-pattern-wave-png-2.png')] bg-no-repeat bg-center bg-cover z-10"></div>

            {/* Header */}
            <motion.header 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex justify-between items-center py-4 px-10 relative z-20 max-w-7xl mx-auto w-full"
            >
                <div className="flex items-center ml-10">
                    <img 
                        src="https://scontent.fnbe1-2.fna.fbcdn.net/v/t1.15752-9/475830842_2840668172780106_8534456318214879610_n.png?stp=dst-png_s480x480&_nc_cat=107&ccb=1-7&_nc_sid=0024fc&_nc_ohc=FLlKtoQ1ddcQ7kNvgHuSshv&_nc_oc=AdgKnKbAmgHf7j4nBE9_rLw3GTKeqAasSxzj0bTXXvnS0ladoySKjo30EF2rsU1cZAg&_nc_ad=z-m&_nc_cid=1159&_nc_zt=23&_nc_ht=scontent.fnbe1-2.fna&oh=03_Q7cD1gF7I8KjS_BRnXKt_8w3Cgl--awVeb1LpewKaEjwSXBPzQ&oe=67E59542" 
                        alt="Logo" 
                        className="h-20 w-auto transition-transform hover:scale-105" 
                    />
                </div>

                <nav className="hidden md:flex items-center">
                    <ul className="flex space-x-8">
                        {['Products', 'Solutions', 'Accountants', 'Partners', 'Blog', 'Support'].map((item) => (
                            <li key={item}>
                                <a 
                                    href="#" 
                                    className="text-white text-sm font-medium hover:text-green-300 transition-colors duration-300"
                                >
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="flex items-center space-x-5">
                    <button className="text-white hover:text-green-300 transition-colors duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                    <button 
                        onClick={handleClick}
                        className="border border-white text-white px-5 py-2 rounded-full text-sm hover:bg-white hover:text-black transition-all duration-300"
                    >
                        Login
                    </button>
                </div>
            </motion.header>

            {/* Hero Section */}
            <motion.section 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-center py-20 px-5 relative z-20 max-w-4xl mx-auto"
            >
                <motion.h1 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="text-4xl md:text-5xl font-bold mb-5 leading-tight"
                >
                    For every step of your business
                </motion.h1>
                <motion.p 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="text-lg opacity-90 max-w-2xl mx-auto leading-relaxed"
                >
                    M7asbi provides the essential technology and human support
                </motion.p>

                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="flex justify-center space-x-4 my-10"
                >
                    {['Small Businesses', 'Medium and Large Enterprises', 'Accountants'].map((tab, index) => (
                        <button 
                            key={tab}
                            className={`px-6 py-3 rounded-full text-sm transition-all duration-300 ${index === 0 ? 'bg-green-300 text-black' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </motion.div>
            </motion.section>

            {/* Cards Section */}
            <motion.section 
                variants={container}
                initial="hidden"
                animate="show"
                className="flex flex-col md:flex-row justify-center gap-8 my-16 relative z-20 max-w-6xl mx-auto px-5"
            >
                {[
                    {
                        title: "M7asbi 50",
                        description: "Accounting, quotes, invoices, inventory, and cash management for small businesses.",
                        buttonText: "Discover M7asbi 50",
                        svg: (
                            <svg width="100%" height="168" viewBox="0 0 413 168">
                                <rect x="35" y="0" width="343" height="168" rx="8" fill="white" stroke="#E5E5E5"></rect>
                                <text x="50" y="30" fill="#333" font-size="16" font-weight="bold">Expense Breakdown</text>
                                <circle cx="206.5" cy="100" r="50" fill="none" stroke="#E5E5E5" stroke-width="20"/>                  
                                <path d="M206.5 50 A50 50 0 0 1 250 140" stroke="#b6d7a8" stroke-width="20" fill="none"/>
                                <path d="M250 140 A50 50 0 0 1 163 140" stroke="#2196F3" stroke-width="20" fill="none"/>
                                <path d="M163 140 A50 50 0 0 1 206.5 50" stroke="#FFC107" stroke-width="20" fill="none"/>
                                <text x="300" y="80" fill="#666" font-size="12">€15000</text>
                                <text x="300" y="110" fill="#666" font-size="12">€07000</text>
                                <text x="300" y="140" fill="#666" font-size="12">€06150</text>
                            </svg>
                        )
                    },
                    {
                        title: "M7asbi 100 Payroll & HR",
                        description: "Payroll and HR management in full compliance for companies with up to 200 employees. Manage your company's human capital flexibly.",
                        buttonText: "Discover M7asbi 100 Payroll & HR",
                        svg: (
                            <svg width="100%" height="168" viewBox="0 0 413 168">
                                <rect x="35" y="0" width="343" height="168" rx="8" fill="white" stroke="#E5E5E5"></rect>
                                <text x="50" y="30" fill="#333" font-size="16" font-weight="bold">Employee Evolution</text>
                                <rect x="60" y="60" width="40" height="80" fill="#b6d7a8" opacity="0.8"/>
                                <rect x="110" y="80" width="40" height="60" fill="#2196F3" opacity="0.8"/>
                                <rect x="160" y="50" width="40" height="90" fill="#FFC107" opacity="0.8"/>
                                <rect x="210" y="70" width="40" height="70" fill="#FF5722" opacity="0.8"/>
                                <line x1="50" y1="140" x2="300" y2="140" stroke="#666" stroke-width="1"/>
                                <text x="70" y="155" fill="#666" font-size="10">Q1</text>
                                <text x="120" y="155" fill="#666" font-size="10">Q2</text>
                                <text x="170" y="155" fill="#666" font-size="10">Q3</text>
                                <text x="220" y="155" fill="#666" font-size="10">Q4</text>
                            </svg>
                        )
                    }
                ].map((card, index) => (
                    <motion.div 
                        key={index}
                        variants={item}
                        whileHover={{ y: -5 }}
                        className="bg-white text-black rounded-xl p-8 w-full md:w-96 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        <h2 className="text-2xl font-bold mb-4">{card.title}</h2>
                        <p className="text-gray-600 text-sm leading-relaxed mb-6">{card.description}</p>
                        <a 
                            href="#" 
                            className="inline-block bg-black text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors duration-300"
                        >
                            {card.buttonText}
                        </a>
                        <div className="mt-6 bg-gray-100 rounded-lg overflow-hidden">
                            {card.svg}
                        </div>
                    </motion.div>
                ))}
            </motion.section>

            {/* Partners Footer */}
            <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center opacity-80 my-20 relative z-20"
            >
                <p>Partners: LabelVie, SICAM, Nouvelair, La Mamounia...</p>
            </motion.div>

            {/* Stats Section */}
            <motion.section 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="py-20 px-5 text-center relative z-20 max-w-6xl mx-auto"
            >
                <motion.h2 
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-white uppercase text-sm tracking-wider mb-3"
                >
                    M7ASBI IN A FEW NUMBERS
                </motion.h2>
                <motion.h3 
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-white text-3xl font-bold mb-12"
                >
                    Businesses from around the world trust M7asbi
                </motion.h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
                    {[
                        {
                            icon: (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            ),
                            value: "Over 40 years",
                            description: "of perfecting tools that help businesses like yours succeed"
                        },
                        {
                            icon: (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            ),
                            value: "2 million",
                            description: "entrepreneurs use M7asbi software in 26 countries"
                        },
                        {
                            icon: (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            ),
                            value: "Over 40,000",
                            description: "partners allow us to provide exceptional support"
                        },
                        {
                            icon: (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                            ),
                            value: "Over 100",
                            description: "awards received for the quality of our customer service, our software innovations, and much more"
                        }
                    ].map((stat, index) => (
                        <motion.div 
                            key={index}
                            initial={{ y: 30, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 + 0.6, duration: 0.6 }}
                            viewport={{ once: true }}
                            className="p-8 text-center text-white"
                        >
                            <div className="bg-green-300 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6">
                                {stat.icon}
                            </div>
                            <h4 className="text-2xl font-bold mb-4">{stat.value}</h4>
                            <p className="text-sm text-gray-300 leading-relaxed">{stat.description}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* Services Section */}
            <motion.section 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="py-20 px-5 relative z-20"
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {[
                        {
                            icon: "https://placehold.co/120x120/00C853/FFFFFF.svg?text=Books",
                            title: "Expert Advice",
                            description: "Our M7asbi blog provides you with advice on everything related to managing a business, including how to successfully transition leadership within a company.",
                            buttonText: "Access the blog"
                        },
                        {
                            icon: "https://placehold.co/120x120/00C853/FFFFFF.svg?text=Partners",
                            title: "Partners",
                            description: "Our community of partners plays a vital role in providing solutions and services that help our clients worldwide thrive.",
                            buttonText: "Discover our partners"
                        },
                        {
                            icon: "https://placehold.co/120x120/00C853/FFFFFF.svg?text=Support",
                            title: "24/7 Support",
                            description: "Our experts can assist you quickly with online or phone product support available 24 hours a day, 7 days a week.",
                            buttonText: "Discover support"
                        }
                    ].map((service, index) => (
                        <motion.div 
                            key={index}
                            initial={{ y: 30, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ delay: index * 0.2, duration: 0.6 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -10 }}
                            className="bg-gray-900 rounded-xl p-10 text-center flex flex-col items-center transition-all duration-300 hover:shadow-lg"
                        >
                            <div className="w-24 h-24 mb-8">
                                <img src={service.icon} alt={service.title} className="w-full h-full object-contain" />
                            </div>
                            <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                            <p className="text-sm text-gray-300 mb-6 leading-relaxed">{service.description}</p>
                            <a 
                                href="#" 
                                className="border border-green-300 text-green-300 px-6 py-2 rounded-full text-sm hover:bg-green-300 hover:text-black transition-all duration-300"
                            >
                                {service.buttonText}
                            </a>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* Blog Section */}
            <motion.section 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="py-20 px-5 bg-black text-white text-center relative z-20"
            >
                <div className="max-w-4xl mx-auto mb-16">
                    <motion.h4 
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-white uppercase text-sm mb-4"
                    >
                        M7asbi Advice
                    </motion.h4>
                    <motion.h2 
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-3xl font-bold leading-tight"
                    >
                        The Blog of Keys to Business Management
                    </motion.h2>
                </div>

                <div className="relative max-w-7xl mx-auto px-5">
                    <button className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white w-10 h-10 rounded-full flex items-center justify-center z-30 hover:bg-green-300 hover:text-black transition-all duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mx-auto">
                        {[
                            {
                                image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e",
                                title: "The Right Questions to Ask When Choosing Your Accounting Software",
                                description: "No one can escape administrative tasks. So, if you've just started your business or are in charge of a company..."
                            },
                            {
                                image: "https://images.unsplash.com/photo-1531482615713-2afd69097998",
                                title: "The Evolution of Accounting Activity with M7asbi FRP 1000cloud",
                                description: "The International Clinic of Parc Monceau has integrated its purchasing management tool with M7asbi FRP 1000cloud to allow..."
                            },
                            {
                                image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf",
                                title: "Boosting Accounting Expertise Through Digitalization",
                                description: "Discover how to save time with SaaS solutions. Reduce errors, improve teamwork, and your..."
                            },
                            {
                                image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0",
                                title: "Best Practices for Fast Closing",
                                description: "Closing accounts is a communication argument about the performance and seriousness of companies. They therefore want to..."
                            }
                        ].map((post, index) => (
                            <motion.article 
                                key={index}
                                initial={{ y: 30, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ delay: index * 0.1, duration: 0.6 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -10 }}
                                className="bg-gray-900 rounded-lg overflow-hidden transition-all duration-300 flex flex-col h-full"
                            >
                                <div className="h-48 overflow-hidden">
                                    <img 
                                        src={post.image} 
                                        alt={post.title} 
                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                    />
                                </div>
                                <div className="p-6 flex-grow flex flex-col">
                                    <h3 className="text-lg font-bold mb-3 leading-snug">{post.title}</h3>
                                    <p className="text-sm text-gray-300 mb-4 flex-grow">{post.description}</p>
                                    <a 
                                        href="#" 
                                        className="text-green-300 text-sm font-medium hover:underline self-start"
                                    >
                                        Read more
                                    </a>
                                </div>
                            </motion.article>
                        ))}
                    </div>

                    <button className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white w-10 h-10 rounded-full flex items-center justify-center z-30 hover:bg-green-300 hover:text-black transition-all duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                <div className="flex justify-center space-x-2 mt-10">
                    {[1, 2, 3, 4, 5, 6].map((dot, index) => (
                        <button 
                            key={dot}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === 0 ? 'bg-green-300 scale-125' : 'bg-gray-700'}`}
                        ></button>
                    ))}
                </div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    viewport={{ once: true }}
                    className="mt-12"
                >
                    <a 
                        href="#" 
                        className="inline-block border border-green-300 text-green-300 px-8 py-3 rounded-full text-sm font-medium hover:bg-green-300 hover:text-black transition-all duration-300"
                    >
                        Access the Blog
                    </a>
                </motion.div>
            </motion.section>

            {/* Main Footer */}
            <motion.footer 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-black py-20 px-5 text-white relative z-20"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="mb-12">
                        <img 
                            src="https://scontent.fnbe1-2.fna.fbcdn.net/v/t1.15752-9/475830842_2840668172780106_8534456318214879610_n.png?stp=dst-png_s480x480&_nc_cat=107&ccb=1-7&_nc_sid=0024fc&_nc_ohc=FLlKtoQ1ddcQ7kNvgHuSshv&_nc_oc=AdgKnKbAmgHf7j4nBE9_rLw3GTKeqAasSxzj0bTXXvnS0ladoySKjo30EF2rsU1cZAg&_nc_ad=z-m&_nc_cid=1159&_nc_zt=23&_nc_ht=scontent.fnbe1-2.fna&oh=03_Q7cD1gF7I8KjS_BRnXKt_8w3Cgl--awVeb1LpewKaEjwSXBPzQ&oe=67E59542" 
                            alt="M7asbi" 
                            className="h-10"
                        />
                    </div>

                    <div className="flex flex-col gap-16">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                            <div>
                                <h3 className="text-white uppercase text-xs font-bold mb-5">Segments</h3>
                                <ul className="space-y-3">
                                    <li><a href="#" className="text-gray-400 text-sm hover:text-green-300 transition-colors duration-300">Small Businesses (TPE)</a></li>
                                    <li><a href="#" className="text-gray-400 text-sm hover:text-green-300 transition-colors duration-300">Medium and Large Enterprises (SMEs and ETIs)</a></li>
                                    <li><a href="#" className="text-gray-400 text-sm hover:text-green-300 transition-colors duration-300">Certified Accountants</a></li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-white uppercase text-xs font-bold mb-5">COMPANY</h3>
                                <ul className="space-y-3">
                                    <li><a href="#" className="text-gray-400 text-sm hover:text-green-300 transition-colors duration-300">Overview</a></li>
                                    <li><a href="#" className="text-gray-400 text-sm hover:text-green-300 transition-colors duration-300">Careers</a></li>
                                    <li><a href="#" className="text-gray-400 text-sm hover:text-green-300 transition-colors duration-300">Events</a></li>
                                    <li><a href="#" className="text-gray-400 text-sm hover:text-green-300 transition-colors duration-300">Social Media</a></li>
                                    <li><a href="#" className="text-gray-400 text-sm hover:text-green-300 transition-colors duration-300">About M7asbi</a></li>
                                    <li><a href="#" className="text-gray-400 text-sm hover:text-green-300 transition-colors duration-300">M7asbi Foundation</a></li>
                                    <li><a href="#" className="text-gray-400 text-sm hover:text-green-300 transition-colors duration-300">Investors</a></li>
                                    <li><a href="#" className="text-gray-400 text-sm hover:text-green-300 transition-colors duration-300">News / Press</a></li>
                                    <li><a href="#" className="text-gray-400 text-sm hover:text-green-300 transition-colors duration-300">Sustainability and Society</a></li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-white uppercase text-xs font-bold mb-5">PRODUCTS</h3>
                                <ul className="space-y-3">
                                    <li><a href="#" className="text-gray-400 text-sm hover:text-green-300 transition-colors duration-300">M7asbi 50</a></li>
                                    <li><a href="#" className="text-gray-400 text-sm hover:text-green-300 transition-colors duration-300">M7asbi 100</a></li>
                                    <li><a href="#" className="text-gray-400 text-sm hover:text-green-300 transition-colors duration-300">M7asbi X3</a></li>
                                    <li><a href="#" className="text-gray-400 text-sm hover:text-green-300 transition-colors duration-300">Expert Connect Generation</a></li>
                                    <li><a href="#" className="text-gray-400 text-sm hover:text-green-300 transition-colors duration-300">View All Products</a></li>
                                    <li><a href="#" className="text-gray-400 text-sm hover:text-green-300 transition-colors duration-300">Login</a></li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-white uppercase text-xs font-bold mb-5">SERVICES AND SUPPORT</h3>
                                <ul className="space-y-3">
                                    <li><a href="#" className="text-gray-400 text-sm hover:text-green-300 transition-colors duration-300">Support</a></li>
                                    <li><a href="#" className="text-gray-400 text-sm hover:text-green-300 transition-colors duration-300">Contact</a></li>
                                    <li><a href="#" className="text-gray-400 text-sm hover:text-green-300 transition-colors duration-300">Blog</a></li>
                                    <li><a href="#" className="text-gray-400 text-sm hover:text-green-300 transition-colors duration-300">Community</a></li>
                                    <li><a href="#" className="text-gray-400 text-sm hover:text-green-300 transition-colors duration-300">Partner Space</a></li>
                                    <li><a href="#" className="text-gray-400 text-sm hover:text-green-300 transition-colors duration-300">Partner Store</a></li>
                                </ul>
                            </div>

                            <div>
                                <ul className="space-y-3">
                                    <li><a href="#" className="text-gray-400 text-sm hover:text-green-300 transition-colors duration-300">Our Partnership Opportunities</a></li>
                                    <li><a href="#" className="text-gray-400 text-sm hover:text-green-300 transition-colors duration-300">ISV Publishers and Alliances</a></li>
                                    <li><a href="#" className="text-gray-400 text-sm hover:text-green-300 transition-colors duration-300">Join Us</a></li>
                                    <li><a href="#" className="text-gray-400 text-sm hover:text-green-300 transition-colors duration-300">Resellers</a></li>
                                    <li><a href="#" className="text-gray-400 text-sm hover:text-green-300 transition-colors duration-300">Integrators</a></li>
                                </ul>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-6">
                            <a href="#" className="text-white hover:text-green-300 transition-colors duration-300">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                </svg>
                            </a>
                            <a href="#" className="text-white hover:text-green-300 transition-colors duration-300">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                                </svg>
                            </a>
                            <a href="#" className="text-white hover:text-green-300 transition-colors duration-300">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                </svg>
                            </a>
                            <a href="#" className="text-white hover:text-green-300 transition-colors duration-300">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                                </svg>
                            </a>
                            <a href="#" className="text-white hover:text-green-300 transition-colors duration-300">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </motion.footer>
        </div>
    );
};

export default Home;