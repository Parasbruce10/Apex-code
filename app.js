// UPDATED LOOPING TYPEWRITER COMPONENT
const TypewriterText = ({ texts, speed = 40, delay = 2000 }) => {
    const [textIndex, setTextIndex] = React.useState(0);
    const [displayText, setDisplayText] = React.useState('');
    const [isDeleting, setIsDeleting] = React.useState(false);

    React.useEffect(() => {
        let timer;
        const currentFullText = texts[textIndex];

        if (!isDeleting) {
            // Text Type Ho Raha Hai
            timer = setTimeout(() => {
                setDisplayText(currentFullText.substring(0, displayText.length + 1));
            }, speed);

            // Jab Poori Line Type Ho Jaye, Toh Pause Karein Phir Delete Shuru Karein
            if (displayText === currentFullText) {
                clearTimeout(timer);
                timer = setTimeout(() => setIsDeleting(true), delay);
            }
        } else {
            // Text Delete Ho Raha Hai
            timer = setTimeout(() => {
                setDisplayText(currentFullText.substring(0, displayText.length - 1));
            }, speed / 2); // Deleting speed thodi tez rakhi hai

            // Jab Poori Line Khali Ho Jaye, Toh Agli Line Par Switch Karein
            if (displayText === '') {
                setIsDeleting(false);
                setTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
            }
        }

        return () => clearTimeout(timer);
    }, [displayText, isDeleting, textIndex, texts, speed, delay]);

    return React.createElement(React.Fragment, null,
        displayText,
        React.createElement('span', { className: 'blinking-cursor' }, '|')
    );
};

// ✨ NAYA COUNTER COMPONENT (Premium Number Animation Ke Liye)
const AnimatedCounter = ({ end, duration = 2000, suffix = '' }) => {
    const [count, setCount] = React.useState(0);
    const [hasStarted, setHasStarted] = React.useState(false);
    const ref = React.useRef(null);

    React.useEffect(() => {
        // Scroll hone par animation start karne ke liye
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setHasStarted(true);
                observer.disconnect();
            }
        }, { threshold: 0.3 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    React.useEffect(() => {
        if (!hasStarted) return;
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // Smooth easing effect
            const easeProgress = 1 - Math.pow(1 - progress, 4); 
            setCount(Math.floor(easeProgress * end));
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }, [end, duration, hasStarted]);

    return React.createElement('span', { ref: ref }, count + suffix);
};
// ❓ Collapsible FAQ Item Component
// ❓ Collapsible FAQ Item Component
const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const contentRef = React.useRef(null);

    return React.createElement('div', {
        style: {
            background: 'rgba(255, 255, 255, 0.03)',
            border: isOpen ? '1px solid rgba(0, 255, 204, 0.35)' : '1px solid rgba(255, 255, 255, 0.09)',
            borderRadius: '12px',
            padding: '20px 24px',
            cursor: 'pointer',
            transition: 'border-color 0.25s ease, background 0.25s ease'
        },
        onClick: () => setIsOpen(!isOpen)
    }, [
        React.createElement('div', {
            key: 'header',
            style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '14px'
            }
        }, [
            React.createElement('span', {
                key: 'q',
                style: {
                    fontSize: '0.98rem',
                    fontWeight: '500',
                    color: '#fff',
                    lineHeight: '1.4'
                }
            }, question),
            React.createElement('svg', {
                key: 'arrow',
                width: '18',
                height: '18',
                viewBox: '0 0 24 24',
                fill: 'none',
                stroke: isOpen ? '#00ffcc' : '#9aa0ad',
                strokeWidth: '2',
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
                style: {
                    flexShrink: 0,
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.25s ease, stroke 0.25s ease'
                }
            }, React.createElement('polyline', { points: '6 9 12 15 18 9' }))
        ]),
        React.createElement('div', {
            key: 'answer',
            ref: contentRef,
            style: {
                maxHeight: isOpen && contentRef.current ? contentRef.current.scrollHeight + 'px' : '0px',
                overflow: 'hidden',
                transition: 'max-height 0.3s ease'
            }
        }, React.createElement('p', {
            style: {
                marginTop: '12px',
                marginBottom: '0',
                color: '#9aa0ad',
                fontSize: '0.88rem',
                lineHeight: '1.6',
                whiteSpace: 'pre-line'
            }
        }, answer))
    ]);
};

// Main 10 Questions Wrapper
const TopFAQSection = () => {
    const faqs = [
    { question: "What services does Apex Code provide?", answer: "We build custom code-based websites (React + Python/Flask), professional WordPress sites, on-page and technical SEO optimization, and ad monetization setups using AdSense, Adsterra, or Monetag." },
    { question: "How do I get started with a project?", answer: "Just fill out the project details form on our site. Tell us what you need and our team will reach out to discuss the right plan, timeline, and pricing for you." },
    { question: "Do you build custom-coded sites or just WordPress?", answer: "Both. We offer fully custom React/Flask websites for performance-critical projects, plus WordPress builds for clients who want an easy-to-manage CMS." },
    { question: "Are your websites mobile responsive?", answer: "Yes. Every plan we offer, Basic, Standard, or Premium, is built with fluid layouts that scale cleanly from desktop screens down to mobile devices." },
    { question: "Do you offer SEO optimization for websites?", answer: "Yes, we have dedicated SEO plans covering on-page optimization, technical audits, keyword strategy, and structured data to help improve your Google ranking." },
    { question: "Can you help monetize my website with ads?", answer: "Yes, we set up AdSense, Adsterra, or Monetag ad placements designed for strong revenue without hurting your site's user experience or load speed." },
    { question: "What payment methods do you accept?", answer: "We support Sadapay, Raqami, Jazzcash, HBL Bank, UBL Bank, Meezan Bank, NayaPay, Easypaisa, and standard corporate bank transfers for project payments." },
    { question: "How long does a project take to complete?", answer: "It depends on the plan. Basic builds have a quick turnaround, while Standard and Premium plans with database integration or enterprise architecture take longer based on scope." },
    { question: "Who owns the website once it's finished?", answer: "Full ownership transfers to you once payment is completed. Reusing or redistributing our proprietary framework themes without authorization is not permitted." },
    { question: "Do you offer revisions or support after launch?", answer: "Custom development revisions follow the written scope agreed at project start. Pre-built website-for-sale purchases are final, so we recommend reviewing the live preview carefully before booking." }
];

    return React.createElement('div', {
        style: {
            width: '100%',
            maxWidth: '900px',
            margin: '0 auto 30px auto'
        }
    }, [
        React.createElement('div', {
    key: 'divider-top',
    style: {
        width: '120px',
        height: '2px',
        margin: '0 auto 18px auto',
        background: 'linear-gradient(90deg, transparent, #00ffcc, transparent)'
    }
}),
        React.createElement('h3', {
            key: 'title',
            style: { color: '#00ffcc', fontSize: '1.2rem', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center' }
        }, "Pre-Project Knowledge Base"),
        React.createElement('div', {
            key: 'grid',
            style: {
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '16px'
            }
        }, faqs.map((faq, i) => React.createElement(FAQItem, { key: i, question: faq.question, answer: faq.answer })))
        
    ]);
};

// 🌟 1. WEBSITE SALE DETAILS ARRAY (Online Images & English Details)
const websiteSaleDetails = [
    {
        title: "01 / Ultra-Fast Performance & Clean Code",
        desc: "Built with modern frameworks ensuring lightning-fast load times. Zero bloatware, highly optimized for maximum speed and user retention. Your users will experience instant page transitions.",
        img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80"
    },
    {
        title: "02 / Fully Responsive & Mobile Optimized",
        desc: "Fluid layouts that adapt perfectly to any screen size. Whether on a desktop, tablet, or smartphone, your audience gets a flawless, app-like experience without layout shifts.",
        img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80"
    },
    {
        title: "03 / Advanced SEO & High Ranking Ready",
        desc: "Programmatically structured for search engines. Includes semantic HTML, meta tags, and fast rendering architectures to help you rank on the first page of Google organically.",
        img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80"
    },
    {
        title: "04 / Integrated Monetization & Ads Placement",
        desc: "Strategically placed ad zones ready for Google AdSense, Adsterra, or Monetag. Turn your traffic into a steady revenue stream effortlessly without ruining the user experience.",
        img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80"
    },
    {
        title: "05 / Secure Admin Panel & Easy Management",
        desc: "Take full control with a powerful, secure backend architecture. Easily manage content, track real-time analytics, and update your site effortlessly with enterprise-grade security.",
        img: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=600&q=80"
    }
];

// 🌟 2. RENDER LOGIC (Zigzag Layout with Premium CSS)
const renderSaleDetailsBlocks = () => {
    return React.createElement('div', {
        style: {
            marginTop: '80px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '60px',
            width: '100%'
        }
    },
        React.createElement('h2', {
            style: { 
                fontSize: '2.2rem', 
                fontWeight: '800', 
                marginBottom: '50px', 
                textAlign: 'center', 
                background: 'linear-gradient(135deg, #fff, #00f2fe)', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent' 
            }
        }, 'Why Choose Our Premium Websites?'),
        
        React.createElement('div', {
            style: { display: 'flex', flexDirection: 'column', gap: '30px' }
        },
            websiteSaleDetails.map((detail, index) => {
                const isEven = index % 2 === 0; // Zigzag logic (Left-Right)
                return React.createElement('div', {
                    key: index,
                    style: {
                        display: 'flex',
                        flexDirection: isEven ? 'row' : 'row-reverse', // Image kabhi left, kabhi right
                        flexWrap: 'wrap',
                        gap: '40px',
                        alignItems: 'center',
                        background: 'rgba(255, 255, 255, 0.02)',
                        padding: '30px',
                        borderRadius: '24px',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
                    }
                },
                    // Image Section
                    React.createElement('div', { style: { flex: '1 1 300px' } },
                        React.createElement('img', {
                            src: detail.img,
                            alt: detail.title,
                            style: { 
                                width: '100%', 
                                borderRadius: '16px', 
                                boxShadow: isEven ? '0 10px 30px rgba(0, 242, 254, 0.15)' : '0 10px 30px rgba(255, 0, 128, 0.15)', 
                                display: 'block',
                                border: '1px solid rgba(255,255,255,0.05)'
                            }
                        })
                    ),
                    // Text Section
                    React.createElement('div', { style: { flex: '1 1 350px' } },
                        React.createElement('h3', { 
                            style: { 
                                color: isEven ? '#00f2fe' : '#ff0080', // Color toggle for premium feel
                                fontSize: '1.5rem', 
                                marginBottom: '15px', 
                                fontWeight: '800' 
                            } 
                        }, detail.title),
                        React.createElement('p', { 
                            style: { 
                                color: 'rgba(255, 255, 255, 0.7)', 
                                fontSize: '1.05rem', 
                                lineHeight: '1.7' 
                            } 
                        }, detail.desc)
                    )
                );
            })
        )
    );
};
// 🌟 1. AVAILABLE JOBS ARRAY (Online Images & Professional Details)
const availableJobsList = [
    {
        title: "01 / Front-End React Developer",
        desc: "Looking for an enthusiastic developer to build highly responsive web interfaces. You will work on creating dynamic components, managing state efficiently, and ensuring mobile-first layouts.",
        img: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=600&q=80"
    },
    {
        title: "02 / Software Engineering Internship",
        desc: "Kickstart your career with our hands-on software engineering program. Collaborate with senior devs on real-world projects. Location: Remote / Karachi.",
        img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80"
    },
    {
        title: "03 / Backend Developer (Python & Flask)",
        desc: "Join our core team to design and maintain robust APIs. You will work on Python-based algorithms, optimize server-side logic using Flask, and integrate with modern frontend frameworks.",
        img: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&w=600&q=80"
    },
    {
        title: "04 / AI & Machine Learning Engineer",
        desc: "Work on cutting-edge AI technologies, including text humanization models, LLM integrations, and intelligent detectors. Help bridge the gap between complex AI logic and user-friendly web apps.",
        img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=600&q=80"
    },
    {
        title: "05 / UI/UX Product Designer",
        desc: "Shape the visual identity of our next-generation web applications. Focus on user-centric design, creating wireframes, and delivering pixel-perfect prototypes for the development team.",
        img: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=600&q=80"
    }
];

// 🌟 2. RENDER LOGIC FOR JOBS (Zigzag Layout with Neon Accents)
const renderAvailableJobsBlocks = () => {
    return React.createElement('div', {
        style: {
            marginTop: '80px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '60px',
            width: '100%'
        }
    },
        React.createElement('h2', {
            style: { 
                fontSize: '2.2rem', 
                fontWeight: '800', 
                marginBottom: '50px', 
                textAlign: 'center', 
                background: 'linear-gradient(135deg, #00ff87, #60efff)', // Greenish-blue neon for Jobs
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent' 
            }
        }, 'Explore Open Opportunities'),
        
        React.createElement('div', {
            style: { display: 'flex', flexDirection: 'column', gap: '30px' }
        },
            availableJobsList.map((job, index) => {
                const isEven = index % 2 === 0;
                return React.createElement('div', {
                    key: index,
                    style: {
                        display: 'flex',
                        flexDirection: isEven ? 'row' : 'row-reverse', // Zigzag Layout
                        flexWrap: 'wrap',
                        gap: '40px',
                        alignItems: 'center',
                        background: 'rgba(255, 255, 255, 0.02)',
                        padding: '30px',
                        borderRadius: '24px',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
                    }
                },
                    // Image Section
                    React.createElement('div', { style: { flex: '1 1 300px' } },
                        React.createElement('img', {
                            src: job.img,
                            alt: job.title,
                            style: { 
                                width: '100%', 
                                borderRadius: '16px', 
                                boxShadow: isEven ? '0 10px 30px rgba(96, 239, 255, 0.15)' : '0 10px 30px rgba(0, 255, 135, 0.15)', 
                                display: 'block',
                                border: '1px solid rgba(255,255,255,0.05)'
                            }
                        })
                    ),
                    // Text Section
                    React.createElement('div', { style: { flex: '1 1 350px' } },
                        React.createElement('h3', { 
                            style: { 
                                color: isEven ? '#60efff' : '#00ff87', // Toggle neon green/blue
                                fontSize: '1.5rem', 
                                marginBottom: '15px', 
                                fontWeight: '800' 
                            } 
                        }, job.title),
                        React.createElement('p', { 
                            style: { 
                                color: 'rgba(255, 255, 255, 0.7)', 
                                fontSize: '1.05rem', 
                                lineHeight: '1.7',
                                marginBottom: '20px'
                            } 
                        }, job.desc),
                        // Apply Now Button Mockup
                        React.createElement('button', {
                            style: {
                                background: 'transparent',
                                color: '#fff',
                                border: `1px solid ${isEven ? '#60efff' : '#00ff87'}`,
                                padding: '10px 24px',
                                borderRadius: '30px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                transition: 'all 0.3s ease',
                                boxShadow: `0 0 10px ${isEven ? 'rgba(96, 239, 255, 0.2)' : 'rgba(0, 255, 135, 0.2)'}`
                            }
                        }, 'Position Closed')
                    )
                );
            })
        )
    );
};
// Yahan se aapka original code shuru ho raha hai
// const QuickKitApp = () => { ...
// JavaScript logic aur React dynamic element creation ek sath

const QuickKitApp = () => {
    const currentYear = 2026;
    const [currentPage, setCurrentPage] = React.useState('home');
    const [openFaqIndex, setOpenFaqIndex] = React.useState(null);
    const toContactUs = (e) => { e.preventDefault(); setCurrentPage('contact-us'); };
    const toComplain = (e) => { e.preventDefault(); setCurrentPage('complain-form'); };
    // NAYA STATE: Selected Plan ki details save karne ke liye
    const [selectedPlan, setSelectedPlan] = React.useState({ name: '', price: '' });
    // Purane states ke neechay ye add karein:
    const [isAdminLoggedIn, setIsAdminLoggedIn] = React.useState(
        localStorage.getItem('isAdminLoggedIn') === 'true'
    );
    const [adminPassword, setAdminPassword] = React.useState('1122'); // Default password
    // ✅ WEBSITES FOR SALE KE LIYE NAYE STATES
    const [websites, setWebsites] = React.useState([]);
    const [websiteToEdit, setWebsiteToEdit] = React.useState(null);
    const [selectedWebsiteDesc, setSelectedWebsiteDesc] = React.useState(null);
    const [selectedWebsiteForOrder, setSelectedWebsiteForOrder] = React.useState(null);

    // ✅ BACKEND SE SAARI WEBSITES FETCH KARNE WALA FUNCTION
    const fetchWebsites = () => {
        fetch('https://hamzaparas-apex-code.hf.space/api/websites') // Backend mein yeh API banani hogi
            .then(res => res.json())
            .then(data => { if (data.success) setWebsites(data.websites); })
            .catch(err => console.log('Websites fetch error:', err));
    };

    // ✅ APP LOAD HOTE HI WEBSITES BHI FETCH KARO
    // Purane useEffect ko is se replace kar dein:
    React.useEffect(() => {
        fetchJobs();
        fetchWebsites();
    }, []);

    // ✅ JOBS KE LIYE NAYE STATES
    const [jobs, setJobs] = React.useState([]);
    const [jobToEdit, setJobToEdit] = React.useState(null); // null = Naya Job, value = Edit ho raha hai
    const [selectedJobDescription, setSelectedJobDescription] = React.useState(null); // Description Modal
    const [selectedJobForApply, setSelectedJobForApply] = React.useState(null); // Apply Form ke liye job

    // ✅ BACKEND SE SAARI JOBS FETCH KARNE WALA FUNCTION
    const fetchJobs = () => {
        fetch('https://hamzaparas-apex-code.hf.space/api/jobs')
            .then(res => res.json())
            .then(data => { if (data.success) setJobs(data.jobs); })
            .catch(err => console.log('Jobs fetch error:', err));
    };

    // ✅ APP LOAD HOTE HI JOBS FETCH KARO
    React.useEffect(() => {
        fetchJobs();
    }, []);

    // Admin Navigation Functions
    const toAdminPanel = (e) => { e.preventDefault(); setCurrentPage('admin-panel'); };
    const toUpdatePassword = (e) => { e.preventDefault(); setCurrentPage('update-password'); };
    // Purane navigation functions ke neechay yeh paste karein
    const toUploadPage = (e) => {
        if (e) e.preventDefault();
        setCurrentPage('upload-page');
    };

    // ✅ WEBSITES NAVIGATION FUNCTIONS
    const toWebsiteUploadForm = (e) => {
        if (e) e.preventDefault();
        setWebsiteToEdit(null); // Naya add karne ke liye form reset
        setCurrentPage('website-upload-form');
    };

    const toWebsitesForSale = (e) => {
        if (e) e.preventDefault();
        fetchWebsites();
        setCurrentPage('websites-for-sale');
    };

    const toWebsiteOrderForm = (website) => (e) => {
        if (e) e.preventDefault();
        setSelectedWebsiteForOrder(website);
        setCurrentPage('website-order-form');
    };

    const toEditWebsiteForm = (website) => (e) => {
        if (e) e.preventDefault();
        setWebsiteToEdit(website);
        setCurrentPage('website-upload-form');
    };

    // ✅ JOBS NAVIGATION FUNCTIONS
    const toJobUploadForm = (e) => {
        if (e) e.preventDefault();
        setJobToEdit(null); // Naya job add karne ke liye reset
        setCurrentPage('job-upload-form');
    };

    const toAvailableJobs = (e) => {
        if (e) e.preventDefault();
        fetchJobs();
        setCurrentPage('available-jobs');
    };

    const toJobApplyForm = (job) => (e) => {
        if (e) e.preventDefault();
        setSelectedJobForApply(job);
        setCurrentPage('job-apply-form');
    };

    const toEditJobForm = (job) => (e) => {
        if (e) e.preventDefault();
        setJobToEdit(job);
        setCurrentPage('job-upload-form');
    };
    // NAYA FUNCTION: Plan aur Price pass karne ke liye
    const toContactForm = (planName, planPrice) => (e) => {
        e.preventDefault();
        setSelectedPlan({ name: planName, price: planPrice });
        setCurrentPage('contact-form');
    };

    // FORM SUBMIT FUNCTION: Bina page load kiye message bhejne ke liye
    const handleFormSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.innerText = 'Sending... ⏳'; // Loading effect
        submitBtn.disabled = true;

        fetch('https://formspree.io/f/mqeoolep', {
            method: 'POST',
            body: new FormData(form),
            headers: { 'Accept': 'application/json' }
        })
            .then(response => response.json())
            .then(data => {
                setCurrentPage('thank-you'); // Message send hotay hi Thank You page par le jaye
            })
            .catch(error => {
                alert('Error sending message. Please try again.');
                submitBtn.innerText = 'Send Request 🚀';
                submitBtn.disabled = false;
            });
    };
    const toHome = (e) => { e.preventDefault(); setCurrentPage('home'); };
    const toServices = (e) => { e.preventDefault(); setCurrentPage('services'); };
    // ADMIN LOGIN LOGIC
    // 1. PYTHON API SE LOGIN CONNECT
    // ADMIN LOGIN LOGIC (No Success Pop-up Version)
    const handleAdminLogin = (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        fetch('https://hamzaparas-apex-code.hf.space/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setIsAdminLoggedIn(true);
                    localStorage.setItem('isAdminLoggedIn', 'true'); // Taake refresh par login rahay
                    setCurrentPage('admin-panel'); // ⚡ DIRECT REDIRECT (Pop-up hata diya)
                } else {
                    alert('🚫 ' + data.message); // Sirf galti par pop-up aayega
                }
            })
            .catch(err => alert('🚫 Backend Server se connection nahi ho saka!'));
    };

    // 2. PYTHON API SE PASSWORD UPDATE CONNECT
    // PYTHON API SE PASSWORD UPDATE CONNECT (No Success Pop-up Version)
    const handlePasswordUpdate = (e) => {
        e.preventDefault();
        const newPassword = e.target.newPassword.value;

        fetch('https://hamzaparas-apex-code.hf.space/api/admin/update-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newPassword })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setCurrentPage('admin-panel'); // ⚡ DIRECT WAPAS (Pop-up hata diya)
                } else {
                    alert('🚫 ' + data.message); // Sirf galti par pop-up aayega
                }
            })
            .catch(err => alert('🚫 Password update karne mein error aaya!'));
    };

    // 3. LOGOUT LOGIC WITH REFRESH CLEAR
    // LOGOUT LOGIC WITH REFRESH CLEAR (No Pop-up Version)
    const handleLogout = (e) => {
        if (e) e.preventDefault();
        setIsAdminLoggedIn(false);
        localStorage.removeItem('isAdminLoggedIn'); // Refresh memory clear
        setCurrentPage('home'); // ⚡ DIRECT HOME (Pop-up hata diya)
    };

    // ✅ JOB ADD YA EDIT SUBMIT (Same form dono kaam karta hai)
    const handleJobFormSubmit = (e) => {
        e.preventDefault();
        const title = e.target.title.value;
        const salary = e.target.salary.value;
        const description = e.target.description.value;

        const isEditing = jobToEdit !== null;
        const url = isEditing
            ? `https://hamzaparas-apex-code.hf.space/api/jobs/${jobToEdit.id}`
            : 'https://hamzaparas-apex-code.hf.space/api/jobs';
        const method = isEditing ? 'PUT' : 'POST';

        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, salary, description })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    fetchJobs();
                    setJobToEdit(null);
                    setCurrentPage('admin-panel');
                } else {
                    alert('🚫 ' + data.message);
                }
            })
            .catch(err => alert('🚫 Job save karne mein error aaya!'));
    };

    // ✅ WEBSITE ADD YA EDIT SUBMIT
    const handleWebsiteFormSubmit = (e) => {
        e.preventDefault();
        const name = e.target.name.value;
        const price = e.target.price.value;
        const imageLink = e.target.imageLink.value;
        const siteLink = e.target.siteLink.value;
        const description = e.target.description.value;

        const isEditing = websiteToEdit !== null;
        const url = isEditing
            ? `https://hamzaparas-apex-code.hf.space/api/websites/${websiteToEdit.id}`
            : 'https://hamzaparas-apex-code.hf.space/api/websites';
        const method = isEditing ? 'PUT' : 'POST';

        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, price, imageLink, siteLink, description })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    fetchWebsites();
                    setWebsiteToEdit(null);
                    setCurrentPage('upload-page');
                } else {
                    alert('🚫 ' + data.message);
                }
            })
            .catch(err => alert('🚫 Website save karne mein error aaya!'));
    };

    // ✅ WEBSITE DELETE
    const handleWebsiteDelete = (websiteId) => {
        if (!window.confirm('Pakka delete karna hai is website ko?')) return;

        fetch(`https://hamzaparas-apex-code.hf.space/api/websites/${websiteId}`, { method: 'DELETE' })
            .then(res => res.json())
            .then(data => {
                if (data.success) fetchWebsites();
                else alert('🚫 ' + data.message);
            })
            .catch(err => alert('🚫 Delete karne mein error aaya!'));
    };

    // ✅ JOB DELETE
    const handleJobDelete = (jobId) => {
        if (!window.confirm('Pakka delete karna hai is job ko?')) return;

        fetch(`https://hamzaparas-apex-code.hf.space/api/jobs/${jobId}`, { method: 'DELETE' })
            .then(res => res.json())
            .then(data => {
                if (data.success) fetchJobs();
                else alert('🚫 ' + data.message);
            })
            .catch(err => alert('🚫 Job delete karne mein error aaya!'));
    };


    const toPlans = (e) => { e.preventDefault(); setCurrentPage('plans'); };
    const toWpPlans = (e) => { e.preventDefault(); setCurrentPage('wp-plans'); };
    const toSeoPlans = (e) => { e.preventDefault(); setCurrentPage('seo-plans'); };
    const toAdsPlans = (e) => { e.preventDefault(); setCurrentPage('ads-plans'); };
    const toPortfolio = (e) => { e.preventDefault(); setCurrentPage('portfolio'); };
    const toAdminLogin = (e) => { e.preventDefault(); setCurrentPage('admin-login'); };
    const toParasPortfolio = (e) => { if (e) e.preventDefault(); setCurrentPage('paras-portfolio'); };
    const toUsmanPortfolio = (e) => { if (e) e.preventDefault(); setCurrentPage('usman-portfolio'); };
    const toSaifPortfolio = (e) => { if (e) e.preventDefault(); setCurrentPage('saif-portfolio'); };
    const toAbdulNafayPortfolio = (e) => { if (e) e.preventDefault(); setCurrentPage('abdulnafay-portfolio'); };
    const toAbrarPortfolio = (e) => { if (e) e.preventDefault(); setCurrentPage('abrar-portfolio'); };
    const toHamzaPortfolio = (e) => { if (e) e.preventDefault(); setCurrentPage('hamza-portfolio'); };
    const toAliPortfolio = (e) => { if (e) e.preventDefault(); setCurrentPage('ali-portfolio'); };
    const toAlamDarPortfolio = (e) => { if (e) e.preventDefault(); setCurrentPage('alamdar-portfolio'); };

    // 1. Header Element (Left: Text, Right: Logo Image)
    const headerElement = React.createElement(
        'header',
        { className: 'header' },
        React.createElement('h1', {
            className: 'logo-text',
            onClick: toHome,
            style: {
                cursor: 'pointer',
                fontFamily: "'Bruno Ace SC', sans-serif",
                fontWeight: '900px', // Browser ko maximum bold thickness force karne ke liye
                // fontStyle: 'italic',
                letterSpacing: '1px',
                color: '#111111'
            }
        }, 'Apex Code ')
        ,
        // Is Image element ko badal kar aisa kar dein:
        React.createElement('img', {
            className: 'logo-img',
            src: 'logo.jpeg',
            alt: 'Apex Code Logo',
            onClick: toAdminLogin, // Yeh click event lagaya
            style: { cursor: 'pointer' } // Taake pata chale yeh clickable hai
        })
    );

    // 2. Main Content Element
    let mainElement;

    if (currentPage === 'services') {

        // UPDATED STYLE: Card ke side par aane wali detail box ka layout aur premium look
        const detailBoxStyle = {
            background: 'linear-gradient(135deg, rgba(20, 20, 30, 0.8), rgba(20, 20, 30, 0.6))',
            padding: '30px 35px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'rgba(255, 255, 255, 0.85)',
            lineHeight: '1.8',
            textAlign: 'left', // Side layout ke liye left-align behtar lagta hai
            fontSize: '1.05rem',
            boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
            flex: '1', // Bachi hui saari jagah le lega
            display: 'flex',
            alignItems: 'center', // Content ko vertically center karne ke liye
            backdropFilter: 'blur(10px)'
        };

        // UPDATED STYLE: Card aur Detail Box ko side-by-side (Row) align karne ke liye
        const groupStyle = {
            display: 'flex',
            flexDirection: 'row', // Side-by-side alignment
            alignItems: 'stretch', // Dono (Card aur Box) ki height bilkul BARABER rakhega
            gap: '30px', // Card aur box ke beech ka fasla
            marginBottom: '50px',
            width: '100%',
            maxWidth: '1100px' // Wide screen par proper spread ke liye
        };

        mainElement = React.createElement('main', { className: 'services-page' },
            // 1️⃣ 👑 ULTRA-PREMIUM BORDERED HEADING BADGE
            React.createElement('div', {
    style: {
        display: 'flex',                             // 'table' se 'flex' kiya takay layout wrap ho sake
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0 auto 20px',                       // Margin-bottom thoda kam kiya mobile space ke liye
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01))',
        backdropFilter: 'blur(15px)',
        WebkitBackdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '24px',
        padding: '12px 20px',                        // Padding mobile ke liye adjust ki
        width: 'fit-content',
        maxWidth: '92%',                             // Screen ke dono side se safe gap rakhega
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        boxSizing: 'border-box'
    }
},
    React.createElement('h2', {
        className: 'section-heading',
        style: {
            fontSize: 'clamp(1.25rem, 4.8vw, 2.3rem)', // Text lamba hai isliye mobile par thoda aur scale-down hoga
            fontWeight: '800',
            letterSpacing: '0.5px',                  // Overlap se bachane ke liye mobile friendly spacing
            textAlign: 'center',
            margin: '0',
            display: 'inline-flex',                  // flex se inline-flex kiya tight mapping ke liye
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',                    // Kisi bhi haal mein text ko single line mein lock rakhega
            background: 'linear-gradient(90deg, #00f2fe 0%, #ff0080 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            WebkitTextStroke: '1px rgba(255, 255, 255, 0.08)',
            filter: 'drop-shadow(0 4px 10px rgba(0, 242, 254, 0.3))'
        }
    }, 'The Services We Provide')
),
React.createElement('p', { 
    className: 'services-sub-text',
    style: {
        fontSize: 'clamp(0.9rem, 3.5vw, 1.1rem)',    // Sub-text bhi mobile screen ke mutabiq scale ho jayegi
        textAlign: 'center',
        padding: '0 15px',                           // Taki sides se responsive text safe rahe
        margin: '0 auto',
        maxWidth: '600px',
        lineHeight: '1.5'
    }
}, 'We craft high-performance digital experiences tailored to your needs.'),
            // Container jo saaray rows ko hold karega
            React.createElement('div', {
                style: {
                    ...groupStyle,
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '30px',
                    alignItems: 'stretch', // Ensures both Card and Detail Box match in height perfectly
                    width: '100%',
                    maxWidth: '900px',
                    marginTop: '30px',
                    marginBottom: '30px'
                },
                className: 'service-row-group'
            },
                // LEFT CARD: HYPER-PREMIUM CUSTOM CODE ENGINE
                React.createElement('div', {
                    className: 'service-card hyper-premium-card',
                    style: {
                        background: 'rgba(10, 11, 18, 0.85)',
                        border: '1px solid rgba(255, 255, 255, 0.07)',
                        boxShadow: '0 30px 70px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 0 50px rgba(0, 242, 254, 0.02)',
                        backdropFilter: 'blur(30px)',
                        WebkitBackdropFilter: 'blur(30px)',
                        padding: '40px 30px',
                        borderRadius: '32px',
                        textAlign: 'left',
                        flex: '0 0 350px',
                        position: 'relative',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                    }
                },
                    // 1. TOP HARDWARE ACCENT BAR (Signature Neon Edge Glow)
                    React.createElement('div', {
                        style: {
                            position: 'absolute', top: '0', left: '40px', right: '40px', height: '3px',
                            background: 'linear-gradient(90deg, transparent, #00f2fe, #ff0080, transparent)',
                            filter: 'drop-shadow(0 2px 8px rgba(0, 242, 254, 0.8))'
                        }
                    }),

                    React.createElement('div', null,
                        // TOP BADGE & BRAND ICON LAYER INLINE
                        React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '25px' } },
                            // Frosted Code Icon Wrapper
                            React.createElement('div', {
                                style: {
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    width: '50px', height: '50px', borderRadius: '14px',
                                    background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.15), rgba(255,255,255,0.01))',
                                    border: '1px solid rgba(0, 242, 254, 0.3)',
                                    color: '#00f2fe', fontSize: '1.2rem', fontWeight: '900',
                                    letterSpacing: '-1px', textShadow: '0 0 12px rgba(0, 242, 254, 0.5)'
                                }
                            }, '</>'),

                            // Micro Popular Pill Badge (with glowing indicator dot)
                            React.createElement('div', {
                                style: {
                                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                                    background: 'rgba(255, 0, 128, 0.08)', border: '1px solid rgba(255, 0, 128, 0.2)',
                                    padding: '5px 12px', borderRadius: '12px'
                                }
                            },
                                React.createElement('span', { style: { width: '6px', height: '6px', backgroundColor: '#ff0080', borderRadius: '50%', boxShadow: '0 0 6px #ff0080' } }),
                                React.createElement('span', { style: { color: '#ff0080', fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.8px', textTransform: 'uppercase' } }, 'Popular')
                            )
                        ),

                        // HEADING
                        React.createElement('h3', {
                            style: { color: '#fff', fontSize: '1.65rem', fontWeight: '900', letterSpacing: '-0.3px', marginBottom: '12px', lineHeight: '1.3' }
                        }, 'Code Base Website Development'),

                        // SHORT DESCRIPTION
                        React.createElement('p', {
                            style: { color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '30px' }
                        }, 'Custom, highly optimized, secure, and lightning-fast websites built from scratch using clean code architecture.')
                    ),

                    // ULTRA-PREMIUM HIGH-CONTRAST WHITE ACTION BUTTON
                    React.createElement('button', {
                        className: 'card-btn enterprise-action',
                        onClick: toPlans,
                        style: {
                            width: '100%', padding: '14px',
                            background: '#fff', color: '#0a0b12',
                            border: '1px solid #fff', borderRadius: '14px',
                            fontSize: '0.95rem', fontWeight: '800', cursor: 'pointer',
                            boxShadow: '0 12px 25px rgba(255, 255, 255, 0.08)',
                            transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                        }
                    },
                        'Get Started',
                        React.createElement('span', { style: { fontSize: '1rem', transform: 'translateY(-1px)' } }, '→')
                    )
                ),

                // RIGHT DETAIL BOX: OMNI-DIRECTIONAL TEXT PANEL
                React.createElement('div', {
                    style: {
                        ...detailBoxStyle,
                        flex: '1 1 450px', // Fluid scale for responsive layouts
                        background: 'rgba(15, 17, 26, 0.5)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        borderRadius: '32px',
                        padding: '40px 35px',
                        color: 'rgba(255, 255, 255, 0.75)',
                        fontSize: '1rem',
                        lineHeight: '1.75',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        textAlign: 'left',
                        position: 'relative'
                    }
                },
                    // Subtle vertical neon alignment bar on the inner left edge
                    React.createElement('div', {
                        style: {
                            position: 'absolute', left: '0', top: '40px', bottom: '40px', width: '2px',
                            background: 'linear-gradient(to bottom, #00f2fe, transparent)'
                        }
                    }),

                    'At Apex Code, we specialize in engineering robust, scalable, and fully customized web architectures from the ground up. Whether you need a complex dynamic web application, a secure enterprise platform, or a lightning-fast frontend with a powerful backend database, our tailored code solutions ensure unparalleled performance. We utilize the latest modern tech stacks to guarantee that your application is future-proof, highly responsive, and uniquely designed to handle your specific business logic without the bloat of traditional templates.'
                ),

                // --- GROUP 2: WORDPRESS BASE ---
                React.createElement('div', {
                    style: {
                        ...groupStyle,
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '30px',
                        alignItems: 'stretch', // Dono layers ki height perfectly barabar rahegi
                        width: '100%',
                        maxWidth: '900px',
                        marginTop: '30px',
                        marginBottom: '30px'
                    },
                    className: 'service-row-group'
                },
                    // LEFT CARD: PREMIUM WORDPRESS ENGINE
                    React.createElement('div', {
                        className: 'service-card hyper-premium-card',
                        style: {
                            background: 'rgba(10, 11, 18, 0.85)',
                            border: '1px solid rgba(255, 255, 255, 0.07)',
                            boxShadow: '0 30px 70px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 0 50px rgba(33, 117, 155, 0.02)',
                            backdropFilter: 'blur(30px)',
                            WebkitBackdropFilter: 'blur(30px)',
                            padding: '40px 30px',
                            borderRadius: '32px',
                            textAlign: 'left',
                            flex: '0 0 350px',
                            position: 'relative',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                        }
                    },
                        // 1. TOP HARDWARE ACCENT BAR (WordPress Corporate Blue Glow Strip)
                        React.createElement('div', {
                            style: {
                                position: 'absolute', top: '0', left: '40px', right: '40px', height: '3px',
                                background: 'linear-gradient(90deg, transparent, #21759b, #00f2fe, transparent)',
                                filter: 'drop-shadow(0 2px 8px rgba(33, 117, 155, 0.8))'
                            }
                        }),

                        React.createElement('div', null,
                            // TOP BADGE & BRAND ICON LAYER INLINE
                            React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '25px' } },
                                // Micro WordPress Icon Circle
                                React.createElement('div', {
                                    style: {
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        width: '50px', height: '50px', borderRadius: '14px',
                                        background: 'linear-gradient(135deg, rgba(33, 117, 155, 0.15), rgba(255,255,255,0.01))',
                                        border: '1px solid rgba(33, 117, 155, 0.3)',
                                        color: '#21759b', fontSize: '1.6rem', fontWeight: '900',
                                        textShadow: '0 0 12px rgba(33, 117, 155, 0.5)'
                                    }
                                }, 'W'),

                                // Tech Pill Badge
                                React.createElement('div', {
                                    className: 'card-badge',
                                    style: {
                                        background: 'rgba(255, 255, 255, 0.05)', color: 'rgba(255, 255, 255, 0.7)',
                                        padding: '4px 12px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: '800',
                                        letterSpacing: '1px', border: '1px solid rgba(255, 255, 255, 0.08)'
                                    }
                                }, 'CMS Architecture')
                            ),

                            // HEADING
                            React.createElement('h3', {
                                style: { color: '#fff', fontSize: '1.65rem', fontWeight: '900', letterSpacing: '-0.3px', marginBottom: '12px', lineHeight: '1.3' }
                            }, 'WordPress Base Web Development'),

                            // SHORT DESCRIPTION
                            React.createElement('p', {
                                style: { color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '30px' }
                            }, 'Professional, fully responsive, and easy-to-manage enterprise pipelines integrated with clean layouts.')
                        ),

                        // ULTRA-PREMIUM CONTRAST WHITE BUTTON
                        React.createElement('button', {
                            className: 'card-btn enterprise-action',
                            onClick: toWpPlans,
                            style: {
                                width: '100%', padding: '14px',
                                background: '#fff', color: '#0a0b12',
                                border: '1px solid #fff', borderRadius: '14px',
                                fontSize: '0.95rem', fontWeight: '800', cursor: 'pointer',
                                boxShadow: '0 12px 25px rgba(255, 255, 255, 0.08)',
                                transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                            }
                        },
                            'Get Started',
                            React.createElement('span', { style: { fontSize: '1rem', transform: 'translateY(-1px)' } }, '→')
                        )
                    ),

                    // RIGHT DETAIL BOX: HIGH-END CORPORATE TEXT PANEL
                    React.createElement('div', {
                        style: {
                            ...detailBoxStyle,
                            flex: '1 1 450px', // Responsive scaling
                            background: 'rgba(15, 17, 26, 0.5)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            borderRadius: '32px',
                            padding: '40px 35px',
                            color: 'rgba(255, 255, 255, 0.75)',
                            fontSize: '1rem',
                            lineHeight: '1.75',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            textAlign: 'left',
                            position: 'relative'
                        }
                    },
                        // Subtle Left-side micro accent indicator (adds premium structural polish)
                        React.createElement('div', {
                            style: {
                                position: 'absolute', left: '0', top: '40px', bottom: '40px', width: '2px',
                                background: 'linear-gradient(to bottom, #21759b, transparent)'
                            }
                        }),

                        'Our professional WordPress solutions are perfect for businesses looking for a powerful, flexible, and easily manageable Content Management System (CMS). We do more than just install standard themes; we craft custom, pixel-perfect designs, integrate advanced plugins like WooCommerce for e-commerce, and implement strict security protocols. We empower your team to easily update content on the fly while we handle the technical heavy lifting, ensuring your site remains fast, secure, and user-friendly.'
                    )
                ),

                // --- GROUP 3: SEO OPTIMIZATION ---
                React.createElement('div', {
                    style: {
                        ...groupStyle,
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '30px',
                        alignItems: 'stretch', // Card aur Detail Box ki height har resolution par unique aur identical rahegi
                        width: '100%',
                        maxWidth: '900px',
                        marginTop: '30px',
                        marginBottom: '30px'
                    },
                    className: 'service-row-group'
                },
                    // LEFT CARD: HYPER-PREMIUM SEO GROWTH ENGINE
                    React.createElement('div', {
                        className: 'service-card hyper-premium-card',
                        style: {
                            background: 'rgba(10, 11, 18, 0.85)',
                            border: '1px solid rgba(255, 255, 255, 0.07)',
                            boxShadow: '0 30px 70px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 0 50px rgba(0, 242, 254, 0.02)',
                            backdropFilter: 'blur(30px)',
                            WebkitBackdropFilter: 'blur(30px)',
                            padding: '40px 30px',
                            borderRadius: '32px',
                            textAlign: 'left',
                            flex: '0 0 350px',
                            position: 'relative',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                        }
                    },
                        // 1. TOP HARDWARE ACCENT BAR (Algorithmic Growth Emerald to Cyan Glow Strip)
                        React.createElement('div', {
                            style: {
                                position: 'absolute', top: '0', left: '40px', right: '40px', height: '3px',
                                background: 'linear-gradient(90deg, transparent, #10b981, #00f2fe, transparent)',
                                filter: 'drop-shadow(0 2px 8px rgba(16, 185, 129, 0.8))'
                            }
                        }),

                        React.createElement('div', null,
                            // TOP BADGE & BRAND ICON LAYER INLINE
                            React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '25px' } },
                                // Micro SEO Text Branding Frame
                                React.createElement('div', {
                                    style: {
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        width: '55px', height: '50px', borderRadius: '14px',
                                        background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.15), rgba(255,255,255,0.01))',
                                        border: '1px solid rgba(0, 242, 254, 0.3)',
                                        color: '#00f2fe', fontSize: '1rem', fontWeight: '900',
                                        letterSpacing: '0.5px', textShadow: '0 0 12px rgba(0, 242, 254, 0.5)'
                                    }
                                }, 'SEO'),

                                // Micro Growth Pill Badge with active green neon dot
                                React.createElement('div', {
                                    style: {
                                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                                        background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)',
                                        padding: '5px 12px', borderRadius: '12px'
                                    }
                                },
                                    React.createElement('span', { style: { width: '6px', height: '6px', backgroundColor: '#10b981', borderRadius: '50%', boxShadow: '0 0 6px #10b981' } }),
                                    React.createElement('span', { style: { color: '#10b981', fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.8px', textTransform: 'uppercase' } }, 'Growth')
                                )
                            ),

                            // HEADING
                            React.createElement('h3', {
                                style: { color: '#fff', fontSize: '1.65rem', fontWeight: '900', letterSpacing: '-0.3px', marginBottom: '12px', lineHeight: '1.3' }
                            }, 'Website SEO Optimization'),

                            // SHORT DESCRIPTION
                            React.createElement('p', {
                                style: { color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '30px' }
                            }, 'Boost your website ranking on Google with advanced on-page SEO, technical audits, speed optimization, and keyword strategy.')
                        ),

                        // ULTRA-PREMIUM HIGH-CONTRAST SOLID WHITE ACTION BUTTON
                        React.createElement('button', {
                            className: 'card-btn enterprise-action',
                            onClick: toSeoPlans,
                            style: {
                                width: '100%', padding: '14px',
                                background: '#fff', color: '#0a0b12',
                                border: '1px solid #fff', borderRadius: '14px',
                                fontSize: '0.95rem', fontWeight: '800', cursor: 'pointer',
                                boxShadow: '0 12px 25px rgba(255, 255, 255, 0.08)',
                                transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                            }
                        },
                            'Get Started',
                            React.createElement('span', { style: { fontSize: '1rem', transform: 'translateY(-1px)' } }, '→')
                        )
                    ),

                    // RIGHT DETAIL BOX: INSULATED GLASS COMPARTMENT
                    React.createElement('div', {
                        style: {
                            ...detailBoxStyle,
                            flex: '1 1 450px', // Asymmetric grid scaling
                            background: 'rgba(15, 17, 26, 0.5)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            borderRadius: '32px',
                            padding: '40px 35px',
                            color: 'rgba(255, 255, 255, 0.75)',
                            fontSize: '1rem',
                            lineHeight: '1.75',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            textAlign: 'left',
                            position: 'relative'
                        }
                    },
                        // Subtle vertical vector border on the left inner edge
                        React.createElement('div', {
                            style: {
                                position: 'absolute', left: '0', top: '40px', bottom: '40px', width: '2px',
                                background: 'linear-gradient(to bottom, #10b981, transparent)'
                            }
                        }),

                        'A stunning website is only effective if your target audience can actually find it. Our comprehensive SEO strategies are strictly data-driven and results-oriented. We conduct deep technical SEO audits, extensive keyword research, strategic on-page optimization, and authoritative backlink building. Our primary goal is to rank your digital assets on the first page of Google, driving high-quality organic traffic, enhancing your brand\'s digital footprint, and significantly increasing your conversion rates.'
                    )
                ),

                // --- GROUP 4: MONETIZATION & ADS ---
                React.createElement('div', {
                    style: {
                        ...groupStyle,
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '30px',
                        alignItems: 'stretch', // Ensures unified responsive heights between both blocks
                        width: '100%',
                        maxWidth: '900px',
                        marginTop: '30px',
                        marginBottom: '30px'
                    },
                    className: 'service-row-group'
                },
                    // LEFT CARD: HYPER-PREMIUM MONETIZATION ENGINE
                    React.createElement('div', {
                        className: 'service-card hyper-premium-card monetization-stream',
                        style: {
                            background: 'rgba(10, 11, 18, 0.85)',
                            border: '1px solid rgba(255, 255, 255, 0.07)',
                            boxShadow: '0 30px 70px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 0 50px rgba(250, 204, 21, 0.02)',
                            backdropFilter: 'blur(30px)',
                            WebkitBackdropFilter: 'blur(30px)',
                            padding: '40px 30px',
                            borderRadius: '32px',
                            textAlign: 'left',
                            flex: '0 0 350px',
                            position: 'relative',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                        }
                    },
                        // 1. TOP HARDWARE ACCENT BAR (Liquid Gold to Cyber Cyan Monetization Strip)
                        React.createElement('div', {
                            style: {
                                position: 'absolute', top: '0', left: '40px', right: '40px', height: '3px',
                                background: 'linear-gradient(90deg, transparent, #faccc88, #4facfe, transparent)', // Gold to Cyan gradient
                                background: 'linear-gradient(90deg, transparent, #eab308, #00f2fe, transparent)',
                                filter: 'drop-shadow(0 2px 8px rgba(234, 179, 8, 0.8))'
                            }
                        }),

                        React.createElement('div', null,
                            // TOP BADGE & BRAND ICON LAYER INLINE
                            React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '25px' } },
                                // Micro Currency/Revenue Custom Icon Box
                                React.createElement('div', {
                                    style: {
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        width: '50px', height: '50px', borderRadius: '14px',
                                        background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.15), rgba(255,255,255,0.01))',
                                        border: '1px solid rgba(234, 179, 8, 0.3)',
                                        color: '#eab308', fontSize: '1.2rem', fontWeight: '900',
                                        letterSpacing: '1px', textShadow: '0 0 12px rgba(234, 179, 8, 0.5)'
                                    }
                                }, '$$$'),

                                // Micro Earn Pill Badge with an active gold neon blinking dot
                                React.createElement('div', {
                                    style: {
                                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                                        background: 'rgba(234, 179, 8, 0.08)', border: '1px solid rgba(234, 179, 8, 0.2)',
                                        padding: '5px 12px', borderRadius: '12px'
                                    }
                                },
                                    React.createElement('span', { style: { width: '6px', height: '6px', backgroundColor: '#eab308', borderRadius: '50%', boxShadow: '0 0 6px #eab308' } }),
                                    React.createElement('span', { style: { color: '#eab308', fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.8px', textTransform: 'uppercase' } }, 'Earn')
                                )
                            ),

                            // HEADING
                            React.createElement('h3', {
                                style: { color: '#fff', fontSize: '1.65rem', fontWeight: '900', letterSpacing: '-0.3px', marginBottom: '12px', lineHeight: '1.3' }
                            }, 'Placing Ads on Website'),

                            // SHORT DESCRIPTION
                            React.createElement('p', {
                                style: { color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '30px' }
                            }, 'Monetize your web traffic setup with AdSense, Adsterra, or Monetag. High-revenue ad placements without ruining user experience.')
                        ),

                        // ULTRA-PREMIUM HIGH-CONTRAST SOLID WHITE ACTION BUTTON
                        React.createElement('button', {
                            className: 'card-btn enterprise-action',
                            onClick: toAdsPlans,
                            style: {
                                width: '100%', padding: '14px',
                                background: '#fff', color: '#0a0b12',
                                border: '1px solid #fff', borderRadius: '14px',
                                fontSize: '0.95rem', fontWeight: '800', cursor: 'pointer',
                                boxShadow: '0 12px 25px rgba(255, 255, 255, 0.08)',
                                transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                            }
                        },
                            'Get Started',
                            React.createElement('span', { style: { fontSize: '1rem', transform: 'translateY(-1px)' } }, '→')
                        )
                    ),

                    // RIGHT DETAIL BOX: MONETIZATION GLASS CONTAINER
                    React.createElement('div', {
                        style: {
                            ...detailBoxStyle,
                            flex: '1 1 450px', // Fluid scale matrix
                            background: 'rgba(15, 17, 26, 0.5)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            borderRadius: '32px',
                            padding: '40px 35px',
                            color: 'rgba(255, 255, 255, 0.75)',
                            fontSize: '1rem',
                            lineHeight: '1.75',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            textAlign: 'left',
                            position: 'relative'
                        }
                    },
                        // Subtle gold-tinted vertical architectural border on the left inner edge
                        React.createElement('div', {
                            style: {
                                position: 'absolute', left: '0', top: '40px', bottom: '40px', width: '2px',
                                background: 'linear-gradient(to bottom, #eab308, transparent)'
                            }
                        }),

                        'Transform your daily website traffic into a consistent and highly lucrative revenue stream. We expertly manage the integration and optimization of top-tier ad networks such as Google AdSense, Adsterra, Advertica, and Monetag. Our strategic ad placements are meticulously designed to maximize your Click-Through Rates (CTR) and overall revenue, all while maintaining a clean, uninterrupted user experience that keeps your visitors engaged and your page loading speeds lightning fast.'
                    )
                )
            )
        );
    } else if (currentPage === 'plans') {
        // ✨ NEW DESIGN: Modern Grid Pricing Table (Inspired by image_db1ba2.png)
        mainElement = React.createElement('main', {
            style: { padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', color: '#fff', fontFamily: "'Inter', sans-serif" }
        },
            // Back Button
            React.createElement('button', {
                className: 'card-btn',
                onClick: toServices, // Yeh aapko direct Services wale main page/state per le jayega
                onMouseEnter: (e) => {
                    e.target.style.background = 'rgba(255,255,255,0.05)';
                    e.target.style.transform = 'translateY(-2px)';
                },
                onMouseLeave: (e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.transform = 'translateY(0)';
                },
                style: {
                    display: 'block',
                    margin: '0 auto 30px auto',
                    padding: '10px 20px',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'transparent',
                    color: '#fff',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                }
            }, '← Back to Services'),

            // Headings
            // 👑 PREMIUM BORDERED HEADING BADGE
            React.createElement('div', {
    style: {
        display: 'flex',                             // 'table' se 'flex' kiya takay screen size ke mutabiq adapt ho sake
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0 auto 15px',                       // Margin-bottom thoda adjust kiya mobile spacing ke liye
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01))',
        backdropFilter: 'blur(15px)', 
        WebkitBackdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 255, 255, 0.12)', 
        borderRadius: '24px', 
        padding: '12px 24px',                        // Padding mobile ke liye thodi kam ki
        width: 'fit-content',
        maxWidth: '92%',                             // Card ko mobile screen ke andar wrap rakhega
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        boxSizing: 'border-box'
    }
},
    React.createElement('h2', {
        style: {
            display: 'inline-block',
            background: 'linear-gradient(45deg, #00f2fe, #ff0080)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            WebkitTextFillColor: 'transparent',
            margin: '0',
            fontSize: 'clamp(1.3rem, 5vw, 2.5rem)',  // Mobile par automatically responsive scale down hoga
            fontWeight: '800',
            textAlign: 'center',
            whiteSpace: 'nowrap',                    // Text ko force karega ke ek hi line me clean dikhay
            filter: 'drop-shadow(0 4px 10px rgba(0, 242, 254, 0.3))'
        }
    }, 'Website Development Plans')
),
React.createElement('p', {
    style: { 
        textAlign: 'center', 
        color: 'rgba(255,255,255,0.6)', 
        marginBottom: '30px',                        // Mobile par gap 50px se kam kar ke 30px kiya takay scroll lamba na ho
        fontSize: 'clamp(0.95rem, 3.5vw, 1.1rem)',   // Sub-text ka size bhi mobile par automatic adjust hoga
        padding: '0 15px',                           // Sides se safe padding di hai
        maxWidth: '500px',
        margin: '0 auto 30px'
    }
}, 'Choose the best plan that fits your business needs.'),

            // Grid Container
            React.createElement('div', {
                style: { display: 'flex', flexWrap: 'wrap', gap: '30px', justifyContent: 'center', alignItems: 'stretch' }
            },

                // 📦 1st Card: Basic Plan
                React.createElement('div', {
                    style: { flex: '1 1 320px', maxWidth: '380px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '35px 25px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }
                },
                    React.createElement('div', null,
                        React.createElement('h3', { style: { fontSize: '1.3rem', color: 'rgba(255,255,255,0.7)', margin: '0 0 10px 0' } }, 'Basic Plan'),
                        React.createElement('div', { style: { display: 'flex', alignItems: 'baseline', gap: '5px', marginBottom: '25px' } },
                            React.createElement('span', { style: { fontSize: '2.2rem', fontWeight: '800', color: '#fff' } }, '50K'),
                            React.createElement('span', { style: { color: 'rgba(255,255,255,0.5)', fontSize: '1rem' } }, 'PKR / total')
                        ),
                        React.createElement('div', { style: { width: '100%', height: '1px', background: 'rgba(255,255,255,0.1)', marginBottom: '25px' } }),

                        // Features List
                        React.createElement('ul', { style: { listStyle: 'none', padding: '0', margin: '0', display: 'flex', flexDirection: 'column', gap: '16px' } },
                            React.createElement('li', { style: { display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)' } }, React.createElement('span', { style: { color: '#00f2fe', fontWeight: 'bold' } }, '✓'), 'Fast, clean custom static HTML/CSS/JS architecture engineered from scratch.'),
                            React.createElement('li', { style: { display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)' } }, React.createElement('span', { style: { color: '#00f2fe', fontWeight: 'bold' } }, '✓'), 'Fully responsive layouts customized for absolute fluid rendering on mobile & desktop.'),
                            React.createElement('li', { style: { display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)' } }, React.createElement('span', { style: { color: '#00f2fe', fontWeight: 'bold' } }, '✓'), 'Zero template bloat ensuring high speed and neat performance optimization.'),
                            React.createElement('li', { style: { display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)' } }, React.createElement('span', { style: { color: '#00f2fe', fontWeight: 'bold' } }, '✓'), 'Baseline setup & flawless deployment structure on modern cloud hosting pipelines.')
                        )
                    ),
                    React.createElement('button', {
                        className: 'card-btn',
                        style: { marginTop: '35px', width: '100%', padding: '14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
                        onClick: toContactForm('Basic Plan', '50K PKR')
                    }, 'Select Basic Plan')
                ),

                // 📦 2nd Card: Standard Plan (Highlighted Premium Center)
                React.createElement('div', {
                    style: { flex: '1 1 320px', maxWidth: '380px', background: 'rgba(0, 242, 254, 0.03)', border: '1px solid #00f2fe', borderRadius: '16px', padding: '35px 25px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 10px 30px rgba(0, 242, 254, 0.05)', position: 'relative' }
                },
                    // Popular Badge
                    React.createElement('div', { style: { position: 'absolute', top: '-15px', right: '25px', background: '#00f2fe', color: '#000', fontSize: '0.8rem', fontWeight: '700', padding: '4px 12px', borderRadius: '20px', textTransform: 'uppercase' } }, 'Best Value'),
                    React.createElement('div', null,
                        React.createElement('h3', { style: { fontSize: '1.3rem', color: '#00f2fe', margin: '0 0 10px 0', fontWeight: '700' } }, 'Standard Plan'),
                        React.createElement('div', { style: { display: 'flex', alignItems: 'baseline', gap: '5px', marginBottom: '25px' } },
                            React.createElement('span', { style: { fontSize: '2.2rem', fontWeight: '800', color: '#fff' } }, '100K'),
                            React.createElement('span', { style: { color: 'rgba(255,255,255,0.5)', fontSize: '1rem' } }, 'PKR / total')
                        ),
                        React.createElement('div', { style: { width: '100%', height: '1px', background: 'rgba(0, 242, 254, 0.2)', marginBottom: '25px' } }),

                        // Features List
                        React.createElement('ul', { style: { listStyle: 'none', padding: '0', margin: '0', display: 'flex', flexDirection: 'column', gap: '16px' } },
                            React.createElement('li', { style: { display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.9)' } }, React.createElement('span', { style: { color: '#00f2fe', fontWeight: 'bold' } }, '✓'), 'Completely dynamic multi-page custom platform designed for scaling businesses.'),
                            React.createElement('li', { style: { display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.9)' } }, React.createElement('span', { style: { color: '#00f2fe', fontWeight: 'bold' } }, '✓'), 'Seamless declarative frontend UI framework architectures for ultimate smoothness.'),
                            React.createElement('li', { style: { display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.9)' } }, React.createElement('span', { style: { color: '#00f2fe', fontWeight: 'bold' } }, '✓'), 'Lightweight live database cluster configurations (MongoDB Atlas integration).'),
                            React.createElement('li', { style: { display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.9)' } }, React.createElement('span', { style: { color: '#00f2fe', fontWeight: 'bold' } }, '✓'), 'Secure backend API routing handlers coupled with basic custom tracking structures.')
                        )
                    ),
                    React.createElement('button', {
                        className: 'card-btn',
                        style: { marginTop: '35px', width: '100%', padding: '14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', background: '#00f2fe', color: '#000', border: 'none' },
                        onClick: toContactForm('Standard Plan', '100K PKR')
                    }, 'Select Standard Plan')
                ),

                // 📦 3rd Card: Premium Plan
                React.createElement('div', {
                    style: { flex: '1 1 320px', maxWidth: '380px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '35px 25px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }
                },
                    React.createElement('div', null,
                        React.createElement('h3', { style: { fontSize: '1.3rem', color: 'rgba(255,255,255,0.7)', margin: '0 0 10px 0' } }, 'Premium Plan'),
                        React.createElement('div', { style: { display: 'flex', alignItems: 'baseline', gap: '5px', marginBottom: '25px' } },
                            React.createElement('span', { style: { fontSize: '2.2rem', fontWeight: '800', color: '#fff' } }, '200K'),
                            React.createElement('span', { style: { color: 'rgba(255,255,255,0.5)', fontSize: '1rem' } }, 'PKR / total')
                        ),
                        React.createElement('div', { style: { width: '100%', height: '1px', background: 'rgba(255,255,255,0.1)', marginBottom: '25px' } }),

                        // Features List
                        React.createElement('ul', { style: { listStyle: 'none', padding: '0', margin: '0', display: 'flex', flexDirection: 'column', gap: '16px' } },
                            React.createElement('li', { style: { display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)' } }, React.createElement('span', { style: { color: '#ff0080', fontWeight: 'bold' } }, '✓'), 'Elite, enterprise full-stack suites modeled around highly scalable platforms.'),
                            React.createElement('li', { style: { display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)' } }, React.createElement('span', { style: { color: '#ff0080', fontWeight: 'bold' } }, '✓'), 'Complex cloud system setups (Render/Vercel pipelines) with extreme runtime configurations.'),
                            React.createElement('li', { style: { display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)' } }, React.createElement('span', { style: { color: '#ff0080', fontWeight: 'bold' } }, '✓'), 'Multi-layered data route firewalls combined with custom database structures.'),
                            React.createElement('li', { style: { display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)' } }, React.createElement('span', { style: { color: '#ff0080', fontWeight: 'bold' } }, '✓'), 'Advanced core script optimization and intricate programmatic search indexing tracking.')
                        )
                    ),
                    React.createElement('button', {
                        className: 'card-btn',
                        style: { marginTop: '35px', width: '100%', padding: '14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
                        onClick: toContactForm('Premium Plan', '200K PKR')
                    }, 'Select Premium Plan')
                ), // <-- Ye aapke existing Website Development Grid Container ka closing bracket hai
                // ✨ UPGRADED DESIGN: Modern Grid Pricing Table for Website Development Plans
                mainElement = React.createElement('main', {
                    style: { padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', color: '#fff', fontFamily: "'Inter', sans-serif" }
                },


                    // ✨ UPGRADED SECTION: Deep Dive Detailed Breakdown (Added below cards for Web Dev)
                    React.createElement('div', {
                        style: { marginTop: '60px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '40px' }
                    },
                        React.createElement('h3', {
                            style: { fontSize: '1.8rem', fontWeight: '700', marginBottom: '30px', textAlign: 'center', color: '#00f2fe' }
                        }, 'Comprehensive Plan Breakdown & Strategy'),

                        React.createElement('div', {
                            style: { display: 'flex', flexDirection: 'column', gap: '30px' }
                        },
                            // Detail Box 1: Basic Web Dev Plan
                            React.createElement('div', {
                                style: { background: 'rgba(255, 255, 255, 0.01)', padding: '25px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }
                            },
                                React.createElement('h4', { style: { fontSize: '1.2rem', color: '#fff', marginBottom: '10px', fontWeight: '600' } }, '01 / Basic Architecture — Core Strategic Breakdown'),
                                React.createElement('p', { style: { color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.6', fontSize: '0.95rem' } },
                                    'The Basic Plan is engineered specifically for startups, portfolios, and informational sites looking to launch a fast frontend presentation layer. We avoid bloated drag-and-drop templates, coding the semantic layout using vanilla HTML/CSS/JS configurations. By writing clean layouts from the ground up, we minimize script weight and runtime layout shifts, ensuring crisp initial loading alignment across all mobile and modern desktop nodes. Your site deploys immediately onto global cloud hosting nodes with production-ready asset caching pipelines to maintain absolute baseline stability.'
                                )
                            ),

                            // Detail Box 2: Standard Full-Stack Plan
                            React.createElement('div', {
                                style: { background: 'rgba(0, 242, 254, 0.02)', padding: '25px', borderRadius: '12px', border: '1px solid rgba(0, 242, 254, 0.15)' }
                            },
                                React.createElement('h4', { style: { fontSize: '1.2rem', color: '#00f2fe', marginBottom: '10px', fontWeight: '600' } }, '02 / Standard Plan — Dynamic Full-Stack Integration'),
                                React.createElement('p', { style: { color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.6', fontSize: '0.95rem' } },
                                    'Designed for scaling digital platforms and modern businesses, the Standard Plan targets interactive UI components using declarative framework logic. We wire this frontend interface directly to structured database architectures (such as MongoDB Atlas dynamic clusters) and clean backend routing nodes. This enables persistent user state synchronization, form captures, and dynamic data delivery on demand. All routes undergo structured API security checks, maintaining ultra-smooth rendering speeds and dynamic flexibility without hitting performance boundaries.'
                                )
                            ),

                            // Detail Box 3: Premium Scaling System
                            React.createElement('div', {
                                style: { background: 'rgba(255, 255, 255, 0.01)', padding: '25px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }
                            },
                                React.createElement('h4', { style: { fontSize: '1.2rem', color: '#fff', marginBottom: '10px', fontWeight: '600' } }, '03 / Premium Plan — High Scale Enterprise Engine'),
                                React.createElement('p', { style: { color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.6', fontSize: '0.95rem' } },
                                    'The Premium Plan produces a serverless ecosystem optimized for massive computational pipelines and intense user loads. We manage your full-stack deployment setups through continuous integration routines mapped directly onto edge platforms like Vercel or Render. Security structures implement multi-layered route filters and strong schema isolated fields to completely block scripting attacks. This comprehensive stack is monitored by custom log monitors and advanced analytics handlers, forcing immediate bot indexing and providing the infrastructure needed for large-scale application scaling.'
                                )
                            )
                        )
                    )
                ),

                // ✨ ENTERPRISE LAYER: Deep Dive Breakdown Sections for Web Development Plans
                React.createElement('div', {
                    style: { marginTop: '80px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '60px' }
                },
                    React.createElement('h2', {
                        style: { fontSize: '2.2rem', fontWeight: '800', marginBottom: '50px', textAlign: 'center', background: 'linear-gradient(135deg, #fff, #00f2fe)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }
                    }, 'Deep Dive Technical Architecture'),

                    React.createElement('div', {
                        style: { display: 'flex', flexDirection: 'column', gap: '80px' }
                    },

                        // 🎯 SECTION 1: BASIC WEB DEVELOPMENT PLAN EXTENDED
                        React.createElement('div', {
                            style: { display: 'flex', flexWrap: 'wrap', gap: '40px', alignItems: 'center' }
                        },
                            React.createElement('div', { style: { flex: '1 1 450px' } },
                                React.createElement('div', { style: { color: '#00f2fe', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '2px', marginBottom: '10px' } }, 'Phase 01 / Frontend Core'),
                                React.createElement('h3', { style: { fontSize: '1.7rem', fontWeight: '700', color: '#fff', marginBottom: '20px' } }, 'Basic Plan: Vanilla Architecture & Mobile Responsiveness'),
                                React.createElement('p', { style: { color: 'rgba(255, 255, 255, 0.65)', lineHeight: '1.7', fontSize: '0.98rem', marginBottom: '15px' } },
                                    'Our Basic Plan bypasses generic template engines to deliver a website built entirely from scratch using clean vanilla HTML, CSS, and lightweight JS. This eliminates hidden framework overhead and page bloat, ensuring that initial paint times stay blazing fast.'
                                ),
                                React.createElement('p', { style: { color: 'rgba(255, 255, 255, 0.65)', lineHeight: '1.7', fontSize: '0.98rem' } },
                                    'We integrate strict CSS flexbox and grid scaling parameters to ensure fluid layout reflows across high-density desktop screens down to modern mobile viewports. Deployment is integrated with automated hosting pipelines for rock-solid stability.'
                                )
                            ),
                            React.createElement('div', {
                                style: { flex: '1 1 350px', maxWidth: '500px', background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }
                            },
                                React.createElement('img', {
                                    src: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=600&q=80',
                                    alt: 'Frontend UI Coding Showcase',
                                    style: { width: '100%', height: 'auto', borderRadius: '12px', opacity: '0.85', display: 'block' }
                                }),
                                React.createElement('div', { style: { fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '10px' } }, 'Fig 1.1: Custom UI node profiling for absolute frontend fluid rendering.')
                            )
                        ),

                        // ⚡ SECTION 2: STANDARD WEB DEVELOPMENT PLAN EXTENDED
                        React.createElement('div', {
                            style: { display: 'flex', flexWrap: 'wrap-reverse', gap: '40px', alignItems: 'center', background: 'linear-gradient(90deg, rgba(0, 242, 254, 0.02), transparent)', padding: '30px', borderRadius: '24px', borderLeft: '3px solid #00f2fe' }
                        },
                            React.createElement('div', {
                                style: { flex: '1 1 350px', maxWidth: '500px', background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }
                            },
                                React.createElement('img', {
                                    src: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
                                    alt: 'Database and API Cluster Management',
                                    style: { width: '100%', height: 'auto', borderRadius: '12px', opacity: '0.85', display: 'block' }
                                }),
                                React.createElement('div', { style: { fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '10px' } }, 'Fig 2.1: Live cluster routing and synchronous database schema mapping.')
                            ),
                            React.createElement('div', { style: { flex: '1 1 450px' } },
                                React.createElement('div', { style: { color: '#00f2fe', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '2px', marginBottom: '10px' } }, 'Phase 02 / Full-Stack Integration'),
                                React.createElement('h3', { style: { fontSize: '1.7rem', fontWeight: '700', color: '#fff', marginBottom: '20px' } }, 'Standard Plan: Declarative UI Frameworks & Live Databases'),
                                React.createElement('p', { style: { color: 'rgba(255, 255, 255, 0.65)', lineHeight: '1.7', fontSize: '0.98rem', marginBottom: '15px' } },
                                    'The Standard Plan handles business scale expansion by implementing declarative modular components. This system handles complex UI rendering changes on the fly with seamless runtime transitions.'
                                ),
                                React.createElement('p', { style: { color: 'rgba(255, 255, 255, 0.65)', lineHeight: '1.7', fontSize: '0.98rem' } },
                                    'We provision lightweight database storage systems (like MongoDB Atlas) to securely capture user interactions and state changes. Custom API endpoints process your internal server operations cleanly, laying out a solid path for scalable product growth.'
                                )
                            )
                        ),

                        // 💎 SECTION 3: PREMIUM WEB DEVELOPMENT PLAN EXTENDED
                        React.createElement('div', {
                            style: { display: 'flex', flexWrap: 'wrap', gap: '40px', alignItems: 'center' }
                        },
                            React.createElement('div', { style: { flex: '1 1 450px' } },
                                React.createElement('div', { style: { color: '#ff0080', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '2px', marginBottom: '10px' } }, 'Phase 03 / Cloud Scalability'),
                                React.createElement('h3', { style: { fontSize: '1.7rem', fontWeight: '700', color: '#fff', marginBottom: '20px' } }, 'Premium Plan: Enterprise Cloud Architecture & Optimization'),
                                React.createElement('p', { style: { color: 'rgba(255, 255, 255, 0.65)', lineHeight: '1.7', fontSize: '0.98rem', marginBottom: '15px' } },
                                    'Designed for high-traffic enterprise demands, the Premium Plan delivers a serverless production environment. Your code is optimized for global edge deployments on frameworks like Vercel or Render pipelines, bringing server lag down to near-zero.'
                                ),
                                React.createElement('p', { style: { color: 'rgba(255, 255, 255, 0.65)', lineHeight: '1.7', fontSize: '0.98rem' } },
                                    'Security parameters include custom route isolation firewalls and advanced schema protection models. Every core system module gets audited for strict compliance scripts, ensuring seamless integration with data tracking pipelines and search engine discovery bots.'
                                )
                            ),
                            React.createElement('div', {
                                style: { flex: '1 1 350px', maxWidth: '500px', background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }
                            },
                                React.createElement('img', {
                                    src: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
                                    alt: 'Enterprise Server Metrics',
                                    style: { width: '100%', height: 'auto', borderRadius: '12px', opacity: '0.85', display: 'block' }
                                }),
                                React.createElement('div', { style: { fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '10px' } }, 'Fig 3.1: Serverless application monitoring and cloud runtime optimization dashboards.')
                            )
                        )

                    )
                ), // <-- Iske baad aapka main return element complete ho jayega

            )
        );
    } else if (currentPage === 'wp-plans') {
        // ✨ UPGRADED DESIGN: Modern Grid Pricing Table for WordPress Plans
        mainElement = React.createElement('main', {
            style: { padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', color: '#fff', fontFamily: "'Inter', sans-serif" }
        },
            // Back Butto   // 
            React.createElement('button', {
                className: 'card-btn',
                onClick: toServices, // Yeh aapko direct Services wale main page/state per le jayega
                onMouseEnter: (e) => {
                    e.target.style.background = 'rgba(255,255,255,0.05)';
                    e.target.style.transform = 'translateY(-2px)';
                },
                onMouseLeave: (e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.transform = 'translateY(0)';
                },
                style: {
                    display: 'block',
                    margin: '0 auto 30px auto',
                    padding: '10px 20px',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'transparent',
                    color: '#fff',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                }
            }, '← Back to Services'),

            // Headings
            // 👑 PREMIUM BORDERED HEADING BADGE
            React.createElement('div', {
    style: {
        display: 'flex',                             // 'table' se 'flex' kiya takay layout responsive handle ho sake
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0 auto 15px',                       // Mobile spacing ke liye margin-bottom adjust kiya
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01))',
        backdropFilter: 'blur(15px)', 
        WebkitBackdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 255, 255, 0.12)', 
        borderRadius: '24px', 
        padding: '12px 24px',                        // Padding sides se thodi kam ki mobile screen ke liye
        width: 'fit-content',
        maxWidth: '92%',                             // Container mobile screen edges ke andar hi rahega
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        boxSizing: 'border-box'
    }
},
    React.createElement('h2', {
        style: {
            display: 'inline-block',
            background: 'linear-gradient(45deg, #00f2fe, #ff0080)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            WebkitTextFillColor: 'transparent',
            margin: '0',
            fontSize: 'clamp(1.3rem, 5vw, 2.5rem)',  // Viewport width ke sath auto-scale down ho jayega
            fontWeight: '800',
            textAlign: 'center',
            whiteSpace: 'nowrap',                    // Heading text hamesha single line me safe rahega
            filter: 'drop-shadow(0 4px 10px rgba(0, 242, 254, 0.3))'
        }
    }, 'Wordpress Development Plans')
),
React.createElement('p', {
    style: { 
        textAlign: 'center', 
        color: 'rgba(255,255,255,0.6)', 
        fontSize: 'clamp(0.95rem, 3.5vw, 1.1rem)',   // Sub-text ka size bhi devices ke mutabiq fluid kiya
        padding: '0 15px',                           // Taki corners se text bilkul chipkay na
        maxWidth: '500px',
        margin: '0 auto 30px'                        // Bottom margin 50px se kam kar ke 30px kiya responsive height optimization ke liye
    }
}, 'Choose the perfect WordPress package for your business.'),

            // Grid Container
            React.createElement('div', {
                style: { display: 'flex', flexWrap: 'wrap', gap: '30px', justifyContent: 'center', alignItems: 'stretch' }
            },

                // 📦 1st Card: Basic WP Plan
                React.createElement('div', {
                    style: { flex: '1 1 320px', maxWidth: '380px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '35px 25px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }
                },
                    React.createElement('div', null,
                        React.createElement('h3', { style: { fontSize: '1.3rem', color: 'rgba(255,255,255,0.7)', margin: '0 0 10px 0' } }, 'Basic WP Plan'),
                        React.createElement('div', { style: { display: 'flex', alignItems: 'baseline', gap: '5px', marginBottom: '25px' } },
                            React.createElement('span', { style: { fontSize: '2.2rem', fontWeight: '800', color: '#fff' } }, '35K'),
                            React.createElement('span', { style: { color: 'rgba(255,255,255,0.5)', fontSize: '1rem' } }, 'PKR / total')
                        ),
                        React.createElement('div', { style: { width: '100%', height: '1px', background: 'rgba(255,255,255,0.1)', marginBottom: '25px' } }),

                        // Features List
                        React.createElement('ul', { style: { listStyle: 'none', padding: '0', margin: '0', display: 'flex', flexDirection: 'column', gap: '16px' } },
                            React.createElement('li', { style: { display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)' } }, React.createElement('span', { style: { color: '#21759b', fontWeight: 'bold' } }, '✓'), 'Essential WordPress installation with core framework setup.'),
                            React.createElement('li', { style: { display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)' } }, React.createElement('span', { style: { color: '#21759b', fontWeight: 'bold' } }, '✓'), 'Standard pre-built theme configuration tailored to your business niche.'),
                            React.createElement('li', { style: { display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)' } }, React.createElement('span', { style: { color: '#21759b', fontWeight: 'bold' } }, '✓'), 'Basic essential plugin integration for security and speed optimization.'),
                            React.createElement('li', { style: { display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)' } }, React.createElement('span', { style: { color: '#21759b', fontWeight: 'bold' } }, '✓'), 'Clean layout rendering setup on modern cloud or shared hosting systems.')
                        )
                    ),
                    React.createElement('button', {
                        className: 'card-btn',
                        style: { marginTop: '35px', width: '100%', padding: '14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
                        onClick: toContactForm('Basic WP Plan', '35K PKR')
                    }, 'Select Basic Plan')
                ),

                // 📦 2nd Card: Standard WP Plan (Highlighted Center)
                React.createElement('div', {
                    style: { flex: '1 1 320px', maxWidth: '380px', background: 'rgba(33, 117, 155, 0.04)', border: '1px solid #21759b', borderRadius: '16px', padding: '35px 25px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 10px 30px rgba(33, 117, 155, 0.08)', position: 'relative' }
                },
                    React.createElement('div', { style: { position: 'absolute', top: '-15px', right: '25px', background: '#21759b', color: '#fff', fontSize: '0.8rem', fontWeight: '700', padding: '4px 12px', borderRadius: '20px', textTransform: 'uppercase' } }, 'Best Value'),
                    React.createElement('div', null,
                        React.createElement('h3', { style: { fontSize: '1.3rem', color: '#21759b', margin: '0 0 10px 0', fontWeight: '700' } }, 'Standard WP Plan'),
                        React.createElement('div', { style: { display: 'flex', alignItems: 'baseline', gap: '5px', marginBottom: '25px' } },
                            React.createElement('span', { style: { fontSize: '2.2rem', fontWeight: '800', color: '#fff' } }, '75K'),
                            React.createElement('span', { style: { color: 'rgba(255,255,255,0.5)', fontSize: '1rem' } }, 'PKR / total')
                        ),
                        React.createElement('div', { style: { width: '100%', height: '1px', background: 'rgba(33, 117, 155, 0.2)', marginBottom: '25px' } }),

                        // Features List
                        React.createElement('ul', { style: { listStyle: 'none', padding: '0', margin: '0', display: 'flex', flexDirection: 'column', gap: '16px' } },
                            React.createElement('li', { style: { display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.9)' } }, React.createElement('span', { style: { color: '#21759b', fontWeight: 'bold' } }, '✓'), 'Custom dynamic multi-page design mapped on premium parent themes.'),
                            React.createElement('li', { style: { display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.9)' } }, React.createElement('span', { style: { color: '#21759b', fontWeight: 'bold' } }, '✓'), 'Advanced plugin suites integration for seamless UI animations and layouts.'),
                            React.createElement('li', { style: { display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.9)' } }, React.createElement('span', { style: { color: '#21759b', fontWeight: 'bold' } }, '✓'), 'Complete fluid responsive layout configurations for all desktop & mobile screen sizes.'),
                            React.createElement('li', { style: { display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.9)' } }, React.createElement('span', { style: { color: '#21759b', fontWeight: 'bold' } }, '✓'), 'Integrated contact nodes, automated lead capturing mechanisms, and site analytics tracking.')
                        )
                    ),
                    React.createElement('button', {
                        className: 'card-btn',
                        style: { marginTop: '35px', width: '100%', padding: '14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', background: '#21759b', color: '#fff', border: 'none' },
                        onClick: toContactForm('Standard WP Plan', '75K PKR')
                    }, 'Select Standard Plan')
                ),

                // 📦 3rd Card: Premium WP Plan
                React.createElement('div', {
                    style: { flex: '1 1 320px', maxWidth: '380px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '35px 25px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }
                },
                    React.createElement('div', null,
                        React.createElement('h3', { style: { fontSize: '1.3rem', color: 'rgba(255,255,255,0.7)', margin: '0 0 10px 0' } }, 'Premium WP Plan'),
                        React.createElement('div', { style: { display: 'flex', alignItems: 'baseline', gap: '5px', marginBottom: '25px' } },
                            React.createElement('span', { style: { fontSize: '2.2rem', fontWeight: '800', color: '#fff' } }, '150K'),
                            React.createElement('span', { style: { color: 'rgba(255,255,255,0.5)', fontSize: '1rem' } }, 'PKR / total')
                        ),
                        React.createElement('div', { style: { width: '100%', height: '1px', background: 'rgba(255,255,255,0.1)', marginBottom: '25px' } }),

                        // Features List
                        React.createElement('ul', { style: { listStyle: 'none', padding: '0', margin: '0', display: 'flex', flexDirection: 'column', gap: '16px' } },
                            React.createElement('li', { style: { display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)' } }, React.createElement('span', { style: { color: '#ff0080', fontWeight: 'bold' } }, '✓'), 'Full-featured WooCommerce structure modeled for high-volume E-commerce operations.'),
                            React.createElement('li', { style: { display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)' } }, React.createElement('span', { style: { color: '#ff0080', fontWeight: 'bold' } }, '✓'), 'Advanced programmatic SEO setup alongside strict multi-layered security firewalls.'),
                            React.createElement('li', { style: { display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)' } }, React.createElement('span', { style: { color: '#ff0080', fontWeight: 'bold' } }, '✓'), 'Premium custom cache engines for high performance and processing speed optimization.'),
                            React.createElement('li', { style: { display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)' } }, React.createElement('span', { style: { color: '#ff0080', fontWeight: 'bold' } }, '✓'), 'Dedicated enterprise infrastructure deployment support + elite tracking script integration.')
                        )
                    ),
                    React.createElement('button', {
                        className: 'card-btn',
                        style: { marginTop: '35px', width: '100%', padding: '14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
                        onClick: toContactForm('Premium WP Plan', '150K PKR')
                    }, 'Select Premium Plan')
                )

            ), // <-- Grid Container Ends Here

            // ✨ UPGRADED SECTION: Deep Dive Detailed Breakdown (Added below cards for WordPress)
            React.createElement('div', {
                style: { marginTop: '60px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '40px' }
            },
                React.createElement('h3', {
                    style: { fontSize: '1.8rem', fontWeight: '700', marginBottom: '30px', textAlign: 'center', color: '#21759b' }
                }, 'Comprehensive Plan Breakdown & Strategy'),

                React.createElement('div', {
                    style: { display: 'flex', flexDirection: 'column', gap: '30px' }
                },
                    // Detail Box 1: Basic WP Plan
                    React.createElement('div', {
                        style: { background: 'rgba(255, 255, 255, 0.01)', padding: '25px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }
                    },
                        React.createElement('h4', { style: { fontSize: '1.2rem', color: '#fff', marginBottom: '10px', fontWeight: '600' } }, '01 / Basic WP Plan — Core Strategic Breakdown'),
                        React.createElement('p', { style: { color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.6', fontSize: '0.95rem' } },
                            'The Basic WP Plan is engineered specifically for businesses, content creators, and startups looking to build a clean, reliable CMS base. We skip heavy pre-built premium bundles that clutter databases, opting instead for custom asset management structures over the WordPress open-source core. By doing clean script configurations, we remove messy background render blocks to keep initial loading times ultra-fast on standard hosting networks. Basic security routines and core policy setups are fully configured to secure your custom domain structure right from day one.'
                        )
                    ),

                    // Detail Box 2: Standard WP Plan
                    React.createElement('div', {
                        style: { background: 'rgba(33, 117, 155, 0.02)', padding: '25px', borderRadius: '12px', border: '1px solid rgba(33, 117, 155, 0.15)' }
                    },
                        React.createElement('h4', { style: { fontSize: '1.2rem', color: '#21759b', marginBottom: '10px', fontWeight: '600' } }, '02 / Standard WP Plan — High Performance Theme Customization'),
                        React.createElement('p', { style: { color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.6', fontSize: '0.95rem' } },
                            'Designed for established setups and evolving brands, the Standard Plan handles multi-page design systems using highly responsive block structures. We bypass slow builder plug-ins by relying directly on specialized core framework hooks and filters to execute clean animations and elements. Every section handles native responsive data flow smoothly across mobile, tablet, and widescreen systems. Plus, we wire production-ready forms, lead capture tools, and standard analytics scripts cleanly into your template layer without dragging down site metrics.'
                        )
                    ),

                    // Detail Box 3: Premium WP Plan
                    React.createElement('div', {
                        style: { background: 'rgba(255, 255, 255, 0.01)', padding: '25px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }
                    },
                        React.createElement('h4', { style: { fontSize: '1.2rem', color: '#fff', marginBottom: '10px', fontWeight: '600' } }, '03 / Premium WP Plan — Enterprise E-Commerce Engine'),
                        React.createElement('p', { style: { color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.6', fontSize: '0.95rem' } },
                            'The Premium Plan introduces a secure, transaction-heavy operational platform driven by high-volume WooCommerce architectures. We configure advanced transactional paths, programmatic metadata layouts, and strict endpoint validation models to easily process checkout actions under continuous multi-request strain. The setup comes fully equipped with server-side caching scripts (like Object Caching or Redis configurations) and dynamic multi-layered file walls to guard database records. This enterprise-level stack ensures immediate search crawler tracking and high cloud performance for intense transactional scaling.'
                        )
                    )
                )
            ),

            // 🛠️ TECHNICAL ARCHITECTURE BREAKDOWN (Deep Dive Technical Layer)
            React.createElement('div', {
                style: { marginTop: '80px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '60px' }
            },
                React.createElement('h2', {
                    style: { fontSize: '2.2rem', fontWeight: '800', marginBottom: '50px', textAlign: 'center', background: 'linear-gradient(135deg, #fff, #21759b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }
                }, 'Deep Dive Technical Architecture'),

                React.createElement('div', {
                    style: { display: 'flex', flexDirection: 'column', gap: '80px' }
                },

                    // Phase 01 Section
                    React.createElement('div', {
                        style: { display: 'flex', flexWrap: 'wrap', gap: '40px', alignItems: 'center' }
                    },
                        React.createElement('div', { style: { flex: '1 1 450px' } },
                            React.createElement('div', { style: { color: '#21759b', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '2px', marginBottom: '10px' } }, 'Phase 01 / Core Environment'),
                            React.createElement('h3', { style: { fontSize: '1.7rem', fontWeight: '700', color: '#fff', marginBottom: '20px' } }, 'Basic Plan: Core Framework & Lightweight Configuration'),
                            React.createElement('p', { style: { color: 'rgba(255, 255, 255, 0.65)', lineHeight: '1.7', fontSize: '0.98rem', marginBottom: '15px' } },
                                'The Basic WP Plan provisions a highly optimized instance of the clean WordPress open-source core. Instead of dropping heavy multi-purpose pre-built bundles that result in excessive database queries, we carefully streamline the template’s system dependencies.'
                            ),
                            React.createElement('p', { style: { color: 'rgba(255, 255, 255, 0.65)', lineHeight: '1.7', fontSize: '0.98rem' } },
                                'We enforce asset minimization guidelines and asset-loading conditions directly within the theme’s runtime configuration. This ensures that essential security and functional scripts load conditionally, maintaining structural integrity across shared server environments.'
                            )
                        ),
                        React.createElement('div', {
                            style: { flex: '1 1 350px', maxWidth: '500px', background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }
                        },
                            React.createElement('img', {
                                src: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&w=600&q=80',
                                alt: 'WordPress Theme Engineering Layout',
                                style: { width: '100%', height: 'auto', borderRadius: '12px', opacity: '0.85', display: 'block' }
                            }),
                            React.createElement('div', { style: { fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '10px' } }, 'Fig 1.1: Core theme system asset tracking and file hierarchy structures.')
                        )
                    ),

                    // Phase 02 Section
                    React.createElement('div', {
                        style: { display: 'flex', flexWrap: 'wrap-reverse', gap: '40px', alignItems: 'center', background: 'linear-gradient(90deg, rgba(33, 117, 155, 0.03), transparent)', padding: '30px', borderRadius: '24px', borderLeft: '3px solid #21759b' }
                    },
                        React.createElement('div', {
                            style: { flex: '1 1 350px', maxWidth: '500px', background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }
                        },
                            React.createElement('img', {
                                src: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80',
                                alt: 'Dynamic CMS Dashboard Customization',
                                style: { width: '100%', height: 'auto', borderRadius: '12px', opacity: '0.85', display: 'block' }
                            }),
                            React.createElement('div', { style: { fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '10px' } }, 'Fig 2.1: Custom block layouts and interface hook instrumentation maps.')
                        ),
                        React.createElement('div', { style: { flex: '1 1 450px' } },
                            React.createElement('div', { style: { color: '#21759b', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '2px', marginBottom: '10px' } }, 'Phase 02 / Advanced Hook Customization'),
                            React.createElement('h3', { style: { fontSize: '1.7rem', fontWeight: '700', color: '#fff', marginBottom: '20px' } }, 'Standard Plan: Premium Theme Engineering & Fluid UX'),
                            React.createElement('p', { style: { color: 'rgba(255, 255, 255, 0.65)', lineHeight: '1.7', fontSize: '0.98rem', marginBottom: '15px' } },
                                'The Standard WP Plan maps advanced modular logic onto clean parent themes. Rather than allowing bloated third-party page builders to slow your loading speeds, we use highly optimized block architectures to maintain responsive fluid scaling across all devices.'
                            ),
                            React.createElement('p', { style: { color: 'rgba(255, 255, 255, 0.65)', lineHeight: '1.7', fontSize: '0.98rem' } },
                                'By targeting custom core hooks and filters, we inject automated forms, secure lead capture nodes, and analytics event tags seamlessly. This approach maintains high Google Core Web Vitals rankings while preserving easy content control.'
                            )
                        )
                    ),

                    // Phase 03 Section
                    React.createElement('div', {
                        style: { display: 'flex', flexWrap: 'wrap', gap: '40px', alignItems: 'center' }
                    },
                        React.createElement('div', { style: { flex: '1 1 450px' } },
                            React.createElement('div', { style: { color: '#ff0080', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '2px', marginBottom: '10px' } }, 'Phase 03 / E-Commerce Scale'),
                            React.createElement('h3', { style: { fontSize: '1.7rem', fontWeight: '700', color: '#fff', marginBottom: '20px' } }, 'Premium Plan: WooCommerce Engine & Enterprise Caching'),
                            React.createElement('p', { style: { color: 'rgba(255, 255, 255, 0.65)', lineHeight: '1.7', fontSize: '0.98rem', marginBottom: '15px' } },
                                'Engineered directly for modern transactional workflows, the Premium WP Plan features a hardened WooCommerce architecture. We customize transactional endpoints and database schemas to manage complex user checkouts under heavy multi-request loads.'
                            ),
                            React.createElement('p', { style: { color: 'rgba(255, 255, 255, 0.65)', lineHeight: '1.7', fontSize: '0.98rem' } },
                                'To protect your site from vulnerabilities, we deploy server-side firewall layers and deep data caching structures (like Redis or Object Caching). This setup lowers your server response times and builds a high-performance, enterprise-ready digital platform.'
                            )
                        ),
                        React.createElement('div', {
                            style: { flex: '1 1 350px', maxWidth: '500px', background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }
                        },
                            React.createElement('img', {
                                src: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=600&q=80',
                                alt: 'Enterprise E-Commerce Server Tracking',
                                style: { width: '100%', height: 'auto', borderRadius: '12px', opacity: '0.85', display: 'block' }
                            }),
                            React.createElement('div', { style: { fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '10px' } }, 'Fig 3.1: Transaction data flow optimization and secure database firewall diagnostics.')
                        )
                    )

                )
            )
        );
    } else if (currentPage === 'seo-plans') {
        // ✨ UPGRADED DESIGN: Modern Grid Pricing Table for SEO Optimization Plans
        mainElement = React.createElement('main', {
            style: { padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', color: '#fff', fontFamily: "'Inter', sans-serif" }
        },
            // Back Button
            React.createElement('button', {
                className: 'card-btn',
                onClick: toServices, // Yeh aapko direct Services wale main page/state per le jayega
                onMouseEnter: (e) => {
                    e.target.style.background = 'rgba(255,255,255,0.05)';
                    e.target.style.transform = 'translateY(-2px)';
                },
                onMouseLeave: (e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.transform = 'translateY(0)';
                },
                style: {
                    display: 'block',
                    margin: '0 auto 30px auto',
                    padding: '10px 20px',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'transparent',
                    color: '#fff',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                }
            }, '← Back to Services'),

            // Headings
            // 👑 PREMIUM BORDERED HEADING BADGE
            React.createElement('div', {
    style: {
        display: 'flex',                             // 'table' se 'flex' kiya takay layout wrap aur shrink ho sake
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0 auto 15px',                       // Mobile spacing ke mutabiq bottom margin adjust kiya
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01))',
        backdropFilter: 'blur(15px)', 
        WebkitBackdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 255, 255, 0.12)', 
        borderRadius: '24px', 
        padding: '12px 24px',                        // Side padding mobile screen ke liye thodi optimal ki
        width: 'fit-content',
        maxWidth: '92%',                             // Container ko mobile screen ke edges ke andar secure rakhega
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        boxSizing: 'border-box'
    }
},
    React.createElement('h2', {
        style: {
            display: 'inline-block',
            background: 'linear-gradient(45deg, #00f2fe, #ff0080)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            WebkitTextFillColor: 'transparent',
            margin: '0',
            fontSize: 'clamp(1.3rem, 5vw, 2.5rem)',  // Viewport width ke mutabiq font auto-scale down hoga
            fontWeight: '800',
            textAlign: 'center',
            whiteSpace: 'nowrap',                    // Heading text break nahi hoga, hamesha ek line me rahega
            filter: 'drop-shadow(0 4px 10px rgba(0, 242, 254, 0.3))'
        }
    }, 'SEO Optimization Plans')
),
React.createElement('p', {
    style: { 
        textAlign: 'center', 
        color: 'rgba(255,255,255,0.6)', 
        fontSize: 'clamp(0.95rem, 3.5vw, 1.1rem)',   // Sub-text ka font size bhi modern fluid scale par chalega
        padding: '0 15px',                           // Taki small viewports par text side walls se touch na kare
        maxWidth: '500px',
        margin: '0 auto 30px'                        // Space adjust ki takay mobile par faltu blank scrolling na ho
    }
}, 'Choose the best SEO package to grow your online presence.'),

            // Grid Container
            React.createElement('div', {
                style: { display: 'flex', flexWrap: 'wrap', gap: '30px', justifyContent: 'center', alignItems: 'stretch' }
            },

                // 📦 1st Card: Basic SEO Plan
                React.createElement('div', {
                    style: { flex: '1 1 320px', maxWidth: '380px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '35px 25px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }
                },
                    React.createElement('div', null,
                        React.createElement('h3', { style: { fontSize: '1.3rem', color: 'rgba(255,255,255,0.7)', margin: '0 0 10px 0' } }, 'Basic SEO Plan'),
                        React.createElement('div', { style: { display: 'flex', alignItems: 'baseline', gap: '5px', marginBottom: '25px' } },
                            React.createElement('span', { style: { fontSize: '2.2rem', fontWeight: '800', color: '#fff' } }, '15K'),
                            React.createElement('span', { style: { color: 'rgba(255,255,255,0.5)', fontSize: '1rem' } }, 'PKR / total')
                        ),
                        React.createElement('div', { style: { width: '100%', height: '1px', background: 'rgba(255,255,255,0.1)', marginBottom: '25px' } }),

                        // Features List
                        React.createElement('ul', { style: { listStyle: 'none', padding: '0', margin: '0', display: 'flex', flexDirection: 'column', gap: '16px' } },
                            React.createElement('li', { style: { display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)' } }, React.createElement('span', { style: { color: '#00f2fe', fontWeight: 'bold' } }, '✓'), 'Comprehensive On-Page SEO optimization for primary landing routes.'),
                            React.createElement('li', { style: { display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)' } }, React.createElement('span', { style: { color: '#00f2fe', fontWeight: 'bold' } }, '✓'), 'Targeted niche keyword research to index core business search phrases.'),
                            React.createElement('li', { style: { display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)' } }, React.createElement('span', { style: { color: '#00f2fe', fontWeight: 'bold' } }, '✓'), 'Precise Meta Title & Meta Description tag structuring for ranking smoothness.'),
                            React.createElement('li', { style: { display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)' } }, React.createElement('span', { style: { color: '#00f2fe', fontWeight: 'bold' } }, '✓'), 'Google Search Console setup and verification mapping.')
                        )
                    ),
                    React.createElement('button', {
                        className: 'card-btn',
                        style: { marginTop: '35px', width: '100%', padding: '14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
                        onClick: toContactForm('Basic SEO Plan', '15K PKR')
                    }, 'Select Basic Plan')
                ),

                // 📦 2nd Card: Standard SEO Plan (Highlighted Center)
                React.createElement('div', {
                    style: { flex: '1 1 320px', maxWidth: '380px', background: 'rgba(0, 242, 254, 0.03)', border: '1px solid #00f2fe', borderRadius: '16px', padding: '35px 25px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 10px 30px rgba(0, 242, 254, 0.05)', position: 'relative' }
                },
                    React.createElement('div', { style: { position: 'absolute', top: '-15px', right: '25px', background: '#00f2fe', color: '#000', fontSize: '0.8rem', fontWeight: '700', padding: '4px 12px', borderRadius: '20px', textTransform: 'uppercase' } }, 'Best Value'),
                    React.createElement('div', null,
                        React.createElement('h3', { style: { fontSize: '1.3rem', color: '#00f2fe', margin: '0 0 10px 0', fontWeight: '700' } }, 'Standard SEO Plan'),
                        React.createElement('div', { style: { display: 'flex', alignItems: 'baseline', gap: '5px', marginBottom: '25px' } },
                            React.createElement('span', { style: { fontSize: '2.2rem', fontWeight: '800', color: '#fff' } }, '30K'),
                            React.createElement('span', { style: { color: 'rgba(255,255,255,0.5)', fontSize: '1rem' } }, 'PKR / total')
                        ),
                        React.createElement('div', { style: { width: '100%', height: '1px', background: 'rgba(0, 242, 254, 0.2)', marginBottom: '25px' } }),

                        // Features List
                        React.createElement('ul', { style: { listStyle: 'none', padding: '0', margin: '0', display: 'flex', flexDirection: 'column', gap: '16px' } },
                            React.createElement('li', { style: { display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.9)' } }, React.createElement('span', { style: { color: '#00f2fe', fontWeight: 'bold' } }, '✓'), 'Full On-Page optimization + high-intent Off-Page growth networks.'),
                            React.createElement('li', { style: { display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.9)' } }, React.createElement('span', { style: { color: '#00f2fe', fontWeight: 'bold' } }, '✓'), 'Strategic high-authority backlink profiling and outreach building.'),
                            React.createElement('li', { style: { display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.9)' } }, React.createElement('span', { style: { color: '#00f2fe', fontWeight: 'bold' } }, '✓'), 'Competitor ranking audits coupled with advanced keyword expansion plans.'),
                            React.createElement('li', { style: { display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.9)' } }, React.createElement('span', { style: { color: '#00f2fe', fontWeight: 'bold' } }, '✓'), 'Transparent monthly processing reports tracking performance & search positions.')
                        )
                    ),
                    React.createElement('button', {
                        className: 'card-btn',
                        style: { marginTop: '35px', width: '100%', padding: '14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', background: '#00f2fe', color: '#000', border: 'none' },
                        onClick: toContactForm('Standard SEO Plan', '30K PKR')
                    }, 'Select Standard Plan')
                ),

                // 📦 3rd Card: Premium SEO Plan
                React.createElement('div', {
                    style: { flex: '1 1 320px', maxWidth: '380px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '35px 25px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }
                },
                    React.createElement('div', null,
                        React.createElement('h3', { style: { fontSize: '1.3rem', color: 'rgba(255,255,255,0.7)', margin: '0 0 10px 0' } }, 'Premium SEO Plan'),
                        React.createElement('div', { style: { display: 'flex', alignItems: 'baseline', gap: '5px', marginBottom: '25px' } },
                            React.createElement('span', { style: { fontSize: '2.2rem', fontWeight: '800', color: '#fff' } }, '50K'),
                            React.createElement('span', { style: { color: 'rgba(255,255,255,0.5)', fontSize: '1rem' } }, 'PKR / total')
                        ),
                        React.createElement('div', { style: { width: '100%', height: '1px', background: 'rgba(255,255,255,0.1)', marginBottom: '25px' } }),

                        // Features List
                        React.createElement('ul', { style: { listStyle: 'none', padding: '0', margin: '0', display: 'flex', flexDirection: 'column', gap: '16px' } },
                            React.createElement('li', { style: { display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)' } }, React.createElement('span', { style: { color: '#ff0080', fontWeight: 'bold' } }, '✓'), 'Advanced Core Web Vitals audit and script-level runtime speed optimization.'),
                            React.createElement('li', { style: { display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)' } }, React.createElement('span', { style: { color: '#ff0080', fontWeight: 'bold' } }, '✓'), 'Intricate Technical SEO configuration (Sitemap, Schema markup, Robots architecture).'),
                            React.createElement('li', { style: { display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)' } }, React.createElement('span', { style: { color: '#ff0080', fontWeight: 'bold' } }, '✓'), 'Deep-dive programmatic competitor gap analysis and keyword conquesting.'),
                            React.createElement('li', { style: { display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)' } }, React.createElement('span', { style: { color: '#ff0080', fontWeight: 'bold' } }, '✓'), 'Elite dedicated technical support + precision automated rank indexing setup.')
                        )
                    ),
                    React.createElement('button', {
                        className: 'card-btn',
                        style: { marginTop: '35px', width: '100%', padding: '14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
                        onClick: toContactForm('Premium SEO Plan', '50K PKR')
                    }, 'Select Premium Plan')
                )

            ), // <-- Grid Container Ends Here

            // ✨ UPGRADED SECTION: Comprehensive Plan Breakdown & Strategy
            React.createElement('div', {
                style: { marginTop: '60px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '40px' }
            },
                React.createElement('h3', {
                    style: { fontSize: '1.8rem', fontWeight: '700', marginBottom: '30px', textAlign: 'center', color: '#00f2fe' }
                }, 'Comprehensive Plan Breakdown & Strategy'),

                React.createElement('div', {
                    style: { display: 'flex', flexDirection: 'column', gap: '30px' }
                },
                    // Detail Box 1: Basic SEO Plan
                    React.createElement('div', {
                        style: { background: 'rgba(255, 255, 255, 0.01)', padding: '25px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }
                    },
                        React.createElement('h4', { style: { fontSize: '1.2rem', color: '#fff', marginBottom: '10px', fontWeight: '600' } }, '01 / Basic SEO Plan — On-Page Essentials & Keyword Clustering'),
                        React.createElement('p', { style: { color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.6', fontSize: '0.95rem' } },
                            'The Basic Plan sets up proper organic tracking lines by building out custom target page updates. We look deep into competitive keywords to separate high-converting traffic targets from dead clusters. By manually optimizing title metrics, headers, and semantic tag maps, your core web content satisfies top search console algorithms right out of the box, building an active foundation for sustainable domain trust.'
                        )
                    ),

                    // Detail Box 2: Standard SEO Plan
                    React.createElement('div', {
                        style: { background: 'rgba(0, 242, 254, 0.02)', padding: '25px', borderRadius: '12px', border: '1px solid rgba(0, 242, 254, 0.15)' }
                    },
                        React.createElement('h4', { style: { fontSize: '1.2rem', color: '#00f2fe', marginBottom: '10px', fontWeight: '600' } }, '02 / Standard SEO Plan — Authority Optimization & Outreach Building'),
                        React.createElement('p', { style: { color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.6', fontSize: '0.95rem' } },
                            'Tailored for expanding commercial niches, the Standard SEO framework handles complete hybrid rank acceleration models. We target competitor gap paths to discover valuable backlink signals and deploy premium contextual mentions across verified domains. This updates your organic index profile quickly while complete dashboard monitoring logs your exact ranking upgrades and click conversions transparently every month.'
                        )
                    ),

                    // Detail Box 3: Premium SEO Plan
                    React.createElement('div', {
                        style: { background: 'rgba(255, 255, 255, 0.01)', padding: '25px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }
                    },
                        React.createElement('h4', { style: { fontSize: '1.2rem', color: '#fff', marginBottom: '10px', fontWeight: '600' } }, '03 / Premium SEO Plan — Technical Architecture & Code Optimization'),
                        React.createElement('p', { style: { color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.6', fontSize: '0.95rem' } },
                            'Built for complex dynamic storefronts and big corporate structures, the Premium system targets runtime code architectures. We align page elements to max out Google’s strict Core Web Vitals criteria by eliminating slow rendering block assets. From structured JSON-LD snippet maps to updated crawling robots logic, this structural upgrade accelerates automated tracking indexes while making your domain dominant across dense target spaces.'
                        )
                    )
                )
            ),

            // 🛠️ TECHNICAL ARCHITECTURE BREAKDOWN (Deep Dive Technical Layer)
            React.createElement('div', {
                style: { marginTop: '80px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '60px' }
            },
                React.createElement('h2', {
                    style: { fontSize: '2.2rem', fontWeight: '800', marginBottom: '50px', textAlign: 'center', background: 'linear-gradient(135deg, #fff, #00f2fe)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }
                }, 'Deep Dive Technical Architecture'),

                React.createElement('div', {
                    style: { display: 'flex', flexDirection: 'column', gap: '80px' }
                },

                    // Phase 01 Section
                    React.createElement('div', {
                        style: { display: 'flex', flexWrap: 'wrap', gap: '40px', alignItems: 'center' }
                    },
                        React.createElement('div', { style: { flex: '1 1 450px' } },
                            React.createElement('div', { style: { color: '#00f2fe', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '2px', marginBottom: '10px' } }, 'Phase 01 / On-Page Foundations'),
                            React.createElement('h3', { style: { fontSize: '1.7rem', fontWeight: '700', color: '#fff', marginBottom: '20px' } }, 'Basic Plan: Semantic Mapping & Indexing Integrity'),
                            React.createElement('p', { style: { color: 'rgba(255, 255, 255, 0.65)', lineHeight: '1.7', fontSize: '0.98rem', marginBottom: '15px' } },
                                'The Basic Plan initiates search engine crawling paths through semantic metadata restructuring. Rather than relying on simple automated metadata generators, we conduct meticulous, high-intent keyword clustering maps aligned with your niche business queries.'
                            ),
                            React.createElement('p', { style: { color: 'rgba(255, 255, 255, 0.65)', lineHeight: '1.7', fontSize: '0.98rem' } },
                                'By auditing your main layout templates, we implement hardcoded configurations for absolute heading tags (H1-H6) and optimize title tags to maximize CTR on SERPs. Complete integration with Google Search Console maps out validation schemas, resolving crawling errors before they can drop your indexing rates.'
                            )
                        ),
                        React.createElement('div', {
                            style: { flex: '1 1 350px', maxWidth: '500px', background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }
                        },
                            React.createElement('img', {
                                src: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=600&q=80',
                                alt: 'SEO Key Performance Metrics Analysis',
                                style: { width: '100%', height: 'auto', borderRadius: '12px', opacity: '0.85', display: 'block' }
                            }),
                            React.createElement('div', { style: { fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '10px' } }, 'Fig 1.1: Web traffic crawling metrics and semantic keyword placement maps.')
                        )
                    ),

                    // Phase 02 Section
                    React.createElement('div', {
                        style: { display: 'flex', flexWrap: 'wrap-reverse', gap: '40px', alignItems: 'center', background: 'linear-gradient(90deg, rgba(0, 242, 254, 0.02), transparent)', padding: '30px', borderRadius: '24px', borderLeft: '3px solid #00f2fe' }
                    },
                        React.createElement('div', {
                            style: { flex: '1 1 350px', maxWidth: '500px', background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }
                        },
                            React.createElement('img', {
                                src: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=600&q=80',
                                alt: 'Off-Page Growth Networks and Backlink Analysis',
                                style: { width: '100%', height: 'auto', borderRadius: '12px', opacity: '0.85', display: 'block' }
                            }),
                            React.createElement('div', { style: { fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '10px' } }, 'Fig 2.1: Authority indexing comparison pipelines and domain score auditing.')
                        ),
                        React.createElement('div', { style: { flex: '1 1 450px' } },
                            React.createElement('div', { style: { color: '#00f2fe', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '2px', marginBottom: '10px' } }, 'Phase 02 / Domain Growth & Authority Building'),
                            React.createElement('h3', { style: { fontSize: '1.7rem', fontWeight: '700', color: '#fff', marginBottom: '20px' } }, 'Standard Plan: Hybrid On/Off-Page Optimization Ecosystem'),
                            React.createElement('p', { style: { color: 'rgba(255, 255, 255, 0.65)', lineHeight: '1.7', fontSize: '0.98rem', marginBottom: '15px' } },
                                'The Standard Plan structures an expansive domain equity engine. We transition beyond on-site scripts into rigorous competitor rank conquesting, reverse-engineering high-ranking keyword targets and closing structural backlink opportunities.'
                            ),
                            React.createElement('p', { style: { color: 'rgba(255, 255, 255, 0.65)', lineHeight: '1.7', fontSize: '0.98rem' } },
                                'By leveraging our high-authority contextual outreach networks, we build high-quality links that accelerate your organic trust matrix. To maintain complete transparency, detailed positions are generated through advanced analytics pipelines that record monthly rank improvements.'
                            )
                        )
                    ),

                    // Phase 03 Section
                    React.createElement('div', {
                        style: { display: 'flex', flexWrap: 'wrap', gap: '40px', alignItems: 'center' }
                    },
                        React.createElement('div', { style: { flex: '1 1 450px' } },
                            React.createElement('div', { style: { color: '#ff0080', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '2px', marginBottom: '10px' } }, 'Phase 03 / Enterprise Technical Scale'),
                            React.createElement('h3', { style: { fontSize: '1.7rem', fontWeight: '700', color: '#fff', marginBottom: '20px' } }, 'Premium Plan: Core Technical SEO & Runtime Optimization'),
                            React.createElement('p', { style: { color: 'rgba(255, 255, 255, 0.65)', lineHeight: '1.7', fontSize: '0.98rem', marginBottom: '15px' } },
                                'Engineered specifically for enterprise portals, dynamic e-commerce pipelines, and highly competitive niches, the Premium Plan delivers precise technical optimizations. We audit code architectures to fine-tune script-level performance, matching Google’s strict Core Web Vitals parameters.'
                            ),
                            React.createElement('p', { style: { color: 'rgba(255, 255, 255, 0.65)', lineHeight: '1.7', fontSize: '0.98rem' } },
                                'This configuration structures complete JSON-LD schema layouts, optimizing breadcrumbs and product markup arrays for rich snippet visibility. Backed by fully updated XML sitemaps and microdata tuning, this elite plan forces immediate bots indexing while sustaining long-term organic authority.'
                            )
                        ),
                        React.createElement('div', {
                            style: { flex: '1 1 350px', maxWidth: '500px', background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }
                        },
                            React.createElement('img', {
                                src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
                                alt: 'Technical SEO Audit Performance Data',
                                style: { width: '100%', height: 'auto', borderRadius: '12px', opacity: '0.85', display: 'block' }
                            }),
                            React.createElement('div', { style: { fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '10px' } }, 'Fig 3.1: Core Web Vitals profiling dashboard and runtime code optimization.')
                        )
                    )

                )
            )
        );
    } else if (currentPage === 'ads-plans') {
        // ✨ UPGRADED DESIGN: Modern Grid Pricing Table for Ads Placement Plans
        mainElement = React.createElement('main', {
            style: { padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', color: '#fff', fontFamily: "'Inter', sans-serif" }
        },
            // Back Button
            React.createElement('button', {
                className: 'card-btn',
                onClick: toServices, // Yeh aapko direct Services wale main page/state per le jayega
                onMouseEnter: (e) => {
                    e.target.style.background = 'rgba(255,255,255,0.05)';
                    e.target.style.transform = 'translateY(-2px)';
                },
                onMouseLeave: (e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.transform = 'translateY(0)';
                },
                style: {
                    display: 'block',
                    margin: '0 auto 30px auto',
                    padding: '10px 20px',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'transparent',
                    color: '#fff',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                }
            }, '← Back to Services'),

            // Headings
            // 👑 PREMIUM BORDERED HEADING BADGE
           React.createElement('div', {
    style: {
        display: 'flex',                             // 'table' se 'flex' kiya takay container responsive auto-fit ho ske
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0 auto 15px',                       // Margin-bottom mobile viewport ke hissab se optimize kiya
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01))',
        backdropFilter: 'blur(15px)', 
        WebkitBackdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 255, 255, 0.12)', 
        borderRadius: '24px', 
        padding: '12px 24px',                        // Sides padding thodi responsive ki
        width: 'fit-content',
        maxWidth: '92%',                             // Container mobile boundaries ke andar hi lock rahega
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        boxSizing: 'border-box'
    }
},
    React.createElement('h2', {
        style: {
            display: 'inline-block',
            background: 'linear-gradient(45deg, #00f2fe, #ff0080)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            WebkitTextFillColor: 'transparent',
            margin: '0',
            fontSize: 'clamp(1.3rem, 5vw, 2.5rem)',  // Fluid pricing heading size, mobile par perfect scale down hoga
            fontWeight: '800',
            textAlign: 'center',
            whiteSpace: 'nowrap',                    // Heading text line split hokar tootega nahi
            filter: 'drop-shadow(0 4px 10px rgba(0, 242, 254, 0.3))'
        }
    }, 'Ads Placement Plans')
),
React.createElement('p', {
    style: { 
        textAlign: 'center', 
        color: 'rgba(255,255,255,0.6)', 
        fontSize: 'clamp(0.95rem, 3.5vw, 1.1rem)',   // Paragraph text size dynamic screen tracking ke mutabiq
        padding: '0 15px',                           // Text edge bleeding rokne ke liye left/right padding
        maxWidth: '500px',
        margin: '0 auto 30px'                        // Space down scaling takay responsive flow seamless lagay
    }
}, 'Monetize your website traffic with the right ads package.'),

            // Grid Container
            React.createElement('div', {
                style: { display: 'flex', flexWrap: 'wrap', gap: '30px', justifyContent: 'center', alignItems: 'stretch' }
            },

                // 📦 1st Card: Basic Ads Plan
                React.createElement('div', {
                    style: { flex: '1 1 320px', maxWidth: '380px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '35px 25px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }
                },
                    React.createElement('div', null,
                        React.createElement('h3', { style: { fontSize: '1.3rem', color: 'rgba(255,255,255,0.7)', margin: '0 0 10px 0' } }, 'Basic Ads Plan'),
                        React.createElement('div', { style: { display: 'flex', alignItems: 'baseline', gap: '5px', marginBottom: '25px' } },
                            React.createElement('span', { style: { fontSize: '2.2rem', fontWeight: '800', color: '#fff' } }, '10K'),
                            React.createElement('span', { style: { color: 'rgba(255,255,255,0.5)', fontSize: '1rem' } }, 'PKR / total')
                        ),
                        React.createElement('div', { style: { width: '100%', height: '1px', background: 'rgba(255,255,255,0.1)', marginBottom: '25px' } }),

                        // Features List
                        React.createElement('ul', { style: { listStyle: 'none', padding: '0', margin: '0', display: 'flex', flexDirection: 'column', gap: '16px' } },
                            React.createElement('li', { style: { display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)' } }, React.createElement('span', { style: { color: '#4facfe', fontWeight: 'bold' } }, '✓'), 'Standard Google AdSense integration with clean template layout injection.'),
                            React.createElement('li', { style: { display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)' } }, React.createElement('span', { style: { color: '#4facfe', fontWeight: 'bold' } }, '✓'), 'Baseline ad placement setups avoiding UI layout shift issues.'),
                            React.createElement('li', { style: { display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)' } }, React.createElement('span', { style: { color: '#4facfe', fontWeight: 'bold' } }, '✓'), 'Essential setup for native banner scripts and core text ad nodes.'),
                            React.createElement('li', { style: { display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)' } }, React.createElement('span', { style: { color: '#4facfe', fontWeight: 'bold' } }, '✓'), 'Safe site policy validation checks to minimize ad serving restrictions.')
                        )
                    ),
                    React.createElement('button', {
                        className: 'card-btn',
                        style: { marginTop: '35px', width: '100%', padding: '14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
                        onClick: toContactForm('Basic Ads Plan', '10K PKR')
                    }, 'Select Basic Plan')
                ),

                // 📦 2nd Card: Standard Ads Plan (Highlighted monetization Center)
                React.createElement('div', {
                    style: { flex: '1 1 320px', maxWidth: '380px', background: 'rgba(79, 172, 254, 0.03)', border: '1px solid #4facfe', borderRadius: '16px', padding: '35px 25px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 10px 30px rgba(79, 172, 254, 0.05)', position: 'relative' }
                },
                    // Popular Badge
                    React.createElement('div', { style: { position: 'absolute', top: '-15px', right: '25px', background: '#4facfe', color: '#000', fontSize: '0.8rem', fontWeight: '700', padding: '4px 12px', borderRadius: '20px', textTransform: 'uppercase' } }, 'Best Value'),
                    React.createElement('div', null,
                        React.createElement('h3', { style: { fontSize: '1.3rem', color: '#4facfe', margin: '0 0 10px 0', fontWeight: '700' } }, 'Standard Ads Plan'),
                        React.createElement('div', { style: { display: 'flex', alignItems: 'baseline', gap: '5px', marginBottom: '25px' } },
                            React.createElement('span', { style: { fontSize: '2.2rem', fontWeight: '800', color: '#fff' } }, '20K'),
                            React.createElement('span', { style: { color: 'rgba(255,255,255,0.5)', fontSize: '1rem' } }, 'PKR / total')
                        ),
                        React.createElement('div', { style: { width: '100%', height: '1px', background: 'rgba(79, 172, 254, 0.2)', marginBottom: '25px' } }),

                        // Features List
                        React.createElement('ul', { style: { listStyle: 'none', padding: '0', margin: '0', display: 'flex', flexDirection: 'column', gap: '16px' } },
                            React.createElement('li', { style: { display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.9)' } }, React.createElement('span', { style: { color: '#4facfe', fontWeight: 'bold' } }, '✓'), 'Multi-network integration mixing Google AdSense with Adsterra networks.'),
                            React.createElement('li', { style: { display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.9)' } }, React.createElement('span', { style: { color: '#4facfe', fontWeight: 'bold' } }, '✓'), 'Precision script setup for anti-block handling and premium popunder networks.'),
                            React.createElement('li', { style: { display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.9)' } }, React.createElement('span', { style: { color: '#4facfe', fontWeight: 'bold' } }, '✓'), 'Optimized high-CTR placement maps for maximum programmatic revenue yield.'),
                            React.createElement('li', { style: { display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.9)' } }, React.createElement('span', { style: { color: '#4facfe', fontWeight: 'bold' } }, '✓'), 'Asynchronous script tag tuning to ensure smooth page load metrics.')
                        )
                    ),
                    React.createElement('button', {
                        className: 'card-btn',
                        style: { marginTop: '35px', width: '100%', padding: '14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', background: '#4facfe', color: '#000', border: 'none' },
                        onClick: toContactForm('Standard Ads Plan', '20K PKR')
                    }, 'Select Standard Plan')
                ),

                // 📦 3rd Card: Premium Ads Plan
                React.createElement('div', {
                    style: { flex: '1 1 320px', maxWidth: '380px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '35px 25px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }
                },
                    React.createElement('div', null,
                        React.createElement('h3', { style: { fontSize: '1.3rem', color: 'rgba(255,255,255,0.7)', margin: '0 0 10px 0' } }, 'Premium Ads Plan'),
                        React.createElement('div', { style: { display: 'flex', alignItems: 'baseline', gap: '5px', marginBottom: '25px' } },
                            React.createElement('span', { style: { fontSize: '2.2rem', fontWeight: '800', color: '#fff' } }, '35K'),
                            React.createElement('span', { style: { color: 'rgba(255,255,255,0.5)', fontSize: '1rem' } }, 'PKR / total')
                        ),
                        React.createElement('div', { style: { width: '100%', height: '1px', background: 'rgba(255,255,255,0.1)', marginBottom: '25px' } }),

                        // Features List
                        React.createElement('ul', { style: { listStyle: 'none', padding: '0', margin: '0', display: 'flex', flexDirection: 'column', gap: '16px' } },
                            React.createElement('li', { style: { display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)' } }, React.createElement('span', { style: { color: '#ff0080', fontWeight: 'bold' } }, '✓'), 'Full-scale global monetization architecture utilizing advanced Monetag networks.'),
                            React.createElement('li', { style: { display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)' } }, React.createElement('span', { style: { color: '#ff0080', fontWeight: 'bold' } }, '✓'), 'Live programmatic A/B testing configurations across multi-tier ad tags.'),
                            React.createElement('li', { style: { display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)' } }, React.createElement('span', { style: { color: '#ff0080', fontWeight: 'bold' } }, '✓'), 'Intricate CPM tier management systems paired with smart link fallback triggers.'),
                            React.createElement('li', { style: { display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)' } }, React.createElement('span', { style: { color: '#ff0080', fontWeight: 'bold' } }, '✓'), 'Maximum revenue generation loops combined with comprehensive script testing.')
                        )
                    ),
                    React.createElement('button', {
                        className: 'card-btn',
                        style: { marginTop: '35px', width: '100%', padding: '14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
                        onClick: toContactForm('Premium Ads Plan', '35K PKR')
                    }, 'Select Premium Plan')
                ),
            ), // <-- Ye aapke existing Grid Container ka closing bracket hai

            // ✨ UPGRADED SECTION: Deep Dive Detailed Breakdown (Added below cards)
            React.createElement('div', {
                style: { marginTop: '60px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '40px' }
            },
                React.createElement('h3', {
                    style: { fontSize: '1.8rem', fontWeight: '700', marginBottom: '30px', textAlign: 'center', color: '#4facfe' }
                }, 'Comprehensive Plan Breakdown & Strategy'),

                React.createElement('div', {
                    style: { display: 'flex', flexDirection: 'column', gap: '30px' }
                },
                    // Detail Box 1: Basic Ads Plan
                    React.createElement('div', {
                        style: { background: 'rgba(255, 255, 255, 0.01)', padding: '25px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }
                    },
                        React.createElement('h4', { style: { fontSize: '1.2rem', color: '#fff', marginBottom: '10px', fontWeight: '600' } }, '01 / Basic Ads Plan — Strategic Breakdown'),
                        React.createElement('p', { style: { color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.6', fontSize: '0.95rem' } },
                            'The Basic Plan is engineered specifically for content creators, bloggers, and emerging publishers looking to initiate stable, long-term monetization. We focus exclusively on standard Google AdSense deployment, integrating native code injections deep into your website’s core framework. By manually auditing your layout, we eliminate unpredictable Cumulative Layout Shifts (CLS), securing your core web vitals while establishing strategic ad units (Anchor, In-feed, and Multiplex). Additionally, we run comprehensive site-policy validation checks to protect your domain status and significantly reduce the probability of automated policy violations or sudden ad serving restrictions right from launch.'
                        )
                    ),

                    // Detail Box 2: Standard Ads Plan
                    React.createElement('div', {
                        style: { background: 'rgba(79, 172, 254, 0.02)', padding: '25px', borderRadius: '12px', border: '1px solid rgba(79, 172, 254, 0.15)' }
                    },
                        React.createElement('h4', { style: { fontSize: '1.2rem', color: '#4facfe', marginBottom: '10px', fontWeight: '600' } }, '02 / Standard Ads Plan — High Yield Hybrid Strategy'),
                        React.createElement('p', { style: { color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.6', fontSize: '0.95rem' } },
                            'Designed for established sites with consistent daily traffic, the Standard Plan implements a robust multi-network programmatic ecosystem. We configure a hybrid model combining Google AdSense’s premium contextual ads with Adsterra’s high-performing CPM direct-link sequences and specialized anti-block scripts. This approach completely bypasses basic ad-blocking extensions to maximize real-time inventory fill rates. By carefully zoning high-CTR zones (above-the-fold, mid-article break points, and post-container targets) and tuning custom asynchronous execution tags, we supercharge your gross programmatic revenue yield without degrading your platform’s underlying operational page-speed metrics.'
                        )
                    ),

                    // Detail Box 3: Premium Ads Plan
                    React.createElement('div', {
                        style: { background: 'rgba(255, 255, 255, 0.01)', padding: '25px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }
                    },
                        React.createElement('h4', { style: { fontSize: '1.2rem', color: '#fff', marginBottom: '10px', fontWeight: '600' } }, '03 / Premium Ads Plan — Enterprise Global Architecture'),
                        React.createElement('p', { style: { color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.6', fontSize: '0.95rem' } },
                            'The Premium Plan delivers an enterprise-grade global monetization architecture tailored for high-volume networks, viral portals, and multi-tier geo traffic. Utilizing state-of-the-art Monetag technology paired with intricate CPM floor management systems, we orchestrate dynamic, auto-optimizing script arrays. The integration deploys live programmatic A/B testing configurations that intelligently distribute ad requests based on the user’s active geographical location and device type. Featuring specialized fallback smart-links, native push alerts, interstitial scripts, and multi-tier safety layers, this plan creates an absolute revenue-generation loop designed to wring maximum profitability out of every single incoming network connection.'
                        )
                    )
                )
            ), // <-- Ye aapke existing Grid Container ka closing bracket hai

            // ✨ ENTERPRISE LAYER: Highly Detailed Breakdown Sections with Working Live Images
            React.createElement('div', {
                style: { marginTop: '80px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '60px' }
            },
                React.createElement('h2', {
                    style: { fontSize: '2.2rem', fontWeight: '800', marginBottom: '50px', textAlign: 'center', background: 'linear-gradient(135deg, #fff, #4facfe)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }
                }, 'Deep Dive Technical Architecture'),

                React.createElement('div', {
                    style: { display: 'flex', flexDirection: 'column', gap: '80px' }
                },

                    // 🎯 SECTION 1: BASIC PLAN EXTENDED
                    React.createElement('div', {
                        style: { display: 'flex', flexWrap: 'wrap', gap: '40px', alignItems: 'center' }
                    },
                        React.createElement('div', { style: { flex: '1 1 450px' } },
                            React.createElement('div', { style: { color: '#4facfe', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '2px', marginBottom: '10px' } }, 'Phase 01 / Core Implementation'),
                            React.createElement('h3', { style: { fontSize: '1.7rem', fontWeight: '700', color: '#fff', marginBottom: '20px' } }, 'Basic Plan: Google AdSense Structural Integrity'),
                            React.createElement('p', { style: { color: 'rgba(255, 255, 255, 0.65)', lineHeight: '1.7', fontSize: '0.98rem', marginBottom: '15px' } },
                                'The Basic Plan is meticulously structured for standard, stable publishing environments. Rather than relying on automated plugins that inject bloated scripts, we perform vanilla, asynchronous code placements directly inside your template’s virtual DOM nodes. This level of precision guarantees zero impact on your rendering performance.'
                            ),
                            React.createElement('p', { style: { color: 'rgba(255, 255, 255, 0.65)', lineHeight: '1.7', fontSize: '0.98rem' } },
                                'We strictly calculate and enforce CSS aspect-ratio matching placeholders for all responsive banners. This completely mitigates Cumulative Layout Shift (CLS) issues, satisfying Google’s Core Web Vitals parameters while systematically eliminating the core triggers that cause automated policy deployment flags and ad serving limitations.'
                            )
                        ),
                        React.createElement('div', {
                            style: { flex: '1 1 350px', maxWidth: '500px', background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }
                        },
                            React.createElement('img', {
                                src: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=600&q=80',
                                alt: 'AdSense Layout Optimization Matrix',
                                style: { width: '100%', height: 'auto', borderRadius: '12px', opacity: '0.85', display: 'block' }
                            }),
                            React.createElement('div', { style: { fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '10px' } }, 'Fig 1.1: Visual matrix profiling UI balance during dynamic ad container adjustments.')
                        )
                    ),

                    // ⚡ SECTION 2: STANDARD PLAN EXTENDED
                    React.createElement('div', {
                        style: { display: 'flex', flexWrap: 'wrap-reverse', gap: '40px', alignItems: 'center', background: 'linear-gradient(90deg, rgba(79, 172, 254, 0.02), transparent)', padding: '30px', borderRadius: '24px', borderLeft: '3px solid #4facfe' }
                    },
                        React.createElement('div', {
                            style: { flex: '1 1 350px', maxWidth: '500px', background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }
                        },
                            React.createElement('img', {
                                src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
                                alt: 'Hybrid Ad Network Optimization Loop',
                                style: { width: '100%', height: 'auto', borderRadius: '12px', opacity: '0.85', display: 'block' }
                            }),
                            React.createElement('div', { style: { fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '10px' } }, 'Fig 2.1: Multi-network real-time request-routing loop and high-CTR mapping.')
                        ),
                        React.createElement('div', { style: { flex: '1 1 450px' } },
                            React.createElement('div', { style: { color: '#4facfe', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '2px', marginBottom: '10px' } }, 'Phase 02 / Programmatic Yield Expansion'),
                            React.createElement('h3', { style: { fontSize: '1.7rem', fontWeight: '700', color: '#fff', marginBottom: '20px' } }, 'Standard Plan: Hybrid Network Mediation Engineering'),
                            React.createElement('p', { style: { color: 'rgba(255, 255, 255, 0.65)', lineHeight: '1.7', fontSize: '0.98rem', marginBottom: '15px' } },
                                'The Standard Plan implements a robust, high-yielding programmatic hybrid network framework. By cross-mediating institutional Google AdSense containers with premium Adsterra popunder tags and advanced anti-block script layers, we bypass typical browser-level ad blockers completely.'
                            ),
                            React.createElement('p', { style: { color: 'rgba(255, 255, 255, 0.65)', lineHeight: '1.7', fontSize: '0.98rem' } },
                                'This setup secures near 100% total fill-rate parameters across all global traffic segments. Every single layout zone undergoes detailed user behavior assessment maps (CTR targeting), ensuring the high-density direct scripts only render at moments of maximum interaction frequency to drive immediate scaling of programmatic CPM returns.'
                            )
                        )
                    ),

                    // 💎 SECTION 3: PREMIUM PLAN EXTENDED
                    React.createElement('div', {
                        style: { display: 'flex', flexWrap: 'wrap', gap: '40px', alignItems: 'center' }
                    },
                        React.createElement('div', { style: { flex: '1 1 450px' } },
                            React.createElement('div', { style: { color: '#ff0080', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '2px', marginBottom: '10px' } }, 'Phase 03 / Multi-Tier Monetization'),
                            React.createElement('h3', { style: { fontSize: '1.7rem', fontWeight: '700', color: '#fff', marginBottom: '20px' } }, 'Premium Plan: Global Scale Programmatic Engine'),
                            React.createElement('p', { style: { color: 'rgba(255, 255, 255, 0.65)', lineHeight: '1.7', fontSize: '0.98rem', marginBottom: '15px' } },
                                'Tailored directly for dynamic scale operations, high-velocity blogs, and viral entertainment platforms, the Premium Plan delivers an enterprise-grade global configuration. Built upon state-of-the-art Monetag SDK architectures, we organize dynamic script maps that perform live programmatic matching loops based on the incoming user’s geolocation tier and carrier metrics.'
                            ),
                            React.createElement('p', { style: { color: 'rgba(255, 255, 255, 0.65)', lineHeight: '1.7', fontSize: '0.98rem' } },
                                'This creates complete coverage through interlocking layers of safe smart-links, custom native push scripts, and clean interstitial setups. Advanced CPM floor targets ensure your inventory is never sold short, extracting maximum financial value out of every millisecond of user connectivity.'
                            )
                        ),
                        React.createElement('div', {
                            style: { flex: '1 1 350px', maxWidth: '500px', background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }
                        },
                            React.createElement('img', {
                                src: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=600&q=80',
                                alt: 'Global Scale CPM Yield Dashboard',
                                style: { width: '100%', height: 'auto', borderRadius: '12px', opacity: '0.85', display: 'block' }
                            }),
                            React.createElement('div', { style: { fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '10px' } }, 'Fig 3.1: Enterprise multi-tier CPM automation tracking interface.')
                        )
                    )

                )
            ) // <-- Iske baad aapka main return element complete ho jayega
        )

    } else if (currentPage === 'portfolio') {

        // 💡 --- SIDE-BY-SIDE LAYOUT STYLES ---
        const detailBoxStyle = {
            background: 'linear-gradient(135deg, rgba(20, 20, 30, 0.8), rgba(20, 20, 30, 0.5))',
            padding: '30px 35px',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            color: 'rgba(255, 255, 255, 0.8)',
            lineHeight: '1.8',
            textAlign: 'left',
            fontSize: '1.02rem',
            boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
            flex: '1',
            display: 'flex',
            alignItems: 'center',
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)'
        };

        const groupStyle = {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'stretch', // Card aur Detail box dono ki height barabar rahegi
            gap: '30px',
            marginBottom: '40px',
            width: '100%',
            maxWidth: '1150px'
        };

        mainElement = React.createElement('main', {
            className: 'portfolio-page', // Cleaned class name
            style: { padding: '40px 20px', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }
        },

            // 👑 ULTRA-PREMIUM BORDERED HEADING BADGE
            React.createElement('div', {
    style: {
        display: 'flex',                             // 'table' se 'flex' kiya taaki card fluidly behave kare
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0 auto 20px',                       // Margin thoda kam kiya mobile spacing ke liye
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01))',
        backdropFilter: 'blur(15px)',
        WebkitBackdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '24px',
        padding: '12px 20px',                        // Side padding mobile ke liye thodi kam ki
        width: 'fit-content',
        maxWidth: '92%',                             // Mobile screen se bahar nikalne se rokega
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        boxSizing: 'border-box'
    }
},
    React.createElement('h2', {
        className: 'section-heading',
        style: {
            fontSize: 'clamp(1.2rem, 4.6vw, 2.3rem)', // Text lamba hone ki wajah se smooth flexible size lagaya
            fontWeight: '800',
            letterSpacing: '0.5px',                  // Letters ko tight space mein overlap hone se bachayega
            textAlign: 'center',
            margin: '0',
            display: 'inline-flex',                  // inline-flex kiya taaki layout elements wrap na hon
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',                    // Kisi bhi haal mein text ko tootne nahi dega, hamesha ek line me rakhega
            background: 'linear-gradient(90deg, #00f2fe 0%, #ff0080 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            WebkitTextStroke: '1px rgba(255, 255, 255, 0.08)',
            filter: 'drop-shadow(0 4px 10px rgba(0, 242, 254, 0.3))'
        }
    }, 'Our Team Members Portfolio')
),

            React.createElement('p', {
                className: 'portfolio-sub-text',
                style: { color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', marginBottom: '50px', textAlign: 'center', maxWidth: '600px' }
            }, 'Meet our talented team of expert software engineers and developers driving digital innovation at Apex Code.'),

            // Main Container for Rows
            React.createElement('div', {
                className: 'portfolio-rows-container',
                style: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }
            },

                // 👨‍💻 ROW 1: Software Engineer Paras
                React.createElement('div', {
                    style: {
                        ...groupStyle,
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '30px',
                        alignItems: 'stretch', // Card aur right panel ki lines completely symmetric rahengi
                        width: '100%',
                        maxWidth: '900px',
                        marginTop: '30px',
                        marginBottom: '30px'
                    },
                    className: 'team-row-group'
                },
                    // LEFT CARD: EXECUTIVE DEV LEAD PROFILE
                    React.createElement('div', {
                        className: 'service-card hyper-premium-card lead-profile-card',
                        style: {
                            background: 'rgba(10, 11, 18, 0.85)',
                            border: '1px solid rgba(255, 255, 255, 0.07)',
                            boxShadow: '0 30px 70px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 0 50px rgba(0, 242, 254, 0.02)',
                            backdropFilter: 'blur(30px)',
                            WebkitBackdropFilter: 'blur(30px)',
                            padding: '40px 30px',
                            borderRadius: '32px',
                            textAlign: 'center', // Profiles center text ke sath clean aur premium lagti hain
                            flex: '0 0 350px',
                            position: 'relative',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                        }
                    },
                        // 1. TOP HARDWARE ACCENT BAR (Cyber Lead Cyan & Violet Flare Loop)
                        React.createElement('div', {
                            style: {
                                position: 'absolute', top: '0', left: '40px', right: '40px', height: '3px',
                                background: 'linear-gradient(90deg, transparent, #00f2fe, #7928ca, transparent)',
                                filter: 'drop-shadow(0 2px 8px rgba(0, 242, 254, 0.8))'
                            }
                        }),

                        React.createElement('div', null,
                            // TOP ROLE BADGE PLACEMENT
                            React.createElement('div', { style: { display: 'flex', justifyContent: 'center', marginBottom: '25px' } },
                                React.createElement('div', {
                                    className: 'card-badge',
                                    style: {
                                        background: 'linear-gradient(45deg, rgba(0, 242, 254, 0.1), rgba(121, 40, 202, 0.1))',
                                        color: '#00f2fe',
                                        padding: '6px 16px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '800',
                                        letterSpacing: '0.8px', textTransform: 'uppercase', border: '1px solid rgba(0, 242, 254, 0.25)'
                                    }
                                }, 'Founder & CEO')
                            ),

                            // HOLOGRAPHIC EXECUTIVE IMAGE CONTAINER
                            React.createElement('div', {
                                style: {
                                    position: 'relative', width: '100px', height: '100px', margin: '0 auto 20px',
                                    borderRadius: '50%', padding: '3px', background: 'linear-gradient(135deg, #00f2fe, #7928ca)',
                                    boxShadow: '0 10px 25px rgba(0, 242, 254, 0.25)'
                                }
                            },
                                React.createElement('img', {
                                    src: 'Pic.jpeg',
                                    alt: ' Engr. Paras Bruce',
                                    style: {
                                        width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover',
                                        display: 'block', background: '#0a0b12'
                                    }
                                })
                            ),

                            // CORE TYPOGRAPHY
                            React.createElement('h3', {
                                style: { color: '#fff', fontSize: '1.65rem', fontWeight: '900', letterSpacing: '-0.3px', marginBottom: '6px', marginTop: '0' }
                            }, 'Engr. Paras Bruce'),

                            React.createElement('p', {
                                style: { color: '#00f2fe', fontWeight: '700', fontSize: '0.85rem', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '25px', opacity: '0.9' }
                            }, 'Full Stack Developer + SEO Specialist')
                        ),

                        // CONTRAST ACTION BUTTONS GRIDS
                        React.createElement('div', { style: { display: 'flex', gap: '12px', width: '100%' } },
                            // Visit Profile: Solid Elite White Action Button
                            React.createElement('button', {
                                className: 'card-btn enterprise-action',
                                onClick: toParasPortfolio,
                                style: {
                                    flex: '1', padding: '12px',
                                    background: '#fff', color: '#0a0b12',
                                    border: '1px solid #fff', borderRadius: '12px',
                                    fontSize: '0.9rem', fontWeight: '800', cursor: 'pointer',
                                    boxShadow: '0 8px 20px rgba(255, 255, 255, 0.05)',
                                    transition: 'all 0.2s ease'
                                }
                            }, 'Visit Profile'),

                            // Contact: Frosted Glass Secondary Border Button
                            React.createElement('a', {
                                href: 'mailto:book.apexcode@gmail.com',
                                className: 'card-btn secondary-frosted-action',
                                style: {
                                    flex: '1', padding: '12px', fontSize: '0.9rem', fontWeight: '800',
                                    color: '#fff', background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '12px',
                                    textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.2s ease', cursor: 'pointer'
                                }
                            }, 'Contact')
                        )
                    ),

                    // RIGHT DETAIL BOX: AUTHENTIC TEXT PORTAL
                    React.createElement('div', {
                        style: {
                            ...detailBoxStyle,
                            flex: '1 1 450px',
                            background: 'rgba(15, 17, 26, 0.5)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            borderRadius: '32px',
                            padding: '40px 35px',
                            color: 'rgba(255, 255, 255, 0.75)',
                            fontSize: '1rem',
                            lineHeight: '1.75',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            textAlign: 'left',
                            position: 'relative'
                        }
                    },
                        // Subtle vertical cyber line aligning to the profile theme on the left inner boundary
                        React.createElement('div', {
                            style: {
                                position: 'absolute', left: '0', top: '40px', bottom: '40px', width: '2px',
                                background: 'linear-gradient(to bottom, #7928ca, transparent)'
                            }
                        }),

                        'As the Lead Developer at Apex Code, Paras architects enterprise-grade web applications with a focus on absolute performance and clean code deployment. Specializing in end-to-end engineering, he seamlessly bridges frontend frameworks with intricate backend systems. Simultaneously, his advanced technical SEO integration models ensure that every digital pipeline developed is natively optimized for supreme visibility, search page dominance, and massive organic growth.'
                    )
                ),

                // 💻 ROW 2: Software Engineer Usman Nadeem
                React.createElement('div', {
                    style: {
                        ...groupStyle,
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '30px',
                        alignItems: 'stretch', // Card aur right text content vertical sync mein rahenge
                        width: '100%',
                        maxWidth: '900px',
                        marginTop: '30px',
                        marginBottom: '30px'
                    },
                    className: 'team-row-group'
                },
                    // LEFT CARD: FRONTEND & UI DEV LEAD PROFILE
                    React.createElement('div', {
                        className: 'service-card hyper-premium-card lead-profile-card',
                        style: {
                            background: 'rgba(10, 11, 18, 0.85)',
                            border: '1px solid rgba(255, 255, 255, 0.07)',
                            boxShadow: '0 30px 70px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 0 50px rgba(255, 0, 128, 0.02)',
                            backdropFilter: 'blur(30px)',
                            WebkitBackdropFilter: 'blur(30px)',
                            padding: '40px 30px',
                            borderRadius: '32px',
                            textAlign: 'center',
                            flex: '0 0 350px',
                            position: 'relative',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                        }
                    },
                        // 1. TOP HARDWARE ACCENT BAR (Cyber Pink to Amethyst Neon Track)
                        React.createElement('div', {
                            style: {
                                position: 'absolute', top: '0', left: '40px', right: '40px', height: '3px',
                                background: 'linear-gradient(90deg, transparent, #ff0080, #7928ca, transparent)',
                                filter: 'drop-shadow(0 2px 8px rgba(255, 0, 128, 0.8))'
                            }
                        }),

                        React.createElement('div', null,
                            // MULTI-BADGE ROW CONFIGURATION
                            React.createElement('div', { style: { display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '25px', flexWrap: 'wrap' } },
                                // Badge 1: UI Expert (Cyber Pink theme)


                                // Badge 2: Lead Developer (Cyan theme)
                                React.createElement('div', {
                                    className: 'card-badge dev-badge',
                                    style: {
                                        background: 'rgba(0, 242, 254, 0.08)',
                                        color: '#00f2fe',
                                        padding: '5px 12px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: '800',
                                        letterSpacing: '0.8px', textTransform: 'uppercase', border: '1px solid rgba(0, 242, 254, 0.25)'
                                    }
                                }, 'Chief Operating Officer')
                            ),

                            // HOLOGRAPHIC CHROME IMAGE FRAME
                            React.createElement('div', {
                                style: {
                                    position: 'relative', width: '100px', height: '100px', margin: '0 auto 20px',
                                    borderRadius: '50%', padding: '3px', background: 'linear-gradient(135deg, #ff0080, #7928ca)',
                                    boxShadow: '0 10px 25px rgba(255, 0, 128, 0.25)'
                                }
                            },
                                React.createElement('img', {
                                    src: 'usman.jpeg',
                                    alt: 'Usman Nadeem',
                                    style: {
                                        width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover',
                                        display: 'block', background: '#0a0b12'
                                    }
                                })
                            ),

                            // IDENTITY & TYPOGRAPHY
                            React.createElement('h3', {
                                style: { color: '#fff', fontSize: '1.65rem', fontWeight: '900', letterSpacing: '-0.3px', marginBottom: '6px', marginTop: '0' }
                            }, 'Engr. Usman Nadeem'),

                            React.createElement('p', {
                                style: { color: '#ff0080', fontWeight: '700', fontSize: '0.85rem', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '25px', opacity: '0.9' }
                            }, 'Frontend + WordPress Developer')
                        ),

                        // CORE CTAs (Solid Action + Frosted Hybrid Ecosystem)
                        React.createElement('div', { style: { display: 'flex', gap: '12px', width: '100%' } },
                            // Visit Profile: Clean Solid Light Target
                            React.createElement('button', {
                                className: 'card-btn enterprise-action',
                                onClick: toUsmanPortfolio,
                                style: {
                                    flex: '1', padding: '12px',
                                    background: '#fff', color: '#0a0b12',
                                    border: '1px solid #fff', borderRadius: '12px',
                                    fontSize: '0.9rem', fontWeight: '800', cursor: 'pointer',
                                    boxShadow: '0 8px 20px rgba(255, 255, 255, 0.05)',
                                    transition: 'all 0.2s ease'
                                }
                            }, 'Visit Profile'),

                            // Contact: Secondary Translucent Glass Control
                            React.createElement('a', {
                                href: 'mailto:book.apexcode@gmail.com',
                                className: 'card-btn secondary-frosted-action',
                                style: {
                                    flex: '1', padding: '12px', fontSize: '0.9rem', fontWeight: '800',
                                    color: '#fff', background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '12px',
                                    textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.2s ease', cursor: 'pointer'
                                }
                            }, 'Contact')
                        )
                    ),

                    // RIGHT DETAIL BOX: THE PREMIUM BIO LAYOVER
                    React.createElement('div', {
                        style: {
                            ...detailBoxStyle,
                            flex: '1 1 450px',
                            background: 'rgba(15, 17, 26, 0.5)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            borderRadius: '32px',
                            padding: '40px 35px',
                            color: 'rgba(255, 255, 255, 0.75)',
                            fontSize: '1rem',
                            lineHeight: '1.75',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            textAlign: 'left',
                            position: 'relative'
                        }
                    },
                        // Neon structural separator matching the primary component aesthetics
                        React.createElement('div', {
                            style: {
                                position: 'absolute', left: '0', top: '40px', bottom: '40px', width: '2px',
                                background: 'linear-gradient(to bottom, #ff0080, transparent)'
                            }
                        }),

                        'Usman transforms complex digital logic into visually stunning, pixel-perfect user interfaces. His advanced grasp of adaptive styling protocols ensures that layouts transition smoothly across all modern screen resolutions. Leveraging high-level custom WordPress orchestration alongside core frontend libraries, he designs tailored web dashboards and content structures that prioritize dynamic client interaction and high brand-conversion metrics.'
                    )
                ),

                // ✨ ROW 3: Software Engineer Saif Ur Rehman
                React.createElement('div', {
                    style: {
                        ...groupStyle,
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '30px',
                        alignItems: 'stretch', // Left aur right segments ki vertical bounds perfect level par balance rahengi
                        width: '100%',
                        maxWidth: '900px',
                        marginTop: '30px',
                        marginBottom: '30px'
                    },
                    className: 'team-row-group'
                },
                    // LEFT CARD: FRONTEND DEV LEAD PROFILE
                    React.createElement('div', {
                        className: 'service-card hyper-premium-card lead-profile-card',
                        style: {
                            background: 'rgba(10, 11, 18, 0.85)',
                            border: '1px solid rgba(255, 255, 255, 0.07)',
                            boxShadow: '0 30px 70px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 0 50px rgba(0, 242, 254, 0.02)',
                            backdropFilter: 'blur(30px)',
                            WebkitBackdropFilter: 'blur(30px)',
                            padding: '40px 30px',
                            borderRadius: '32px',
                            textAlign: 'center',
                            flex: '0 0 350px',
                            position: 'relative',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between' // Fixed: Yahan split error tha, ab bilkul theek hy
                        }
                    },
                        // 1. TOP HARDWARE ACCENT BAR (Electric Cyan to Fluid Blue Neon Streak)
                        React.createElement('div', {
                            style: {
                                position: 'absolute', top: '0', left: '40px', right: '40px', height: '3px',
                                background: 'linear-gradient(90deg, transparent, #00f2fe, #4facfe, transparent)',
                                filter: 'drop-shadow(0 2px 8px rgba(0, 242, 254, 0.8))'
                            }
                        }),

                        React.createElement('div', null,
                            // HIGH-END MULTI-BADGE BLOCK ROW
                            React.createElement('div', { style: { display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '25px', flexWrap: 'wrap' } },
                                // Badge 1: Frontend Dev (Cyan/Blue Hue)


                                // Badge 2: Lead Developer (Deep Tech Royal Shade)
                                React.createElement('div', {
                                    className: 'card-badge dev-badge',
                                    style: {
                                        background: 'rgba(121, 40, 202, 0.08)',
                                        color: '#a855f7',
                                        padding: '5px 12px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: '800',
                                        letterSpacing: '0.8px', textTransform: 'uppercase', border: '1px solid rgba(121, 40, 202, 0.25)'
                                    }
                                }, 'CEO OF Zarvix & Companies Partner')
                            ),

                            // HOLOGRAPHIC GEOMETRIC CYBER RING
                            React.createElement('div', {
                                style: {
                                    position: 'relative', width: '100px', height: '100px', margin: '0 auto 20px',
                                    borderRadius: '50%', padding: '3px', background: 'linear-gradient(135deg, #00f2fe, #4facfe)',
                                    boxShadow: '0 10px 25px rgba(0, 242, 254, 0.25)'
                                }
                            },
                                React.createElement('img', {
                                    src: 'rana.jpeg',
                                    alt: 'Saif Ur Rahman',
                                    style: {
                                        width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover',
                                        display: 'block', background: '#0a0b12'
                                    }
                                })
                            ),

                            // TYPOGRAPHY CORE SYSTEM
                            React.createElement('h3', {
                                style: { color: '#fff', fontSize: '1.65rem', fontWeight: '900', letterSpacing: '-0.3px', marginBottom: '6px', marginTop: '0' }
                            }, 'Engr. Saif Ur Rehman'),

                            React.createElement('p', {
                                style: { color: '#00f2fe', fontWeight: '700', fontSize: '0.85rem', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '25px', opacity: '0.9' }
                            }, 'Frontend Developer')
                        ),

                        // ENTERPRISE ACTION GROUP (Solid Contrast Primary + Ultra-Frosted Secondary)
                        React.createElement('div', { style: { display: 'flex', gap: '12px', width: '100%' } },
                            // Visit Profile: Solid High-Contrast White Engine
                            React.createElement('button', {
                                className: 'card-btn enterprise-action',
                                onClick: toSaifPortfolio,
                                style: {
                                    flex: '1', padding: '12px',
                                    background: '#fff', color: '#0a0b12',
                                    border: '1px solid #fff', borderRadius: '12px',
                                    fontSize: '0.9rem', fontWeight: '800', cursor: 'pointer',
                                    boxShadow: '0 8px 20px rgba(255, 255, 255, 0.05)',
                                    transition: 'all 0.2s ease'
                                }
                            }, 'Visit Profile'),

                            // Contact: Translucent Architectural Node
                            React.createElement('a', {
                                href: 'mailto:book.apexcode@gmail.com',
                                className: 'card-btn secondary-frosted-action',
                                style: {
                                    flex: '1', padding: '12px', fontSize: '0.9rem', fontWeight: '800',
                                    color: '#fff', background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '12px',
                                    textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.2s ease', cursor: 'pointer'
                                }
                            }, 'Contact')
                        )
                    ),

                    // RIGHT DETAIL BOX: THE CORE FRAMEWORK PORTAL
                    React.createElement('div', {
                        style: {
                            ...detailBoxStyle,
                            flex: '1 1 450px',
                            background: 'rgba(15, 17, 26, 0.5)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            borderRadius: '32px',
                            padding: '40px 35px',
                            color: 'rgba(255, 255, 255, 0.75)',
                            fontSize: '1rem',
                            lineHeight: '1.75',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            textAlign: 'left',
                            position: 'relative'
                        }
                    },
                        // Fluid Cyan architectural vertical bar inside the description area
                        React.createElement('div', {
                            style: {
                                position: 'absolute', left: '0', top: '40px', bottom: '40px', width: '2px',
                                background: 'linear-gradient(to bottom, #00f2fe, transparent)'
                            }
                        }),

                        'Saif brings websites to life by crafting immersive, fluid interactive layers. His execution focuses heavily on modern user journeys, utilizing optimized rendering engines and modular components to maintain flawless system runtimes. By implementing micro-interactions, custom script animations, and asynchronous UI features, he delivers unmatched aesthetics that naturally elevate user retention periods.'
                    )
                ),

                // 🚀 ROW 4: Software Engineer Abdul Nafay
                React.createElement('div', {
                    style: {
                        ...groupStyle,
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '30px',
                        alignItems: 'stretch', // Card aur right panel vertical lines ko perfectly block-match rakhta hy
                        width: '100%',
                        maxWidth: '900px',
                        marginTop: '30px',
                        marginBottom: '30px'
                    },
                    className: 'team-row-group'
                },
                    // LEFT CARD: CMS & WORDPRESS DEV LEAD PROFILE
                    React.createElement('div', {
                        className: 'service-card hyper-premium-card lead-profile-card',
                        style: {
                            background: 'rgba(10, 11, 18, 0.85)',
                            border: '1px solid rgba(255, 255, 255, 0.07)',
                            boxShadow: '0 30px 70px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 0 50px rgba(121, 40, 202, 0.02)',
                            backdropFilter: 'blur(30px)',
                            WebkitBackdropFilter: 'blur(30px)',
                            padding: '40px 30px',
                            borderRadius: '32px',
                            textAlign: 'center',
                            flex: '0 0 350px',
                            position: 'relative',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                        }
                    },
                        // 1. TOP HARDWARE ACCENT BAR (Cyber Violet to Electric Blue Flare)
                        React.createElement('div', {
                            style: {
                                position: 'absolute', top: '0', left: '40px', right: '40px', height: '3px',
                                background: 'linear-gradient(90deg, transparent, #7928ca, #00f2fe, transparent)',
                                filter: 'drop-shadow(0 2px 8px rgba(121, 40, 202, 0.8))'
                            }
                        }),

                        React.createElement('div', null,
                            // HIGH-END MULTI-BADGE ROW SETUP
                            React.createElement('div', { style: { display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '25px', flexWrap: 'wrap' } },
                                // Badge 1: Developer


                                // Badge 2: Lead Developer
                                React.createElement('div', {
                                    className: 'card-badge lead-badge',
                                    style: {
                                        background: 'rgba(0, 242, 254, 0.08)',
                                        color: '#00f2fe',
                                        padding: '5px 12px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: '800',
                                        letterSpacing: '0.8px', textTransform: 'uppercase', border: '1px solid rgba(0, 242, 254, 0.25)'
                                    }
                                }, 'Employed')
                            ),

                            // HOLOGRAPHIC GRAPHIC IMAGE RING
                            React.createElement('div', {
                                style: {
                                    position: 'relative', width: '100px', height: '100px', margin: '0 auto 20px',
                                    borderRadius: '50%', padding: '3px', background: 'linear-gradient(135deg, #7928ca, #00f2fe)',
                                    boxShadow: '0 10px 25px rgba(121, 40, 202, 0.25)'
                                }
                            },
                                React.createElement('img', {
                                    src: 'nafay.jpeg',
                                    alt: 'Abdul Nafay',
                                    style: {
                                        width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover',
                                        display: 'block', background: '#0a0b12'
                                    }
                                })
                            ),

                            // TYPOGRAPHY SCHEME
                            React.createElement('h3', {
                                style: { color: '#fff', fontSize: '1.65rem', fontWeight: '900', letterSpacing: '-0.3px', marginBottom: '6px', marginTop: '0' }
                            }, 'Engr. Abdul Nafay'),

                            React.createElement('p', {
                                style: { color: '#ff0080', fontWeight: '700', fontSize: '0.85rem', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '25px', opacity: '0.9' }
                            }, 'WordPress Developer')
                        ),

                        // ENTERPRISE PROFILE INTERACTIVE ACTIONS
                        React.createElement('div', { style: { display: 'flex', gap: '12px', width: '100%' } },
                            // Visit Profile: Solid High-Contrast White Engine
                            React.createElement('button', {
                                className: 'card-btn enterprise-action',
                                onClick: toAbdulNafayPortfolio,
                                style: {
                                    flex: '1', padding: '12px',
                                    background: '#fff', color: '#0a0b12',
                                    border: '1px solid #fff', borderRadius: '12px',
                                    fontSize: '0.9rem', fontWeight: '800', cursor: 'pointer',
                                    boxShadow: '0 8px 20px rgba(255, 255, 255, 0.05)',
                                    transition: 'all 0.2s ease'
                                }
                            }, 'Visit Profile'),

                            // Contact: Translucent Architectural Button
                            React.createElement('a', {
                                href: 'mailto:book.apexcode@gmail.com',
                                className: 'card-btn secondary-frosted-action',
                                style: {
                                    flex: '1', padding: '12px', fontSize: '0.9rem', fontWeight: '800',
                                    color: '#fff', background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '12px',
                                    textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.2s ease', cursor: 'pointer'
                                }
                            }, 'Contact')
                        )
                    ),

                    // RIGHT DETAIL BOX: INFRASTRUCTURE CORE PORTAL
                    React.createElement('div', {
                        style: {
                            ...detailBoxStyle,
                            flex: '1 1 450px',
                            background: 'rgba(15, 17, 26, 0.5)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            borderRadius: '32px',
                            padding: '40px 35px',
                            color: 'rgba(255, 255, 255, 0.75)',
                            fontSize: '1rem',
                            lineHeight: '1.75',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            textAlign: 'left',
                            position: 'relative'
                        }
                    },
                        // Cyber Violet architectural vertical bar on left border inner alignment
                        React.createElement('div', {
                            style: {
                                position: 'absolute', left: '0', top: '40px', bottom: '40px', width: '2px',
                                background: 'linear-gradient(to bottom, #7928ca, transparent)'
                            }
                        }),

                        'Abdul Nafay commands advanced CMS development loops, engineering optimized web nodes that scale efficiently under intense corporate traffic. He specializes in designing bespoke block patterns, configuring modular store infrastructures, and building completely responsive layouts. His optimization frameworks guarantee lightweight pages, solid security layers, and seamless functionality for global clients.'
                    )
                ),

                // 🔍 ROW 5: Software Engineer Abrar Jamshad
                React.createElement('div', {
                    style: {
                        ...groupStyle,
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '30px',
                        alignItems: 'stretch', // Ensures perfectly matched dynamic heights between card and bio box
                        width: '100%',
                        maxWidth: '900px',
                        marginTop: '30px',
                        marginBottom: '30px'
                    },
                    className: 'team-row-group'
                },
                    // LEFT CARD: FULL STACK & SEO GROWTH ENGINEER
                    React.createElement('div', {
                        className: 'service-card hyper-premium-card lead-profile-card',
                        style: {
                            background: 'rgba(10, 11, 18, 0.85)',
                            border: '1px solid rgba(255, 255, 255, 0.07)',
                            boxShadow: '0 30px 70px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 0 50px rgba(16, 185, 129, 0.02)',
                            backdropFilter: 'blur(30px)',
                            WebkitBackdropFilter: 'blur(30px)',
                            padding: '40px 30px',
                            borderRadius: '32px',
                            textAlign: 'center',
                            flex: '0 0 350px',
                            position: 'relative',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                        }
                    },
                        // 1. TOP HARDWARE ACCENT BAR (Data Growth Emerald to Cyber Cyan Stream)
                        React.createElement('div', {
                            style: {
                                position: 'absolute', top: '0', left: '40px', right: '40px', height: '3px',
                                background: 'linear-gradient(90deg, transparent, #10b981, #00f2fe, transparent)',
                                filter: 'drop-shadow(0 2px 8px rgba(16, 185, 129, 0.8))'
                            }
                        }),

                        React.createElement('div', null,
                            // HIGH-END INLINE MULTI-BADGE CONFIGURATION
                            React.createElement('div', { style: { display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '25px', flexWrap: 'wrap' } },
                                // Badge 1: Growth Expert (Emerald Matrix Shade)


                                // Badge 2: Lead Developer (Deep Sea Cyan Shade)
                                React.createElement('div', {
                                    className: 'card-badge lead-badge',
                                    style: {
                                        background: 'rgba(0, 242, 254, 0.08)',
                                        color: '#00f2fe',
                                        padding: '5px 12px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: '800',
                                        letterSpacing: '0.8px', textTransform: 'uppercase', border: '1px solid rgba(0, 242, 254, 0.25)'
                                    }
                                }, 'Employed')
                            ),

                            // HOLOGRAPHIC DYNAMIC CYBER RING
                            React.createElement('div', {
                                style: {
                                    position: 'relative', width: '100px', height: '100px', margin: '0 auto 20px',
                                    borderRadius: '50%', padding: '3px', background: 'linear-gradient(135deg, #10b981, #00f2fe)',
                                    boxShadow: '0 10px 25px rgba(16, 185, 129, 0.25)'
                                }
                            },
                                React.createElement('img', {
                                    src: 'abrar.jpeg',
                                    alt: 'Abrar Jamsed',
                                    style: {
                                        width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover',
                                        display: 'block', background: '#0a0b12'
                                    }
                                })
                            ),

                            // CORE IDENTITY & TYPOGRAPHY SYSTEMS
                            React.createElement('h3', {
                                style: { color: '#fff', fontSize: '1.65rem', fontWeight: '900', letterSpacing: '-0.3px', marginBottom: '6px', marginTop: '0' }
                            }, 'Engr. Abrar Jamshad'),

                            React.createElement('p', {
                                style: { color: '#00f2fe', fontWeight: '700', fontSize: '0.85rem', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '25px', opacity: '0.9' }
                            }, 'Full Stack Developer + SEO Specialist')
                        ),

                        // ENTERPRISE ACTION BUTTON HOOKS
                        React.createElement('div', { style: { display: 'flex', gap: '12px', width: '100%' } },
                            // Visit Profile: Solid High-Contrast White Engine
                            React.createElement('button', {
                                className: 'card-btn enterprise-action',
                                onClick: toAbrarPortfolio,
                                style: {
                                    flex: '1', padding: '12px',
                                    background: '#fff', color: '#0a0b12',
                                    border: '1px solid #fff', borderRadius: '12px',
                                    fontSize: '0.9rem', fontWeight: '800', cursor: 'pointer',
                                    boxShadow: '0 8px 20px rgba(255, 255, 255, 0.05)',
                                    transition: 'all 0.2s ease'
                                }
                            }, 'Visit Profile'),

                            // Contact: Translucent Architectural Node
                            React.createElement('a', {
                                href: 'mailto:book.apexcode@gmail.com',
                                className: 'card-btn secondary-frosted-action',
                                style: {
                                    flex: '1', padding: '12px', fontSize: '0.9rem', fontWeight: '800',
                                    color: '#fff', background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '12px',
                                    textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.2s ease', cursor: 'pointer'
                                }
                            }, 'Contact')
                        )
                    ),

                    // RIGHT DETAIL BOX: ALGORITHMIC BIO STORAGE PANEL
                    React.createElement('div', {
                        style: {
                            ...detailBoxStyle,
                            flex: '1 1 450px',
                            background: 'rgba(15, 17, 26, 0.5)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            borderRadius: '32px',
                            padding: '40px 35px',
                            color: 'rgba(255, 255, 255, 0.75)',
                            fontSize: '1rem',
                            lineHeight: '1.75',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            textAlign: 'left',
                            position: 'relative'
                        }
                    },
                        // Growth Emerald architectural vertical vector bar on inside left border alignment
                        React.createElement('div', {
                            style: {
                                position: 'absolute', left: '0', top: '40px', bottom: '40px', width: '2px',
                                background: 'linear-gradient(to bottom, #10b981, transparent)'
                            }
                        }),

                        'Abrar approaches software engineering with a strategic data-driven growth mindset. He focuses closely on aligning complex full-stack web architectures with advanced indexability paradigms. By deploying clean schematic structures, precise server configurations, and targeted algorithmic keyword mappings, he bridges the technical divide between robust script deployments and high search ranking sustainability.'
                    )
                ),

                // ⚡ ROW 6: Software Engineer Hamza
                React.createElement('div', {
                    style: {
                        ...groupStyle,
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '30px',
                        alignItems: 'stretch', // Keeps both left card and right detail box dynamically locked to the same height
                        width: '100%',
                        maxWidth: '900px',
                        marginTop: '30px',
                        marginBottom: '30px'
                    },
                    className: 'team-row-group'
                },
                    // LEFT CARD: FULL STACK & BACKEND INFRASTRUCTURE LEAD PROFILE
                    React.createElement('div', {
                        className: 'service-card hyper-premium-card lead-profile-card',
                        style: {
                            background: 'rgba(10, 11, 18, 0.85)',
                            border: '1px solid rgba(255, 255, 255, 0.07)',
                            boxShadow: '0 30px 70px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 0 50px rgba(255, 0, 128, 0.02)',
                            backdropFilter: 'blur(30px)',
                            WebkitBackdropFilter: 'blur(30px)',
                            padding: '40px 30px',
                            borderRadius: '32px',
                            textAlign: 'center',
                            flex: '0 0 350px',
                            position: 'relative',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                        }
                    },
                        // 1. TOP HARDWARE ACCENT BAR (Backend Cluster Cyber Magenta Flare)
                        React.createElement('div', {
                            style: {
                                position: 'absolute', top: '0', left: '40px', right: '40px', height: '3px',
                                background: 'linear-gradient(90deg, transparent, #ff0080, #7928ca, transparent)',
                                filter: 'drop-shadow(0 2px 8px rgba(255, 0, 128, 0.8))'
                            }
                        }),

                        React.createElement('div', null,
                            // HIGH-END INLINE MULTI-BADGE ROW CONFIGURATION
                            React.createElement('div', { style: { display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '25px', flexWrap: 'wrap' } },
                                // Badge 1: Full Stack Dev (Cyber Pink Theme)


                                // Badge 2: Lead Developer (Deep Tech Violet Theme)
                                React.createElement('div', {
                                    className: 'card-badge lead-badge',
                                    style: {
                                        background: 'rgba(121, 40, 202, 0.08)',
                                        color: '#a855f7',
                                        padding: '5px 12px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: '800',
                                        letterSpacing: '0.8px', textTransform: 'uppercase', border: '1px solid rgba(121, 40, 202, 0.25)'
                                    }
                                }, 'Employed')
                            ),

                            // HOLOGRAPHIC DYNAMIC CYBER RING
                            React.createElement('div', {
                                style: {
                                    position: 'relative', width: '100px', height: '100px', margin: '0 auto 20px',
                                    borderRadius: '50%', padding: '3px', background: 'linear-gradient(135deg, #ff0080, #7928ca)',
                                    boxShadow: '0 10px 25px rgba(255, 0, 128, 0.25)'
                                }
                            },
                                React.createElement('img', {
                                    src: 'hamza.jpeg',
                                    alt: 'Hamza',
                                    style: {
                                        width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover',
                                        display: 'block', background: '#0a0b12'
                                    }
                                })
                            ),

                            // IDENTITY & CORE TYPOGRAPHY SYSTEMS
                            React.createElement('h3', {
                                style: { color: '#fff', fontSize: '1.65rem', fontWeight: '900', letterSpacing: '-0.3px', marginBottom: '6px', marginTop: '0' }
                            }, 'Engr. Hamza'),

                            React.createElement('p', {
                                style: { color: '#ff0080', fontWeight: '700', fontSize: '0.85rem', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '25px', opacity: '0.9' }
                            }, 'Full Stack Developer')
                        ),

                        // ENTERPRISE ACTION BUTTON HOOKS
                        React.createElement('div', { style: { display: 'flex', gap: '12px', width: '100%' } },
                            // Visit Profile: Solid High-Contrast White Engine
                            React.createElement('button', {
                                className: 'card-btn enterprise-action',
                                onClick: toHamzaPortfolio,
                                style: {
                                    flex: '1', padding: '12px',
                                    background: '#fff', color: '#0a0b12',
                                    border: '1px solid #fff', borderRadius: '12px',
                                    fontSize: '0.9rem', fontWeight: '800', cursor: 'pointer',
                                    boxShadow: '0 8px 20px rgba(255, 255, 255, 0.05)',
                                    transition: 'all 0.2s ease'
                                }
                            }, 'Visit Profile'),

                            // Contact: Translucent Architectural Node
                            React.createElement('a', {
                                href: 'mailto:book.apexcode@gmail.com',
                                className: 'card-btn secondary-frosted-action',
                                style: {
                                    flex: '1', padding: '12px', fontSize: '0.9rem', fontWeight: '800',
                                    color: '#fff', background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '12px',
                                    textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.2s ease', cursor: 'pointer'
                                }
                            }, 'Contact')
                        )
                    ),

                    // RIGHT DETAIL BOX: INFRASTRUCTURE AND BIO STORAGE PANEL
                    React.createElement('div', {
                        style: {
                            ...detailBoxStyle,
                            flex: '1 1 450px',
                            background: 'rgba(15, 17, 26, 0.5)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            borderRadius: '32px',
                            padding: '40px 35px',
                            color: 'rgba(255, 255, 255, 0.75)',
                            fontSize: '1rem',
                            lineHeight: '1.75',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            textAlign: 'left',
                            position: 'relative'
                        }
                    },
                        // Backend Magenta architectural vertical vector bar on inside left border alignment
                        React.createElement('div', {
                            style: {
                                position: 'absolute', left: '0', top: '40px', bottom: '40px', width: '2px',
                                background: 'linear-gradient(to bottom, #ff0080, transparent)'
                            }
                        }),

                        'Hamza manages high-performance server configurations, relational schema distributions, and intricate data modeling processes. He builds scalable end-to-end data layers, integrating complex asynchronous operations with responsive client applications. His specialized database fine-tuning keeps response frequencies exceptionally brief, ensuring lag-free workflow synchronization.'
                    )
                ),

                // 🛡️ ROW 7: Software Engineer Ali
                React.createElement('div', {
                    style: {
                        ...groupStyle,
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '30px',
                        alignItems: 'stretch',
                        width: '100%',
                        maxWidth: '900px',
                        marginTop: '30px',
                        marginBottom: '30px'
                    },
                    className: 'team-row-group'
                },
                    // LEFT CARD: QA EXPERT & SECURITY SHIELD PROFILE
                    React.createElement('div', {
                        className: 'service-card hyper-premium-card lead-profile-card',
                        style: {
                            background: 'rgba(10, 11, 18, 0.85)',
                            border: '1px solid rgba(255, 255, 255, 0.07)',
                            boxShadow: '0 30px 70px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 0 50px rgba(0, 242, 254, 0.02)',
                            backdropFilter: 'blur(30px)',
                            WebkitBackdropFilter: 'blur(30px)',
                            padding: '40px 30px',
                            borderRadius: '32px',
                            textAlign: 'center',
                            flex: '0 0 350px',
                            position: 'relative',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                        }
                    },
                        // 1. TOP HARDWARE ACCENT BAR (QA Precision Blue Stream)
                        React.createElement('div', {
                            style: {
                                position: 'absolute', top: '0', left: '40px', right: '40px', height: '3px',
                                background: 'linear-gradient(90deg, transparent, #00f2fe, #4facfe, transparent)',
                                filter: 'drop-shadow(0 2px 8px rgba(0, 242, 254, 0.8))'
                            }
                        }),

                        React.createElement('div', null,
                            // MULTI-BADGE CONFIGURATION
                            React.createElement('div', { style: { display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '25px', flexWrap: 'wrap' } },


                                React.createElement('div', {
                                    className: 'card-badge lead-badge',
                                    style: {
                                        background: 'rgba(121, 40, 202, 0.08)',
                                        color: '#a855f7',
                                        padding: '5px 12px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: '800',
                                        letterSpacing: '0.8px', textTransform: 'uppercase', border: '1px solid rgba(121, 40, 202, 0.25)'
                                    }
                                }, 'Internship')
                            ),

                            // DYNAMIC CYBER RING
                            React.createElement('div', {
                                style: {
                                    position: 'relative', width: '100px', height: '100px', margin: '0 auto 20px',
                                    borderRadius: '50%', padding: '3px', background: 'linear-gradient(135deg, #00f2fe, #7928ca)',
                                    boxShadow: '0 10px 25px rgba(0, 242, 254, 0.25)'
                                }
                            },
                                React.createElement('img', {
                                    src: 'ali.jpeg',
                                    alt: 'Ali',
                                    style: {
                                        width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover',
                                        display: 'block', background: '#0a0b12'
                                    }
                                })
                            ),

                            // TYPOGRAPHY
                            React.createElement('h3', {
                                style: { color: '#fff', fontSize: '1.65rem', fontWeight: '900', letterSpacing: '-0.3px', marginBottom: '6px', marginTop: '0' }
                            }, 'Mr. Ali'),

                            React.createElement('p', {
                                style: { color: '#00f2fe', fontWeight: '700', fontSize: '0.85rem', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '25px', opacity: '0.9' }
                            }, 'Software Tester (QA)')
                        ),

                        // BUTTONS
                        React.createElement('div', { style: { display: 'flex', gap: '12px', width: '100%' } },
                            React.createElement('button', {
                                className: 'card-btn enterprise-action',
                                onClick: toAliPortfolio,
                                style: {
                                    flex: '1', padding: '12px',
                                    background: '#fff', color: '#0a0b12',
                                    border: '1px solid #fff', borderRadius: '12px',
                                    fontSize: '0.9rem', fontWeight: '800', cursor: 'pointer',
                                    boxShadow: '0 8px 20px rgba(255, 255, 255, 0.05)',
                                    transition: 'all 0.2s ease'
                                }
                            }, 'Visit Profile'),

                            React.createElement('a', {
                                href: 'mailto:book.apexcode@gmail.com',
                                className: 'card-btn secondary-frosted-action',
                                style: {
                                    flex: '1', padding: '12px', fontSize: '0.9rem', fontWeight: '800',
                                    color: '#fff', background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '12px',
                                    textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.2s ease', cursor: 'pointer'
                                }
                            }, 'Contact')
                        )
                    ),

                    // RIGHT DETAIL BOX: QA PROTOCOL STORAGE
                    React.createElement('div', {
                        style: {
                            ...detailBoxStyle,
                            flex: '1 1 450px',
                            background: 'rgba(15, 17, 26, 0.5)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            borderRadius: '32px',
                            padding: '40px 35px',
                            color: 'rgba(255, 255, 255, 0.75)',
                            fontSize: '1rem',
                            lineHeight: '1.75',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            textAlign: 'left',
                            position: 'relative'
                        }
                    },
                        // Precision Blue vector bar
                        React.createElement('div', {
                            style: {
                                position: 'absolute', left: '0', top: '40px', bottom: '40px', width: '2px',
                                background: 'linear-gradient(to bottom, #00f2fe, transparent)'
                            }
                        }),

                        'Ali acts as the quality shield for Apex Code, maintaining absolute defense against system instabilities or interface flaws. He orchestrates manual inspection routines, designs comprehensive regression protocols, and validates script outputs against intensive performance parameters. His strict inspection pipeline ensures that deployments arrive perfectly secure, zero-bug, and ready for high-volume enterprise production.'
                    )
                )))


    } else if (currentPage === 'contact-form') {

        // Premium Dark Glassmorphism Input Styling
        const inputStyle = {
            width: '100%',
            padding: '14px 18px',
            margin: '12px 0',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(255, 255, 255, 0.05)',
            color: '#fff',
            fontSize: '16px',
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(5px)'
        };

        mainElement = React.createElement('main', {
            className: 'services-page',
            style: {
                padding: '40px 20px',
                minHeight: '80vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }
        },
            // Back Button with Subtle Glow
            React.createElement('button', {
                className: 'card-btn',
                style: { marginBottom: '30px', alignSelf: 'center', borderColor: 'rgba(255,255,255,0.3)' },
                onClick: toPlans
            }, '← Back to Plans'),

            // Gradient Animated Heading
            // Gradient Animated Heading// 👑 PREMIUM BORDERED HEADING BADGE
            React.createElement('div', {
    style: {
        display: 'flex',                             // 'table' ko hata kar 'flex' kiya taaki screen width ke mutabiq adjust ho
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0 auto 10px',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01))',
        backdropFilter: 'blur(15px)', 
        WebkitBackdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 255, 255, 0.12)', 
        borderRadius: '24px',
        padding: '12px 20px',                        // Mobile par safe space ke liye side padding thodi kam ki (32px -> 20px)
        width: 'fit-content',
        maxWidth: '92%',                             // Box ko mobile screen se bahar nikalne se rokega
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        boxSizing: 'border-box'
    }
},
    React.createElement('h2', {
        style: {
            display: 'inline-block',
            background: 'linear-gradient(45deg, #00f2fe, #ff0080)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            WebkitTextFillColor: 'transparent',
            margin: '0',
            fontSize: 'clamp(1.2rem, 5vw, 2.5rem)',  // 2.5rem static size ko hata kar fluid clamping laga di
            fontWeight: '800',
            textAlign: 'center',
            whiteSpace: 'nowrap',                    // Text ko har haal mein single line mein lock rakhega
            filter: 'drop-shadow(0 4px 10px rgba(0, 242, 254, 0.3))'
        }
    }, 'Complete Your Order')
),

            React.createElement('p', {
                className: 'services-sub-text',
                style: { color: 'rgba(255,255,255,0.7)', marginBottom: '40px' }
            }, 'Please provide your project details below to launch your next big thing.'),

            // 🚀 PREMIUM UNIFIED CARD — FORM + IMAGE EK HI GLASS CONTAINER MEIN
            React.createElement('div', {
                style: {
                    position: 'relative',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'stretch',
                    width: '100%',
                    maxWidth: '1000px',
                    borderRadius: '28px',
                    overflow: 'hidden',
                    background: 'linear-gradient(145deg, rgba(25,25,38,0.75), rgba(10,10,16,0.85))',
                    border: '1px solid rgba(255,255,255,0.12)',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)'
                }
            },
                // ✨ Ambient glow blobs — premium lighting touch
                React.createElement('div', {
                    style: {
                        position: 'absolute', top: '-70px', left: '-70px', width: '200px', height: '200px',
                        background: 'radial-gradient(circle, rgba(0,242,254,0.25), transparent 70%)',
                        filter: 'blur(10px)', pointerEvents: 'none', zIndex: 0
                    }
                }),
                React.createElement('div', {
                    style: {
                        position: 'absolute', bottom: '-80px', right: '-80px', width: '220px', height: '220px',
                        background: 'radial-gradient(circle, rgba(255,0,128,0.22), transparent 70%)',
                        filter: 'blur(15px)', pointerEvents: 'none', zIndex: 0
                    }
                }),

                // 💎 LEFT: FORM
                React.createElement('form', {
                    onSubmit: handleFormSubmit,
                    style: {
                        flex: '1 1 400px',
                        padding: '48px 42px',
                        boxSizing: 'border-box',
                        position: 'relative',
                        zIndex: 1
                    }
                },
                    // Hidden Fields for FormSubmit
                    React.createElement('input', { type: 'hidden', name: '_captcha', value: 'false' }),
                    React.createElement('input', { type: 'hidden', name: '_subject', value: '🚀 New Apex Code Order Received!' }),

                    // Auto-filled Plan & Price (Jo user badal nahi sakta)
                    React.createElement('input', {
                        type: 'text',
                        name: 'Selected_Plan',
                        value: `${selectedPlan.name} (${selectedPlan.price})`,
                        readOnly: true,
                        style: { ...inputStyle, background: 'rgba(0, 242, 254, 0.1)', color: '#00f2fe', fontWeight: 'bold', border: '1px solid #00f2fe' }
                    }),

                    // Baqi wahi purane fields
                    React.createElement('input', { type: 'text', name: 'Name', placeholder: '👤 Full Name', required: true, style: inputStyle }),
                    React.createElement('input', { type: 'tel', name: 'WhatsApp', placeholder: '💬 WhatsApp Number', required: true, style: inputStyle }),
                    React.createElement('input', { type: 'email', name: 'Email', placeholder: '✉️ Email Address', required: true, style: inputStyle }),
                    React.createElement('input', { type: 'text', name: 'Country', placeholder: '🌐 Your Country', required: true, style: inputStyle }),
                    React.createElement('input', { type: 'text', name: 'WebsiteType', placeholder: '💻 Website Type (e.g. Portfolio, E-commerce)', required: true, style: inputStyle }),

                    React.createElement('button', {
                        type: 'submit',
                        className: 'card-btn',
                        style: { width: '100%', marginTop: '25px', padding: '14px', fontSize: '18px', fontWeight: '600', background: 'linear-gradient(45deg, #00f2fe, #ff0080)', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(255, 0, 128, 0.35)' }
                    }, 'Order Now 🚀')
                ),

                // 🎨 RIGHT: IMAGE
                React.createElement('div', {
                    style: {
                        flex: '1 1 380px',
                        minHeight: '420px',
                        position: 'relative',
                        zIndex: 1
                    }
                },
                    React.createElement('img', {
                        src: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
                        alt: 'Apex Code Order Illustration',
                        style: {
                            position: 'absolute', inset: 0,
                            width: '100%', height: '100%',
                            objectFit: 'cover',
                            filter: 'brightness(0.85) contrast(1.15) saturate(1.1)'
                        }
                    }),
                    React.createElement('div', {
                        style: {
                            position: 'absolute', inset: 0,
                            background: 'linear-gradient(100deg, rgba(12,12,20,0.9) 0%, rgba(12,12,20,0.15) 35%, transparent 60%)'
                        }
                    }),
                    React.createElement('div', {
                        style: {
                            position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px',
                            background: 'linear-gradient(90deg, #00f2fe, #ff0080)',
                            opacity: 0.6
                        }
                    })
                )
            ) // Unified Card ends here
        );
    } else if (currentPage === 'paras-portfolio') {
        const portfolioInputStyle = {
            background: 'linear-gradient(135deg, rgba(20, 20, 30, 0.8), rgba(20, 20, 30, 0.5))',
            padding: '35px',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            color: 'rgba(255, 255, 255, 0.85)',
            lineHeight: '1.8',
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)',
            boxShadow: '0 20px 45px rgba(0,0,0,0.4)',
            width: '100%',
            boxSizing: 'border-box'
        };

        const projectCardStyle = {
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '20px',
            transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)'
        };

        mainElement = React.createElement('main', {
            style: { padding: '40px 20px', minHeight: '85vh', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', boxSizing: 'border-box' }
        },
            // Back to Team Button with Glow Interaction
            React.createElement('button', {
                className: 'card-btn',
                onClick: toPortfolio,
                onMouseEnter: (e) => {
                    e.target.style.background = 'rgba(255,255,255,0.05)';
                    e.target.style.transform = 'translateX(-3px)';
                },
                onMouseLeave: (e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.transform = 'translateX(0)';
                },
                style: { marginBottom: '30px', alignSelf: 'center', borderColor: 'rgba(255,255,255,0.2)', transition: 'all 0.3s ease', cursor: 'pointer' }
            }, '← Back to Team Portfolios'),

            // Main Profile Window
            React.createElement('div', {
                style: { width: '100%', maxWidth: '950px', display: 'flex', flexDirection: 'column', gap: '35px' }
            },
                // Header Intro Section
                React.createElement('div', { 
    style: { 
        ...portfolioInputStyle, 
        display: 'flex',                             // Grid/Table issues se bachne ke liye flexbox select kiya
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center', 
        background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.05), rgba(255, 0, 128, 0.05))', 
        border: '1px solid rgba(0, 242, 254, 0.15)',
        padding: '30px 20px',                        // Mobile par safe layout cushioning ke liye padding
        maxWidth: '95%',                             // Card mobile screen edges ke andar hi compact rahega
        margin: '0 auto',
        boxSizing: 'border-box'
    } 
},
    React.createElement('img', {
        src: 'Pic.jpeg',
        alt: 'Paras Bruce',
        style: {
            width: 'clamp(100px, 25vw, 130px)',      // Mobile par automatic choti ho kar perfectly adjust ho jayegi
            height: 'clamp(100px, 25vw, 130px)',     // Image square ratio maintain rakhegi circular filter ke sath
            borderRadius: '50%',
            objectFit: 'cover',
            marginBottom: '15px',                    // Spacing mobile layout ke liye thodi optimal ki
            border: '3px solid #00f2fe',
            boxShadow: '0 0 25px rgba(0, 242, 254, 0.5)',
            display: 'inline-block'
        }
    }),
    React.createElement('h2', {
        style: { 
            fontSize: 'clamp(1.8rem, 6vw, 2.8rem)',  // Name heading desktop par full 2.8rem aur mobile par auto-scale down hogi
            fontWeight: '800', 
            margin: '0 0 10px 0', 
            background: 'linear-gradient(90deg, #00f2fe, #ff0080)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent',
            lineHeight: '1.2'
        }
    }, 'Engr. Paras Bruce'),
    React.createElement('p', { 
        style: { 
            color: '#00f2fe', 
            fontWeight: '700', 
            fontSize: 'clamp(1rem, 4vw, 1.2rem)',    // Designation ka font size fluid kiya taaki single/clean layout wrap ho
            letterSpacing: '0.5px',                  // Letters spacing choti screen ke liye track compact ki
            margin: '0 0 15px 0' 
        } 
    }, 'Lead Software Engineer & Full-Stack Developer'),
    React.createElement('p', { 
        style: { 
            maxWidth: '650px',                       // Clean horizontal margins text structure ke liye
            margin: '0 auto', 
            color: 'rgba(255,255,255,0.7)', 
            fontSize: 'clamp(0.95rem, 3.5vw, 1.05rem)', // Bio description paragraph responsive adjustment
            lineHeight: '1.5',
            padding: '0 10px'                        // Side bleeding protection for low-res devices
        } 
    }, 'Specializing in dynamic web scaling, automated API architecture, and enterprise cloud deployments. Passionate about building intelligent core logic structures that optimize processing speeds and modern web utility.')
),

                // Two Column Breakdown: Core Experience & Technical Expertise
                React.createElement('div', { style: { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '30px', width: '100%' } },
                    // Left Column: Core Expertise
                    React.createElement('div', { style: { ...portfolioInputStyle, flex: '1 1 400px' } },
                        React.createElement('h3', { style: { color: '#00f2fe', fontSize: '1.4rem', marginTop: '0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' } }, 'Technical Matrix'),
                        React.createElement('ul', { style: { paddingLeft: '20px', margin: '15px 0 0 0' } },
                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Backend Architecture: '), 'Robust logic management using modular micro-frameworks linked with dynamic runtime clusters.'),
                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Frontend Engineering: '), 'Declarative UI rendering pipelines built with modular frameworks for absolute rendering smoothness.'),
                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Database & Cloud Mastery: '), 'Intricate structure management on distributed clouds (Render, Vercel) alongside live database setups (MongoDB Atlas).'),
                            React.createElement('li', { style: { marginBottom: '0px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Growth & Monetization: '), 'Optimizing platform tracking systems using precision script structures and search ranking metrics.')
                        ),

                    ), // <--- Yeh comma Left aur Right column ko alag karta hai
                    React.createElement('div', { style: { ...portfolioInputStyle, flex: '1 1 400px' } },
                        React.createElement('h3', { style: { color: '#00f2fe', fontSize: '1.4rem', marginTop: '0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', letterSpacing: '1px' } }, 'Social Profiles'),
                        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' } },

                            // Instagram Link
                            React.createElement('a', {
                                href: 'https://www.instagram.com/paras_in_10?igsh=Nm03bXFueW4zbjZk',
                                target: '_blank',
                                rel: 'noopener noreferrer',
                                style: { display: 'block', padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)', textDecoration: 'none', color: '#fff', fontSize: '1.05rem', cursor: 'pointer' }
                            },
                                React.createElement('strong', { style: { color: '#f77737' } }, '📸 Instagram: '), 'Follow on Instagram'
                            ),

                            // Facebook Link
                            React.createElement('a', {
                                href: 'https://www.facebook.com/share/1EPaLZESDy/',
                                target: '_blank',
                                rel: 'noopener noreferrer',
                                style: { display: 'block', padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)', textDecoration: 'none', color: '#fff', fontSize: '1.05rem', cursor: 'pointer' }
                            },
                                React.createElement('strong', { style: { color: '#1877f2' } }, '🔵 Facebook: '), 'Connect on Facebook'
                            ),

                            // Threads Link
                            React.createElement('a', {
                                href: 'https://www.threads.com/@paras_in_10',
                                target: '_blank',
                                rel: 'noopener noreferrer',
                                style: { display: 'block', padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)', textDecoration: 'none', color: '#fff', fontSize: '1.05rem', cursor: 'pointer' }
                            },
                                React.createElement('strong', { style: { color: '#fff', textShadow: '0 0 5px rgba(255,255,255,0.3)' } }, '🧵 Threads: '), 'View Threads Profile'
                            ),

                            // LinkedIn Link
                            React.createElement('a', {
                                href: 'https://www.linkedin.com/in/paras-bruce-062610343?utm_source=share_via&utm_content=profile&utm_medium=member_android',
                                target: '_blank',
                                rel: 'noopener noreferrer',
                                style: { display: 'block', padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)', textDecoration: 'none', color: '#fff', fontSize: '1.05rem', cursor: 'pointer' }
                            },
                                React.createElement('strong', { style: { color: '#0077b5' } }, '💼 LinkedIn: '), 'Let\'s Network on LinkedIn'
                            )
                        )
                    ),
                    // Right Column: Education & Agency Details
                    React.createElement('div', { style: { ...portfolioInputStyle, flex: '1 1 400px' } },
                        React.createElement('h3', { style: { color: '#ff0080', fontSize: '1.4rem', marginTop: '0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' } }, 'Skills'),
                        React.createElement('ul', { style: { paddingLeft: '20px', margin: '15px 0 0 0', listStyleType: 'square' } },
                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'HTML: '), 'Proficient in architecting clean, semantic, and SEO-friendly web structures to ensure absolute cross-browser accessibility.'),
                            React.createElement('li', { style: { marginBottom: '20px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'CSS: '), 'Experienced in crafting highly responsive, pixel-perfect interfaces using modern design principles, layouts, and smooth transition animations.'),
                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Javascript: '), 'Strong expertise in implementing complex, declarative client-side logic and managing high-performance asynchronous state operations.'),
                            React.createElement('li', { style: { marginBottom: '20px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'React.JS: '), 'Advanced capability in building modular, reusable component systems and interactive, real-time user interfaces.'),
                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Python: '), 'Specialized in developing robust backend micro-frameworks, customized regex structures, and automated data processing logic.'),
                            React.createElement('li', { style: { marginBottom: '20px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Microsoft Office: '), 'Competent in managing professional documentation, advanced data sorting, and structuring clean business operational reports.'),

                            // Custom Sub-heading for Academic Timeline
                            React.createElement('li', { style: { listStyleType: 'none', marginLeft: '-20px', marginBottom: '12px', color: '#ff0080', fontWeight: '700', fontSize: '1.1rem' } }, '🎓 Academic Journey'),

                            React.createElement('li', { style: { marginBottom: '10px', fontSize: '0.95rem' } },
                                React.createElement('strong', { style: { color: '#fff' } }, 'Masters: '), 'Ilma University (2026 - Present)'
                            ),
                            React.createElement('li', { style: { marginBottom: '10px', fontSize: '0.95rem' } },
                                React.createElement('strong', { style: { color: '#fff' } }, 'Graduation: '), 'Ilma University (2022 - 2026)'
                            ),
                            React.createElement('li', { style: { marginBottom: '10px', fontSize: '0.95rem' } },
                                React.createElement('strong', { style: { color: '#fff' } }, 'Intermediate: '), 'Ziauddin Board (2020 - 2022)'
                            ),
                            React.createElement('li', { style: { marginBottom: '0px', fontSize: '0.95rem' } },
                                React.createElement('strong', { style: { color: '#fff' } }, 'Matric : '), 'Mathematics City Grammar School (2018 - 2019)'
                            )
                        )
                    ),
                    // Right Column: Education & Agency Details
                    React.createElement('div', { style: { ...portfolioInputStyle, flex: '1 1 400px' } },
                        React.createElement('h3', { style: { color: '#ff0080', fontSize: '1.4rem', marginTop: '0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' } }, 'Companies Which I Work For'),
                        React.createElement('ul', { style: { paddingLeft: '20px', margin: '15px 0 0 0', listStyleType: 'square' } },
                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Apex Code: '), 'As the Founder and CEO of Apex Code, I drive the companys strategic vision while actively architecting core platforms as a Full Stack Developer'),
                            React.createElement('li', { style: { marginBottom: '20px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Codex Venture: '), 'Previously worked as a Full Stack Developer at Codex Venture, handling end-to-end web development and engineering scalable digital solutions. .'),

                            // Custom Sub-heading for Academic Timeline
                            React.createElement('li', { style: { listStyleType: 'none', marginLeft: '-20px', marginBottom: '12px', color: '#ff0080', fontWeight: '700', fontSize: '1.1rem' } }, 'Experience'),

                            React.createElement('li', { style: { marginBottom: '10px', fontSize: '0.95rem' } },
                                React.createElement('strong', { style: { color: '#fff' } }, 'Full-Stack Developer: '), 'Apex Code (30-April-2025 - Present)'
                            ),
                            React.createElement('li', { style: { marginBottom: '10px', fontSize: '0.95rem' } },
                                React.createElement('strong', { style: { color: '#fff' } }, 'Full-Stack Developer: '), 'Codex Venture (01-Feb-2024 - 05-March-2025)'
                            ),
                        )
                    ),
                ),

                // Exclusive Interactive Projects Hub (Option requested)
                // Project Node 2: GlyphHuman - AI Text Humanizer & Detector Portal
                React.createElement('div', {
                    style: projectCardStyle,
                    onMouseEnter: (e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                        e.currentTarget.style.border = '1px solid rgba(255, 0, 128, 0.3)';
                        e.currentTarget.style.transform = 'translateY(-3px)';
                    },
                    onMouseLeave: (e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                        e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }

                },

                    // Title Row
                    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' } },
                        React.createElement('h4', { style: { color: '#fff', fontSize: '1.35rem', margin: '0', fontWeight: '700' } }, '"GlyphHuman" – AI Text Humanizer & Detector Portal'),
                        React.createElement('span', { style: { background: 'rgba(255, 0, 128, 0.1)', color: '#ff0080', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' } }, 'Active Service')
                    ),

                    // Detailed Breakdown Info Hub
                    React.createElement('div', { style: { color: 'rgba(255,255,255,0.72)', fontSize: '0.95rem', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px', lineHeight: '1.6' } },
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#ff0080' } }, 'Core Purpose: '), 'A web-based application designed to convert robotic, AI-generated text into a natural, human-like writing style and analyze text to calculate AI probability scores.'
                        ),
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#ff0080' } }, 'The Detector Engine: '), 'Uses a customized rule-based algorithm in Python to check keyword density (tracking words like delve, moreover, tapestry), vocabulary richness, and sentence length patterns to output an AI vs. Human percentage.'
                        ),
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#ff0080' } }, 'The Humanizer Engine: '), 'Utilizes pure Python and regex logic instead of a heavy AI model. It works by randomly replacing robotic phrases with casual human synonyms and altering long sentence structures to mimic natural human writing flow ("burstiness").'
                        ),
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#ff0080' } }, 'Frontend Features: '), 'A multi-view React interface featuring real-time word/character counters, side-by-side input and output fields, instant clipboard copying, and an integrated contact form powered by Formspree.'
                        ),
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#ff0080' } }, 'Privacy & Protection: '), 'Relies on a strict zero-persistence privacy policy, meaning user text data is processed instantly through the Flask backend API and never stored or logged.'
                        )
                    ),

                    // Footer Container: Tech Stack & Live Link
                    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' } },
                        React.createElement('span', { style: { color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' } }, 'Tech Stack: Flask API / React.js / Python / Regex'),

                        // Interactive Link Button
                        React.createElement('a', {
                            href: 'https://glyphhuman.resumepro.it.com',
                            target: '_blank',
                            rel: 'noopener noreferrer',
                            style: {
                                color: '#ff0080',
                                textDecoration: 'none',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                borderBottom: '1px dashed #ff0080',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            },
                            onMouseEnter: (e) => { e.target.style.color = '#fff'; e.target.style.borderBottomColor = '#fff'; },
                            onMouseLeave: (e) => { e.target.style.color = '#ff0080'; e.target.style.borderBottomColor = '#ff0080'; }
                        }, '🔗 Visit Website')
                    )
                ),
                // Project Node 1: Lets Detect - Fake News Detector Portal
                React.createElement('div', {
                    style: projectCardStyle,
                    onMouseEnter: (e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                        e.currentTarget.style.border = '1px solid rgba(0, 242, 254, 0.3)';
                        e.currentTarget.style.transform = 'translateY(-3px)';
                    },
                    onMouseLeave: (e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                        e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }
                },
                    // Title Row
                    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' } },
                        React.createElement('h4', { style: { color: '#fff', fontSize: '1.35rem', margin: '0', fontWeight: '700' } }, '"Lets Detect" – Fake News Detector Portal'),
                        React.createElement('span', { style: { background: 'rgba(0, 242, 254, 0.1)', color: '#00f2fe', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' } }, 'Live System')
                    ),

                    // Detailed Breakdown Info Hub
                    React.createElement('div', { style: { color: 'rgba(255,255,255,0.72)', fontSize: '0.95rem', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px', lineHeight: '1.6' } },
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#00f2fe' } }, 'Core Purpose: '), 'An AI-powered portal designed to identify fake news, rumors, and misinformation, specifically optimized for English and Urdu contexts.'
                        ),
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#00f2fe' } }, 'The AI Engine: '), 'Utilizes an 8-Layer Hybrid AI Engine that scans text to calculate a fake news score based on clickbait, conspiracies, emotional triggers, and pseudoscience.'
                        ),
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#00f2fe' } }, 'Source Verification: '), 'The system automatically checks news links against trusted domains (like Dawn, Geo, BBC) and flags known unreliable sources.'
                        ),
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#00f2fe' } }, 'Image Scanning (OCR): '), 'Integrates Tesseract.js to extract and verify text directly from uploaded screenshots or news images.'
                        ),
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#00f2fe' } }, 'Security & Privacy: '), 'Features a secure OTP email login and a strict zero-persistence privacy policy that discards user data immediately after scanning.'
                        )
                    ),

                    // Footer Container: Tech Stack & Live Link
                    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' } },
                        React.createElement('span', { style: { color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' } }, 'Tech Stack: Flask (Backend) / React.js (Frontend) / MongoDB'),

                        // Interactive Link Button
                        React.createElement('a', {
                            href: 'https://letsdetect.resumepro.it.com',
                            target: '_blank',
                            rel: 'noopener noreferrer',
                            style: {
                                color: '#00f2fe',
                                textDecoration: 'none',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                borderBottom: '1px dashed #00f2fe',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            },
                            onMouseEnter: (e) => { e.target.style.color = '#fff'; e.target.style.borderBottomColor = '#fff'; },
                            onMouseLeave: (e) => { e.target.style.color = '#00f2fe'; e.target.style.borderBottomColor = '#00f2fe'; }
                        }, '🔗 Visit Website')
                    )
                ),
                // Project Node 3: Resume Pro – All-in-One Productivity Suite
                React.createElement('div', {
                    style: projectCardStyle,
                    onMouseEnter: (e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                        e.currentTarget.style.border = '1px solid rgba(168, 85, 247, 0.3)';
                        e.currentTarget.style.transform = 'translateY(-3px)';
                    },
                    onMouseLeave: (e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                        e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }
                },
                    // Title Row
                    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' } },
                        React.createElement('h4', { style: { color: '#fff', fontSize: '1.35rem', margin: '0', fontWeight: '700' } }, 'Resume Pro – All-in-One Productivity Suite'),
                        React.createElement('span', { style: { background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' } }, 'Core Platform')
                    ),

                    // Core Advantage Highlight
                    React.createElement('p', { style: { color: 'rgba(255,255,255,0.85)', fontSize: '0.98rem', margin: '0 0 15px 0', fontStyle: 'italic', borderLeft: '3px solid #a855f7', paddingLeft: '12px' } },
                        'An all-in-one, browser-based productivity suite designed for job seekers, creators, and professionals. Runs 100% locally in the browser—no data is ever sent to a server, ensuring absolute speed and complete user privacy.'
                    ),

                    // Detailed Breakdown Info Hub
                    React.createElement('div', { style: { color: 'rgba(255,255,255,0.72)', fontSize: '0.95rem', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px', lineHeight: '1.6' } },
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#a855f7' } }, 'Interactive Resume Builder: '), 'A split-screen interface featuring live side-by-side rendering, multi-template switching (Modern, Classic, Minimalist), an integrated education tracker, and seamless ATS-friendly PDF exports.'
                        ),
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#a855f7' } }, 'LinkedIn Banner Studio: '), 'A built-in graphic canvas built to structure high-definition professional banners using dynamic background gradients and customizable geometric layouts.'
                        ),
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#a855f7' } }, '4K Logo Designer: '), 'A rapid branding utility featuring multi-layout adjustments (stacked, horizontal, icon-only) exporting ultra-sharp 4K graphic files with absolute alpha transparency.'
                        ),
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#a855f7' } }, 'Word-to-PDF Converter: '), 'A high-speed drag-and-drop file processing pipeline that instantly converts complex Microsoft Word (.docx) formats into clean, structured PDFs entirely client-side.'
                        ),
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#a855f7' } }, 'Rich Text Document Editor: '), 'An embedded micro-word processor providing direct inline styling, formatting blocks, and instant raw downloads into standard .docx formats.'
                        ),
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#a855f7' } }, 'Zip & Unzip Utilities: '), 'A browser-based archive layer allowing instant granular extraction of individual compressed assets or compilation of multiple data layers into a zipped bundle.'
                        )
                    ),

                    // Footer Container: Tech Stack & Live Link
                    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' } },
                        React.createElement('span', { style: { color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' } }, 'Tech Stack: React.js / Client-Side Web APIs / HTML5 Canvas / JSZip'),

                        // Interactive Link Button
                        React.createElement('a', {
                            href: 'https://resumepro.it.com',
                            target: '_blank',
                            rel: 'noopener noreferrer',
                            style: {
                                color: '#a855f7',
                                textDecoration: 'none',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                borderBottom: '1px dashed #a855f7',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            },
                            onMouseEnter: (e) => { e.target.style.color = '#fff'; e.target.style.borderBottomColor = '#fff'; },
                            onMouseLeave: (e) => { e.target.style.color = '#a855f7'; e.target.style.borderBottomColor = '#a855f7'; }
                        }, '🔗 Visit Website')
                    )
                ),
                // Project Node 4: Quickkit – Gamified Assessment & Trivia Platform
                React.createElement('div', {
                    style: projectCardStyle,
                    onMouseEnter: (e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                        e.currentTarget.style.border = '1px solid rgba(16, 185, 129, 0.3)';
                        e.currentTarget.style.transform = 'translateY(-3px)';
                    },
                    onMouseLeave: (e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                        e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }
                },
                    // Title Row
                    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' } },
                        React.createElement('h4', { style: { color: '#fff', fontSize: '1.35rem', margin: '0', fontWeight: '700' } }, 'Quickkit – Gamified Assessment & Trivia Platform'),
                        React.createElement('span', { style: { background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' } }, 'Gamified System')
                    ),

                    // Core Purpose
                    React.createElement('p', { style: { color: 'rgba(255,255,255,0.85)', fontSize: '0.98rem', margin: '0 0 15px 0' } },
                        'A Gamified Multi-Category Assessment & Trivia Platform designed to test users across a vast range of academic, professional, and pop-culture subjects.'
                    ),

                    // Detailed Breakdown Info Hub
                    React.createElement('div', { style: { color: 'rgba(255,255,255,0.72)', fontSize: '0.95rem', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px', lineHeight: '1.6' } },
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#10b981' } }, '14 Diverse Quiz Categories: '), 'Offers specialized assessments in fields like Web Development (Coder Quiz), Teaching Pedagogy, English Grammar, Mathematics, Sciences (Physics, Chemistry, Biology), Commerce, Pre-Engineering, Psychology, General Knowledge, and Entertainment.'
                        ),
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#10b981' } }, 'Progressive Difficulty Matrix: '), 'Every topic features a 3-tier round system mapping from Basic/Easy, Intermediate/Medium, to Advanced/Hard.'
                        ),
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#10b981' } }, 'Strict Gatekeeping Mechanic: '), 'To keep things challenging, users must score at least 8 out of 10 in their current round to unlock the consecutive higher-difficulty level.'
                        ),
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#10b981' } }, 'Performance Auditing: '), 'Features an automated Efficiency Report at the end of the assessment, calculating overall accuracy percentages and providing broken-down performance metrics for each level.'
                        ),
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#10b981' } }, 'Modern UI Architecture: '), 'Built with a glassmorphism theme (glass-calc-card), featuring real-time responsive progress bars and seamless state navigation.'
                        )
                    ),

                    // Footer Container: Tech Stack & Live Link
                    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' } },
                        React.createElement('span', { style: { color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' } }, 'Tech Stack: React.js / Responsive UI State Architecture / CSS Glassmorphism'),

                        // Interactive Link Button
                        React.createElement('a', {
                            href: 'https://quickkit.resumepro.it.com',
                            target: '_blank',
                            rel: 'noopener noreferrer',
                            style: {
                                color: '#10b981',
                                textDecoration: 'none',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                borderBottom: '1px dashed #10b981',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            },
                            onMouseEnter: (e) => { e.target.style.color = '#fff'; e.target.style.borderBottomColor = '#fff'; },
                            onMouseLeave: (e) => { e.target.style.color = '#10b981'; e.target.style.borderBottomColor = '#10b981'; }
                        }, '🔗 Visit Website')
                    )
                ),

            )
        );
    } else if (currentPage === 'saif-portfolio') {
        const portfolioInputStyle = {
            background: 'linear-gradient(135deg, rgba(20, 20, 30, 0.8), rgba(20, 20, 30, 0.5))',
            padding: '35px',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            color: 'rgba(255, 255, 255, 0.85)',
            lineHeight: '1.8',
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)',
            boxShadow: '0 20px 45px rgba(0,0,0,0.4)',
            width: '100%',
            boxSizing: 'border-box'
        };

        const projectCardStyle = {
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '20px',
            transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)'
        };

        mainElement = React.createElement('main', {
            style: { padding: '40px 20px', minHeight: '85vh', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', boxSizing: 'border-box' }
        },
            React.createElement('button', {
                className: 'card-btn',
                onClick: toPortfolio,
                onMouseEnter: (e) => {
                    e.target.style.background = 'rgba(255,255,255,0.05)';
                    e.target.style.transform = 'translateX(-3px)';
                },
                onMouseLeave: (e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.transform = 'translateX(0)';
                },
                style: { marginBottom: '30px', alignSelf: 'center', borderColor: 'rgba(255,255,255,0.2)', transition: 'all 0.3s ease', cursor: 'pointer' }
            }, '← Back to Team Portfolios'),

            React.createElement('div', {
                style: { width: '100%', maxWidth: '950px', display: 'flex', flexDirection: 'column', gap: '35px' }
            },
                // Header
                React.createElement('div', { 
    style: { 
        ...portfolioInputStyle, 
        display: 'flex',                             // Block configuration se flexbox par shift kiya vertical layout ke liye
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center', 
        background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.05), rgba(255, 0, 128, 0.05))', 
        border: '1px solid rgba(0, 242, 254, 0.15)',
        padding: '30px 20px',                        // Layout margins ko padding cushioning di takay corners tight na laghein
        maxWidth: '95%',                             // Card container auto-adjust hokar screen boundaries ke andar rahega
        margin: '0 auto',
        boxSizing: 'border-box'
    } 
},
    React.createElement('img', {
        src: 'rana.jpeg',                            // Saif Bhai ka image asset source yahan map ho gaya hai
        alt: 'Saif Ur Rehman',
        style: {
            width: 'clamp(100px, 25vw, 130px)',      // Mobile screen sizes par fluid size optimization
            height: 'clamp(100px, 25vw, 130px)',     // Border radius display ratio square to circle tight lock
            borderRadius: '50%',
            objectFit: 'cover',
            marginBottom: '15px',                    // Bottom spacer layout compact kiya
            border: '3px solid #00f2fe',
            boxShadow: '0 0 25px rgba(0, 242, 254, 0.5)',
            display: 'inline-block'
        }
    }),
    React.createElement('h2', {
        style: { 
            fontSize: 'clamp(1.7rem, 5.8vw, 2.8rem)', // Viewport width tracking responsive text sizing mechanism
            fontWeight: '800', 
            margin: '0 0 10px 0', 
            background: 'linear-gradient(90deg, #00f2fe, #ff0080)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent',
            lineHeight: '1.2'
        }
    }, 'Engr. Saif Ur Rehman'),
    React.createElement('p', { 
        style: { 
            color: '#00f2fe', 
            fontWeight: '700', 
            fontSize: 'clamp(1rem, 4vw, 1.2rem)',    // Mobile resolutions par single line execution control karega
            letterSpacing: '0.5px',                  // Clean line tracking compression matrix
            margin: '0 0 15px 0' 
        } 
    }, 'Front End Developer & CEO of Zarvex'),
    React.createElement('p', { 
        style: { 
            maxWidth: '650px', 
            margin: '0 auto', 
            color: 'rgba(255,255,255,0.7)', 
            fontSize: 'clamp(0.95rem, 3.5vw, 1.05rem)', // Bio descriptions paragraphs standard responsive grid setup
            lineHeight: '1.5',
            padding: '0 10px'                        // Low-res mobile displays edge bleeding filtering override
        } 
    }, 'A results-driven Front End Developer and entrepreneur specializing in crafting high-performance, visually immersive web experiences. Passionate about scalable UI architectures, seamless user interactions, and modern web interfaces that deliver real business impact.')
),

                // Two Column
                React.createElement('div', { style: { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '30px', width: '100%' } },

                    // Technical Matrix
                    React.createElement('div', { style: { ...portfolioInputStyle, flex: '1 1 400px' } },
                        React.createElement('h3', { style: { color: '#00f2fe', fontSize: '1.4rem', marginTop: '0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' } }, 'Technical Matrix'),
                        React.createElement('ul', { style: { paddingLeft: '20px', margin: '15px 0 0 0' } },
                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'UI/UX Engineering: '), 'Designing pixel-perfect, responsive interfaces using modern CSS layout systems, Flexbox, Grid, and fluid micro-animations for exceptional user experiences.'),
                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Component Architecture: '), 'Building modular, reusable React.js component systems and interactive real-time user interfaces optimized for scalability and maintainability.'),
                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Performance Optimization: '), 'Enhancing Core Web Vitals, load speeds, and rendering efficiency to deliver lightning-fast experiences across all device types and screen sizes.'),
                            React.createElement('li', { style: { marginBottom: '0px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Cross-Browser Compatibility: '), 'Ensuring consistent, seamless front-end experiences across all major browsers, platforms, and resolutions with rigorous testing standards.')
                        ),
                    ),

                    // Social Profiles
                    React.createElement('div', { style: { ...portfolioInputStyle, flex: '1 1 400px' } },
                        React.createElement('h3', { style: { color: '#00f2fe', fontSize: '1.4rem', marginTop: '0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', letterSpacing: '1px' } }, 'Social Profiles'),
                        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' } },

                            React.createElement('a', {
                                href: 'https://www.instagram.com/rana_saif_rs?utm_source=qr&igsh=b2tsempydWp1MGE4',
                                target: '_blank',
                                rel: 'noopener noreferrer',
                                style: { display: 'block', padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)', textDecoration: 'none', color: '#fff', fontSize: '1.05rem', cursor: 'pointer' }
                            },
                                React.createElement('strong', { style: { color: '#f77737' } }, '📸 Instagram: '), 'Follow on Instagram'
                            ),

                            React.createElement('a', {
                                href: 'https://www.facebook.com/share/18gmTE9e1k/',
                                target: '_blank',
                                rel: 'noopener noreferrer',
                                style: { display: 'block', padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)', textDecoration: 'none', color: '#fff', fontSize: '1.05rem', cursor: 'pointer' }
                            },
                                React.createElement('strong', { style: { color: '#1877f2' } }, '🔵 Facebook: '), 'Connect on Facebook'
                            ),

                            React.createElement('a', {
                                href: '#',
                                style: { display: 'block', padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)', textDecoration: 'none', color: 'rgba(255,255,255,0.35)', fontSize: '1.05rem', cursor: 'default' }
                            },
                                React.createElement('strong', { style: { color: 'rgba(255,255,255,0.35)' } }, '🧵 Threads: '), 'Not Available'
                            ),

                            React.createElement('a', {
                                href: 'https://www.linkedin.com/in/saif-ur-rehman-5a9856213?utm_source=share_via&utm_content=profile&utm_medium=member_android',
                                target: '_blank',
                                rel: 'noopener noreferrer',
                                style: { display: 'block', padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)', textDecoration: 'none', color: '#fff', fontSize: '1.05rem', cursor: 'pointer' }
                            },
                                React.createElement('strong', { style: { color: '#0077b5' } }, '💼 LinkedIn: '), 'Connect on LinkedIn'
                            )
                        )
                    ),

                    // Skills + Academic
                    React.createElement('div', { style: { ...portfolioInputStyle, flex: '1 1 400px' } },
                        React.createElement('h3', { style: { color: '#ff0080', fontSize: '1.4rem', marginTop: '0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' } }, 'Skills'),
                        React.createElement('ul', { style: { paddingLeft: '20px', margin: '15px 0 0 0', listStyleType: 'square' } },
                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'HTML5: '), 'Proficient in writing semantic, SEO-optimized, and fully accessible web structures ensuring cross-browser compatibility and clean code standards.'),
                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'CSS3: '), 'Experienced in crafting highly responsive, pixel-perfect interfaces using Flexbox, Grid, animations, and modern design principles.'),
                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'JavaScript: '), 'Strong command over dynamic client-side logic, asynchronous operations, and high-performance DOM manipulation.'),
                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'React.js: '), 'Advanced capability in building modular, reusable component systems and interactive real-time user interfaces with state management.'),
                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Figma & UI Design: '), 'Skilled in translating high-fidelity design mockups into production-ready, visually accurate front-end code.'),
                            React.createElement('li', { style: { marginBottom: '20px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Microsoft Office: '), 'Competent in professional documentation, data management, and structured business reporting.'),

                            React.createElement('li', { style: { listStyleType: 'none', marginLeft: '-20px', marginBottom: '12px', color: '#ff0080', fontWeight: '700', fontSize: '1.1rem' } }, '🎓 Academic Journey'),


                            React.createElement('li', { style: { marginBottom: '10px', fontSize: '0.95rem' } },
                                React.createElement('strong', { style: { color: '#fff' } }, 'Graduation: '), 'Ilma University (2022 – 2026)'
                            ),
                            React.createElement('li', { style: { marginBottom: '10px', fontSize: '0.95rem' } },
                                React.createElement('strong', { style: { color: '#fff' } }, 'Intermediate: '), 'Punjab Group Of Colleges (2019 – 2021)'
                            ),
                            React.createElement('li', { style: { marginBottom: '0px', fontSize: '0.95rem' } },
                                React.createElement('strong', { style: { color: '#fff' } }, 'Matric: '), 'Afaq Board (2018 – 2019)'
                            )
                        )
                    ),

                    // Companies & Experience
                    React.createElement('div', { style: { ...portfolioInputStyle, flex: '1 1 400px' } },
                        React.createElement('h3', { style: { color: '#ff0080', fontSize: '1.4rem', marginTop: '0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' } }, 'Companies'),
                        React.createElement('ul', { style: { paddingLeft: '20px', margin: '15px 0 0 0', listStyleType: 'square' } },
                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Zarvex: '), 'Serving as CEO and Co-Founder of Zarvex, leading the company\'s strategic vision while actively contributing as a Front End Developer — building scalable, high-performance digital products and managing end-to-end client solutions.'),
                            React.createElement('li', { style: { marginBottom: '20px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Apex Code: '), 'Partnered with Apex Code as a Front End Developer, collaborating on enterprise-grade web projects and delivering cutting-edge digital solutions across multiple client platforms.'),

                            React.createElement('li', { style: { listStyleType: 'none', marginLeft: '-20px', marginBottom: '12px', color: '#ff0080', fontWeight: '700', fontSize: '1.1rem' } }, 'Experience'),

                            React.createElement('li', { style: { marginBottom: '10px', fontSize: '0.95rem' } },
                                React.createElement('strong', { style: { color: '#fff' } }, 'CEO & Front End Developer: '), 'Zarvex (01-April-2026 – Present)'
                            ),
                            React.createElement('li', { style: { marginBottom: '10px', fontSize: '0.95rem' } },
                                React.createElement('strong', { style: { color: '#fff' } }, 'Front End Developer: '), 'Apex Code (20-June-2026 – Present)'
                            ),
                        )
                    ),
                ),

                // Project cards — unchanged, paste your existing project nodes here
            )
        );
    } else if (currentPage === 'usman-portfolio') {

        const portfolioInputStyle = {
            background: 'linear-gradient(135deg, rgba(20, 20, 30, 0.8), rgba(20, 20, 30, 0.5))',
            padding: '35px',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            color: 'rgba(255, 255, 255, 0.85)',
            lineHeight: '1.8',
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)',
            boxShadow: '0 20px 45px rgba(0,0,0,0.4)',
            width: '100%',
            boxSizing: 'border-box'
        };

        const projectCardStyle = {
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '20px',
            transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)'
        };

        mainElement = React.createElement('main', {
            style: { padding: '40px 20px', minHeight: '85vh', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', boxSizing: 'border-box' }
        },
            // Back to Team Button with Glow Interaction
            React.createElement('button', {
                className: 'card-btn',
                onClick: toPortfolio,
                onMouseEnter: (e) => {
                    e.target.style.background = 'rgba(255,255,255,0.05)';
                    e.target.style.transform = 'translateX(-3px)';
                },
                onMouseLeave: (e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.transform = 'translateX(0)';
                },
                style: { marginBottom: '30px', alignSelf: 'center', borderColor: 'rgba(255,255,255,0.2)', transition: 'all 0.3s ease', cursor: 'pointer' }
            }, '← Back to Team Portfolios'),

            // Main Profile Window
            React.createElement('div', {
                style: { width: '100%', maxWidth: '950px', display: 'flex', flexDirection: 'column', gap: '35px' }
            },
                // Header Intro Section
                React.createElement('div', { 
    style: { 
        ...portfolioInputStyle, 
        display: 'flex',                             
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center', 
        background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.05), rgba(255, 0, 128, 0.05))', 
        border: '1px solid rgba(0, 242, 254, 0.15)',
        padding: '30px 15px',                        // Padding thodi mazeed optimize ki mobile edges ke liye
        maxWidth: '95%',                             
        margin: '0 auto',
        boxSizing: 'border-box'
    } 
},
    React.createElement('img', {
        src: 'usman.jpeg',                           
        alt: 'Usman Nadeem',
        style: {
            width: 'clamp(90px, 22vw, 130px)',      // Mobile par size thoda aur streamline kiya taaki space bache
            height: 'clamp(90px, 22vw, 130px)',     
            borderRadius: '50%',
            objectFit: 'cover',
            marginBottom: '15px',                    
            border: '3px solid #00f2fe',
            boxShadow: '0 0 25px rgba(0, 242, 254, 0.5)',
            display: 'inline-block'
        }
    }),
    React.createElement('h2', {
        style: { 
            fontSize: 'clamp(1.2rem, 5.5vw, 2.4rem)', // Font scale ko thoda scale-down kiya taaki ek line me fit aye
            fontWeight: '800', 
            margin: '0 0 10px 0', 
            whiteSpace: 'nowrap',                    // STRICT LOCK: Kisi bhi haal me text 2 lines me nahi tootega
            background: 'linear-gradient(90deg, #00f2fe, #ff0080)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent',
            lineHeight: '1.2'
        }
    }, 'Engr. Usman Nadeem'),
    React.createElement('p', { 
        style: { 
            color: '#00f2fe', 
            fontWeight: '700', 
            fontSize: 'clamp(0.9rem, 3.8vw, 1.2rem)', // Isko bhi balance kiya heading ke mutabiq
            letterSpacing: '0.5px',                  
            margin: '0 0 15px 0' 
        } 
    }, 'Lead Software Engineer & Full-Stack Developer'),
    React.createElement('p', { 
        style: { 
            maxWidth: '650px', 
            margin: '0 auto', 
            color: 'rgba(255,255,255,0.7)', 
            fontSize: 'clamp(0.9rem, 3.5vw, 1.05rem)', 
            lineHeight: '1.5',
            padding: '0 5px'                        
        } 
    }, 'Specializing in dynamic web scaling, automated API architecture, and enterprise cloud deployments. Passionate about building intelligent core logic structures that optimize processing speeds and modern web utility.')
),

                // Two Column Breakdown: Core Experience & Technical Expertise
                React.createElement('div', { style: { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '30px', width: '100%' } },
                    // Left Column: Core Expertise
                    React.createElement('div', { style: { ...portfolioInputStyle, flex: '1 1 400px' } },
                        React.createElement('h3', { style: { color: '#00f2fe', fontSize: '1.4rem', marginTop: '0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' } }, 'Technical Matrix'),
                        React.createElement('ul', { style: { paddingLeft: '20px', margin: '15px 0 0 0' } },
                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Backend & CMS Architecture: '), 'Robust WordPress ecosystem management utilizing custom theme development, bespoke plugin architecture, and optimized server-side logic for high-scale performance.'),
                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Frontend Engineering: '), 'Pixel-perfect UI/UX pipelines built with modern frontend frameworks and semantic CSS, ensuring absolute rendering smoothness and lightning-fast page load speeds.'),
                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Database & Cloud Deployment: '), 'Scalable infrastructure mastery with live cloud-database integration (MongoDB Atlas) and enterprise-grade deployment workflows across high-speed platforms (Vercel, Render, managed hosting).'),
                            React.createElement('li', { style: { marginBottom: '0px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Growth & Monetization: '), 'Advanced SEO and traffic optimization using data-driven tracking scripts, search ranking intelligence, and conversion-focused monetization architecture for maximum revenue yield.')
                        ),

                    ), // <--- Yeh comma Left aur Right column ko alag karta hai
                    React.createElement('div', { style: { ...portfolioInputStyle, flex: '1 1 400px' } },
                        React.createElement('h3', { style: { color: '#00f2fe', fontSize: '1.4rem', marginTop: '0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', letterSpacing: '1px' } }, 'Social Profiles'),
                        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' } },

                            // Instagram Link
                            React.createElement('a', {
                                href: 'https://www.instagram.com/usman_qureshi2002?igsh=MWVnMTZtOXJjOHppcQ==',
                                target: '_blank',
                                rel: 'noopener noreferrer',
                                style: { display: 'block', padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)', textDecoration: 'none', color: '#fff', fontSize: '1.05rem', cursor: 'pointer' }
                            },
                                React.createElement('strong', { style: { color: '#f77737' } }, '📸 Instagram: '), 'Follow on Instagram'
                            ),

                            // Facebook Link
                            React.createElement('a', {
                                href: 'https://www.facebook.com/share/1D1QBJQtTa/',
                                target: '_blank',
                                rel: 'noopener noreferrer',
                                style: { display: 'block', padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)', textDecoration: 'none', color: '#fff', fontSize: '1.05rem', cursor: 'pointer' }
                            },
                                React.createElement('strong', { style: { color: '#1877f2' } }, '🔵 Facebook: '), 'Connect on Facebook'
                            ),

                            // Threads Link
                            React.createElement('a', {
                                href: '#',
                                target: '_blank',
                                rel: 'noopener noreferrer',
                                style: { display: 'block', padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)', textDecoration: 'none', color: '#fff', fontSize: '1.05rem', cursor: 'pointer' }
                            },
                                React.createElement('strong', { style: { color: '#fff', textShadow: '0 0 5px rgba(255,255,255,0.3)' } }, '🧵 Threads: '), 'View Threads Profile'
                            ),

                            // LinkedIn Link
                            React.createElement('a', {
                                href: 'https://www.linkedin.com/in/usman-qureshi-a09662402?utm_source=share_via&utm_content=profile&utm_medium=member_android',
                                target: '_blank',
                                rel: 'noopener noreferrer',
                                style: { display: 'block', padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)', textDecoration: 'none', color: '#fff', fontSize: '1.05rem', cursor: 'pointer' }
                            },
                                React.createElement('strong', { style: { color: '#0077b5' } }, '💼 LinkedIn: '), 'Let\'s Network on LinkedIn'
                            )
                        )
                    ),
                    // Right Column: Education & Agency Details
                    React.createElement('div', { style: { ...portfolioInputStyle, flex: '1 1 400px' } },
                        React.createElement('h3', { style: { color: '#ff0080', fontSize: '1.4rem', marginTop: '0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' } }, 'Skills'),
                        React.createElement('ul', { style: { paddingLeft: '20px', margin: '15px 0 0 0', listStyleType: 'square' } },
                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'HTML: '), 'Proficient in architecting clean, semantic, and SEO-friendly web structures to ensure absolute cross-browser accessibility.'),
                            React.createElement('li', { style: { marginBottom: '20px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'CSS: '), 'Experienced in crafting highly responsive, pixel-perfect interfaces using modern design principles, layouts, and smooth transition animations.'),
                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Javascript: '), 'Strong expertise in implementing complex, declarative client-side logic and managing high-performance asynchronous state operations.'),
                            React.createElement('li', { style: { marginBottom: '20px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'React.JS: '), 'Advanced capability in building modular, reusable component systems and interactive, real-time user interfaces.'),
                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Wordpress: '), 'Specialized in custom WordPress development and high-speed frontend solutions. Lets start your project.'),
                            React.createElement('li', { style: { marginBottom: '20px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Microsoft Office: '), 'Competent in managing professional documentation, advanced data sorting, and structuring clean business operational reports.'),

                            // Custom Sub-heading for Academic Timeline
                            React.createElement('li', { style: { listStyleType: 'none', marginLeft: '-20px', marginBottom: '12px', color: '#ff0080', fontWeight: '700', fontSize: '1.1rem' } }, '🎓 Academic Journey'),

                            React.createElement('li', { style: { marginBottom: '10px', fontSize: '0.95rem' } },
                                React.createElement('strong', { style: { color: '#fff' } }, 'Graduation: '), 'Ilma University (2022 - 2026)'
                            ),
                            React.createElement('li', { style: { marginBottom: '10px', fontSize: '0.95rem' } },
                                React.createElement('strong', { style: { color: '#fff' } }, 'Intermediate: '), 'Army Public School & College (2020 - 2022)'
                            ),
                            React.createElement('li', { style: { marginBottom: '0px', fontSize: '0.95rem' } },
                                React.createElement('strong', { style: { color: '#fff' } }, 'Matric : '), 'Iqra Huffaz Boys Secondary School (2019 - 2020)'
                            )
                        )
                    ),
                    // Right Column: Education & Agency Details
                    React.createElement('div', { style: { ...portfolioInputStyle, flex: '1 1 400px' } },
                        React.createElement('h3', { style: { color: '#ff0080', fontSize: '1.4rem', marginTop: '0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' } }, 'Companies Which I Work For'),
                        React.createElement('ul', { style: { paddingLeft: '20px', margin: '15px 0 0 0', listStyleType: 'square' } },
                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Apex Code: '), 'As A Cheif Operating Officer of Apex Code, I drive the companys strategic vision while actively architecting core platforms.'),
                            React.createElement('li', { style: { marginBottom: '20px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Research Teq: '), 'Previously worked as a Wordpress Developer at Research Teq, handling end-to-end wordpress development and engineering scalable digital solutions. .'),

                            // Custom Sub-heading for Academic Timeline
                            React.createElement('li', { style: { listStyleType: 'none', marginLeft: '-20px', marginBottom: '12px', color: '#ff0080', fontWeight: '700', fontSize: '1.1rem' } }, 'Experience'),

                            React.createElement('li', { style: { marginBottom: '10px', fontSize: '0.95rem' } },
                                React.createElement('strong', { style: { color: '#fff' } }, 'Wordpress + Frontend Developer: '), 'Apex Code (30-April-2025 - Present)'
                            ),
                            React.createElement('li', { style: { marginBottom: '10px', fontSize: '0.95rem' } },
                                React.createElement('strong', { style: { color: '#fff' } }, 'Wordpress Developer: '), 'Research Teq (01-Nov-2023 - 05-Nov-2024)'
                            ),
                        )
                    ),
                ),

                // Exclusive Interactive Projects Hub (Option requested)
                // Project Node 2: GlyphHuman - AI Text Humanizer & Detector Portal
                React.createElement('div', {
                    style: projectCardStyle,
                    onMouseEnter: (e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                        e.currentTarget.style.border = '1px solid rgba(255, 0, 128, 0.3)';
                        e.currentTarget.style.transform = 'translateY(-3px)';
                    },
                    onMouseLeave: (e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                        e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }

                },

                    // Title Row
                    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' } },
                        React.createElement('h4', { style: { color: '#fff', fontSize: '1.35rem', margin: '0', fontWeight: '700' } }, '"Healthy Habits Hub" – For A Better Lifestyle'),
                        React.createElement('span', { style: { background: 'rgba(255, 0, 128, 0.1)', color: '#ff0080', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' } }, 'Active Service')
                    ),

                    // Detailed Breakdown Info Hub
                    React.createElement('div', { style: { color: 'rgba(255,255,255,0.72)', fontSize: '0.95rem', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px', lineHeight: '1.6' } },
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#ff0080' } }, 'Mental & Emotional Clarity: '), 'True wellness goes beyond the physical. Discover mindfulness routines, stress-management frameworks, and deep cognitive balance.'
                        ),
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#ff0080' } }, 'Sustainable Fitness: '), 'UMove with purpose. Explore practical workout strategies and habit-stacking methods tailored for busy modern routines.'
                        ),

                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#ff0080' } }, 'Mindful Nutrition: '), 'Learn to fuel your mind and body with wholesome, nutrient-dense foods without feeling restricted by extreme diets.'
                        ),
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#ff0080' } }, 'About Us: '), 'Welcome to HealthyHabitsHubb – Your ultimate destination for holistic and sustainable wellness. We firmly believe that true transformation doesn’t happen through radical overhauls, but through the micro-habits we practice every single day. Our mission is to filter out the noise and provide you with actionable, realistic guidance across nutrition, mental clarity, and physical fitness. We are here to support you in bridging the gap between where you are and where you want to be.'
                        )
                    ),

                    // Footer Container: Tech Stack & Live Link
                    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' } },
                        React.createElement('span', { style: { color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' } }, 'Tech Stack: Wordpress Development'),

                        // Interactive Link Button
                        React.createElement('a', {
                            href: 'https://healthyhabitshubb.com/',
                            target: '_blank',
                            rel: 'noopener noreferrer',
                            style: {
                                color: '#ff0080',
                                textDecoration: 'none',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                borderBottom: '1px dashed #ff0080',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            },
                            onMouseEnter: (e) => { e.target.style.color = '#fff'; e.target.style.borderBottomColor = '#fff'; },
                            onMouseLeave: (e) => { e.target.style.color = '#ff0080'; e.target.style.borderBottomColor = '#ff0080'; }
                        }, '🔗 Visit Website')
                    )
                ),

            )
        );
    } else if (currentPage === 'abdulnafay-portfolio') {

        const portfolioInputStyle = {
            background: 'linear-gradient(135deg, rgba(20, 20, 30, 0.8), rgba(20, 20, 30, 0.5))',
            padding: '35px',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            color: 'rgba(255, 255, 255, 0.85)',
            lineHeight: '1.8',
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)',
            boxShadow: '0 20px 45px rgba(0,0,0,0.4)',
            width: '100%',
            boxSizing: 'border-box'
        };

        const projectCardStyle = {
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '20px',
            transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)'
        };

        mainElement = React.createElement('main', {
            style: { padding: '40px 20px', minHeight: '85vh', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', boxSizing: 'border-box' }
        },
            // Back to Team Button with Glow Interaction
            React.createElement('button', {
                className: 'card-btn',
                onClick: toPortfolio,
                onMouseEnter: (e) => {
                    e.target.style.background = 'rgba(255,255,255,0.05)';
                    e.target.style.transform = 'translateX(-3px)';
                },
                onMouseLeave: (e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.transform = 'translateX(0)';
                },
                style: { marginBottom: '30px', alignSelf: 'center', borderColor: 'rgba(255,255,255,0.2)', transition: 'all 0.3s ease', cursor: 'pointer' }
            }, '← Back to Team Portfolios'),

            // Main Profile Window
            React.createElement('div', {
                style: { width: '100%', maxWidth: '950px', display: 'flex', flexDirection: 'column', gap: '35px' }
            },
                // Header Intro Section
                React.createElement('div', { 
    style: { 
        ...portfolioInputStyle, 
        display: 'flex',                             // Layout block chain se flexbox runtime par shift kiya
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center', 
        background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.05), rgba(255, 0, 128, 0.05))', 
        border: '1px solid rgba(0, 242, 254, 0.15)',
        padding: '30px 20px',                        // Content padding structural buffering mobile ke liye optimize ki
        maxWidth: '95%',                             // Mobile device boundaries ke andar template safe rahega
        margin: '0 auto',
        boxSizing: 'border-box'
    } 
},
    React.createElement('img', {
        src: 'nafay.jpeg',                           // Nafay Bhai ka asset pointer update ho gaya hai
        alt: 'Abdul Nafay',
        style: {
            width: 'clamp(100px, 25vw, 130px)',      // Responsive viewports compression track matrix
            height: 'clamp(100px, 25vw, 130px)',     // Circle overflow filter system lock
            borderRadius: '50%',
            objectFit: 'cover',
            marginBottom: '15px',                    // Layout tracking compact kiya
            border: '3px solid #00f2fe',
            boxShadow: '0 0 25px rgba(0, 242, 254, 0.5)',
            display: 'inline-block'
        }
    }),
    React.createElement('h2', {
        style: { 
            fontSize: 'clamp(1.7rem, 5.8vw, 2.8rem)', // Display grid font spacing compression code
            fontWeight: '800', 
            margin: '0 0 10px 0', 
            background: 'linear-gradient(90deg, #00f2fe, #ff0080)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent',
            lineHeight: '1.2'
        }
    }, 'Engr. Abdul Nafay'),
    React.createElement('p', { 
        style: { 
            color: '#00f2fe', 
            fontWeight: '700', 
            fontSize: 'clamp(1rem, 4vw, 1.2rem)',    // Title string scale logic mapping
            letterSpacing: '0.5px',                  // Clean multi-device text rendering optimization
            margin: '0 0 15px 0' 
        } 
    }, 'Lead Wordpress Developer'),
    React.createElement('p', { 
        style: { 
            maxWidth: '650px', 
            margin: '0 auto', 
            color: 'rgba(255,255,255,0.7)', 
            fontSize: 'clamp(0.95rem, 3.5vw, 1.05rem)', // Bio description layout text viewport fluid
            lineHeight: '1.5',
            padding: '0 10px'                        // Edge alignment safe space protection filter
        } 
    }, 'Specializing in dynamic WordPress scaling, automated REST/GraphQL API architecture, and enterprise cloud deployments. Passionate about building intelligent core logic structures, decoupled (headless) solutions, and custom plugin architectures that optimize processing speeds and modern web utility.')
),

                // Two Column Breakdown: Core Experience & Technical Expertise
                React.createElement('div', { style: { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '30px', width: '100%' } },
                    // Left Column: Core Expertise
                    React.createElement('div', { style: { ...portfolioInputStyle, flex: '1 1 400px' } },
                        React.createElement('h3', { style: { color: '#00f2fe', fontSize: '1.4rem', marginTop: '0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' } }, 'Technical Matrix'),
                        React.createElement('ul', { style: { paddingLeft: '20px', margin: '15px 0 0 0' } },
                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Backend Engineering: '), 'rchitecting robust, decoupled WordPress backends using custom REST/GraphQL APIs, optimized hooks, and scalable data pipelines for seamless third-party and mobile app integrations.'),
                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'WordPress Engineering: '), 'Declarative UI workflows built with React-driven Gutenberg blocks and modular frameworks for absolute rendering smoothness and optimized Core Web Vitals.'),
                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Database & Cloud Mastery: '), 'Intricate structure management on distributed clouds (Render, Vercel) alongside live database setups (MongoDB Atlas).'),
                            React.createElement('li', { style: { marginBottom: '0px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Growth & Monetization: '), 'Optimizing platform tracking systems using precision script structures and search ranking metrics.')
                        ),

                    ), // <--- Yeh comma Left aur Right column ko alag karta hai
                    React.createElement('div', { style: { ...portfolioInputStyle, flex: '1 1 400px' } },
                        React.createElement('h3', { style: { color: '#00f2fe', fontSize: '1.4rem', marginTop: '0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', letterSpacing: '1px' } }, 'Social Profiles'),
                        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' } },

                            // Instagram Link
                            React.createElement('a', {
                                href: 'https://www.instagram.com/uurr_spidey?igsh=MXR4eGhrcXYyYzFjMw==',
                                target: '_blank',
                                rel: 'noopener noreferrer',
                                style: { display: 'block', padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)', textDecoration: 'none', color: '#fff', fontSize: '1.05rem', cursor: 'pointer' }
                            },
                                React.createElement('strong', { style: { color: '#f77737' } }, '📸 Instagram: '), 'Follow on Instagram'
                            ),

                            // Facebook Link
                            React.createElement('a', {
                                href: 'https://www.facebook.com/share/1JpMTRHay5/',
                                target: '_blank',
                                rel: 'noopener noreferrer',
                                style: { display: 'block', padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)', textDecoration: 'none', color: '#fff', fontSize: '1.05rem', cursor: 'pointer' }
                            },
                                React.createElement('strong', { style: { color: '#1877f2' } }, '🔵 Facebook: '), 'Connect on Facebook'
                            ),

                            // Threads Link
                            React.createElement('a', {
                                href: '#',
                                target: '_blank',
                                rel: 'noopener noreferrer',
                                style: { display: 'block', padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)', textDecoration: 'none', color: '#fff', fontSize: '1.05rem', cursor: 'pointer' }
                            },
                                React.createElement('strong', { style: { color: '#fff', textShadow: '0 0 5px rgba(255,255,255,0.3)' } }, '🧵 Threads: '), 'View Threads Profile'
                            ),

                            // LinkedIn Link
                            React.createElement('a', {
                                href: 'https://www.linkedin.com/in/abdul-nafay-442473246?utm_source=share_via&utm_content=profile&utm_medium=member_android',
                                target: '_blank',
                                rel: 'noopener noreferrer',
                                style: { display: 'block', padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)', textDecoration: 'none', color: '#fff', fontSize: '1.05rem', cursor: 'pointer' }
                            },
                                React.createElement('strong', { style: { color: '#0077b5' } }, '💼 LinkedIn: '), 'Let\'s Network on LinkedIn'
                            )
                        )
                    ),
                    // Right Column: Education & Agency Details
                    React.createElement('div', { style: { ...portfolioInputStyle, flex: '1 1 400px' } },
                        React.createElement('h3', { style: { color: '#ff0080', fontSize: '1.4rem', marginTop: '0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' } }, 'Skills'),
                        React.createElement('ul', { style: { paddingLeft: '20px', margin: '15px 0 0 0', listStyleType: 'square' } },
                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'HTML: '), 'Proficient in architecting clean, semantic, and SEO-friendly web structures to ensure absolute cross-browser accessibility.'),
                            React.createElement('li', { style: { marginBottom: '20px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'CSS: '), 'Experienced in crafting highly responsive, pixel-perfect interfaces using modern design principles, layouts, and smooth transition animations.'),
                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'WordPress: '), 'Declarative UI workflows built with React-driven Gutenberg blocks and modular frameworks for absolute rendering smoothness and optimized Core Web Vitals.'),
                            React.createElement('li', { style: { marginBottom: '20px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Microsoft Office: '), 'Competent in managing professional documentation, advanced data sorting, and structuring clean business operational reports.'),

                            // Custom Sub-heading for Academic Timeline
                            React.createElement('li', { style: { listStyleType: 'none', marginLeft: '-20px', marginBottom: '12px', color: '#ff0080', fontWeight: '700', fontSize: '1.1rem' } }, '🎓 Academic Journey'),


                            React.createElement('li', { style: { marginBottom: '10px', fontSize: '0.95rem' } },
                                React.createElement('strong', { style: { color: '#fff' } }, 'Graduation: '), 'Ilma University (2022 - 2026)'
                            ),
                            React.createElement('li', { style: { marginBottom: '10px', fontSize: '0.95rem' } },
                                React.createElement('strong', { style: { color: '#fff' } }, 'Intermediate: '), 'Board Of intermidite & Secondry Education, Hyderabad (2019 - 2021)'
                            ),
                            React.createElement('li', { style: { marginBottom: '0px', fontSize: '0.95rem' } },
                                React.createElement('strong', { style: { color: '#fff' } }, 'Matric : '), 'Board Of Secondry Education Karachi (2018 - 2019)'
                            )
                        )
                    ),
                    // Right Column: Education & Agency Details
                    React.createElement('div', { style: { ...portfolioInputStyle, flex: '1 1 400px' } },
                        React.createElement('h3', { style: { color: '#ff0080', fontSize: '1.4rem', marginTop: '0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' } }, 'Companies Which I Work For'),
                        React.createElement('ul', { style: { paddingLeft: '20px', margin: '15px 0 0 0', listStyleType: 'square' } },
                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Apex Code: '), 'As a Lead WordPress Developer at Apex Code, I drive the technical execution of platform strategies while actively architecting core full-stack systems and custom WordPress architectures.'),
                            React.createElement('li', { style: { marginBottom: '20px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Hexsoltexh: '), 'I am a dedicated WordPress Developer with over 1 year of professional experience in designing and developing modern, responsive, and user-friendly websites. I have successfully worked on 50+ live websites, delivering high-quality solutions for clients across different industries.'),

                            // Custom Sub-heading for Academic Timeline
                            React.createElement('li', { style: { listStyleType: 'none', marginLeft: '-20px', marginBottom: '12px', color: '#ff0080', fontWeight: '700', fontSize: '1.1rem' } }, 'Experience'),

                            React.createElement('li', { style: { marginBottom: '10px', fontSize: '0.95rem' } },
                                React.createElement('strong', { style: { color: '#fff' } }, 'Full-Stack Developer: '), 'Apex Code (30-May-2026 - Present)'
                            ),
                            React.createElement('li', { style: { marginBottom: '10px', fontSize: '0.95rem' } },
                                React.createElement('strong', { style: { color: '#fff' } }, 'Full-Stack Developer: '), 'Hexsoltexh (01-June-2025 - Present)'
                            ),
                        )
                    ),
                ),

                // Exclusive Interactive Projects Hub (Option requested)
                // Project Node 2: GlyphHuman - AI Text Humanizer & Detector Portal
                React.createElement('div', {
                    style: projectCardStyle,
                    onMouseEnter: (e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                        e.currentTarget.style.border = '1px solid rgba(255, 0, 128, 0.3)';
                        e.currentTarget.style.transform = 'translateY(-3px)';
                    },
                    onMouseLeave: (e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                        e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }

                },

                    // Title Row
                    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' } },
                        React.createElement('h4', { style: { color: '#fff', fontSize: '1.35rem', margin: '0', fontWeight: '700' } }, '"GlyphHuman" – AI Text Humanizer & Detector Portal'),
                        React.createElement('span', { style: { background: 'rgba(255, 0, 128, 0.1)', color: '#ff0080', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' } }, 'Active Service')
                    ),

                    // Detailed Breakdown Info Hub
                    React.createElement('div', { style: { color: 'rgba(255,255,255,0.72)', fontSize: '0.95rem', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px', lineHeight: '1.6' } },
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#ff0080' } }, 'Core Purpose: '), 'A web-based application designed to convert robotic, AI-generated text into a natural, human-like writing style and analyze text to calculate AI probability scores.'
                        ),
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#ff0080' } }, 'The Detector Engine: '), 'Uses a customized rule-based algorithm in Python to check keyword density (tracking words like delve, moreover, tapestry), vocabulary richness, and sentence length patterns to output an AI vs. Human percentage.'
                        ),
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#ff0080' } }, 'The Humanizer Engine: '), 'Utilizes pure Python and regex logic instead of a heavy AI model. It works by randomly replacing robotic phrases with casual human synonyms and altering long sentence structures to mimic natural human writing flow ("burstiness").'
                        ),
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#ff0080' } }, 'Frontend Features: '), 'A multi-view React interface featuring real-time word/character counters, side-by-side input and output fields, instant clipboard copying, and an integrated contact form powered by Formspree.'
                        ),
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#ff0080' } }, 'Privacy & Protection: '), 'Relies on a strict zero-persistence privacy policy, meaning user text data is processed instantly through the Flask backend API and never stored or logged.'
                        )
                    ),

                    // Footer Container: Tech Stack & Live Link
                    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' } },
                        React.createElement('span', { style: { color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' } }, 'Tech Stack: Flask API / React.js / Python / Regex'),

                        // Interactive Link Button
                        React.createElement('a', {
                            href: 'https://glyphhuman.resumepro.it.com',
                            target: '_blank',
                            rel: 'noopener noreferrer',
                            style: {
                                color: '#ff0080',
                                textDecoration: 'none',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                borderBottom: '1px dashed #ff0080',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            },
                            onMouseEnter: (e) => { e.target.style.color = '#fff'; e.target.style.borderBottomColor = '#fff'; },
                            onMouseLeave: (e) => { e.target.style.color = '#ff0080'; e.target.style.borderBottomColor = '#ff0080'; }
                        }, '🔗 Visit Website')
                    )
                ),

            )
        );
    } else if (currentPage === 'abrar-portfolio') {

        const portfolioInputStyle = {
            background: 'linear-gradient(135deg, rgba(20, 20, 30, 0.8), rgba(20, 20, 30, 0.5))',
            padding: '35px',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            color: 'rgba(255, 255, 255, 0.85)',
            lineHeight: '1.8',
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)',
            boxShadow: '0 20px 45px rgba(0,0,0,0.4)',
            width: '100%',
            boxSizing: 'border-box'
        };

        const projectCardStyle = {
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '20px',
            transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)'
        };

        mainElement = React.createElement('main', {
            style: { padding: '40px 20px', minHeight: '85vh', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', boxSizing: 'border-box' }
        },
            // Back to Team Button with Glow Interaction
            React.createElement('button', {
                className: 'card-btn',
                onClick: toPortfolio,
                onMouseEnter: (e) => {
                    e.target.style.background = 'rgba(255,255,255,0.05)';
                    e.target.style.transform = 'translateX(-3px)';
                },
                onMouseLeave: (e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.transform = 'translateX(0)';
                },
                style: { marginBottom: '30px', alignSelf: 'center', borderColor: 'rgba(255,255,255,0.2)', transition: 'all 0.3s ease', cursor: 'pointer' }
            }, '← Back to Team Portfolios'),

            // Main Profile Window
            React.createElement('div', {
                style: { width: '100%', maxWidth: '950px', display: 'flex', flexDirection: 'column', gap: '35px' }
            },
                // Header Intro Section
                React.createElement('div', { 
    style: { 
        ...portfolioInputStyle, 
        display: 'flex',                             // Block chain se pure flexbox par shift kiya vertical architecture ke liye
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center', 
        background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.05), rgba(255, 0, 128, 0.05))', 
        border: '1px solid rgba(0, 242, 254, 0.15)',
        padding: '30px 20px',                        // Layout cushioning takay mobile display tight na ho
        maxWidth: '95%',                             // Card browser grid ke mutabiq screen borders me compress ho sakega
        margin: '0 auto',
        boxSizing: 'border-box'
    } 
},
    React.createElement('img', {
        src: 'abrar.jpeg',                           // Abrar Bhai ka profile image mapping path
        alt: 'Abrar Jamshed',
        style: {
            width: 'clamp(100px, 25vw, 130px)',      // Small screens par automatic downscale tracking matrix
            height: 'clamp(100px, 25vw, 130px)',     // Circle alignment ratio square to round safe zone
            borderRadius: '50%',
            objectFit: 'cover',
            marginBottom: '15px',                    // Bottom spacing text compression layout optimal kiya
            border: '3px solid #00f2fe',
            boxShadow: '0 0 25px rgba(0, 242, 254, 0.5)',
            display: 'inline-block'
        }
    }),
    React.createElement('h2', {
        style: { 
            fontSize: 'clamp(1.7rem, 5.8vw, 2.8rem)', // Viewport variable mapping taaki name string screen width ke sath wrap ho
            fontWeight: '800', 
            margin: '0 0 10px 0', 
            background: 'linear-gradient(90deg, #00f2fe, #ff0080)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent',
            lineHeight: '1.2'
        }
    }, 'Engr. Abrar Jamshed'),
    React.createElement('p', { 
        style: { 
            color: '#00f2fe', 
            fontWeight: '700', 
            fontSize: 'clamp(1rem, 4vw, 1.2rem)',    // Title string scales optimized for compact display tracking
            letterSpacing: '0.5px',                  // Clean multi-device layout tracking
            margin: '0 0 15px 0' 
        } 
    }, 'Lead Software Engineer & Full-Stack Developer'),
    React.createElement('p', { 
        style: { 
            maxWidth: '650px', 
            margin: '0 auto', 
            color: 'rgba(255,255,255,0.7)', 
            fontSize: 'clamp(0.95rem, 3.5vw, 1.05rem)', // Paragraph description text adaptive typography tracking
            lineHeight: '1.5',
            padding: '0 10px'                        // Border bleeding margin safety layer
        } 
    }, 'Specializing in dynamic web scaling, automated API architecture, and enterprise cloud deployments. Passionate about building intelligent core logic structures that optimize processing speeds and modern web utility.')
),

                // Two Column Breakdown: Core Experience & Technical Expertise
                React.createElement('div', { style: { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '30px', width: '100%' } },
                    // Left Column: Core Expertise
                    React.createElement('div', { style: { ...portfolioInputStyle, flex: '1 1 400px' } },
                        React.createElement('h3', { style: { color: '#00f2fe', fontSize: '1.4rem', marginTop: '0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' } }, 'Technical Matrix'),
                        React.createElement('ul', { style: { paddingLeft: '20px', margin: '15px 0 0 0' } },
                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Backend Architecture: '), 'Robust logic management using modular micro-frameworks linked with dynamic runtime clusters.'),
                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Frontend Engineering: '), 'Declarative UI rendering pipelines built with modular frameworks for absolute rendering smoothness.'),
                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Database & Cloud Mastery: '), 'Intricate structure management on distributed clouds (Render, Vercel) alongside live database setups (MongoDB Atlas).'),
                            React.createElement('li', { style: { marginBottom: '0px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Growth & Monetization: '), 'Optimizing platform tracking systems using precision script structures and search ranking metrics.')
                        ),

                    ), // <--- Yeh comma Left aur Right column ko alag karta hai
                    React.createElement('div', { style: { ...portfolioInputStyle, flex: '1 1 400px' } },
                        React.createElement('h3', { style: { color: '#00f2fe', fontSize: '1.4rem', marginTop: '0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', letterSpacing: '1px' } }, 'Social Profiles'),
                        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' } },

                            // Instagram Link
                            React.createElement('a', {
                                href: 'https://www.instagram.com/abrardevil?igsh=MXFpZ2Y0cWR6ODd6eQ==',
                                target: '_blank',
                                rel: 'noopener noreferrer',
                                style: { display: 'block', padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)', textDecoration: 'none', color: '#fff', fontSize: '1.05rem', cursor: 'pointer' }
                            },
                                React.createElement('strong', { style: { color: '#f77737' } }, '📸 Instagram: '), 'Follow on Instagram'
                            ),

                            // Facebook Link
                            React.createElement('a', {
                                href: 'https://www.facebook.com/share/17nhqSXjm4/',
                                target: '_blank',
                                rel: 'noopener noreferrer',
                                style: { display: 'block', padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)', textDecoration: 'none', color: '#fff', fontSize: '1.05rem', cursor: 'pointer' }
                            },
                                React.createElement('strong', { style: { color: '#1877f2' } }, '🔵 Facebook: '), 'Connect on Facebook'
                            ),

                            // Threads Link
                            React.createElement('a', {
                                href: 'https://www.threads.com/@abrardevil',
                                target: '_blank',
                                rel: 'noopener noreferrer',
                                style: { display: 'block', padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)', textDecoration: 'none', color: '#fff', fontSize: '1.05rem', cursor: 'pointer' }
                            },
                                React.createElement('strong', { style: { color: '#fff', textShadow: '0 0 5px rgba(255,255,255,0.3)' } }, '🧵 Threads: '), 'View Threads Profile'
                            ),

                            // LinkedIn Link
                            React.createElement('a', {
                                href: 'https://www.linkedin.com/in/abrar-jamshed-994030265?utm_source=share_via&utm_content=profile&utm_medium=member_android',
                                target: '_blank',
                                rel: 'noopener noreferrer',
                                style: { display: 'block', padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)', textDecoration: 'none', color: '#fff', fontSize: '1.05rem', cursor: 'pointer' }
                            },
                                React.createElement('strong', { style: { color: '#0077b5' } }, '💼 LinkedIn: '), 'Let\'s Network on LinkedIn'
                            )
                        )
                    ),
                    // Right Column: Education & Agency Details
                    React.createElement('div', { style: { ...portfolioInputStyle, flex: '1 1 400px' } },
                        React.createElement('h3', { style: { color: '#ff0080', fontSize: '1.4rem', marginTop: '0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' } }, 'Skills'),
                        React.createElement('ul', { style: { paddingLeft: '20px', margin: '15px 0 0 0', listStyleType: 'square' } },
                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'HTML: '), 'Proficient in architecting clean, semantic, and SEO-friendly web structures to ensure absolute cross-browser accessibility.'),
                            React.createElement('li', { style: { marginBottom: '20px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'CSS: '), 'Experienced in crafting highly responsive, pixel-perfect interfaces using modern design principles, layouts, and smooth transition animations.'),
                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Javascript: '), 'Strong expertise in implementing complex, declarative client-side logic and managing high-performance asynchronous state operations.'),
                            React.createElement('li', { style: { marginBottom: '20px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'React.JS: '), 'Advanced capability in building modular, reusable component systems and interactive, real-time user interfaces.'),
                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Python: '), 'Specialized in developing robust backend micro-frameworks, customized regex structures, and automated data processing logic.'),
                            React.createElement('li', { style: { marginBottom: '20px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Microsoft Office: '), 'Competent in managing professional documentation, advanced data sorting, and structuring clean business operational reports.'),

                            // Custom Sub-heading for Academic Timeline
                            React.createElement('li', { style: { listStyleType: 'none', marginLeft: '-20px', marginBottom: '12px', color: '#ff0080', fontWeight: '700', fontSize: '1.1rem' } }, '🎓 Academic Journey'),


                            React.createElement('li', { style: { marginBottom: '10px', fontSize: '0.95rem' } },
                                React.createElement('strong', { style: { color: '#fff' } }, 'Graduation: '), 'Ilma University (2022 - 2026)'
                            ),
                            React.createElement('li', { style: { marginBottom: '10px', fontSize: '0.95rem' } },
                                React.createElement('strong', { style: { color: '#fff' } }, 'Intermediate: '), 'SSAT Degree College (2020 - 2022)'
                            ),
                            React.createElement('li', { style: { marginBottom: '0px', fontSize: '0.95rem' } },
                                React.createElement('strong', { style: { color: '#fff' } }, 'Matric : '), 'City Grammar School (2018 - 2019)'
                            )
                        )
                    ),
                    // Right Column: Education & Agency Details
                    React.createElement('div', { style: { ...portfolioInputStyle, flex: '1 1 400px' } },
                        React.createElement('h3', { style: { color: '#ff0080', fontSize: '1.4rem', marginTop: '0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' } }, 'Companies Which I Work For'),
                        React.createElement('ul', { style: { paddingLeft: '20px', margin: '15px 0 0 0', listStyleType: 'square' } },
                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Apex Code: '), 'Worked as a Full Stack Developer at Apex Code, handling end-to-end web development and engineering scalable digital solutions.'),


                            // Custom Sub-heading for Academic Timeline
                            React.createElement('li', { style: { listStyleType: 'none', marginLeft: '-20px', marginBottom: '12px', color: '#ff0080', fontWeight: '700', fontSize: '1.1rem' } }, 'Experience'),

                            React.createElement('li', { style: { marginBottom: '10px', fontSize: '0.95rem' } },
                                React.createElement('strong', { style: { color: '#fff' } }, 'Full-Stack Developer: '), 'Apex Code (30-April-2026 - Present)'
                            ),
                        )
                    ),
                ),

                // Exclusive Interactive Projects Hub (Option requested)
                // Project Node 2: GlyphHuman - AI Text Humanizer & Detector Portal
                React.createElement('div', {
                    style: projectCardStyle,
                    onMouseEnter: (e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                        e.currentTarget.style.border = '1px solid rgba(255, 0, 128, 0.3)';
                        e.currentTarget.style.transform = 'translateY(-3px)';
                    },
                    onMouseLeave: (e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                        e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }

                },

                    // Title Row
                    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' } },
                        React.createElement('h4', { style: { color: '#fff', fontSize: '1.35rem', margin: '0', fontWeight: '700' } }, '"GlyphHuman" – AI Text Humanizer & Detector Portal'),
                        React.createElement('span', { style: { background: 'rgba(255, 0, 128, 0.1)', color: '#ff0080', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' } }, 'Active Service')
                    ),

                    // Detailed Breakdown Info Hub
                    React.createElement('div', { style: { color: 'rgba(255,255,255,0.72)', fontSize: '0.95rem', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px', lineHeight: '1.6' } },
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#ff0080' } }, 'Core Purpose: '), 'A web-based application designed to convert robotic, AI-generated text into a natural, human-like writing style and analyze text to calculate AI probability scores.'
                        ),
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#ff0080' } }, 'The Detector Engine: '), 'Uses a customized rule-based algorithm in Python to check keyword density (tracking words like delve, moreover, tapestry), vocabulary richness, and sentence length patterns to output an AI vs. Human percentage.'
                        ),
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#ff0080' } }, 'The Humanizer Engine: '), 'Utilizes pure Python and regex logic instead of a heavy AI model. It works by randomly replacing robotic phrases with casual human synonyms and altering long sentence structures to mimic natural human writing flow ("burstiness").'
                        ),
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#ff0080' } }, 'Frontend Features: '), 'A multi-view React interface featuring real-time word/character counters, side-by-side input and output fields, instant clipboard copying, and an integrated contact form powered by Formspree.'
                        ),
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#ff0080' } }, 'Privacy & Protection: '), 'Relies on a strict zero-persistence privacy policy, meaning user text data is processed instantly through the Flask backend API and never stored or logged.'
                        )
                    ),

                    // Footer Container: Tech Stack & Live Link
                    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' } },
                        React.createElement('span', { style: { color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' } }, 'Tech Stack: Flask API / React.js / Python / Regex'),

                        // Interactive Link Button
                        React.createElement('a', {
                            href: 'https://glyphhuman.resumepro.it.com',
                            target: '_blank',
                            rel: 'noopener noreferrer',
                            style: {
                                color: '#ff0080',
                                textDecoration: 'none',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                borderBottom: '1px dashed #ff0080',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            },
                            onMouseEnter: (e) => { e.target.style.color = '#fff'; e.target.style.borderBottomColor = '#fff'; },
                            onMouseLeave: (e) => { e.target.style.color = '#ff0080'; e.target.style.borderBottomColor = '#ff0080'; }
                        }, '🔗 Visit Website')
                    )
                ),

            )
        );
    }
    else if (currentPage === 'hamza-portfolio') {

        const portfolioInputStyle = {
            background: 'linear-gradient(135deg, rgba(20, 20, 30, 0.8), rgba(20, 20, 30, 0.5))',
            padding: '35px',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            color: 'rgba(255, 255, 255, 0.85)',
            lineHeight: '1.8',
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)',
            boxShadow: '0 20px 45px rgba(0,0,0,0.4)',
            width: '100%',
            boxSizing: 'border-box'
        };

        const projectCardStyle = {
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '20px',
            transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)'
        };

        mainElement = React.createElement('main', {
            style: { padding: '40px 20px', minHeight: '85vh', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', boxSizing: 'border-box' }
        },
            // Back to Team Button with Glow Interaction
            React.createElement('button', {
                className: 'card-btn',
                onClick: toPortfolio,
                onMouseEnter: (e) => {
                    e.target.style.background = 'rgba(255,255,255,0.05)';
                    e.target.style.transform = 'translateX(-3px)';
                },
                onMouseLeave: (e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.transform = 'translateX(0)';
                },
                style: { marginBottom: '30px', alignSelf: 'center', borderColor: 'rgba(255,255,255,0.2)', transition: 'all 0.3s ease', cursor: 'pointer' }
            }, '← Back to Team Portfolios'),

            // Main Profile Window
            React.createElement('div', {
                style: { width: '100%', maxWidth: '950px', display: 'flex', flexDirection: 'column', gap: '35px' }
            },
                // Header Intro Section
                React.createElement('div', { 
    style: { 
        ...portfolioInputStyle, 
        display: 'flex',                             // Layout chain ko flexbox matrix me migrate kiya
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center', 
        background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.05), rgba(255, 0, 128, 0.05))', 
        border: '1px solid rgba(0, 242, 254, 0.15)',
        padding: '30px 20px',                        // Responsive padding structural tracking
        maxWidth: '95%',                             // Card outer boundary layout control
        margin: '0 auto',
        boxSizing: 'border-box'
    } 
},
    React.createElement('img', {
        src: 'hamza.jpeg',                           // Asset path update ho gaya hai
        alt: 'Hamza',
        style: {
            width: 'clamp(100px, 25vw, 130px)',      // Small viewports par fluid responsive downscaling
            height: 'clamp(100px, 25vw, 130px)',     // Circle frame ratio constant lock
            borderRadius: '50%',
            objectFit: 'cover',
            marginBottom: '15px',                    // Bottom gap spacing criteria optimal kiya
            border: '3px solid #00f2fe',
            boxShadow: '0 0 25px rgba(0, 242, 254, 0.5)',
            display: 'inline-block'
        }
    }),
    React.createElement('h2', {
        style: { 
            fontSize: 'clamp(1.7rem, 5.8vw, 2.8rem)', // Viewport variable mapping taaki name mobile par single line me safely compact ho sake
            fontWeight: '800', 
            margin: '0 0 10px 0', 
            background: 'linear-gradient(90deg, #00f2fe, #ff0080)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent',
            lineHeight: '1.2'
        }
    }, 'Engr. Hamza'),
    React.createElement('p', { 
        style: { 
            color: '#00f2fe', 
            fontWeight: '700', 
            fontSize: 'clamp(1rem, 4vw, 1.2rem)',    // Designation text dynamic compression track
            letterSpacing: '0.5px',                  // Crisp screen rendering criteria
            margin: '0 0 15px 0' 
        } 
    }, 'Lead Software Engineer & Full-Stack Developer'),
    React.createElement('p', { 
        style: { 
            maxWidth: '650px', 
            margin: '0 auto', 
            color: 'rgba(255,255,255,0.7)', 
            fontSize: 'clamp(0.95rem, 3.5vw, 1.05rem)', // Adaptive reading bio setup
            lineHeight: '1.5',
            padding: '0 10px'                        // Screen corner bleeding protective system
        } 
    }, 'Specializing in dynamic web scaling, automated API architecture, and enterprise cloud deployments. Passionate about building intelligent core logic structures that optimize processing speeds and modern web utility.')
),

                // Two Column Breakdown: Core Experience & Technical Expertise
                React.createElement('div', { style: { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '30px', width: '100%' } },
                    // Left Column: Core Expertise
                    React.createElement('div', { style: { ...portfolioInputStyle, flex: '1 1 400px' } },
                        React.createElement('h3', { style: { color: '#00f2fe', fontSize: '1.4rem', marginTop: '0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' } }, 'Technical Matrix'),
                        React.createElement('ul', { style: { paddingLeft: '20px', margin: '15px 0 0 0' } },
                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Backend Architecture: '), 'Robust logic management using modular micro-frameworks linked with dynamic runtime clusters.'),
                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Frontend Engineering: '), 'Declarative UI rendering pipelines built with modular frameworks for absolute rendering smoothness.'),
                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Database & Cloud Mastery: '), 'Intricate structure management on distributed clouds (Render, Vercel) alongside live database setups (MongoDB Atlas).'),
                            React.createElement('li', { style: { marginBottom: '0px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Growth & Monetization: '), 'Optimizing platform tracking systems using precision script structures and search ranking metrics.')
                        ),

                    ), // <--- Yeh comma Left aur Right column ko alag karta hai
                    React.createElement('div', { style: { ...portfolioInputStyle, flex: '1 1 400px' } },
                        React.createElement('h3', { style: { color: '#00f2fe', fontSize: '1.4rem', marginTop: '0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', letterSpacing: '1px' } }, 'Social Profiles'),
                        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' } },

                            // Instagram Link
                            React.createElement('a', {
                                href: 'https://www.instagram.com/ham_zii_sardar?igsh=MWkxY3Qxbm53cWF1bA==',
                                target: '_blank',
                                rel: 'noopener noreferrer',
                                style: { display: 'block', padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)', textDecoration: 'none', color: '#fff', fontSize: '1.05rem', cursor: 'pointer' }
                            },
                                React.createElement('strong', { style: { color: '#f77737' } }, '📸 Instagram: '), 'Follow on Instagram'
                            ),

                            // Facebook Link
                            React.createElement('a', {
                                href: 'https://www.facebook.com/share/1DDJAuQc4Z/',
                                target: '_blank',
                                rel: 'noopener noreferrer',
                                style: { display: 'block', padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)', textDecoration: 'none', color: '#fff', fontSize: '1.05rem', cursor: 'pointer' }
                            },
                                React.createElement('strong', { style: { color: '#1877f2' } }, '🔵 Facebook: '), 'Connect on Facebook'
                            ),

                            // Threads Link
                            React.createElement('a', {
                                href: '#',
                                target: '_blank',
                                rel: 'noopener noreferrer',
                                style: { display: 'block', padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)', textDecoration: 'none', color: '#fff', fontSize: '1.05rem', cursor: 'pointer' }
                            },
                                React.createElement('strong', { style: { color: '#fff', textShadow: '0 0 5px rgba(255,255,255,0.3)' } }, '🧵 Threads: '), 'View Threads Profile'
                            ),

                            // LinkedIn Link
                            React.createElement('a', {
                                href: 'https://www.linkedin.com/in/hamza-sardar-00a395353?utm_source=share_via&utm_content=profile&utm_medium=member_android',
                                target: '_blank',
                                rel: 'noopener noreferrer',
                                style: { display: 'block', padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)', textDecoration: 'none', color: '#fff', fontSize: '1.05rem', cursor: 'pointer' }
                            },
                                React.createElement('strong', { style: { color: '#0077b5' } }, '💼 LinkedIn: '), 'Let\'s Network on LinkedIn'
                            )
                        )
                    ),
                    // Right Column: Education & Agency Details
                    React.createElement('div', { style: { ...portfolioInputStyle, flex: '1 1 400px' } },
                        React.createElement('h3', { style: { color: '#ff0080', fontSize: '1.4rem', marginTop: '0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' } }, 'Skills'),
                        React.createElement('ul', { style: { paddingLeft: '20px', margin: '15px 0 0 0', listStyleType: 'square' } },
                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'HTML: '), 'Proficient in architecting clean, semantic, and SEO-friendly web structures to ensure absolute cross-browser accessibility.'),
                            React.createElement('li', { style: { marginBottom: '20px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'CSS: '), 'Experienced in crafting highly responsive, pixel-perfect interfaces using modern design principles, layouts, and smooth transition animations.'),
                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Javascript: '), 'Strong expertise in implementing complex, declarative client-side logic and managing high-performance asynchronous state operations.'),
                            React.createElement('li', { style: { marginBottom: '20px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'React.JS: '), 'Advanced capability in building modular, reusable component systems and interactive, real-time user interfaces.'),
                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Python: '), 'Specialized in developing robust backend micro-frameworks, customized regex structures, and automated data processing logic.'),
                            React.createElement('li', { style: { marginBottom: '20px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Microsoft Office: '), 'Competent in managing professional documentation, advanced data sorting, and structuring clean business operational reports.'),

                            // Custom Sub-heading for Academic Timeline
                            React.createElement('li', { style: { listStyleType: 'none', marginLeft: '-20px', marginBottom: '12px', color: '#ff0080', fontWeight: '700', fontSize: '1.1rem' } }, '🎓 Academic Journey'),

                            React.createElement('li', { style: { marginBottom: '10px', fontSize: '0.95rem' } },
                                React.createElement('strong', { style: { color: '#fff' } }, 'Graduation: '), 'Ilma University (2022 - 2026)'
                            ),
                            React.createElement('li', { style: { marginBottom: '10px', fontSize: '0.95rem' } },
                                React.createElement('strong', { style: { color: '#fff' } }, 'Intermediate: '), 'SM Science College (2020 - 2022)'
                            ),
                            React.createElement('li', { style: { marginBottom: '0px', fontSize: '0.95rem' } },
                                React.createElement('strong', { style: { color: '#fff' } }, 'Matric : '), 'Iqra Huffaz Boys Secondary School (2018 - 2019)'
                            )
                        )
                    ),
                    // Right Column: Education & Agency Details
                    React.createElement('div', { style: { ...portfolioInputStyle, flex: '1 1 400px' } },
                        React.createElement('h3', { style: { color: '#ff0080', fontSize: '1.4rem', marginTop: '0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' } }, 'Companies Which I Work For'),
                        React.createElement('ul', { style: { paddingLeft: '20px', margin: '15px 0 0 0', listStyleType: 'square' } },
                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Apex Code: '), 'Working as a Full-Stack Developer at Apex Code, specializing in scalable web solutions.'),

                            // Custom Sub-heading for Academic Timeline
                            React.createElement('li', { style: { listStyleType: 'none', marginLeft: '-20px', marginBottom: '12px', color: '#ff0080', fontWeight: '700', fontSize: '1.1rem' } }, 'Experience'),

                            React.createElement('li', { style: { marginBottom: '10px', fontSize: '0.95rem' } },
                                React.createElement('strong', { style: { color: '#fff' } }, 'Full-Stack Developer: '), 'Apex Code (5-April-2026 - Present)'
                            ),
                        )
                    ),
                ),

                // Exclusive Interactive Projects Hub (Option requested)
                // Project Node 2: GlyphHuman - AI Text Humanizer & Detector Portal
                React.createElement('div', {
                    style: projectCardStyle,
                    onMouseEnter: (e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                        e.currentTarget.style.border = '1px solid rgba(255, 0, 128, 0.3)';
                        e.currentTarget.style.transform = 'translateY(-3px)';
                    },
                    onMouseLeave: (e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                        e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }

                },

                    // Title Row
                    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' } },
                        React.createElement('h4', { style: { color: '#fff', fontSize: '1.35rem', margin: '0', fontWeight: '700' } }, '"GlyphHuman" – AI Text Humanizer & Detector Portal'),
                        React.createElement('span', { style: { background: 'rgba(255, 0, 128, 0.1)', color: '#ff0080', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' } }, 'Active Service')
                    ),

                    // Detailed Breakdown Info Hub
                    React.createElement('div', { style: { color: 'rgba(255,255,255,0.72)', fontSize: '0.95rem', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px', lineHeight: '1.6' } },
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#ff0080' } }, 'Core Purpose: '), 'A web-based application designed to convert robotic, AI-generated text into a natural, human-like writing style and analyze text to calculate AI probability scores.'
                        ),
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#ff0080' } }, 'The Detector Engine: '), 'Uses a customized rule-based algorithm in Python to check keyword density (tracking words like delve, moreover, tapestry), vocabulary richness, and sentence length patterns to output an AI vs. Human percentage.'
                        ),
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#ff0080' } }, 'The Humanizer Engine: '), 'Utilizes pure Python and regex logic instead of a heavy AI model. It works by randomly replacing robotic phrases with casual human synonyms and altering long sentence structures to mimic natural human writing flow ("burstiness").'
                        ),
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#ff0080' } }, 'Frontend Features: '), 'A multi-view React interface featuring real-time word/character counters, side-by-side input and output fields, instant clipboard copying, and an integrated contact form powered by Formspree.'
                        ),
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#ff0080' } }, 'Privacy & Protection: '), 'Relies on a strict zero-persistence privacy policy, meaning user text data is processed instantly through the Flask backend API and never stored or logged.'
                        )
                    ),

                    // Footer Container: Tech Stack & Live Link
                    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' } },
                        React.createElement('span', { style: { color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' } }, 'Tech Stack: Flask API / React.js / Python / Regex'),

                        // Interactive Link Button
                        React.createElement('a', {
                            href: 'https://glyphhuman.resumepro.it.com',
                            target: '_blank',
                            rel: 'noopener noreferrer',
                            style: {
                                color: '#ff0080',
                                textDecoration: 'none',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                borderBottom: '1px dashed #ff0080',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            },
                            onMouseEnter: (e) => { e.target.style.color = '#fff'; e.target.style.borderBottomColor = '#fff'; },
                            onMouseLeave: (e) => { e.target.style.color = '#ff0080'; e.target.style.borderBottomColor = '#ff0080'; }
                        }, '🔗 Visit Website')
                    )
                ),


            )
        );
    }
    else if (currentPage === 'ali-portfolio') {

        const portfolioInputStyle = {
            background: 'linear-gradient(135deg, rgba(20, 20, 30, 0.8), rgba(20, 20, 30, 0.5))',
            padding: '35px',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            color: 'rgba(255, 255, 255, 0.85)',
            lineHeight: '1.8',
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)',
            boxShadow: '0 20px 45px rgba(0,0,0,0.4)',
            width: '100%',
            boxSizing: 'border-box'
        };

        const projectCardStyle = {
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '20px',
            transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)'
        };

        mainElement = React.createElement('main', {
            style: { padding: '40px 20px', minHeight: '85vh', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', boxSizing: 'border-box' }
        },
            // Back to Team Button with Glow Interaction
            React.createElement('button', {
                className: 'card-btn',
                onClick: toPortfolio,
                onMouseEnter: (e) => {
                    e.target.style.background = 'rgba(255,255,255,0.05)';
                    e.target.style.transform = 'translateX(-3px)';
                },
                onMouseLeave: (e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.transform = 'translateX(0)';
                },
                style: { marginBottom: '30px', alignSelf: 'center', borderColor: 'rgba(255,255,255,0.2)', transition: 'all 0.3s ease', cursor: 'pointer' }
            }, '← Back to Team Portfolios'),

            // Main Profile Window
            React.createElement('div', {
                style: { width: '100%', maxWidth: '950px', display: 'flex', flexDirection: 'column', gap: '35px' }
            },
                // Header Intro Section
                React.createElement('div', { 
    style: { 
        ...portfolioInputStyle, 
        display: 'flex',                             // Layout chain ko standard flexbox mein migrate kiya
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center', 
        background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.05), rgba(255, 0, 128, 0.05))', 
        border: '1px solid rgba(0, 242, 254, 0.15)',
        padding: '30px 20px',                        // Layout cushioning taaki edges tight na laghein
        maxWidth: '95%',                             // Card outer boundary screen layout control
        margin: '0 auto',
        boxSizing: 'border-box'
    } 
},
    React.createElement('img', {
        src: 'ali.jpeg',                             // Asset path yahan map ho gaya hai
        alt: 'Ali',
        style: {
            width: 'clamp(100px, 25vw, 130px)',      // Small viewports par automatic fluid downscaling
            height: 'clamp(100px, 25vw, 130px)',     // Circle frame ratio tight lock
            borderRadius: '50%',
            objectFit: 'cover',
            marginBottom: '15px',                    // Spacing matrix mobile ke liye adjust kiya
            border: '3px solid #00f2fe',
            boxShadow: '0 0 25px rgba(0, 242, 254, 0.5)',
            display: 'inline-block'
        }
    }),
    React.createElement('h2', {
        style: { 
            fontSize: 'clamp(1.7rem, 5.8vw, 2.8rem)', // Name text mobile scales par bina line wrap hue set rahega
            fontWeight: '800', 
            margin: '0 0 10px 0', 
            background: 'linear-gradient(90deg, #00f2fe, #ff0080)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent',
            lineHeight: '1.2'
        }
    }, 'Mr. Ali'),
    React.createElement('p', { 
        style: { 
            color: '#00f2fe', 
            fontWeight: '700', 
            fontSize: 'clamp(1rem, 4vw, 1.2rem)',    // Title text dynamic screens ko trace karega
            letterSpacing: '0.5px',                  // Clean line rendering compression filter
            margin: '0 0 15px 0' 
        } 
    }, 'Lead Software Tester'),
    React.createElement('p', { 
        style: { 
            maxWidth: '650px', 
            margin: '0 auto', 
            color: 'rgba(255,255,255,0.7)', 
            fontSize: 'clamp(0.95rem, 3.5vw, 1.05rem)', // Bio paragraph block layout responsive adjustment
            lineHeight: '1.5',
            padding: '0 10px'                        // Screen corner bleeding protective framework
        } 
    }, 'Specializing in automated test architecture, performance scaling validation, and enterprise cloud deployment testing. Passionate about verifying intelligent core logic structures to optimize processing speeds and ensure flawless web utility.')
),

                // Two Column Breakdown: Core Experience & Technical Expertise
                React.createElement('div', { style: { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '30px', width: '100%' } },
                    // Left Column: Core Expertise
                    React.createElement('div', { style: { ...portfolioInputStyle, flex: '1 1 400px' } },
                        React.createElement('h3', { style: { color: '#00f2fe', fontSize: '1.4rem', marginTop: '0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' } }, 'Technical Matrix'),
                        React.createElement('ul', { style: { paddingLeft: '20px', margin: '15px 0 0 0' } },
                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Backend & API Testing: '), 'Validating robust logic management and micro-framework integrations through automated integration testing and dynamic runtime cluster monitoring.'),
                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Frontend & UI Testing: '), 'Implementing declarative UI testing pipelines and automated visual regressions on modular frameworks to guarantee absolute rendering smoothness and flawless UX.'),
                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Database & Cloud Testing: '), 'Stress-testing intricate infrastructure setups on distributed clouds (Render, Vercel) alongside executing data integrity and load validation on live database systems (MongoDB Atlas).'),
                            React.createElement('li', { style: { marginBottom: '0px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Tracking & Performance Analytics Testing: '), 'Verifying platform tracking systems, pixel setups, and analytics triggers using precision script testing tools while auditing search ranking metrics for optimal performance.')
                        ),

                    ), // <--- Yeh comma Left aur Right column ko alag karta hai
                    React.createElement('div', { style: { ...portfolioInputStyle, flex: '1 1 400px' } },
                        React.createElement('h3', { style: { color: '#00f2fe', fontSize: '1.4rem', marginTop: '0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', letterSpacing: '1px' } }, 'Social Profiles'),
                        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' } },

                            // Instagram Link
                            React.createElement('a', {
                                href: 'https://www.instagram.com/m_ali8642?utm_source=qr&igsh=NDQ0d25icXk0MnQ1',
                                target: '_blank',
                                rel: 'noopener noreferrer',
                                style: { display: 'block', padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)', textDecoration: 'none', color: '#fff', fontSize: '1.05rem', cursor: 'pointer' }
                            },
                                React.createElement('strong', { style: { color: '#f77737' } }, '📸 Instagram: '), 'Follow on Instagram'
                            ),

                            // Facebook Link
                            React.createElement('a', {
                                href: 'https://www.facebook.com/share/1FyigCYRW5/',
                                target: '_blank',
                                rel: 'noopener noreferrer',
                                style: { display: 'block', padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)', textDecoration: 'none', color: '#fff', fontSize: '1.05rem', cursor: 'pointer' }
                            },
                                React.createElement('strong', { style: { color: '#1877f2' } }, '🔵 Facebook: '), 'Connect on Facebook'
                            ),

                            // Threads Link
                            React.createElement('a', {
                                href: '#',
                                target: '_blank',
                                rel: 'noopener noreferrer',
                                style: { display: 'block', padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)', textDecoration: 'none', color: '#fff', fontSize: '1.05rem', cursor: 'pointer' }
                            },
                                React.createElement('strong', { style: { color: '#fff', textShadow: '0 0 5px rgba(255,255,255,0.3)' } }, '🧵 Threads: '), 'View Threads Profile'
                            ),

                            // LinkedIn Link
                            React.createElement('a', {
                                href: 'https://www.linkedin.com/in/ali8642',
                                target: '_blank',
                                rel: 'noopener noreferrer',
                                style: { display: 'block', padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)', textDecoration: 'none', color: '#fff', fontSize: '1.05rem', cursor: 'pointer' }
                            },
                                React.createElement('strong', { style: { color: '#0077b5' } }, '💼 LinkedIn: '), 'Let\'s Network on LinkedIn'
                            )
                        )
                    ),
                    // Right Column: Education & Agency Details
                    React.createElement('div', { style: { ...portfolioInputStyle, flex: '1 1 400px' } },
                        React.createElement('h3', { style: { color: '#ff0080', fontSize: '1.4rem', marginTop: '0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' } }, 'Skills'),
                        React.createElement('ul', { style: { paddingLeft: '20px', margin: '15px 0 0 0', listStyleType: 'square' } },
                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'HTML: '), 'Proficient in architecting clean, semantic, and SEO-friendly web structures to ensure absolute cross-browser accessibility.'),
                            React.createElement('li', { style: { marginBottom: '20px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'CSS: '), 'Experienced in crafting highly responsive, pixel-perfect interfaces using modern design principles, layouts, and smooth transition animations.'),
                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Javascript: '), 'Strong expertise in implementing complex, declarative client-side logic and managing high-performance asynchronous state operations.'),
                            React.createElement('li', { style: { marginBottom: '20px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'React.JS: '), 'Advanced capability in building modular, reusable component systems and interactive, real-time user interfaces.'),

                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Next.js: '), 'Specialized in developing robust full-stack applications, optimized Serverless APIs, dynamic routing logic, and high-performance server-side data processing structures.'),
                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Python: '), 'Specialized in developing robust backend micro-frameworks, customized regex structures, and automated data processing logic.'),
                            React.createElement('li', { style: { marginBottom: '20px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Microsoft Office: '), 'Competent in managing professional documentation, advanced data sorting, and structuring clean business operational reports.'),

                            // Custom Sub-heading for Academic Timeline
                            React.createElement('li', { style: { listStyleType: 'none', marginLeft: '-20px', marginBottom: '12px', color: '#ff0080', fontWeight: '700', fontSize: '1.1rem' } }, '🎓 Academic Journey'),


                            React.createElement('li', { style: { marginBottom: '10px', fontSize: '0.95rem' } },
                                React.createElement('strong', { style: { color: '#fff' } }, 'Graduation: '), 'Federa Urdu University Of Arts & Tecnology (2022 - 2026)'
                            ),
                            React.createElement('li', { style: { marginBottom: '10px', fontSize: '0.95rem' } },
                                React.createElement('strong', { style: { color: '#fff' } }, 'Intermediate: '), 'Aisha Bawany Government College (2019 - 2021)'
                            ),
                            React.createElement('li', { style: { marginBottom: '0px', fontSize: '0.95rem' } },
                                React.createElement('strong', { style: { color: '#fff' } }, 'Matric : '), 'Higher secondry School (2018 - 2019)'
                            )
                        )
                    ),
                    // Right Column: Education & Agency Details
                    React.createElement('div', { style: { ...portfolioInputStyle, flex: '1 1 400px' } },
                        React.createElement('h3', { style: { color: '#ff0080', fontSize: '1.4rem', marginTop: '0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' } }, 'Companies Which I Work For'),
                        React.createElement('ul', { style: { paddingLeft: '20px', margin: '15px 0 0 0', listStyleType: 'square' } },
                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Apex Code: '), 'Working as a Quality Assurance (QA) Engineer at Apex Code, specializing in automated testing and scalable web performance validation.'),

                            // Custom Sub-heading for Academic Timeline
                            React.createElement('li', { style: { listStyleType: 'none', marginLeft: '-20px', marginBottom: '12px', color: '#ff0080', fontWeight: '700', fontSize: '1.1rem' } }, 'Experience'),

                            React.createElement('li', { style: { marginBottom: '10px', fontSize: '0.95rem' } },
                                React.createElement('strong', { style: { color: '#fff' } }, 'Software Tester: '), 'Apex Code (20-June-2025 - Present)'
                            ),
                        )
                    ),
                ),


            )
        );
    }
    else if (currentPage === 'alamdar-portfolio') {

        const portfolioInputStyle = {
            background: 'linear-gradient(135deg, rgba(20, 20, 30, 0.8), rgba(20, 20, 30, 0.5))',
            padding: '35px',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            color: 'rgba(255, 255, 255, 0.85)',
            lineHeight: '1.8',
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)',
            boxShadow: '0 20px 45px rgba(0,0,0,0.4)',
            width: '100%',
            boxSizing: 'border-box'
        };

        const projectCardStyle = {
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '20px',
            transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)'
        };

        mainElement = React.createElement('main', {
            style: { padding: '40px 20px', minHeight: '85vh', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', boxSizing: 'border-box' }
        },
            // Back to Team Button with Glow Interaction
            React.createElement('button', {
                className: 'card-btn',
                onClick: toPortfolio,
                onMouseEnter: (e) => {
                    e.target.style.background = 'rgba(255,255,255,0.05)';
                    e.target.style.transform = 'translateX(-3px)';
                },
                onMouseLeave: (e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.transform = 'translateX(0)';
                },
                style: { marginBottom: '30px', alignSelf: 'center', borderColor: 'rgba(255,255,255,0.2)', transition: 'all 0.3s ease', cursor: 'pointer' }
            }, '← Back to Team Portfolios'),

            // Main Profile Window
            React.createElement('div', {
                style: { width: '100%', maxWidth: '950px', display: 'flex', flexDirection: 'column', gap: '35px' }
            },
                // Header Intro Section
React.createElement('div', { 
  style: { 
    ...portfolioInputStyle, 
    display: 'flex',
    flexDirection: 'column', 
    alignItems: 'center', 
    textAlign: 'center', 
    background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.05), rgba(255, 0, 128, 0.05))', 
    border: '1px solid rgba(0, 242, 254, 0.15)', 
    padding: '30px 10px',           // thoda padding badhaya
    width: '100%', 
    maxWidth: '100%',
    margin: '0 auto', 
    boxSizing: 'border-box', 
    overflow: 'hidden' 
  } 
},

  // Image
  React.createElement('img', { 
    src: 'usman.jpeg',
    alt: 'Usman Nadeem', 
    style: { 
      width: 'clamp(80px, 18vw, 120px)',
      height: 'clamp(80px, 18vw, 120px)',
      borderRadius: '50%', 
      objectFit: 'cover', 
      marginBottom: '15px',
      border: '3px solid #00f2fe', 
      boxShadow: '0 0 25px rgba(0, 242, 254, 0.5)' 
    } 
  }), 

  // Name - Yeh wala main fix hai
  React.createElement('h2', { 
    style: { 
      fontSize: 'clamp(8px, 2.3vw, 1.6rem)',
fontWeight: '800',
margin: '0 0 10px 0',
letterSpacing: '-0.3px',
whiteSpace: 'nowrap',
wordBreak: 'keep-all',
overflow: 'hidden',
textOverflow: 'ellipsis',
display: 'block',
width: '100%',
    }
  }, 'Engr. Usman Nadeem'),

  // Title
  React.createElement('p', { 
    style: { 
      color: '#00f2fe', 
      fontWeight: '700', 
      fontSize: 'clamp(12px, 3.5vw, 1.1rem)', 
      letterSpacing: '0',                                       
      margin: '0 0 15px 0' 
    } 
  }, 'Lead Software Engineer & Full-Stack Developer'),

  // Description
  React.createElement('p', { 
    style: { 
      maxWidth: '650px', 
      margin: '0 auto', 
      color: 'rgba(255,255,255,0.7)', 
      fontSize: 'clamp(12px, 3.2vw, 1rem)', 
      lineHeight: '1.5',
      padding: '0 8px'                        
    } 
  }, 'Specializing in dynamic web scaling, automated API architecture, and enterprise cloud deployments. Passionate about building intelligent core logic structures that optimize processing speeds and modern web utility.')
),

                // Two Column Breakdown: Core Experience & Technical Expertise
                React.createElement('div', { style: { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '30px', width: '100%' } },
                    // Left Column: Core Expertise
                    React.createElement('div', { style: { ...portfolioInputStyle, flex: '1 1 400px' } },
                        React.createElement('h3', { style: { color: '#00f2fe', fontSize: '1.4rem', marginTop: '0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' } }, 'Technical Matrix'),
                        React.createElement('ul', { style: { paddingLeft: '20px', margin: '15px 0 0 0' } },
                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Backend Architecture: '), 'Robust logic management using modular micro-frameworks linked with dynamic runtime clusters.'),
                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Frontend Engineering: '), 'Declarative UI rendering pipelines built with modular frameworks for absolute rendering smoothness.'),
                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Database & Cloud Mastery: '), 'Intricate structure management on distributed clouds (Render, Vercel) alongside live database setups (MongoDB Atlas).'),
                            React.createElement('li', { style: { marginBottom: '0px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Growth & Monetization: '), 'Optimizing platform tracking systems using precision script structures and search ranking metrics.')
                        ),

                    ), // <--- Yeh comma Left aur Right column ko alag karta hai
                    React.createElement('div', { style: { ...portfolioInputStyle, flex: '1 1 400px' } },
                        React.createElement('h3', { style: { color: '#00f2fe', fontSize: '1.4rem', marginTop: '0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', letterSpacing: '1px' } }, 'Social Profiles'),
                        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' } },

                            // Instagram Link
                            React.createElement('a', {
                                href: 'https://www.instagram.com/paras_in_10?igsh=Nm03bXFueW4zbjZk',
                                target: '_blank',
                                rel: 'noopener noreferrer',
                                style: { display: 'block', padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)', textDecoration: 'none', color: '#fff', fontSize: '1.05rem', cursor: 'pointer' }
                            },
                                React.createElement('strong', { style: { color: '#f77737' } }, '📸 Instagram: '), 'Follow on Instagram'
                            ),

                            // Facebook Link
                            React.createElement('a', {
                                href: 'https://www.facebook.com/share/1EPaLZESDy/',
                                target: '_blank',
                                rel: 'noopener noreferrer',
                                style: { display: 'block', padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)', textDecoration: 'none', color: '#fff', fontSize: '1.05rem', cursor: 'pointer' }
                            },
                                React.createElement('strong', { style: { color: '#1877f2' } }, '🔵 Facebook: '), 'Connect on Facebook'
                            ),

                            // Threads Link
                            React.createElement('a', {
                                href: 'https://www.threads.com/@paras_in_10',
                                target: '_blank',
                                rel: 'noopener noreferrer',
                                style: { display: 'block', padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)', textDecoration: 'none', color: '#fff', fontSize: '1.05rem', cursor: 'pointer' }
                            },
                                React.createElement('strong', { style: { color: '#fff', textShadow: '0 0 5px rgba(255,255,255,0.3)' } }, '🧵 Threads: '), 'View Threads Profile'
                            ),

                            // LinkedIn Link
                            React.createElement('a', {
                                href: 'https://www.linkedin.com/in/paras-bruce-062610343?utm_source=share_via&utm_content=profile&utm_medium=member_android',
                                target: '_blank',
                                rel: 'noopener noreferrer',
                                style: { display: 'block', padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)', textDecoration: 'none', color: '#fff', fontSize: '1.05rem', cursor: 'pointer' }
                            },
                                React.createElement('strong', { style: { color: '#0077b5' } }, '💼 LinkedIn: '), 'Let\'s Network on LinkedIn'
                            )
                        )
                    ),
                    // Right Column: Education & Agency Details
                    React.createElement('div', { style: { ...portfolioInputStyle, flex: '1 1 400px' } },
                        React.createElement('h3', { style: { color: '#ff0080', fontSize: '1.4rem', marginTop: '0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' } }, 'Skills'),
                        React.createElement('ul', { style: { paddingLeft: '20px', margin: '15px 0 0 0', listStyleType: 'square' } },
                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'HTML: '), 'Proficient in architecting clean, semantic, and SEO-friendly web structures to ensure absolute cross-browser accessibility.'),
                            React.createElement('li', { style: { marginBottom: '20px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'CSS: '), 'Experienced in crafting highly responsive, pixel-perfect interfaces using modern design principles, layouts, and smooth transition animations.'),
                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Javascript: '), 'Strong expertise in implementing complex, declarative client-side logic and managing high-performance asynchronous state operations.'),
                            React.createElement('li', { style: { marginBottom: '20px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'React.JS: '), 'Advanced capability in building modular, reusable component systems and interactive, real-time user interfaces.'),
                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Python: '), 'Specialized in developing robust backend micro-frameworks, customized regex structures, and automated data processing logic.'),
                            React.createElement('li', { style: { marginBottom: '20px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Microsoft Office: '), 'Competent in managing professional documentation, advanced data sorting, and structuring clean business operational reports.'),

                            // Custom Sub-heading for Academic Timeline
                            React.createElement('li', { style: { listStyleType: 'none', marginLeft: '-20px', marginBottom: '12px', color: '#ff0080', fontWeight: '700', fontSize: '1.1rem' } }, '🎓 Academic Journey'),

                            React.createElement('li', { style: { marginBottom: '10px', fontSize: '0.95rem' } },
                                React.createElement('strong', { style: { color: '#fff' } }, 'Masters: '), 'Ilma University (2026 - Present)'
                            ),
                            React.createElement('li', { style: { marginBottom: '10px', fontSize: '0.95rem' } },
                                React.createElement('strong', { style: { color: '#fff' } }, 'Graduation: '), 'Ilma University (2022 - 2026)'
                            ),
                            React.createElement('li', { style: { marginBottom: '10px', fontSize: '0.95rem' } },
                                React.createElement('strong', { style: { color: '#fff' } }, 'Intermediate: '), 'Ziauddin Board (2020 - 2022)'
                            ),
                            React.createElement('li', { style: { marginBottom: '0px', fontSize: '0.95rem' } },
                                React.createElement('strong', { style: { color: '#fff' } }, 'Matric : '), 'Mathematics City Grammar School (2018 - 2019)'
                            )
                        )
                    ),
                    // Right Column: Education & Agency Details
                    React.createElement('div', { style: { ...portfolioInputStyle, flex: '1 1 400px' } },
                        React.createElement('h3', { style: { color: '#ff0080', fontSize: '1.4rem', marginTop: '0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' } }, 'Companies Which I Work For'),
                        React.createElement('ul', { style: { paddingLeft: '20px', margin: '15px 0 0 0', listStyleType: 'square' } },
                            React.createElement('li', { style: { marginBottom: '12px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Apex Code: '), 'As the Founder and CEO of Apex Code, I drive the companys strategic vision while actively architecting core platforms as a Full Stack Developer'),
                            React.createElement('li', { style: { marginBottom: '20px' } }, React.createElement('strong', { style: { color: '#fff' } }, 'Codex Venture: '), 'Previously worked as a Full Stack Developer at Codex Venture, handling end-to-end web development and engineering scalable digital solutions. .'),

                            // Custom Sub-heading for Academic Timeline
                            React.createElement('li', { style: { listStyleType: 'none', marginLeft: '-20px', marginBottom: '12px', color: '#ff0080', fontWeight: '700', fontSize: '1.1rem' } }, 'Experience'),

                            React.createElement('li', { style: { marginBottom: '10px', fontSize: '0.95rem' } },
                                React.createElement('strong', { style: { color: '#fff' } }, 'Full-Stack Developer: '), 'Apex Code (30-April-2025 - Present)'
                            ),
                            React.createElement('li', { style: { marginBottom: '10px', fontSize: '0.95rem' } },
                                React.createElement('strong', { style: { color: '#fff' } }, 'Full-Stack Developer: '), 'Codex Venture (01-Feb-2024 - 05-March-2025)'
                            ),
                        )
                    ),
                ),

                // Exclusive Interactive Projects Hub (Option requested)
                // Project Node 2: GlyphHuman - AI Text Humanizer & Detector Portal
                React.createElement('div', {
                    style: projectCardStyle,
                    onMouseEnter: (e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                        e.currentTarget.style.border = '1px solid rgba(255, 0, 128, 0.3)';
                        e.currentTarget.style.transform = 'translateY(-3px)';
                    },
                    onMouseLeave: (e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                        e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }

                },

                    // Title Row
                    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' } },
                        React.createElement('h4', { style: { color: '#fff', fontSize: '1.35rem', margin: '0', fontWeight: '700' } }, '"GlyphHuman" – AI Text Humanizer & Detector Portal'),
                        React.createElement('span', { style: { background: 'rgba(255, 0, 128, 0.1)', color: '#ff0080', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' } }, 'Active Service')
                    ),

                    // Detailed Breakdown Info Hub
                    React.createElement('div', { style: { color: 'rgba(255,255,255,0.72)', fontSize: '0.95rem', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px', lineHeight: '1.6' } },
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#ff0080' } }, 'Core Purpose: '), 'A web-based application designed to convert robotic, AI-generated text into a natural, human-like writing style and analyze text to calculate AI probability scores.'
                        ),
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#ff0080' } }, 'The Detector Engine: '), 'Uses a customized rule-based algorithm in Python to check keyword density (tracking words like delve, moreover, tapestry), vocabulary richness, and sentence length patterns to output an AI vs. Human percentage.'
                        ),
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#ff0080' } }, 'The Humanizer Engine: '), 'Utilizes pure Python and regex logic instead of a heavy AI model. It works by randomly replacing robotic phrases with casual human synonyms and altering long sentence structures to mimic natural human writing flow ("burstiness").'
                        ),
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#ff0080' } }, 'Frontend Features: '), 'A multi-view React interface featuring real-time word/character counters, side-by-side input and output fields, instant clipboard copying, and an integrated contact form powered by Formspree.'
                        ),
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#ff0080' } }, 'Privacy & Protection: '), 'Relies on a strict zero-persistence privacy policy, meaning user text data is processed instantly through the Flask backend API and never stored or logged.'
                        )
                    ),

                    // Footer Container: Tech Stack & Live Link
                    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' } },
                        React.createElement('span', { style: { color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' } }, 'Tech Stack: Flask API / React.js / Python / Regex'),

                        // Interactive Link Button
                        React.createElement('a', {
                            href: 'https://glyphhuman.resumepro.it.com',
                            target: '_blank',
                            rel: 'noopener noreferrer',
                            style: {
                                color: '#ff0080',
                                textDecoration: 'none',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                borderBottom: '1px dashed #ff0080',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            },
                            onMouseEnter: (e) => { e.target.style.color = '#fff'; e.target.style.borderBottomColor = '#fff'; },
                            onMouseLeave: (e) => { e.target.style.color = '#ff0080'; e.target.style.borderBottomColor = '#ff0080'; }
                        }, '🔗 glyphhuman.resumepro.it.com')
                    )
                ),
                // Project Node 1: Lets Detect - Fake News Detector Portal
                React.createElement('div', {
                    style: projectCardStyle,
                    onMouseEnter: (e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                        e.currentTarget.style.border = '1px solid rgba(0, 242, 254, 0.3)';
                        e.currentTarget.style.transform = 'translateY(-3px)';
                    },
                    onMouseLeave: (e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                        e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }
                },
                    // Title Row
                    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' } },
                        React.createElement('h4', { style: { color: '#fff', fontSize: '1.35rem', margin: '0', fontWeight: '700' } }, '"Lets Detect" – Fake News Detector Portal'),
                        React.createElement('span', { style: { background: 'rgba(0, 242, 254, 0.1)', color: '#00f2fe', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' } }, 'Live System')
                    ),

                    // Detailed Breakdown Info Hub
                    React.createElement('div', { style: { color: 'rgba(255,255,255,0.72)', fontSize: '0.95rem', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px', lineHeight: '1.6' } },
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#00f2fe' } }, 'Core Purpose: '), 'An AI-powered portal designed to identify fake news, rumors, and misinformation, specifically optimized for English and Urdu contexts.'
                        ),
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#00f2fe' } }, 'The AI Engine: '), 'Utilizes an 8-Layer Hybrid AI Engine that scans text to calculate a fake news score based on clickbait, conspiracies, emotional triggers, and pseudoscience.'
                        ),
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#00f2fe' } }, 'Source Verification: '), 'The system automatically checks news links against trusted domains (like Dawn, Geo, BBC) and flags known unreliable sources.'
                        ),
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#00f2fe' } }, 'Image Scanning (OCR): '), 'Integrates Tesseract.js to extract and verify text directly from uploaded screenshots or news images.'
                        ),
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#00f2fe' } }, 'Security & Privacy: '), 'Features a secure OTP email login and a strict zero-persistence privacy policy that discards user data immediately after scanning.'
                        )
                    ),

                    // Footer Container: Tech Stack & Live Link
                    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' } },
                        React.createElement('span', { style: { color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' } }, 'Tech Stack: Flask (Backend) / React.js (Frontend) / MongoDB'),

                        // Interactive Link Button
                        React.createElement('a', {
                            href: 'https://letsdetect.resumepro.it.com',
                            target: '_blank',
                            rel: 'noopener noreferrer',
                            style: {
                                color: '#00f2fe',
                                textDecoration: 'none',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                borderBottom: '1px dashed #00f2fe',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            },
                            onMouseEnter: (e) => { e.target.style.color = '#fff'; e.target.style.borderBottomColor = '#fff'; },
                            onMouseLeave: (e) => { e.target.style.color = '#00f2fe'; e.target.style.borderBottomColor = '#00f2fe'; }
                        }, '🔗 letsdetect.resumepro.it.com')
                    )
                ),
                // Project Node 3: Resume Pro – All-in-One Productivity Suite
                React.createElement('div', {
                    style: projectCardStyle,
                    onMouseEnter: (e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                        e.currentTarget.style.border = '1px solid rgba(168, 85, 247, 0.3)';
                        e.currentTarget.style.transform = 'translateY(-3px)';
                    },
                    onMouseLeave: (e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                        e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }
                },
                    // Title Row
                    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' } },
                        React.createElement('h4', { style: { color: '#fff', fontSize: '1.35rem', margin: '0', fontWeight: '700' } }, 'Resume Pro – All-in-One Productivity Suite'),
                        React.createElement('span', { style: { background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' } }, 'Core Platform')
                    ),

                    // Core Advantage Highlight
                    React.createElement('p', { style: { color: 'rgba(255,255,255,0.85)', fontSize: '0.98rem', margin: '0 0 15px 0', fontStyle: 'italic', borderLeft: '3px solid #a855f7', paddingLeft: '12px' } },
                        'An all-in-one, browser-based productivity suite designed for job seekers, creators, and professionals. Runs 100% locally in the browser—no data is ever sent to a server, ensuring absolute speed and complete user privacy.'
                    ),

                    // Detailed Breakdown Info Hub
                    React.createElement('div', { style: { color: 'rgba(255,255,255,0.72)', fontSize: '0.95rem', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px', lineHeight: '1.6' } },
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#a855f7' } }, 'Interactive Resume Builder: '), 'A split-screen interface featuring live side-by-side rendering, multi-template switching (Modern, Classic, Minimalist), an integrated education tracker, and seamless ATS-friendly PDF exports.'
                        ),
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#a855f7' } }, 'LinkedIn Banner Studio: '), 'A built-in graphic canvas built to structure high-definition professional banners using dynamic background gradients and customizable geometric layouts.'
                        ),
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#a855f7' } }, '4K Logo Designer: '), 'A rapid branding utility featuring multi-layout adjustments (stacked, horizontal, icon-only) exporting ultra-sharp 4K graphic files with absolute alpha transparency.'
                        ),
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#a855f7' } }, 'Word-to-PDF Converter: '), 'A high-speed drag-and-drop file processing pipeline that instantly converts complex Microsoft Word (.docx) formats into clean, structured PDFs entirely client-side.'
                        ),
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#a855f7' } }, 'Rich Text Document Editor: '), 'An embedded micro-word processor providing direct inline styling, formatting blocks, and instant raw downloads into standard .docx formats.'
                        ),
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#a855f7' } }, 'Zip & Unzip Utilities: '), 'A browser-based archive layer allowing instant granular extraction of individual compressed assets or compilation of multiple data layers into a zipped bundle.'
                        )
                    ),

                    // Footer Container: Tech Stack & Live Link
                    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' } },
                        React.createElement('span', { style: { color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' } }, 'Tech Stack: React.js / Client-Side Web APIs / HTML5 Canvas / JSZip'),

                        // Interactive Link Button
                        React.createElement('a', {
                            href: 'https://resumepro.it.com',
                            target: '_blank',
                            rel: 'noopener noreferrer',
                            style: {
                                color: '#a855f7',
                                textDecoration: 'none',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                borderBottom: '1px dashed #a855f7',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            },
                            onMouseEnter: (e) => { e.target.style.color = '#fff'; e.target.style.borderBottomColor = '#fff'; },
                            onMouseLeave: (e) => { e.target.style.color = '#a855f7'; e.target.style.borderBottomColor = '#a855f7'; }
                        }, '🔗 resumepro.it.com')
                    )
                ),
                // Project Node 4: Quickkit – Gamified Assessment & Trivia Platform
                React.createElement('div', {
                    style: projectCardStyle,
                    onMouseEnter: (e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                        e.currentTarget.style.border = '1px solid rgba(16, 185, 129, 0.3)';
                        e.currentTarget.style.transform = 'translateY(-3px)';
                    },
                    onMouseLeave: (e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                        e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }
                },
                    // Title Row
                    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' } },
                        React.createElement('h4', { style: { color: '#fff', fontSize: '1.35rem', margin: '0', fontWeight: '700' } }, 'Quickkit – Gamified Assessment & Trivia Platform'),
                        React.createElement('span', { style: { background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' } }, 'Gamified System')
                    ),

                    // Core Purpose
                    React.createElement('p', { style: { color: 'rgba(255,255,255,0.85)', fontSize: '0.98rem', margin: '0 0 15px 0' } },
                        'A Gamified Multi-Category Assessment & Trivia Platform designed to test users across a vast range of academic, professional, and pop-culture subjects.'
                    ),

                    // Detailed Breakdown Info Hub
                    React.createElement('div', { style: { color: 'rgba(255,255,255,0.72)', fontSize: '0.95rem', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px', lineHeight: '1.6' } },
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#10b981' } }, '14 Diverse Quiz Categories: '), 'Offers specialized assessments in fields like Web Development (Coder Quiz), Teaching Pedagogy, English Grammar, Mathematics, Sciences (Physics, Chemistry, Biology), Commerce, Pre-Engineering, Psychology, General Knowledge, and Entertainment.'
                        ),
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#10b981' } }, 'Progressive Difficulty Matrix: '), 'Every topic features a 3-tier round system mapping from Basic/Easy, Intermediate/Medium, to Advanced/Hard.'
                        ),
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#10b981' } }, 'Strict Gatekeeping Mechanic: '), 'To keep things challenging, users must score at least 8 out of 10 in their current round to unlock the consecutive higher-difficulty level.'
                        ),
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#10b981' } }, 'Performance Auditing: '), 'Features an automated Efficiency Report at the end of the assessment, calculating overall accuracy percentages and providing broken-down performance metrics for each level.'
                        ),
                        React.createElement('p', { style: { margin: '0' } },
                            React.createElement('strong', { style: { color: '#10b981' } }, 'Modern UI Architecture: '), 'Built with a glassmorphism theme (glass-calc-card), featuring real-time responsive progress bars and seamless state navigation.'
                        )
                    ),

                    // Footer Container: Tech Stack & Live Link
                    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' } },
                        React.createElement('span', { style: { color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' } }, 'Tech Stack: React.js / Responsive UI State Architecture / CSS Glassmorphism'),

                        // Interactive Link Button
                        React.createElement('a', {
                            href: 'https://quickkit.resumepro.com',
                            target: '_blank',
                            rel: 'noopener noreferrer',
                            style: {
                                color: '#10b981',
                                textDecoration: 'none',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                borderBottom: '1px dashed #10b981',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            },
                            onMouseEnter: (e) => { e.target.style.color = '#fff'; e.target.style.borderBottomColor = '#fff'; },
                            onMouseLeave: (e) => { e.target.style.color = '#10b981'; e.target.style.borderBottomColor = '#10b981'; }
                        }, '🔗 quickkit.resumepro.com')
                    )
                ),

            )
        );
    }
    else if (currentPage === 'thank-you') {

        mainElement = React.createElement('main', {
            className: 'services-page',
            style: {
                minHeight: '70vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '20px'
            }
        },
            React.createElement('div', {
                style: {
                    fontSize: '4rem',
                    marginBottom: '20px',
                    textShadow: '0 0 20px rgba(0, 242, 254, 0.5)'
                }
            }, '🎉'),
            React.createElement('h2', {
                className: 'services-heading',
                style: { color: '#00f2fe', fontSize: '2.5rem', marginBottom: '15px' }
            }, 'Thank You!'),
            React.createElement('p', {
                className: 'services-sub-text',
                style: { fontSize: '1.2rem', maxWidth: '500px', margin: '0 auto 30px' }
            }, 'Your order request has been successfully sent. Our team will contact you on WhatsApp or Email shortly.'),

        );

    } else if (currentPage === 'admin-login') {

        // Dark Glassmorphism Input Styling
        const adminInputStyle = {
            width: '100%',
            padding: '14px 18px',
            margin: '12px 0',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(255, 255, 255, 0.05)',
            color: '#fff',
            fontSize: '16px',
            outline: 'none',
            boxSizing: 'border-box',
            backdropFilter: 'blur(5px)',
            transition: 'all 0.3s ease'
        };

        mainElement = React.createElement('main', {
            className: 'services-page',
            style: { padding: '40px 20px', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }
        },
            // Premium Glassmorphism Card
            React.createElement('div', {
                style: {
                    width: '100%',
                    maxWidth: '420px',
                    background: 'rgba(20, 20, 30, 0.75)',
                    padding: '40px 30px',
                    borderRadius: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(20px)',
                    boxSizing: 'border-box',
                    textAlign: 'center'
                }
            },
                // Admin Icon & Title
                React.createElement('div', { style: { fontSize: '3.5rem', marginBottom: '10px', textShadow: '0 0 20px rgba(0, 242, 254, 0.3)' } }, '🔐'),
                React.createElement('h2', {
                    style: {
                        background: 'linear-gradient(45deg, #00f2fe, #ff0080)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: '2rem',
                        marginBottom: '8px',
                        fontWeight: '700'
                    }
                }, 'Admin Portal'),
                React.createElement('p', { style: { color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginBottom: '25px' } }, 'Authorized Personnel Only'),

                // Form Elements
                // Form Elements (Replace this part in your admin-login block)
                React.createElement('form', { onSubmit: handleAdminLogin },
                    React.createElement('input', { type: 'text', name: 'email', placeholder: '👤 Username / Email', required: true, style: adminInputStyle }),
                    React.createElement('input', { type: 'password', name: 'password', placeholder: '🔑 Password', required: true, style: adminInputStyle }),

                    React.createElement('button', {
                        type: 'submit',
                        className: 'card-btn',
                        style: { width: '100%', marginTop: '20px', padding: '12px', fontSize: '16px', fontWeight: '600', background: 'linear-gradient(45deg, #00f2fe, #ff0080)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(255, 0, 128, 0.3)' }
                    }, 'Secure Login 🚀')
                ),

                // Back Button to Home
                // Ultra Premium Animated "Cancel & Go Back" Button
                React.createElement('button', {
                    onClick: toHome,
                    className: 'card-btn',
                    // HOVER ANIMATIONS LOGIC (Inline States Transitions):
                    onMouseEnter: (e) => {
                        e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                        e.target.style.border = '1px solid rgba(0, 242, 254, 0.6)'; // Neon Cyan Border Active
                        e.target.style.color = '#00f2fe'; // Text turns Neon Cyan
                        e.target.style.boxShadow = '0 0 25px rgba(0, 242, 254, 0.25), inset 0 1px 0 rgba(255,255,255,0.2)'; // Outside Glow Effect
                        e.target.style.transform = 'translateY(-2px) scale(1.01)'; // Smooth Lift Micro-interaction
                    },
                    onMouseLeave: (e) => {
                        e.target.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01))';
                        e.target.style.border = '1px solid rgba(255, 255, 255, 0.15)';
                        e.target.style.color = 'rgba(255, 255, 255, 0.8)';
                        e.target.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
                        e.target.style.transform = 'translateY(0) scale(1)'; // Return to original position
                    },
                    style: {
                        width: '100%',
                        marginTop: '15px',
                        padding: '14px',
                        fontSize: '15px',
                        fontWeight: '600',
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01))',
                        color: 'rgba(255, 255, 255, 0.8)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        boxSizing: 'border-box',
                        letterSpacing: '0.5px',
                        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                        // Is liquid easing transition se upar wale saare properties smooth chalenge:
                        transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)'
                    }
                }, '← Cancel & Go Back')
            )
        );
    } else if (currentPage === 'admin-panel') {
        // ADMIN PANEL UI
        mainElement = React.createElement('main', {
            className: 'services-page',
            style: { padding: '40px 20px', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }
        },
            React.createElement('div', { style: { fontSize: '4rem', marginBottom: '10px' } }, '👑'),
            React.createElement('h2', {
                style: { background: 'linear-gradient(45deg, #00f2fe, #ff0080)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '2.5rem' }
            }, 'Welcome to Admin Dashboard'),
            React.createElement('p', { style: { color: 'rgba(255,255,255,0.7)', fontSize: '1.2rem', marginTop: '10px' } }, 'Aap yahan se website ka data manage kar sakte hain.')
        );

    } else if (currentPage === 'update-password') { //

        // 🔒 FIX: Input style ko yahan locally define kiya taake white screen crash na ho
        const passwordInputStyle = {
            width: '100%',
            padding: '14px 18px',
            margin: '0 0 20px 0',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(255, 255, 255, 0.05)',
            color: '#fff',
            fontSize: '0.95rem',
            outline: 'none',
            boxSizing: 'border-box',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            textAlign: 'center'
        };

        mainElement = React.createElement('main', { className: 'services-page', style: { padding: '40px 20px', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' } }, //
            React.createElement('form', { onSubmit: handlePasswordUpdate, style: { width: '100%', maxWidth: '420px', background: 'rgba(20, 20, 30, 0.65)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(15px)', boxSizing: 'border-box', textAlign: 'center' } }, //

                // 👑 PREMIUM BORDERED CAPSULE HEADING
                React.createElement('div', {
                    style: {
                        display: 'table',
                        margin: '0 auto 16px',
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01))',
                        backdropFilter: 'blur(15px)',
                        WebkitBackdropFilter: 'blur(15px)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '20px',
                        padding: '10px 24px',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)'
                    }
                },
                    React.createElement('h2', {
                        style: {
                            fontSize: '1.65rem',
                            fontWeight: '800',
                            letterSpacing: '1px',
                            margin: '0',
                            background: 'linear-gradient(90deg, #00f2fe 0%, #ff0080 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            WebkitTextStroke: '1px rgba(255, 255, 255, 0.06)',
                            filter: 'drop-shadow(0 4px 10px rgba(0, 242, 254, 0.3))'
                        }
                    }, 'Update Password 🔑')
                ),

                // 📝 RELATED SUB-TEXT DETAIL
                React.createElement('p', {
                    style: {
                        color: 'rgba(255, 255, 255, 0.55)',
                        fontSize: '0.88rem',
                        lineHeight: '1.5',
                        marginBottom: '24px',
                        padding: '0 12px',
                        fontWeight: '400'
                    }
                }, 'Secure your administrator dashboard by configuring a strong custom master password below to prevent unauthorized access.'),

                // 🔑 INPUT FIELD (Ab yeh bilkul safe hai)
                React.createElement('input', { type: 'text', name: 'newPassword', placeholder: '🔑 Enter New Password', required: true, style: passwordInputStyle }), //

                // ✨ PREMIUM ACTION BUTTONS
                React.createElement('button', { type: 'submit', className: 'card-btn', style: { width: '100%', marginTop: '10px', padding: '12px', background: 'linear-gradient(45deg, #00f2fe, #ff0080)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' } }, 'Save Password ✨'), //
                React.createElement('button', { type: 'button', onClick: toAdminPanel, className: 'card-btn', style: { width: '100%', marginTop: '15px', background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', padding: '10px', cursor: 'pointer' } }, 'Cancel') //
            )
        );
    } else if (currentPage === 'upload-page') {
        mainElement = React.createElement('main', {
            className: 'main-content',
            style: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                padding: '40px 20px',
                width: '100%'
            }
        },
            // 1️⃣ 👑 ULTRA-PREMIUM BORDERED HEADING BADGE (Exact Screenshot Style)
            React.createElement('div', {
                style: {
                    display: 'table',               // Heading jitna hi size shrink karega
                    margin: '0 auto 35px',          // Screen ke center mein alignment aur bottom gap
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01))', // Mild glass background
                    backdropFilter: 'blur(15px)',
                    WebkitBackdropFilter: 'blur(15px)',

                    // 🎆 OUTSIDE SLEEK BORDER (Jo aapne screenshot mein point out kiya)
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '24px',           // Premium smooth rounded corners
                    padding: '12px 32px',           // Text ke aas paas clean breathing space
                    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)' // Subtle internal reflection
                }
            },
                React.createElement('h2', {
                    className: 'section-heading',
                    style: {
                        fontSize: '2.3rem',         // Clean and balanced size
                        fontWeight: '800',          // Extra bold cinematic weight
                        letterSpacing: '1.5px',
                        textAlign: 'center',
                        margin: '0',                // Extra default margins remove karne ke liye
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',

                        // Dynamic Gradient Fill
                        background: 'linear-gradient(90deg, #00f2fe 0%, #ff0080 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',

                        // ⚡ TEXT SHARP BORDER (Text Outline Effect)
                        WebkitTextStroke: '1px rgba(255, 255, 255, 0.08)',

                        // Neon Aura Glow
                        filter: 'drop-shadow(0 4px 10px rgba(0, 242, 254, 0.3))'
                    }
                }, 'Uploads & Management 📁')
            ),

            // 2️⃣ RELATED DESCRIPTION LINE
            React.createElement('p', {
                style: {
                    color: 'rgba(255, 255, 255, 0.65)',
                    fontSize: '0.95rem',
                    textAlign: 'center',
                    marginBottom: '40px',
                    maxWidth: '500px',
                    lineHeight: '1.6',
                    letterSpacing: '0.3px'
                }
            }, 'Apex Code Admin Portal ka exclusive cloud upload center. Yahan se aap website ke liye nayi jobs, assets aur digital marketplace resources secure tareeqay se manage kar sakte hain.'),

            // CARDS WRAPPER CONTAINER
            React.createElement('div', {
                style: {
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '30px',
                    width: '100%',
                    maxWidth: '900px',
                    marginBottom: '50px'
                }
            },
                // CARD 1: JOBS UPLOAD
                React.createElement('div', {
                    className: 'card',
                    style: {
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.02))',
                        backdropFilter: 'blur(25px)',
                        WebkitBackdropFilter: 'blur(25px)',
                        border: '1px solid rgba(255, 255, 255, 0.16)',
                        borderRadius: '32px',
                        padding: '50px 35px',
                        boxShadow: '0 30px 60px rgba(0, 0, 0, 0.5), inset 0 1px 2px rgba(255, 255, 255, 0.25)',
                        textAlign: 'center',
                        maxWidth: '380px',
                        width: '100%',
                        position: 'relative',
                        overflow: 'hidden'
                    }
                },
                    React.createElement('div', {
                        style: {
                            width: '75px',
                            height: '75px',
                            borderRadius: '24px',
                            background: 'linear-gradient(135deg, rgba(255, 0, 128, 0.35), rgba(0, 242, 254, 0.25))',
                            border: '1px solid rgba(255, 255, 255, 0.25)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 28px',
                            fontSize: '2.2rem',
                            boxShadow: '0 12px 30px rgba(255, 0, 128, 0.45)'
                        }
                    }, '💼'),
                    React.createElement('h3', { className: 'card-title', style: { color: '#fff', fontSize: '1.5rem', fontWeight: '700', marginBottom: '14px', background: 'linear-gradient(180deg, #ffffff 30%, #b3b3b3 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }, 'Jobs Upload'),
                    React.createElement('p', { style: { color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '38px' } }, 'Portal par nayi jobs open karne, management automation setup karne aur recruitment wizard shuru karne ke liye niche click karein.'),
                    React.createElement('button', { className: 'card-btn', style: { width: '100%', padding: '15px', borderRadius: '18px', background: 'linear-gradient(90deg, #ff0080, #00f2fe)', color: '#fff', border: 'none', fontSize: '1rem', fontWeight: '700', boxShadow: '0 0 25px rgba(255, 0, 128, 0.55)', cursor: 'pointer' }, onClick: toJobUploadForm }, 'Get Started 🚀')
                ),

                // CARD 2: WEBSITE FOR SALE
                React.createElement('div', {
                    className: 'card',
                    style: {
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.02))',
                        backdropFilter: 'blur(25px)',
                        WebkitBackdropFilter: 'blur(25px)',
                        border: '1px solid rgba(255, 255, 255, 0.16)',
                        borderRadius: '32px',
                        padding: '50px 35px',
                        boxShadow: '0 30px 60px rgba(0, 0, 0, 0.5), inset 0 1px 2px rgba(255, 255, 255, 0.25)',
                        textAlign: 'center',
                        maxWidth: '380px',
                        width: '100%',
                        position: 'relative',
                        overflow: 'hidden'
                    }
                },
                    React.createElement('div', { style: { position: 'absolute', top: '-10%', right: '-10%', width: '120px', height: '120px', background: 'rgba(0, 242, 254, 0.12)', filter: 'blur(30px)', borderRadius: '50%', pointerEvents: 'none' } }),
                    React.createElement('div', { style: { width: '75px', height: '75px', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.35), rgba(0, 224, 140, 0.25))', border: '1px solid rgba(255, 255, 255, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', fontSize: '2.2rem', boxShadow: '0 12px 30px rgba(0, 242, 254, 0.45)' } }, '🌐'),
                    React.createElement('h3', { className: 'card-title', style: { color: '#fff', fontSize: '1.5rem', fontWeight: '700', marginBottom: '14px', background: 'linear-gradient(180deg, #ffffff 30%, #b3b3b3 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }, 'Website For Sale'),

                    React.createElement('p', { style: { color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '38px' } }, 'Naye web templates, premium domains, aur ready-made code projects ko sale par lagane aur unki live listings manage karne ke liye shuru karein.'),
                    React.createElement('button', { className: 'card-btn', style: { width: '100%', padding: '15px', borderRadius: '18px', background: 'linear-gradient(90deg, #00f2fe, #00e08c)', color: '#fff', border: 'none', fontSize: '1rem', fontWeight: '700', boxShadow: '0 0 25px rgba(0, 242, 254, 0.55)', cursor: 'pointer' }, onClick: toWebsiteUploadForm }, 'Manage Sales 💰')
                )
            ),

        );
    } else if (currentPage === 'job-upload-form') {
        const jobInputStyle = {
            width: '100%', padding: '14px 18px', margin: '0 0 18px 0', borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(255, 255, 255, 0.05)',
            color: '#fff', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box',
            backdropFilter: 'blur(5px)', fontFamily: 'inherit'
        };

        mainElement = React.createElement('main', {
            className: 'services-page',
            style: { padding: '40px 20px', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }
        },
            React.createElement('div', { style: { fontSize: '3.5rem', marginBottom: '10px' } }, '💼'),
            React.createElement('h2', {
                style: { background: 'linear-gradient(45deg, #00f2fe, #ff0080)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '2rem', marginBottom: '25px', textAlign: 'center' }
            }, jobToEdit ? 'Job Edit Karein ✏️' : 'Nai Job Post Karein 🚀'),

            // FORM CARD (key isliye taake Edit click karne par fields fresh values ke sath refresh hon)
            React.createElement('form', {
                key: jobToEdit ? `edit-${jobToEdit.id}` : 'new-job',
                onSubmit: handleJobFormSubmit,
                style: {
                    width: '100%', maxWidth: '500px', background: 'rgba(20, 20, 30, 0.75)', padding: '35px 30px',
                    borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(20px)', boxSizing: 'border-box', marginBottom: '40px'
                }
            },
                React.createElement('label', { style: { color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', display: 'block', marginBottom: '6px' } }, 'Job Title'),
                React.createElement('input', { type: 'text', name: 'title', placeholder: 'e.g. WordPress Developer', defaultValue: jobToEdit ? jobToEdit.title : '', required: true, style: jobInputStyle }),

                React.createElement('label', { style: { color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', display: 'block', marginBottom: '6px' } }, 'Salary'),
                React.createElement('input', { type: 'text', name: 'salary', placeholder: 'e.g. PKR 50,000 - 80,000', defaultValue: jobToEdit ? jobToEdit.salary : '', style: jobInputStyle }),

                React.createElement('label', { style: { color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', display: 'block', marginBottom: '6px' } }, 'Job Description'),
                React.createElement('textarea', { name: 'description', placeholder: 'Job ki tafseel yahan likhein...', defaultValue: jobToEdit ? jobToEdit.description : '', required: true, rows: 5, style: { ...jobInputStyle, resize: 'vertical', fontFamily: 'inherit' } }),

                React.createElement('button', {
                    type: 'submit', className: 'card-btn',
                    style: { width: '100%', marginTop: '10px', padding: '14px', fontSize: '1rem', fontWeight: '700', background: 'linear-gradient(45deg, #00f2fe, #ff0080)', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', boxShadow: '0 4px 20px rgba(255, 0, 128, 0.35)' }
                }, jobToEdit ? 'Job Update Karein ✅' : 'Job Post Karein 🚀')
            ),

            // POSTED JOBS LIST (Admin Manage Section)
            React.createElement('div', { style: { width: '100%', maxWidth: '500px' } },
                React.createElement('h3', { style: { color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', marginBottom: '16px', textAlign: 'left' } }, '📋 Posted Jobs'),

                jobs.length === 0 ? React.createElement('p', { style: { color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' } }, 'Abhi koi job post nahi hui.') :
                    jobs.map(job => React.createElement('div', {
                        key: job.id,
                        style: { background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '14px', padding: '16px 18px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }
                    },
                        React.createElement('div', null,
                            React.createElement('p', { style: { color: '#fff', fontWeight: '700', fontSize: '0.95rem', margin: 0 } }, job.title),
                            React.createElement('p', { style: { color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', margin: '4px 0 0' } }, job.salary || 'Salary not mentioned')
                        ),
                        React.createElement('div', { style: { display: 'flex', gap: '8px' } },
                            React.createElement('button', { onClick: toEditJobForm(job), style: { padding: '8px 14px', fontSize: '0.8rem', fontWeight: '600', color: '#00f2fe', background: 'rgba(0, 242, 254, 0.1)', border: '1px solid rgba(0, 242, 254, 0.35)', borderRadius: '10px', cursor: 'pointer' } }, 'Edit ✏️'),
                            React.createElement('button', { onClick: () => handleJobDelete(job.id), style: { padding: '8px 14px', fontSize: '0.8rem', fontWeight: '600', color: '#ff3366', background: 'rgba(255, 51, 102, 0.1)', border: '1px solid rgba(255, 51, 102, 0.35)', borderRadius: '10px', cursor: 'pointer' } }, 'Delete 🗑️')
                        )
                    ))
            )
        );
    } else if (currentPage === 'available-jobs') {
        mainElement = React.createElement('main', { className: 'services-page' },
            // HEADING BADGE
            
            React.createElement('div', {
    style: {
        display: 'flex',                             // 'table' se 'flex' kiya takay elements automatically fit ho sakein
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0 auto 20px',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01))',
        backdropFilter: 'blur(15px)',
        WebkitBackdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '24px',
        padding: '12px 24px',                        // Mobile spacing ke liye padding adjust ki
        width: 'fit-content',
        maxWidth: '90%',                             // Card ko mobile screen se bahar nikalne se rokega
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        boxSizing: 'border-box'
    }
},
    React.createElement('h2', {
        style: {
            fontSize: 'clamp(1.4rem, 5vw, 2.3rem)',  // Mobile screens par font size automatic chota ho jayega
            fontWeight: '800',
            letterSpacing: '0.5px',                  // Squeeze hone se bachane ke liye spacing thodi kam ki
            textAlign: 'center',
            margin: '0',
            whiteSpace: 'nowrap',                    // Text aur emoji hamesha single line mein lock rahenge
            background: 'linear-gradient(90deg, #00f2fe 0%, #ff0080 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 4px 10px rgba(0, 242, 254, 0.3))'
        }
    }, 'Available Jobs 💼')
),

            React.createElement('p', {
                style: { color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.95rem', textAlign: 'center', marginBottom: '40px', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto', lineHeight: '1.6' }
            }, 'Check out the openings below to join the Apex Code team.'),

            // JOBS GRID
            jobs.length === 0 ? React.createElement('p', {
                style: { color: 'rgba(255,255,255,0.5)', fontSize: '1rem', textAlign: 'center' }
            }, 'There are no vacancies available at the moment. Please try again later.') :

                React.createElement('div', {
                    style: { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: '30px', width: '100%', maxWidth: '900px', margin: '0 auto' }
                },
                    jobs.map(job => React.createElement('div', {
                        key: job.id,
                        className: 'card',
                        style: {
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.02))',
                            backdropFilter: 'blur(25px)', WebkitBackdropFilter: 'blur(25px)',
                            border: '1px solid rgba(255, 255, 255, 0.16)', borderRadius: '32px', padding: '40px 30px',
                            boxShadow: '0 30px 60px rgba(0, 0, 0, 0.5), inset 0 1px 2px rgba(255, 255, 255, 0.25)',
                            textAlign: 'center', maxWidth: '340px', width: '100%'
                        }
                    },
                        React.createElement('div', {
                            style: {
                                width: '65px', height: '65px', borderRadius: '20px',
                                background: 'linear-gradient(135deg, rgba(255, 0, 128, 0.35), rgba(0, 242, 254, 0.25))',
                                border: '1px solid rgba(255, 255, 255, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 20px', fontSize: '1.8rem', boxShadow: '0 12px 30px rgba(255, 0, 128, 0.45)'
                            }
                        }, '💼'),
                        React.createElement('h3', { style: { color: '#fff', fontSize: '1.3rem', fontWeight: '700', marginBottom: '8px' } }, job.title),
                        React.createElement('p', { style: { color: '#00f2fe', fontSize: '0.9rem', fontWeight: '600', marginBottom: '24px' } }, job.salary || 'Salary: Negotiable'),

                  React.createElement('div', { style: { display: 'flex', gap: '10px' } },
                            React.createElement('button', {
                                onClick: () => setSelectedJobDescription(job),
                                style: { flex: '1', padding: '12px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.08)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.2)', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }
                            }, 'Description 📄'),
                            React.createElement('button', {
                                onClick: toJobApplyForm(job),
                                style: { flex: '1', padding: '12px', borderRadius: '14px', background: 'linear-gradient(90deg, #ff0080, #00f2fe)', color: '#fff', border: 'none', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 0 18px rgba(255, 0, 128, 0.4)' }
                            }, 'Apply 🚀')
                        )
                    ))
                ),

            // 2. YEH WALA BLOCK HAMESHA SHOW HOGA (jobs posted hon ya na hon)
            renderAvailableJobsBlocks(),

            // DESCRIPTION MODAL (Description button click karne par khulega)
            selectedJobDescription ? React.createElement('div', {
                onClick: () => setSelectedJobDescription(null),
                style: {
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(5px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 9999, padding: '20px', boxSizing: 'border-box'
                }
            },
                React.createElement('div', {
                    onClick: (e) => e.stopPropagation(),
                    style: {
                        background: 'rgba(20, 20, 30, 0.95)', border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '24px', padding: '35px 30px', maxWidth: '450px', width: '100%',
                        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)', position: 'relative'
                    }
                },
                    React.createElement('button', {
                        onClick: () => setSelectedJobDescription(null),
                        style: { position: 'absolute', top: '14px', right: '18px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '1.4rem', cursor: 'pointer' }
                    }, '✕'),
                    React.createElement('h3', { style: { color: '#00f2fe', fontSize: '1.4rem', fontWeight: '700', marginBottom: '6px' } }, selectedJobDescription.title),
                    React.createElement('p', { style: { color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginBottom: '18px' } }, selectedJobDescription.salary || 'Salary: Negotiable'),
                    React.createElement('p', { style: { color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', lineHeight: '1.7', whiteSpace: 'pre-wrap' } }, selectedJobDescription.description)
                )
            ) : null
        );
        
        // 1️⃣ PEHLE YEH PAGE KHULEGA (CONTACT US CARD)
    } else if (currentPage === 'job-apply-form' && selectedJobForApply) {
        const handleApplySubmit = (e) => {
            e.preventDefault();
            const form = e.target;
            const fd = new FormData(form);

            fetch('https://formsubmit.co/ajax/book.apexcode@gmail.com', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    _subject: 'New Job Application: ' + selectedJobForApply.title,
                    _template: 'table',
                    _captcha: 'false',
                    Job_Title: selectedJobForApply.title,
                    Job_Salary: selectedJobForApply.salary || 'N/A',
                    Applicant_Name: fd.get('name'),
                    Email: fd.get('email'),
                    Phone: fd.get('phone'),
                    Address: fd.get('address'),
                    Experience: fd.get('experience'),
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success === 'true' || data.success === true) {
                        alert('✅ Application bhej di gayi! Hum jald rabta karenge.');
                        form.reset();
                        setCurrentPage('available-jobs');
                    } else {
                        alert('❌ Kuch masla hua. Dobara koshish karein.');
                    }
                })
                .catch(err => { console.error(err); alert('❌ Network error.'); });
        };

        const inputStyle = {
            width: '100%',
            padding: '14px 18px',
            marginTop: '8px',
            marginBottom: '20px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(255, 255, 255, 0.05)',
            color: '#fff',
            fontSize: '16px',
            outline: 'none',
            boxSizing: 'border-box',
            backdropFilter: 'blur(5px)'
        };

        const labelStyle = {
            color: 'rgba(255, 255, 255, 0.85)',
            fontSize: '0.95rem',
            fontWeight: '600',
            letterSpacing: '0.5px'
        };

        // Yahan hum mainElement ko assign kar rahe hain taake index.html ka main skeleton, Header aur Footer break na ho
        mainElement = React.createElement('div', {
            style: { padding: '40px 20px', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }
        },
            // Back / Cancel Button
            React.createElement('button', {
                className: 'card-btn',
                style: { marginBottom: '25px', borderColor: 'rgba(255,255,255,0.3)', padding: '8px 20px' },
                onClick: () => setCurrentPage('available-jobs')
            }, '← Back to Jobs'),

            // Premium Heading Badge
            React.createElement('div', {
                style: {
                    display: 'table', margin: '0 auto 20px', background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01))',
                    backdropFilter: 'blur(15px)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '24px',
                    padding: '12px 32px', boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4)'
                }
            },
                React.createElement('h2', {
                    className: 'section-heading',
                    style: {
                        fontSize: '2.1rem', fontWeight: '800', textAlign: 'center', margin: '0',
                        background: 'linear-gradient(90deg, #00f2fe 0%, #ff0080 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        filter: 'drop-shadow(0 4px 10px rgba(0, 242, 254, 0.3))'
                    }
                }, 'Apply for: ' + selectedJobForApply.title)
            ),

            React.createElement('p', {
                className: 'services-sub-text',
                style: { color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', marginBottom: '35px', textAlign: 'center' }
            }, 'Estimated Salary: ' + (selectedJobForApply.salary || 'N/A')),

            // Form Card
            React.createElement('form', {
                onSubmit: handleApplySubmit,
                style: {
                    width: '100%', maxWidth: '600px', background: 'rgba(20, 20, 30, 0.65)', padding: '40px',
                    borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(15px)', boxSizing: 'border-box'
                }
            },
                React.createElement('div', null,
                    React.createElement('label', { style: labelStyle }, '👤 Full Name'),
                    React.createElement('input', { name: 'name', type: 'text', required: true, style: inputStyle })
                ),
                React.createElement('div', null,
                    React.createElement('label', { style: labelStyle }, '✉️ Email Address'),
                    React.createElement('input', { name: 'email', type: 'email', required: true, style: inputStyle })
                ),
                React.createElement('div', null,
                    React.createElement('label', { style: labelStyle }, '📞 Phone Number'),
                    React.createElement('input', { name: 'phone', type: 'tel', required: true, style: inputStyle })
                ),
                React.createElement('div', null,
                    React.createElement('label', { style: labelStyle }, '📍 Current Address'),
                    React.createElement('textarea', { name: 'address', rows: 2, required: true, style: { ...inputStyle, resize: 'none' } })
                ),
                React.createElement('div', null,
                    React.createElement('label', { style: labelStyle }, '💼 Professional Experience'),
                    React.createElement('textarea', { name: 'experience', rows: 4, placeholder: 'Apna relevant experience ya technical stack tafseel se likhein...', required: true, style: { ...inputStyle, resize: 'none' } })
                ),

                React.createElement('div', { style: { display: 'flex', gap: '15px', marginTop: '15px' } },
                    React.createElement('button', {
                        type: 'submit',
                        className: 'card-btn',
                        style: { flex: 2, padding: '14px', fontSize: '16px', fontWeight: '700', background: 'linear-gradient(45deg, #00f2fe, #ff0080)', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0, 242, 254, 0.3)' }
                    }, 'Submit Application 🚀'),

                    React.createElement('button', {
                        type: 'button',
                        className: 'card-btn',
                        style: { flex: 1, padding: '14px', fontSize: '16px', background: 'transparent', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', cursor: 'pointer' },
                        onClick: () => setCurrentPage('available-jobs')
                    }, 'Cancel')
                )
            )
        );
    } else if (currentPage === 'contact-us-form') {

        // Premium Dark Glassmorphism Input Styling
        const inputStyle = {
            width: '100%', padding: '14px 18px', margin: '12px 0', borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(255, 255, 255, 0.05)',
            color: '#fff', fontSize: '16px', outline: 'none', boxSizing: 'border-box',
            transition: 'all 0.3s ease', backdropFilter: 'blur(5px)'
        };

        mainElement = React.createElement('main', {
            className: 'services-page',
            style: { padding: '40px 20px', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }
        },

            // Wapas Card Par Jane Ka Button
            React.createElement('button', {
                className: 'card-btn',
                style: { marginBottom: '20px', alignSelf: 'center', borderColor: 'rgba(255,255,255,0.3)' },
                onClick: () => setCurrentPage('contact-us')
            }, '← Back to Contact Options'),

            // 👑 PREMIUM BORDERED HEADING BADGE
            React.createElement('div', {
                style: {
                    display: 'table', margin: '0 auto 20px', background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01))',
                    backdropFilter: 'blur(15px)', WebkitBackdropFilter: 'blur(15px)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '24px',
                    padding: '12px 32px', boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
                }
            },
                React.createElement('h2', {
                    className: 'section-heading',
                    style: {
                        fontSize: '2.3rem', fontWeight: '800', letterSpacing: '1.5px', textAlign: 'center', margin: '0', display: 'flex', alignItems: 'center', gap: '12px',
                        background: 'linear-gradient(90deg, #00f2fe 0%, #ff0080 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        WebkitTextStroke: '1px rgba(255, 255, 255, 0.08)', filter: 'drop-shadow(0 4px 10px rgba(0, 242, 254, 0.3))'
                    }
                }, 'Send Us A Message 📩')
            ),

            // 📝 NAYI DETAIL/TEXT (HEADING KE NEECHAY, FORM SE OOPAR)
            React.createElement('p', {
                className: 'services-sub-text',
                style: { color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', marginBottom: '35px', textAlign: 'center', maxWidth: '550px' }
            }, 'Please fill out the form below with your details and inquiry. Our support team will get back to you via email or WhatsApp shortly.'),

            // 🚀 PREMIUM UNIFIED CARD — FORM + IMAGE EK HI GLASS CONTAINER MEIN
            React.createElement('div', {
                style: {
                    position: 'relative',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'stretch',
                    width: '100%',
                    maxWidth: '1000px',
                    borderRadius: '28px',
                    overflow: 'hidden',
                    background: 'linear-gradient(145deg, rgba(25,25,38,0.75), rgba(10,10,16,0.85))',
                    border: '1px solid rgba(255,255,255,0.12)',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)'
                }
            },
                // ✨ Ambient glow blobs — premium lighting touch
                React.createElement('div', {
                    style: {
                        position: 'absolute', top: '-70px', left: '-70px', width: '200px', height: '200px',
                        background: 'radial-gradient(circle, rgba(0,242,254,0.25), transparent 70%)',
                        filter: 'blur(10px)', pointerEvents: 'none', zIndex: 0
                    }
                }),
                React.createElement('div', {
                    style: {
                        position: 'absolute', bottom: '-80px', right: '-80px', width: '220px', height: '220px',
                        background: 'radial-gradient(circle, rgba(255,0,128,0.22), transparent 70%)',
                        filter: 'blur(15px)', pointerEvents: 'none', zIndex: 0
                    }
                }),

                // 💎 LEFT: FORM
                React.createElement('form', {
                    onSubmit: handleFormSubmit,
                    style: {
                        flex: '1 1 400px',
                        padding: '48px 42px',
                        boxSizing: 'border-box',
                        position: 'relative',
                        zIndex: 1
                    }
                },
                    React.createElement('input', { type: 'hidden', name: '_subject', value: 'New Message from Apex Code Contact Form!' }),

                    React.createElement('input', { type: 'text', name: 'Name', placeholder: '👤 Your Full Name', required: true, style: inputStyle }),
                    React.createElement('input', { type: 'email', name: 'Email', placeholder: '✉️ Your Email Address', required: true, style: inputStyle }),
                    React.createElement('textarea', { name: 'Message', placeholder: '💬 Type your message here...', rows: '5', required: true, style: { ...inputStyle, resize: 'none' } }),

                    React.createElement('button', {
                        type: 'submit',
                        className: 'card-btn',
                        style: {
                            width: '100%', marginTop: '25px', padding: '14px', fontSize: '18px', fontWeight: '600',
                            background: 'linear-gradient(45deg, #00f2fe, #ff0080)', color: '#fff', border: 'none',
                            borderRadius: '12px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(255, 0, 128, 0.35)'
                        }
                    }, 'Send Message 🚀')
                ),

                // 🎨 RIGHT: IMAGE
                React.createElement('div', {
                    style: {
                        flex: '1 1 380px',
                        minHeight: '420px',
                        position: 'relative',
                        zIndex: 1
                    }
                },
                    React.createElement('img', {
                        src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
                        alt: 'Apex Code Tech Contact Illustration',
                        style: {
                            position: 'absolute', inset: 0,
                            width: '100%', height: '100%',
                            objectFit: 'cover',
                            filter: 'brightness(0.85) contrast(1.15) saturate(1.1)'
                        }
                    }),
                    React.createElement('div', {
                        style: {
                            position: 'absolute', inset: 0,
                            background: 'linear-gradient(100deg, rgba(12,12,20,0.9) 0%, rgba(12,12,20,0.15) 35%, transparent 60%)'
                        }
                    }),
                    React.createElement('div', {
                        style: {
                            position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px',
                            background: 'linear-gradient(90deg, #00f2fe, #ff0080)',
                            opacity: 0.6
                        }
                    })
                )
            ) // Unified Card ends here
        );
        // 1️⃣ CONTACT US MAIN PAGE (AB IS MEIN 2 CARDS HONGAY)
        // 1️⃣ CONTACT US MAIN PAGE (AB IS MEIN 2 CARDS HONGAY)
        // 1️⃣ CONTACT US MAIN PAGE (AB IS MEIN 2 CARDS HONGAY)
    } else if (currentPage === 'contact-us') {

        mainElement = React.createElement('main', {
            className: 'services-page',
            style: { padding: '40px 20px', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }
        },
            // Premium Bordered Heading Badge
            React.createElement('div', {
                style: {
                    display: 'table', margin: '0 auto 20px', background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01))',
                    backdropFilter: 'blur(15px)', WebkitBackdropFilter: 'blur(15px)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '24px',
                    padding: '12px 32px', boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
                }
            },
                React.createElement('h2', {
                    className: 'section-heading',
                    style: {
                        fontSize: '2.3rem', fontWeight: '800', letterSpacing: '1.5px', textAlign: 'center', margin: '0', display: 'flex', alignItems: 'center', gap: '12px',
                        background: 'linear-gradient(90deg, #00f2fe 0%, #ff0080 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        WebkitTextStroke: '1px rgba(255, 255, 255, 0.08)', filter: 'drop-shadow(0 4px 10px rgba(0, 242, 254, 0.3))'
                    }
                }, 'Contact & Support 📞')
            ),

            React.createElement('p', {
                className: 'services-sub-text',
                style: { color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', marginBottom: '40px', textAlign: 'center', maxWidth: '600px' }
            }, 'Welcome to Apex Code Support. Choose an option below to connect with our business team or log an official complaint.'),

            // CARDS CONTAINER (Flex wrapper for side-by-side responsive layout)
            React.createElement('div', {
                style: {
                    display: 'flex', flexWrap: 'wrap', gap: '30px', justifyContent: 'center', width: '100%', maxWidth: '900px', marginTop: '10px'
                }
            },
                // CARD 1: GET IN TOUCH
                React.createElement('div', {
                    className: 'service-card hyper-premium-card',
                    style: {
                        background: 'rgba(10, 11, 18, 0.85)',
                        border: '1px solid rgba(255, 255, 255, 0.07)',
                        boxShadow: '0 30px 70px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 0 50px rgba(0, 242, 254, 0.03)',
                        backdropFilter: 'blur(30px)',
                        WebkitBackdropFilter: 'blur(30px)',
                        padding: '50px 35px 40px',
                        borderRadius: '32px',
                        textAlign: 'left', // Professional asymmetric text alignment
                        flex: '1 1 380px',
                        maxWidth: '420px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        position: 'relative',
                        overflow: 'hidden'
                    }
                },
                    // 1. TOP HARDWARE ACCENT BAR (Elite cyber glow strip)
                    React.createElement('div', {
                        style: {
                            position: 'absolute', top: '0', left: '40px', right: '40px', height: '3px',
                            background: 'linear-gradient(90deg, transparent, #00f2fe, #4facfe, transparent)',
                            filter: 'drop-shadow(0 2px 8px rgba(0, 242, 254, 0.8))'
                        }
                    }),

                    // 2. BACKGROUND LIGHT MESH (Subtle radial spot gradient inside card)
                    React.createElement('div', {
                        style: {
                            position: 'absolute', top: '-100px', right: '-100px', width: '250px', height: '250px',
                            background: 'radial-gradient(circle, rgba(0, 242, 254, 0.08) 0%, transparent 70%)',
                            pointerEvents: 'none'
                        }
                    }),

                    React.createElement('div', null,
                        // FLOATING ICON WRAPPER WITH FROSTED BACKDROP
                        React.createElement('div', {
                            style: {
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                width: '70px', height: '70px', borderRadius: '20px',
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))',
                                border: '1px solid rgba(255,255,255,0.1)', marginBottom: '30px',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
                            }
                        },
                            React.createElement('span', { style: { fontSize: '2.5rem', filter: 'drop-shadow(0 4px 10px rgba(0, 242, 254, 0.3))' } }, '📩')
                        ),

                        // SPLIT-COLOR TYPOGRAPHY WITH INTERACTIVE LIVE BADGE INLINE
                        React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' } },
                            React.createElement('h3', {
                                style: { color: '#fff', fontSize: '2.2rem', fontWeight: '900', letterSpacing: '-0.5px', margin: '0' }
                            }, 'General Inquiry'),

                            // Micro pill badge
                            React.createElement('div', {
                                style: {
                                    display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(0, 242, 254, 0.08)',
                                    padding: '4px 10px', borderRadius: '12px', border: '1px solid rgba(0, 242, 254, 0.15)'
                                }
                            },
                                React.createElement('span', { style: { width: '6px', height: '6px', backgroundColor: '#00f2fe', borderRadius: '50%', boxShadow: '0 0 6px #00f2fe' } }),
                                React.createElement('span', { style: { color: '#00f2fe', fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.5px', textTransform: 'uppercase' } }, 'Live')
                            )
                        ),

                        // CLEAN HIGH-CONTRAST DESCRIPTION
                        React.createElement('p', {
                            style: { color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '40px' }
                        }, 'Have a groundbreaking project idea or custom development infrastructure request? Initiate direct alignment with our engineering core to deploy clean solutions.')
                    ),

                    // 3. VERCEL-STYLE STYLISH BUTTON WITH ANCHORED BORDER
                    React.createElement('button', {
                        className: 'card-btn enterprise-action',
                        onClick: () => setCurrentPage('contact-us-form'),
                        style: {
                            width: '100%', padding: '16px',
                            background: '#fff', // White buttons over pure dark layouts look incredibly expensive
                            color: '#050508',
                            border: '1px solid #fff', borderRadius: '14px',
                            fontSize: '1rem', fontWeight: '800', cursor: 'pointer',
                            boxShadow: '0 12px 30px rgba(255, 255, 255, 0.1)',
                            transition: 'all 0.2s ease-in-out',
                            letterSpacing: '-0.2px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                        }
                    },
                        'Open Contact Form',
                        React.createElement('span', { style: { fontSize: '1.1rem', transform: 'translateY(-1px)' } }, '→')
                    )
                ),

                // CARD 2: LAUNCH A COMPLAIN (NEW 💥)
                React.createElement('div', {
                    className: 'service-card hyper-premium-card critical-alert',
                    style: {
                        background: 'rgba(12, 10, 15, 0.85)', // Darker obsidian tone for safety/critical look
                        border: '1px solid rgba(255, 255, 255, 0.07)',
                        boxShadow: '0 30px 70px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 0 50px rgba(255, 0, 128, 0.02)',
                        backdropFilter: 'blur(30px)',
                        WebkitBackdropFilter: 'blur(30px)',
                        padding: '50px 35px 40px',
                        borderRadius: '32px',
                        textAlign: 'left', // Matching the elite asymmetric alignment
                        flex: '1 1 380px',
                        maxWidth: '420px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        position: 'relative',
                        overflow: 'hidden'
                    }
                },
                    // 1. TOP CRITICAL HARDWARE ACCENT BAR (Premium Neon Rose/Orange glow strip)
                    React.createElement('div', {
                        style: {
                            position: 'absolute', top: '0', left: '40px', right: '40px', height: '3px',
                            background: 'linear-gradient(90deg, transparent, #ff0080, #ff8c00, transparent)',
                            filter: 'drop-shadow(0 2px 8px rgba(255, 0, 128, 0.8))'
                        }
                    }),

                    // 2. BACKGROUND HEAT MESH (Subtle radial warming glow inside the top right corner)
                    React.createElement('div', {
                        style: {
                            position: 'absolute', top: '-100px', right: '-100px', width: '250px', height: '250px',
                            background: 'radial-gradient(circle, rgba(255, 0, 128, 0.06) 0%, transparent 70%)',
                            pointerEvents: 'none'
                        }
                    }),

                    React.createElement('div', null,
                        // FLOATING ICON WRAPPER WITH FROSTED BACKDROP
                        React.createElement('div', {
                            style: {
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                width: '70px', height: '70px', borderRadius: '20px',
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))',
                                border: '1px solid rgba(255,255,255,0.1)', marginBottom: '30px',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
                            }
                        },
                            React.createElement('span', { style: { fontSize: '2.3rem', filter: 'drop-shadow(0 4px 10px rgba(255, 0, 128, 0.35))' } }, '⚠️')
                        ),

                        // HEADING & MICRO DYNAMIC PRIORITY BADGE
                        React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' } },
                            React.createElement('h3', {
                                style: { color: '#fff', fontSize: '2.2rem', fontWeight: '900', letterSpacing: '-0.5px', margin: '0' }
                            }, 'Launch a Complaint'),

                            // Micro Priority pill badge
                            React.createElement('div', {
                                style: {
                                    display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 0, 128, 0.08)',
                                    padding: '4px 10px', borderRadius: '12px', border: '1px solid rgba(255, 0, 128, 0.18)'
                                }
                            },
                                React.createElement('span', { style: { width: '6px', height: '6px', backgroundColor: '#ff0080', borderRadius: '50%', boxShadow: '0 0 6px #ff0080' } }),
                                React.createElement('span', { style: { color: '#ff0080', fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.5px', textTransform: 'uppercase' } }, 'Priority')
                            )
                        ),

                        // HIGH-CONTRAST DESCRIPTION TEXT
                        React.createElement('p', {
                            style: { color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '40px' }
                        }, 'Facing technical anomalies, billing discrepancies, or infrastructure delays? Log your ticket into our priority stream for instant cross-departmental escalations.')
                    ),

                    // 3. SOLID PREMIUM WHITE ACTION BUTTON WITH ANCHORED BORDER
                    React.createElement('button', {
                        className: 'card-btn enterprise-action urgent-btn',
                        onClick: () => setCurrentPage('complain-form'),
                        style: {
                            width: '100%', padding: '16px',
                            background: '#fff',
                            color: '#0a0508',
                            border: '1px solid #fff', borderRadius: '14px',
                            fontSize: '1rem', fontWeight: '800', cursor: 'pointer',
                            boxShadow: '0 12px 30px rgba(255, 255, 255, 0.1)',
                            transition: 'all 0.2s ease-in-out',
                            letterSpacing: '-0.2px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                        }
                    },
                        'File Complaint',
                        React.createElement('span', { style: { fontSize: '1.1rem', transform: 'translateY(-1px)' } }, '🚨')
                    )
                ),
                React.createElement('div', {
                    className: 'support-detailed-showcase',
                    style: {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '50px',
                        maxWidth: '900px',
                        width: '100%',
                        marginTop: '40px'
                    }
                },
                    // SECTION 1: GLOBAL REMOTE ENGINEERING (Image Right)
                    React.createElement('div', {
                        style: {
                            display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '30px',
                            backgroundColor: 'rgba(20, 20, 30, 0.45)', border: '1px solid rgba(255, 255, 255, 0.08)',
                            backdropFilter: 'blur(15px)', borderRadius: '24px', padding: '35px', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
                        }
                    },
                        React.createElement('div', { style: { flex: '1 1 400px', textAlign: 'left' } },
                            React.createElement('h4', {
                                style: { color: '#fff', fontSize: '1.6rem', fontWeight: '700', marginBottom: '12px', background: 'linear-gradient(90deg, #00f2fe, #4facfe)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }
                            }, '01. Global Remote Infrastructure'),
                            React.createElement('p', {
                                style: { color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '0' }
                            }, 'As a global remote company, our software engineering and web development pipelines are built for seamless distributed collaboration. We bridge regional boundaries to deliver high-performance web architecture, stable database integrations via MongoDB Atlas, and production-ready deployments instantly.')
                        ),
                        React.createElement('div', { style: { flex: '1 1 300px', display: 'flex', justifyContent: 'center' } },
                            React.createElement('img', {
                                src: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop', // <-- Replace with your Image 1 URL
                                alt: 'Global Infrastructure',
                                style: { width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '16px', border: '1px solid rgba(0, 242, 254, 0.2)', boxShadow: '0 10px 30px rgba(0, 242, 254, 0.15)' }
                            })
                        )
                    ),

                    // SECTION 2: WEB MONETIZATION & DEVELOPMENT (Image Left)
                    React.createElement('div', {
                        style: {
                            display: 'flex', flexWrap: 'wrap-reverse', alignItems: 'center', justifyContent: 'space-between', gap: '30px',
                            backgroundColor: 'rgba(20, 20, 30, 0.45)', border: '1px solid rgba(255, 255, 255, 0.08)',
                            backdropFilter: 'blur(15px)', borderRadius: '24px', padding: '35px', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
                        }
                    },
                        React.createElement('div', { style: { flex: '1 1 300px', display: 'flex', justifyContent: 'center' } },
                            React.createElement('img', {
                                src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop', // <-- Replace with your Image 2 URL
                                alt: 'Web Optimization',
                                style: { width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '16px', border: '1px solid rgba(255, 0, 128, 0.2)', boxShadow: '0 10px 30px rgba(255, 0, 128, 0.15)' }
                            })
                        ),
                        React.createElement('div', { style: { flex: '1 1 400px', textAlign: 'left' } },
                            React.createElement('h4', {
                                style: { color: '#fff', fontSize: '1.6rem', fontWeight: '700', marginBottom: '12px', background: 'linear-gradient(90deg, #ff0080, #ff8c00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }
                            }, '02. Monetization & Traffic Scaling'),
                            React.createElement('p', {
                                style: { color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '0' }
                            }, 'Optimize your web applications to maximize performance and ad revenue placement seamlessly. We build UI workflows that integrate robust asset distribution setups with ad networks and modern monetization scripts, ensuring clean user retention while keeping your Core Web Vitals fully optimized.')
                        )
                    ),

                    // SECTION 3: REVOLUTIONARY AI & FULL-STACK INTEGRATIONS (Image Right)
                    React.createElement('div', {
                        style: {
                            display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '30px',
                            backgroundColor: 'rgba(20, 20, 30, 0.45)', border: '1px solid rgba(255, 255, 255, 0.08)',
                            backdropFilter: 'blur(15px)', borderRadius: '24px', padding: '35px', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
                        }
                    },
                        React.createElement('div', { style: { flex: '1 1 400px', textAlign: 'left' } },
                            React.createElement('h4', {
                                style: { color: '#fff', fontSize: '1.6rem', fontWeight: '700', marginBottom: '12px', background: 'linear-gradient(90deg, #00f2fe, #ff0080)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }
                            }, '03. Enterprise AI & System Auditing'),
                            React.createElement('p', {
                                style: { color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '0' }
                            }, 'Leverage elite artificial intelligence modules and continuous integration setups via automated platforms. Our full-stack diagnostics identify service latencies, structural overheads, and security compliance loops to ensure that your customer queries and application data flow smoothly under any stress.')
                        ),
                        React.createElement('div', { style: { flex: '1 1 300px', display: 'flex', justifyContent: 'center' } },
                            React.createElement('img', {
                                src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop', // <-- Replace with your Image 3 URL
                                alt: 'AI Integration',
                                style: { width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.15)', boxShadow: '0 10px 30px rgba(255, 255, 255, 0.1)' }
                            })
                        )
                    ),
                    React.createElement('div', {
                        className: 'apex-metrics-grid',
                        style: {
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '20px',
                            maxWidth: '900px',
                            width: '100%',
                            marginTop: '30px',
                            justifyContent: 'space-between'
                        }
                    },
                        // METRIC 1: SPEED / RESPONSE TIME
                        React.createElement('div', {
                            style: {
                                flex: '1 1 260px',
                                background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.05), rgba(20, 20, 30, 0.6))',
                                border: '1px solid rgba(0, 242, 254, 0.25)',
                                borderRadius: '20px',
                                padding: '25px',
                                textAlign: 'center',
                                backdropFilter: 'blur(10px)',
                                boxShadow: '0 15px 30px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255,255,255,0.05)'
                            }
                        },
                            React.createElement('div', { style: { fontSize: '2.5rem', fontWeight: '900', color: '#00f2fe', letterSpacing: '-1px', marginBottom: '5px', textShadow: '0 0 15px rgba(0, 242, 254, 0.4)' } }, '< 45ms'),
                            React.createElement('div', { style: { color: '#fff', fontSize: '1rem', fontWeight: '700', marginBottom: '8px' } }, 'API Gateway Latency'),
                            React.createElement('p', { style: { color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', lineHeight: '1.4', margin: '0' } }, 'Ultra-fast data delivery routes monitored via our premium continuous delivery channels.')
                        ),

                        // METRIC 2: UPTIME / RELIABILITY
                        React.createElement('div', {
                            style: {
                                flex: '1 1 260px',
                                background: 'linear-gradient(135deg, rgba(255, 0, 128, 0.05), rgba(20, 20, 30, 0.6))',
                                border: '1px solid rgba(255, 0, 128, 0.25)',
                                borderRadius: '20px',
                                padding: '25px',
                                textAlign: 'center',
                                backdropFilter: 'blur(10px)',
                                boxShadow: '0 15px 30px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255,255,255,0.05)'
                            }
                        },
                            React.createElement('div', { style: { fontSize: '2.5rem', fontWeight: '900', color: '#ff0080', letterSpacing: '-1px', marginBottom: '5px', textShadow: '0 0 15px rgba(255, 0, 128, 0.4)' } }, '99.99%'),
                            React.createElement('div', { style: { color: '#fff', fontSize: '1rem', fontWeight: '700', marginBottom: '8px' } }, 'Production Operational Uptime'),
                            React.createElement('p', { style: { color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', lineHeight: '1.4', margin: '0' } }, 'Fail-safe cluster deployments handling heavy infrastructure overhead flawlessly.')
                        ),

                        // METRIC 3: TRAFFIC MONETIZATION / VOLUME
                        React.createElement('div', {
                            style: {
                                flex: '1 1 260px',
                                background: 'linear-gradient(135deg, rgba(255, 140, 0, 0.05), rgba(20, 20, 30, 0.6))',
                                border: '1px solid rgba(255, 140, 0, 0.25)',
                                borderRadius: '20px',
                                padding: '25px',
                                textAlign: 'center',
                                backdropFilter: 'blur(10px)',
                                boxShadow: '0 15px 30px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255,255,255,0.05)'
                            }
                        },
                            React.createElement('div', { style: { fontSize: '2.5rem', fontWeight: '900', color: '#ff8c00', letterSpacing: '-1px', marginBottom: '5px', textShadow: '0 0 15px rgba(255, 140, 0, 0.4)' } }, '24M+'),
                            React.createElement('div', { style: { color: '#fff', fontSize: '1rem', fontWeight: '700', marginBottom: '8px' } }, 'Monthly Ad Impressions Served'),
                            React.createElement('p', { style: { color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', lineHeight: '1.4', margin: '0' } }, 'High-yielding monetization units optimized for user retention and scalability.')
                        )
                    )
                )
            )
        );

        // 2️⃣ GENERAL CONTACT FORM PAGE
    } else if (currentPage === 'contact-us-form') {
        const inputStyle = { width: '100%', padding: '14px 18px', margin: '12px 0', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(255, 255, 255, 0.05)', color: '#fff', fontSize: '16px', outline: 'none', boxSizing: 'border-box', backdropFilter: 'blur(5px)' };
        mainElement = React.createElement('main', { className: 'services-page', style: { padding: '40px 20px', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center' } },
            React.createElement('button', { className: 'card-btn', style: { marginBottom: '20px', borderColor: 'rgba(255,255,255,0.3)' }, onClick: () => setCurrentPage('contact-us') }, '← Back to Options'),
            React.createElement('div', { style: { display: 'table', margin: '0 auto 20px', background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01))', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '24px', padding: '12px 32px' } },
                React.createElement('h2', { className: 'section-heading', style: { fontSize: '2.3rem', fontWeight: '800', textAlign: 'center', margin: '0', background: 'linear-gradient(90deg, #00f2fe 0%, #ff0080 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }, 'Send Us A Message 📩')
            ),
            React.createElement('p', { className: 'services-sub-text', style: { color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', marginBottom: '35px', textAlign: 'center', maxWidth: '550px' } }, 'Please fill out the form below. Our support team will get back to you via email shortly.'),
            React.createElement('form', { onSubmit: handleFormSubmit, style: { width: '100%', maxWidth: '520px', background: 'rgba(20, 20, 30, 0.65)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(15px)', boxSizing: 'border-box' } },
                React.createElement('input', { type: 'hidden', name: '_subject', value: 'New Message from Apex Code Contact Form!' }),
                React.createElement('input', { type: 'text', name: 'Name', placeholder: '👤 Your Full Name', required: true, style: inputStyle }),
                React.createElement('input', { type: 'email', name: 'Email', placeholder: '✉️ Your Email Address', required: true, style: inputStyle }),
                React.createElement('textarea', { name: 'Message', placeholder: '💬 Type your message here...', rows: '5', required: true, style: { ...inputStyle, resize: 'none' } }),
                React.createElement('button', { type: 'submit', className: 'card-btn', style: { width: '100%', marginTop: '25px', padding: '14px', fontSize: '18px', fontWeight: '600', background: 'linear-gradient(45deg, #00f2fe, #ff0080)', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer' } }, 'Send Message 🚀')
            )
        );

        // 3️⃣ NAYA COMPLAINT FORM PAGE (NEW 💥)
    } else if (currentPage === 'complain-form') {
        const inputStyle = {
            width: '100%', padding: '14px 18px', margin: '12px 0', borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(255, 255, 255, 0.05)',
            color: '#fff', fontSize: '16px', outline: 'none', boxSizing: 'border-box',
            transition: 'all 0.3s ease', backdropFilter: 'blur(5px)'
        };

        mainElement = React.createElement('main', {
            className: 'services-page',
            style: { padding: '40px 20px', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }
        },
            // Back Button
            React.createElement('button', {
                className: 'card-btn',
                style: { marginBottom: '20px', alignSelf: 'center', borderColor: 'rgba(255,255,255,0.3)' },
                onClick: () => setCurrentPage('contact-us')
            }, '← Back to Options'),

            // Orange/Red Gradient Complain Heading
            React.createElement('div', {
                style: {
                    display: 'table', margin: '0 auto 20px', background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01))',
                    backdropFilter: 'blur(15px)', WebkitBackdropFilter: 'blur(15px)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '24px',
                    padding: '12px 32px', boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4)'
                }
            },
                React.createElement('h2', {
                    className: 'section-heading',
                    style: {
                        fontSize: '2.3rem', fontWeight: '800', letterSpacing: '1.5px', textAlign: 'center', margin: '0', display: 'flex', alignItems: 'center', gap: '12px',
                        background: 'linear-gradient(90deg, #ff0080 0%, #ff8c00 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        filter: 'drop-shadow(0 4px 10px rgba(255, 0, 128, 0.3))'
                    }
                }, 'Launch a Complaint 🚨')
            ),

            React.createElement('p', {
                className: 'services-sub-text',
                style: { color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', marginBottom: '35px', textAlign: 'center', maxWidth: '550px' }
            }, 'We take your issues seriously. Please state your complaint details clearly below, and our senior desk will review it immediately.'),

            // 🚀 PREMIUM UNIFIED CARD — FORM + IMAGE EK HI GLASS CONTAINER MEIN
            React.createElement('div', {
                style: {
                    position: 'relative',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'stretch',
                    width: '100%',
                    maxWidth: '1000px',
                    borderRadius: '28px',
                    overflow: 'hidden',
                    background: 'linear-gradient(145deg, rgba(35,18,22,0.78), rgba(12,8,10,0.88))',
                    border: '1px solid rgba(255, 0, 128, 0.18)',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)'
                }
            },
                // ✨ Ambient glow blobs — red/orange theme
                React.createElement('div', {
                    style: {
                        position: 'absolute', top: '-70px', left: '-70px', width: '200px', height: '200px',
                        background: 'radial-gradient(circle, rgba(255,0,128,0.25), transparent 70%)',
                        filter: 'blur(10px)', pointerEvents: 'none', zIndex: 0
                    }
                }),
                React.createElement('div', {
                    style: {
                        position: 'absolute', bottom: '-80px', right: '-80px', width: '220px', height: '220px',
                        background: 'radial-gradient(circle, rgba(255,140,0,0.22), transparent 70%)',
                        filter: 'blur(15px)', pointerEvents: 'none', zIndex: 0
                    }
                }),

                // 💎 LEFT: FORM
                React.createElement('form', {
                    onSubmit: handleFormSubmit,
                    style: {
                        flex: '1 1 400px',
                        padding: '48px 42px',
                        boxSizing: 'border-box',
                        position: 'relative',
                        zIndex: 1
                    }
                },
                    React.createElement('input', { type: 'hidden', name: '_subject', value: 'URGENT: New Complaint Lodged on Apex Code!' }),

                    React.createElement('input', { type: 'text', name: 'Complainant_Name', placeholder: '👤 Your Full Name', required: true, style: inputStyle }),
                    React.createElement('input', { type: 'email', name: 'Complainant_Email', placeholder: '✉️ Your Email Address', required: true, style: inputStyle }),
                    React.createElement('textarea', { name: 'Complaint_Details', placeholder: '⚠️ Describe your complaint/issue in detail...', rows: '6', required: true, style: { ...inputStyle, resize: 'none' } }),

                    React.createElement('button', {
                        type: 'submit',
                        className: 'card-btn',
                        style: {
                            width: '100%', marginTop: '25px', padding: '14px', fontSize: '18px', fontWeight: '600',
                            background: 'linear-gradient(45deg, #ff0080, #ff8c00)', color: '#fff', border: 'none',
                            borderRadius: '12px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(255, 0, 128, 0.4)'
                        }
                    }, 'Submit Complaint 🚨')
                ),

                // 🎨 RIGHT: IMAGE
                React.createElement('div', {
                    style: {
                        flex: '1 1 380px',
                        minHeight: '420px',
                        position: 'relative',
                        zIndex: 1
                    }
                },
                    React.createElement('img', {
                        src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
                        alt: 'Apex Code Complaint Support Illustration',
                        style: {
                            position: 'absolute', inset: 0,
                            width: '100%', height: '100%',
                            objectFit: 'cover',
                            filter: 'brightness(0.8) contrast(1.15) saturate(1.05) sepia(0.15)'
                        }
                    }),
                    React.createElement('div', {
                        style: {
                            position: 'absolute', inset: 0,
                            background: 'linear-gradient(100deg, rgba(20,10,12,0.92) 0%, rgba(20,10,12,0.18) 35%, transparent 60%)'
                        }
                    }),
                    React.createElement('div', {
                        style: {
                            position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px',
                            background: 'linear-gradient(90deg, #ff0080, #ff8c00)',
                            opacity: 0.6
                        }
                    })
                )
            ) // Unified Card ends here
        );
    } else if (currentPage === 'website-upload-form') {
        const inputStyle = { width: '100%', padding: '14px 18px', margin: '0 0 18px 0', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(255, 255, 255, 0.05)', color: '#fff', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' };

        mainElement = React.createElement('main', { className: 'services-page', style: { padding: '40px 20px', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center' } },
            React.createElement('button', { className: 'card-btn', style: { marginBottom: '20px', borderColor: 'rgba(255,255,255,0.3)' }, onClick: (e) => { e.preventDefault(); setCurrentPage('upload-page'); } }, '← Back to Uploads'),
            React.createElement('h2', { style: { color: '#00f2fe', fontSize: '2rem', marginBottom: '25px', textAlign: 'center' } }, websiteToEdit ? 'Website Edit Karein ✏️' : 'Nayi Website Post Karein 🚀'),

            React.createElement('form', { key: websiteToEdit ? `edit-${websiteToEdit.id}` : 'new-site', onSubmit: handleWebsiteFormSubmit, style: { width: '100%', maxWidth: '500px', background: 'rgba(20, 20, 30, 0.75)', padding: '35px 30px', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.1)' } },
                React.createElement('input', { type: 'text', name: 'name', placeholder: 'Website Name', defaultValue: websiteToEdit ? websiteToEdit.name : '', required: true, style: inputStyle }),
                React.createElement('input', { type: 'text', name: 'price', placeholder: 'Price (e.g. 50,000 PKR)', defaultValue: websiteToEdit ? websiteToEdit.price : '', required: true, style: inputStyle }),
                React.createElement('input', { type: 'url', name: 'imageLink', placeholder: 'Image URL', defaultValue: websiteToEdit ? websiteToEdit.imageLink : '', required: true, style: inputStyle }),
                React.createElement('input', { type: 'url', name: 'siteLink', placeholder: 'Website Live Link', defaultValue: websiteToEdit ? websiteToEdit.siteLink : '', required: true, style: inputStyle }),
                React.createElement('textarea', { name: 'description', placeholder: 'Website Description...', defaultValue: websiteToEdit ? websiteToEdit.description : '', required: true, rows: 5, style: { ...inputStyle, resize: 'vertical' } }),
                React.createElement('button', { type: 'submit', className: 'card-btn', style: { width: '100%', background: 'linear-gradient(45deg, #00f2fe, #00e08c)' } }, websiteToEdit ? 'Update ✅' : 'Post Website 🚀')
            ),

            // Admin List to Edit/Delete
            React.createElement('div', { style: { width: '100%', maxWidth: '500px', marginTop: '30px' } },
                websites.map(site => React.createElement('div', { key: site.id, style: { background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '10px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between' } },
                    React.createElement('span', { style: { color: '#fff' } }, site.name),
                    React.createElement('div', null,
                        React.createElement('button', { onClick: toEditWebsiteForm(site), style: { marginRight: '10px', background: 'none', color: '#00f2fe', border: 'none', cursor: 'pointer' } }, 'Edit'),
                        React.createElement('button', { onClick: () => handleWebsiteDelete(site.id), style: { background: 'none', color: '#ff3366', border: 'none', cursor: 'pointer' } }, 'Delete')
                    )
                ))
            )
        );
    } else if (currentPage === 'websites-for-sale') {
        mainElement = React.createElement('main', { className: 'services-page' },
            // 1️⃣ 👑 ULTRA-PREMIUM BORDERED HEADING BADGE (Exact Jobs Style)
            React.createElement('div', {
    style: {
        display: 'flex',                             // 'table' se 'flex' change kiya takay responsive ho sake
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0 auto 20px',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01))',
        backdropFilter: 'blur(15px)',
        WebkitBackdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '24px',
        padding: '12px 24px',                        // Mobile ke liye padding thodi side se kam ki (32px se 24px)
        width: 'fit-content',                        // Content ke mutabiq width adjust hogi
        maxWidth: '90%',                             // Mobile screen ke corners se chipkay na
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        boxSizing: 'border-box'
    }
},
    React.createElement('h2', {
        style: {
            fontSize: 'clamp(1.4rem, 5vw, 2.3rem)',  // Mobile par khud chota ho jayega, desktop par full 2.3rem rahega
            fontWeight: '800',
            letterSpacing: '0.5px',                  // Mobile par letters ko overlap hone se bachaane ke liye thoda kam kiya
            textAlign: 'center',
            margin: '0',
            whiteSpace: 'nowrap',                    // Text aur emoji ko hamesha ek line me lock rakhega
            background: 'linear-gradient(90deg, #00f2fe 0%, #ff0080 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 4px 10px rgba(0, 242, 254, 0.3))'
        }
    }, 'Websites For Sale 🌐')
),

            // 2️⃣ RELATED DESCRIPTION LINE
            React.createElement('p', {
                style: {
                    color: 'rgba(255, 255, 255, 0.65)',
                    fontSize: '0.95rem',
                    textAlign: 'center',
                    marginBottom: '40px',
                    maxWidth: '500px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    lineHeight: '1.6'
                }
            }, 'Buy ready-made premium templates and live web projects from here.'),

            // 3️⃣ WEBSITES GRID CONTAINER (Exact Jobs Grid Architecture)
            websites.length === 0 ? React.createElement('p', {
                style: { color: 'rgba(255,255,255,0.5)', fontSize: '1rem', textAlign: 'center' }
            }, 'No websites are currently available for sale. Please check back later!') :

                React.createElement('div', {
                    style: {
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: '30px',
                        width: '100%',
                        maxWidth: '900px',
                        margin: '0 auto'
                    }
                },
                    websites.map(web => {
                        // 🔥 PURE ADMIN LINK EXTRACTION (Apne paas se koi third-party link nahi lagaya)
                        const adminImgSrc = web.imageLink || web.image || web.imageUrl;

                        return React.createElement('div', {
                            key: web.id,
                            className: 'card',
                            style: {
                                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.02))',
                                backdropFilter: 'blur(25px)',
                                WebkitBackdropFilter: 'blur(25px)',
                                border: '1px solid rgba(255, 255, 255, 0.16)',
                                borderRadius: '32px',
                                padding: '30px 24px 40px 24px',
                                boxShadow: '0 30px 60px rgba(0, 0, 0, 0.5), inset 0 1px 2px rgba(255, 255, 255, 0.25)',
                                textAlign: 'center',
                                maxWidth: '340px',
                                width: '100%'
                            }
                        },
                            // 📸 ADMIN-SPECIFIC IMAGE CONTAINER BLOCK
                            React.createElement('div', {
                                style: {
                                    width: '100%',
                                    height: '160px',
                                    borderRadius: '20px',
                                    overflow: 'hidden',
                                    marginBottom: '20px',
                                    border: '1px solid rgba(255, 255, 255, 0.12)',
                                    background: 'rgba(0, 0, 0, 0.2)',
                                    position: 'relative',
                                    boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
                                }
                            },
                                // Image tabhi render hogi jab admin ka link exist karega
                                adminImgSrc && React.createElement('img', {
                                    src: adminImgSrc,
                                    alt: web.name,
                                    style: {
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        transition: 'transform 0.3s ease'
                                    },
                                    onMouseEnter: (e) => e.target.style.transform = 'scale(1.05)',
                                    onMouseLeave: (e) => e.target.style.transform = 'scale(1)'
                                }),

                                // Floating Badge Overlay
                                React.createElement('span', {
                                    style: {
                                        position: 'absolute',
                                        top: '12px',
                                        right: '12px',
                                        background: 'rgba(0, 242, 254, 0.2)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(0, 242, 254, 0.4)',
                                        color: '#00f2fe',
                                        fontSize: '0.75rem',
                                        fontWeight: '700',
                                        padding: '4px 12px',
                                        borderRadius: '12px'
                                    }
                                }, 'PREMIUM')
                            ),

                            // Website Title
                            React.createElement('h3', { style: { color: '#fff', fontSize: '1.3rem', fontWeight: '700', marginBottom: '8px' } }, web.name),

                            // Website Price Tag (Cyan Highlighted like Jobs Salary)
                            React.createElement('p', { style: { color: '#00f2fe', fontSize: '0.9rem', fontWeight: '600', marginBottom: '24px' } }, `Price: ${web.price || 'Negotiable'}`),

                            // 4️⃣ DUAL ACTION BUTTON PANEL (Description + Buy/Order Now)
                            React.createElement('div', { style: { display: 'flex', gap: '10px' } },
                                // Description Modal Trigger (Bilateral Layout Scheme)
                                React.createElement('button', {
                                    onClick: () => setSelectedWebsiteDesc(web),
                                    style: {
                                        flex: '1',
                                        padding: '12px',
                                        borderRadius: '14px',
                                        background: 'rgba(255, 255, 255, 0.08)',
                                        color: '#fff',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        fontSize: '0.85rem',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }
                                }, 'Details 📄'),

                                // Main Order Trigger Button (With Neon Gradient Aura Effect)
                                // Fixed: onClick wrapper lagaya loop se bachne ke liye
                                React.createElement('button', {
                                    onClick: toWebsiteOrderForm(web),
                                    style: {
                                        flex: '1',
                                        padding: '12px',
                                        borderRadius: '14px',
                                        background: 'linear-gradient(90deg, #ff0080, #00f2fe)',
                                        color: '#fff',
                                        border: 'none',
                                        fontSize: '0.85rem',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        boxShadow: '0 0 18px rgba(255, 0, 128, 0.4)'
                                    }
                                }, 'Buy Now 🚀')
                            )
                            
                        );
                        
                    }),
                    renderSaleDetailsBlocks()
                ),

            // 5️⃣ DETAILS DESCRIPTION MODAL (Exact Jobs Modal Mirror Architecture)
            selectedWebsiteDesc ? (() => {
                // Modal ke liye bhi wahi exact link check jo admin provide kar raha hai
const adminModalImgSrc = selectedWebsiteDesc.imageLink || selectedWebsiteDesc.image || selectedWebsiteDesc.imageUrl;
                return React.createElement('div', {
                    onClick: () => setSelectedWebsiteDesc(null),
                    style: {
                        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                        background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(5px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 9999, padding: '20px', boxSizing: 'border-box'
                    }
                },
                    React.createElement('div', {
                        onClick: (e) => e.stopPropagation(),
                        style: {
                            background: 'rgba(20, 20, 30, 0.95)', border: '1px solid rgba(255, 255, 255, 0.15)',
                            borderRadius: '24px', padding: '35px 30px', maxWidth: '450px', width: '100%',
                            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)', position: 'relative'
                        }
                    },
                        React.createElement('button', {
                            onClick: () => setSelectedWebsiteDesc(null),
                            style: { position: 'absolute', top: '14px', right: '18px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '1.4rem', cursor: 'pointer' }
                        }, '✕'),

                        // 📸 MODAL LARGE PREVIEW IMAGE FROM ADMIN ONLY
                        adminModalImgSrc && React.createElement('img', {
                            src: adminModalImgSrc,
                            alt: selectedWebsiteDesc.name,
                            style: {
                                width: '100%',
                                height: '200px',
                                objectFit: 'cover',
                                borderRadius: '16px',
                                marginBottom: '20px',
                                border: '1px solid rgba(255, 255, 255, 0.1)'
                            }
                        }),

                        React.createElement('h3', { style: { color: '#00f2fe', fontSize: '1.4rem', fontWeight: '700', marginBottom: '6px' } }, selectedWebsiteDesc.name),
                        React.createElement('p', { style: { color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginBottom: '18px' } }, `Price: ${selectedWebsiteDesc.price || 'Negotiable'}`),
                        React.createElement('p', { style: { color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', lineHeight: '1.7', whiteSpace: 'pre-wrap' } }, selectedWebsiteDesc.description),

                        // Live Link Preview Button (If link exists)
                        selectedWebsiteDesc.siteLink && React.createElement('a', {
                            href: selectedWebsiteDesc.siteLink, target: '_blank', rel: 'noopener noreferrer',
                            style: { display: 'block', width: '100%', textAlign: 'center', marginTop: '20px', textDecoration: 'none', color: '#ff0080', fontWeight: '700', fontSize: '0.9rem' }
                        }, '🔗 View Live Demo Website')
                    )
                );
            })() : null
        );
    } else if (currentPage === 'website-order-form' && selectedWebsiteForOrder) {

        // 📩 FORM SUBMIT LOGIC (Email Bhejne Ka Code)
        const handleSiteOrderSubmit = (e) => {
            e.preventDefault();
            const form = e.target;
            const btn = form.querySelector('button[type="submit"]');

            // Loading Effect
            const originalText = btn.innerText;
            btn.innerText = 'Sending Request... ⏳';
            btn.disabled = true;

            // FormSubmit API (Direct to your email)
            fetch('https://formsubmit.co/ajax/book.apexcode@gmail.com', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    _subject: '🚀 NEW ORDER: ' + selectedWebsiteForOrder.name,
                    _template: 'table', // Email mein data table ki form mein aayega
                    Website_Name: selectedWebsiteForOrder.name,
                    Price: selectedWebsiteForOrder.price,
                    Customer_Name: form.name.value,
                    Email: form.email.value,
                    Phone: form.phone.value,
                    Country: form.country.value // 🌍 Nayi Field
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success === "true" || data.success === true) {
                        alert('✅ Order Details Successfully Sent! We will contact you soon.');
                        setCurrentPage('websites-for-sale');
                    } else {
                        alert('❌ Something went wrong. Please try again.');
                        btn.innerText = originalText;
                        btn.disabled = false;
                    }
                })
                .catch(err => {
                    alert('❌ Network Error. Please check your internet connection.');
                    btn.innerText = originalText;
                    btn.disabled = false;
                });
        };

        // 💎 PREMIUM DARK GLASSMORPHISM INPUT STYLE
        const inputStyle = {
            width: '100%', padding: '14px 18px', margin: '12px 0',
            borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(255, 255, 255, 0.05)', color: '#fff',
            fontSize: '16px', outline: 'none', boxSizing: 'border-box',
            transition: 'all 0.3s ease', backdropFilter: 'blur(5px)'
        };

        // 🎨 UI RENDER
        mainElement = React.createElement('main', {
            className: 'services-page',
            style: { padding: '40px 20px', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }
        },
            // Back Button
            React.createElement('button', {
                className: 'card-btn',
                style: { marginBottom: '30px', alignSelf: 'center', borderColor: 'rgba(255,255,255,0.3)' },
                onClick: () => setCurrentPage('websites-for-sale')
            }, '← Back to Market'),

            // 👑 PREMIUM HEADING BADGE
            React.createElement('div', {
    style: {
        display: 'flex',                             // 'table' se 'flex' kiya takay small devices par shrink ho sake
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0 auto 20px',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01))',
        backdropFilter: 'blur(15px)', 
        WebkitBackdropFilter: 'blur(15px)',          // Safari support secure karne ke liye webkit overlay
        border: '1px solid rgba(255, 255, 255, 0.12)', 
        borderRadius: '24px',
        padding: '12px 24px',                        // Side padding mobile frame ke hissab se optimize ki
        width: 'fit-content',
        maxWidth: '90%',                             // Element hamesha responsive screen layout ke andar fit rahega
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4)',
        boxSizing: 'border-box'
    }
},
    React.createElement('h2', {
        style: {
            fontSize: 'clamp(1.35rem, 5vw, 2.2rem)', // Viewport scaling lagayi takay mobile par text adjust ho jaye
            fontWeight: '800', 
            textAlign: 'center', 
            margin: '0',
            whiteSpace: 'nowrap',                    // Kisi bhi mobile device par text break hokar wrap nahi hoga
            background: 'linear-gradient(90deg, #00f2fe 0%, #ff0080 100%)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 4px 10px rgba(0, 242, 254, 0.3))'
        }
    }, 'Secure Your Purchase 🛒')                    // Broken encoding template ko original shopping cart emoji se replace kiya
),

            // Order Highlight Text
            React.createElement('p', {
                style: { color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', marginBottom: '35px', textAlign: 'center' }
            }, 'You are about to order: ', React.createElement('strong', { style: { color: '#00f2fe', fontSize: '1.2rem' } }, selectedWebsiteForOrder.name)),

            // 💎 GLASSMORPHISM FORM CONTAINER
            React.createElement('form', {
                onSubmit: handleSiteOrderSubmit,
                style: {
                    width: '100%', maxWidth: '520px', background: 'rgba(20, 20, 30, 0.65)', padding: '40px',
                    borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(15px)', boxSizing: 'border-box'
                }
            },
                // Inputs
                React.createElement('input', { type: 'text', name: 'name', placeholder: '👤 Full Name', required: true, style: inputStyle }),
                React.createElement('input', { type: 'email', name: 'email', placeholder: '✉️ Email Address', required: true, style: inputStyle }),
                React.createElement('input', { type: 'tel', name: 'phone', placeholder: '📞 WhatsApp / Phone Number', required: true, style: inputStyle }),
                React.createElement('input', { type: 'text', name: 'country', placeholder: '🌍 Your Country', required: true, style: inputStyle }),

                // Submit Button
                React.createElement('button', {
                    type: 'submit',
                    className: 'card-btn',
                    style: {
                        width: '100%', marginTop: '25px', padding: '14px', fontSize: '18px', fontWeight: '700',
                        background: 'linear-gradient(45deg, #00f2fe, #ff0080)', color: '#fff', border: 'none',
                        borderRadius: '12px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(255, 0, 128, 0.35)'
                    }
                }, 'Confirm Order 🚀')
            )
        );
    } else if (currentPage === 'about-us') {
        // 🌌 Premium Core Section Style (Sophisticated Glassmorphism)
        const sectionStyle = {
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '24px',
            padding: '40px',
            marginBottom: '35px',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            position: 'relative',
            overflow: 'hidden'
        };

        // ⚡ Glowing accent lines for that extra premium touch
        const glowLineStyle = (color) => ({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '2px',
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`
        });

        mainElement = React.createElement('main', {
            className: 'about-page',
            style: { padding: '80px 24px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' }
        },

            // 🚀 HEADER SECTION (Stunning Typography & Gradient)
            React.createElement('div', { style: { textAlign: 'center', marginBottom: '60px', position: 'relative' } },
                React.createElement('h2', {
                    className: 'section-heading',
                    style: {
                        fontSize: '3rem',
                        fontWeight: '850',
                        letterSpacing: '1.5px',
                        textAlign: 'center',
                        margin: '0 auto',
                        display: 'inline-block',
                        padding: '12px 35px',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '20px',
                        background: 'linear-gradient(90deg, #00f2fe 0%, #ff0080 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        WebkitTextStroke: '1px rgba(255, 255, 255, 0.05)',
                        filter: 'drop-shadow(0 4px 12px rgba(0, 242, 254, 0.25))',
                        lineHeight: '1.2',
                        backdropFilter: 'blur(4px)',
                        boxShadow: 'inset 0 0 12px rgba(255, 255, 255, 0.02)'
                    }
                }, 'About Apex Code'),
                React.createElement('p', { style: { color: 'rgba(255,255,255,0.5)', fontSize: '1.25rem', marginTop: '15px', fontWeight: '400', maxWidth: '600px', margin: '15px auto 0' } },
                    'Innovating Digital Landscapes, Engineering Excellence.'
                )
            ),

            // 🛡️ WHO WE ARE SECTION
            React.createElement('div', { style: sectionStyle },
                React.createElement('div', { style: glowLineStyle('#00f2fe') }),
                React.createElement('div', { style: { display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' } },
                    React.createElement('span', { style: { color: '#00f2fe', fontSize: '1.5rem' } }, '✦'),
                    React.createElement('h3', { style: { color: '#ffffff', fontSize: '1.75rem', fontWeight: '700', margin: 0 } }, 'Who We Are')
                ),
                React.createElement('p', { style: { color: 'rgba(255,255,255,0.75)', lineHeight: '1.9', fontSize: '1.1rem', fontWeight: '300' } },
                    'Welcome to Apex Code, an active digital service agency dedicated to pioneering high-end web development, premium WordPress design, and strategic SEO architectures. We are a technical collective of software engineers, creative designers, and growth optimization specialists who translate complex business logic into lightning-fast, production-ready web experiences. We build enterprise-grade systems that seamlessly scale on modern deployment frameworks like Vercel and Render, bridging rich front-end user layers with secure back-end cluster structures connected to systems like MongoDB Atlas. Our goal is to replace bulky architectures with clean, sustainable, and highly interactive digital networks.'
                )
            ),

            // 🎯 VISION & MISSION SECTION
            React.createElement('div', { style: sectionStyle },
                React.createElement('div', { style: glowLineStyle('#ff0080') }),
                React.createElement('div', { style: { display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' } },
                    React.createElement('span', { style: { color: '#ff0080', fontSize: '1.5rem' } }, '✦'),
                    React.createElement('h3', { style: { color: '#ffffff', fontSize: '1.75rem', fontWeight: '700', margin: 0 } }, 'Our Vision & Mission')
                ),
                React.createElement('p', { style: { color: 'rgba(255,255,255,0.75)', lineHeight: '1.9', fontSize: '1.1rem', fontWeight: '300' } },
                    'Our mission is absolute: to bridge the gap between heavy, complex back-end architectures and fluid, conversion-optimized user experiences. We believe a website shouldn’t just look premium—it must function as a high-converting business asset that minimizes latencies down to microseconds. Through systematic engineering cycles, clean-code rules, and progressive rendering paradigms, we completely eliminate technical debt and layout shifts. Our ultimate vision is to empower digital platforms with scalable full-stack layers that allow brands, e-commerce stores, and technical web apps to sustain continuous market growth.'
                )
            ),

            // ⚙️ TECHNICAL STACK & ARCHITECTURE SECTION
            React.createElement('div', { style: sectionStyle },
                React.createElement('div', { style: glowLineStyle('#00f2fe') }),
                React.createElement('div', { style: { display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' } },
                    React.createElement('span', { style: { color: '#00f2fe', fontSize: '1.5rem' } }, '✦'),
                    React.createElement('h3', { style: { color: '#ffffff', fontSize: '1.75rem', fontWeight: '700', margin: 0 } }, 'Core Engineering & Cloud Deployment')
                ),
                React.createElement('p', { style: { color: 'rgba(255,255,255,0.75)', lineHeight: '1.9', fontSize: '1.1rem', fontWeight: '300' } },
                    'At Apex Code, we maintain zero compromises on technical quality. On the client side, we engineer modular interfaces utilizing component-driven ecosystems, unified reactive states, and responsive modern layouts for absolute cross-device fluid interaction. For corporate configurations and business nodes, we leverage deep custom WordPress engineering, completely rewriting theme file hierarchies, striping away heavy script bloat, and hooking into custom database routines. By routing assets across serverless infrastructures and secure API networks, we achieve ultra-short response cycles that ensure unmatched operational efficiency.'
                )
            ),

            // 💰 MONETIZATION & TECHNICAL SEO FRAMEWORK SECTION
            React.createElement('div', { style: sectionStyle },
                React.createElement('div', { style: glowLineStyle('#ff0080') }),
                React.createElement('div', { style: { display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' } },
                    React.createElement('span', { style: { color: '#ff0080', fontSize: '1.5rem' } }, '✦'),
                    React.createElement('h3', { style: { color: '#ffffff', fontSize: '1.75rem', fontWeight: '700', margin: 0 } }, 'Web Monetization & Technical SEO Framework')
                ),
                React.createElement('p', { style: { color: 'rgba(255,255,255,0.75)', lineHeight: '1.9', fontSize: '1.1rem', fontWeight: '300' } },
                    'A premium website must achieve supreme search dominance while unlocking absolute commercial viability. We integrate technical on-page and programmatic SEO frameworks into the core architecture of every platform, compiling structured JSON-LD schemas and fine-tuning Core Web Vitals to guarantee 100% indexability on search engines. Additionally, we possess specialized expertise in optimizing high-yield monetization structures, embedding clean ad unit platforms like Adsterra, Advertica, and Monetag. We safely deploy ad delivery loops and user tracking metrics without degrading layout stability, causing script blocks, or interrupting user interfaces.'
                )
            ),

            // 📊 PREMIUM STATS GRID
            React.createElement('div', {
                style: {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '25px',
                    textAlign: 'center',
                    marginBottom: '50px',
                    marginTop: '40px'
                }
            },
                // Stat 1
                React.createElement('div', { style: { ...sectionStyle, padding: '35px 20px', marginBottom: 0 } },
                    React.createElement('div', { style: { fontSize: '2.5rem', fontWeight: '850', background: 'linear-gradient(135deg, #00f2fe, #4facfe)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' } }, '100%'),
                    React.createElement('h4', { style: { color: '#ffffff', fontSize: '1.1rem', fontWeight: '600', margin: '0 0 5px 0', letterSpacing: '0.5px' } }, 'Client Satisfaction'),
                    React.createElement('p', { style: { color: 'rgba(255,255,255,0.4)', margin: '0', fontSize: '0.9rem' } }, 'Delivering flawless execution')
                ),
                // Stat 2
                React.createElement('div', { style: { ...sectionStyle, padding: '35px 20px', marginBottom: 0 } },
                    React.createElement('div', { style: { fontSize: '2.5rem', fontWeight: '850', background: 'linear-gradient(135deg, #38ef7d, #11998e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' } }, 'SEO+'),
                    React.createElement('h4', { style: { color: '#ffffff', fontSize: '1.1rem', fontWeight: '600', margin: '0 0 5px 0', letterSpacing: '0.5px' } }, 'Optimized Structure'),
                    React.createElement('p', { style: { color: 'rgba(255,255,255,0.4)', margin: '0', fontSize: '0.9rem' } }, 'Built for search visibility')
                ),
                // Stat 3
                React.createElement('div', { style: { ...sectionStyle, padding: '35px 20px', marginBottom: 0 } },
                    React.createElement('div', { style: { fontSize: '2.5rem', fontWeight: '850', background: 'linear-gradient(135deg, #ff0080, #ff8c00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' } }, '24/7'),
                    React.createElement('h4', { style: { color: '#ffffff', fontSize: '1.1rem', fontWeight: '600', margin: '0 0 5px 0', letterSpacing: '0.5px' } }, 'Dedicated Support'),
                    React.createElement('p', { style: { color: 'rgba(255,255,255,0.4)', margin: '0', fontSize: '0.9rem' } }, 'Always here for your scaling needs')
                )
            )
        );
    }else if (currentPage === 'privacy-policy') {
        // 🌌 Premium Core Section Style (Sophisticated Glassmorphism matching About page)
        const sectionStyle = {
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '24px',
            padding: '40px',
            marginBottom: '35px',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            position: 'relative',
            overflow: 'hidden'
        };

        // ⚡ Glowing accent lines for neon aesthetic matching About page
        const glowLineStyle = (color) => ({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '2px',
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`
        });

        mainElement = React.createElement('main', {
            className: 'privacy-page',
            style: { padding: '80px 24px', maxWidth: '900px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' }
        },

            // 🚀 HEADER SECTION (Stunning Pill-Shaped Glowing Border & Gradient)
            React.createElement('div', { style: { textAlign: 'center', marginBottom: '60px', position: 'relative' } },
                React.createElement('h2', {
                    className: 'section-heading',
                    style: {
                        fontSize: '3rem',
                        fontWeight: '850',
                        letterSpacing: '1.5px',
                        textAlign: 'center',
                        margin: '0 auto',
                        display: 'inline-block',
                        padding: '12px 35px',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '20px',
                        background: 'linear-gradient(90deg, #00f2fe 0%, #ff0080 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        WebkitTextStroke: '1px rgba(255, 255, 255, 0.05)',
                        filter: 'drop-shadow(0 4px 12px rgba(0, 242, 254, 0.25))',
                        lineHeight: '1.2',
                        backdropFilter: 'blur(4px)',
                        boxShadow: 'inset 0 0 12px rgba(255, 255, 255, 0.02)'
                    }
                }, 'Privacy Policy'),
                React.createElement('p', { style: { color: 'rgba(255,255,255,0.4)', fontSize: '1.05rem', marginTop: '20px', fontWeight: '500' } }, 'Last Updated: June 2026')
            ),

            // 🛡️ 1. INFORMATION WE COLLECT
            React.createElement('div', { style: sectionStyle },
                React.createElement('div', { style: glowLineStyle('#00f2fe') }),
                React.createElement('div', { style: { display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' } },
                    React.createElement('span', { style: { color: '#00f2fe', fontSize: '1.5rem' } }, '✦'),
                    React.createElement('h3', { style: { color: '#ffffff', fontSize: '1.65rem', fontWeight: '700', margin: 0 } }, '1. Information We Collect')
                ),
                React.createElement('p', { style: { color: 'rgba(255,255,255,0.75)', lineHeight: '1.9', fontSize: '1.1rem', fontWeight: '300' } },
                    'At Apex Code, accessible from our platform, one of our main priorities is the privacy of our visitors. When you request a service, contact us via email, fill out a form (such as ordering websites listed for sale), submit a job application, or communicate with us through any channel, we may collect personal information including your full name, email address, phone/WhatsApp number, country of residence, project details, and payment information. All payment transactions are processed securely through third-party payment gateways.'
                )
            ),

            // 🎯 2. HOW WE USE YOUR INFORMATION
            React.createElement('div', { style: sectionStyle },
                React.createElement('div', { style: glowLineStyle('#ff0080') }),
                React.createElement('div', { style: { display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' } },
                    React.createElement('span', { style: { color: '#ff0080', fontSize: '1.5rem' } }, '✦'),
                    React.createElement('h3', { style: { color: '#ffffff', fontSize: '1.65rem', fontWeight: '700', margin: 0 } }, '2. How We Use Your Information')
                ),
                React.createElement('p', { style: { color: 'rgba(255,255,255,0.75)', lineHeight: '1.9', fontSize: '1.1rem', fontWeight: '300' } },
                    'We utilize the collected information strictly to process your business inquiries, fulfill custom website development and design orders, process job applications, enhance user experience, and communicate updates or support regarding your purchases. We do not sell, rent, or distribute your credentials to third-party marketing networks. Your data is used solely for the purpose of delivering our services to you.'
                )
            ),

            // 💳 3. PAYMENT TERMS & PROJECT POLICY (NEW SECTION)
            React.createElement('div', { style: sectionStyle },
                React.createElement('div', { style: glowLineStyle('#eab308') }),
                React.createElement('div', { style: { display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' } },
                    React.createElement('span', { style: { color: '#eab308', fontSize: '1.5rem' } }, '✦'),
                    React.createElement('h3', { style: { color: '#ffffff', fontSize: '1.65rem', fontWeight: '700', margin: 0 } }, '3. Payment Terms & Project Policy')
                ),
                React.createElement('p', { style: { color: 'rgba(255,255,255,0.75)', lineHeight: '1.9', fontSize: '1.1rem', fontWeight: '300' } },
                    'We require a 50% advance payment before starting any project. The remaining 50% is due upon project completion and before final delivery. All payments are non-refundable once the project work has commenced. We do not store your payment information on our servers.'
                ),
                React.createElement('p', { style: { color: 'rgba(255,255,255,0.75)', lineHeight: '1.9', fontSize: '1.1rem', fontWeight: '300', marginTop: '15px' } },
                    'Important Notice: Apex Code is not responsible for any website crashes, technical failures, data loss, or security breaches that occur 6 months after project completion and final delivery. After this 6-month period, the client assumes full responsibility for website maintenance, security updates, plugin updates, backups, and all technical support. We offer separate maintenance and support packages that can be purchased to extend coverage beyond the 6-month period.'
                ),
                React.createElement('p', { style: { color: 'rgba(255,255,255,0.75)', lineHeight: '1.9', fontSize: '1.1rem', fontWeight: '300', marginTop: '15px' } },
                    'All website-for-sale purchases are final and binding. We highly recommend reviewing live previews and templates thoroughly before making a purchase. Custom development revisions are subject to the initial written scope agreed upon at project start.'
                )
            ),

            // 🌐 4. THIRD-PARTY SERVICES & AD NETWORKS
            React.createElement('div', { style: sectionStyle },
                React.createElement('div', { style: glowLineStyle('#00f2fe') }),
                React.createElement('div', { style: { display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' } },
                    React.createElement('span', { style: { color: '#00f2fe', fontSize: '1.5rem' } }, '✦'),
                    React.createElement('h3', { style: { color: '#ffffff', fontSize: '1.65rem', fontWeight: '700', margin: 0 } }, '4. Third-Party Services & Ad Networks')
                ),
                React.createElement('p', { style: { color: 'rgba(255,255,255,0.75)', lineHeight: '1.9', fontSize: '1.1rem', fontWeight: '300' } },
                    'Our platform may utilize integrated third-party analytics (such as Google Analytics) and ad-monetization publisher networks (including AdSense, Adsterra, and Monetag) to serve premium advertisements. These networks may track anonymized user visits, collect anonymous usage data, or deploy web cookies to optimize target delivery. Please refer to their respective individual privacy policies for full terms on their data collection and usage practices.'
                )
            ),

            // 🔐 5. DATA PROTECTION & SECURITY
            React.createElement('div', { style: sectionStyle },
                React.createElement('div', { style: glowLineStyle('#ff0080') }),
                React.createElement('div', { style: { display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' } },
                    React.createElement('span', { style: { color: '#ff0080', fontSize: '1.5rem' } }, '✦'),
                    React.createElement('h3', { style: { color: '#ffffff', fontSize: '1.65rem', fontWeight: '700', margin: 0 } }, '5. Data Protection & Security')
                ),
                React.createElement('p', { style: { color: 'rgba(255,255,255,0.75)', lineHeight: '1.9', fontSize: '1.1rem', fontWeight: '300' } },
                    'We implement robust digital security measures to maintain the absolute confidentiality of your order forms and payment verification queries submitted across our secure networks. This includes SSL encryption for data transmission, limited access to personal data, regular security audits, and compliance with data protection regulations. However, please note that no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.'
                )
            ),

            // 📋 6. DATA RETENTION & YOUR RIGHTS
            React.createElement('div', { style: sectionStyle },
                React.createElement('div', { style: glowLineStyle('#00f2fe') }),
                React.createElement('div', { style: { display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' } },
                    React.createElement('span', { style: { color: '#00f2fe', fontSize: '1.5rem' } }, '✦'),
                    React.createElement('h3', { style: { color: '#ffffff', fontSize: '1.65rem', fontWeight: '700', margin: 0 } }, '6. Data Retention & Your Rights')
                ),
                React.createElement('p', { style: { color: 'rgba(255,255,255,0.75)', lineHeight: '1.9', fontSize: '1.1rem', fontWeight: '300' } },
                    'We retain your personal information only for as long as necessary to fulfill the purposes outlined in this privacy policy, unless a longer retention period is required by law. You have the right to access, correct, or request deletion of your personal information at any time. You may also withdraw consent for data processing or object to the processing of your personal information. To exercise any of these rights, please contact us at book.apexcode@gmail.com.'
                )
            ),

            // 🍪 7. COOKIES & CHILDREN'S PRIVACY
            React.createElement('div', { style: sectionStyle },
                React.createElement('div', { style: glowLineStyle('#ff0080') }),
                React.createElement('div', { style: { display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' } },
                    React.createElement('span', { style: { color: '#ff0080', fontSize: '1.5rem' } }, '✦'),
                    React.createElement('h3', { style: { color: '#ffffff', fontSize: '1.65rem', fontWeight: '700', margin: 0 } }, '7. Cookies & Children\'s Privacy')
                ),
                React.createElement('p', { style: { color: 'rgba(255,255,255,0.75)', lineHeight: '1.9', fontSize: '1.1rem', fontWeight: '300' } },
                    'Our website may use cookies to enhance your browsing experience. You can control cookie preferences through your browser settings. Please note that disabling cookies may affect certain features of our website. Our services are not intended for individuals under the age of 13, and we do not knowingly collect personal information from children under 13 years of age.'
                )
            ),

            // 📞 8. CONTACT US & POLICY UPDATES
            React.createElement('div', { style: sectionStyle },
                React.createElement('div', { style: glowLineStyle('#00f2fe') }),
                React.createElement('div', { style: { display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' } },
                    React.createElement('span', { style: { color: '#00f2fe', fontSize: '1.5rem' } }, '✦'),
                    React.createElement('h3', { style: { color: '#ffffff', fontSize: '1.65rem', fontWeight: '700', margin: 0 } }, '8. Contact Us & Policy Updates')
                ),
                React.createElement('p', { style: { color: 'rgba(255,255,255,0.75)', lineHeight: '1.9', fontSize: '1.1rem', fontWeight: '300' } },
                    'We reserve the right to update this privacy policy at any time. We will notify you of any changes by posting the new policy on this page with an updated "Last Updated" date. If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us at:'
                ),
                React.createElement('p', { style: { color: 'rgba(255,255,255,0.9)', lineHeight: '1.9', fontSize: '1.1rem', fontWeight: '500', marginTop: '15px' } },
                    '📧 Email: book.apexcode@gmail.com'
                ),
                React.createElement('p', { style: { color: 'rgba(255,255,255,0.75)', lineHeight: '1.9', fontSize: '1.1rem', fontWeight: '300', marginTop: '15px', fontStyle: 'italic' } },
                    'By using our services, you acknowledge that you have read, understood, and agree to this Privacy Policy and our Terms & Conditions.'
                )
            )

        );
    }else if (currentPage === 'terms-conditions') {
        // 🌌 Premium Core Section Style (Sophisticated Glassmorphism)
        const sectionStyle = {
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '24px',
            padding: '40px',
            marginBottom: '35px',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            position: 'relative',
            overflow: 'hidden'
        };

        // ⚡ Glowing accent lines for neon aesthetic matching other premium pages
        const glowLineStyle = (color) => ({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '2px',
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`
        });

        mainElement = React.createElement('main', {
            className: 'terms-page',
            style: { padding: '80px 24px', maxWidth: '900px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' }
        },

            // 🚀 HEADER SECTION (Stunning Pill-Shaped Glowing Border & Gradient)
            React.createElement('div', { style: { textAlign: 'center', marginBottom: '60px', position: 'relative' } },
                
                React.createElement('div', {
                    style: {
                        display: 'inline-block',
                        padding: '12px 35px',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '20px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        boxShadow: 'inset 0 0 12px rgba(255, 255, 255, 0.02), 0 8px 32px rgba(0, 0, 0, 0.3)',
                        margin: '0 auto',
                        filter: 'drop-shadow(0 4px 12px rgba(255, 0, 128, 0.15))'
                    }
                },
                    React.createElement('h2', {
                        className: 'section-heading',
                        style: {
                            fontSize: '3rem',
                            fontWeight: '850',
                            letterSpacing: '1.5px',
                            margin: '0',
                            padding: '0',
                            background: 'linear-gradient(90deg, #FF0080 0%, #00F2FE 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            display: 'block',
                            lineHeight: '1.2'
                        }
                    }, 'Terms & Conditions')
                ),
                
                React.createElement('p', { style: { color: 'rgba(255,255,255,0.4)', fontSize: '1.05rem', marginTop: '20px', fontWeight: '500' } }, 'Last Updated: June 2026')
            ),

            // 📜 1. INTRODUCTION & AGREEMENT
            React.createElement('div', { style: sectionStyle },
                React.createElement('div', { style: glowLineStyle('#ff0080') }),
                React.createElement('div', { style: { display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' } },
                    React.createElement('span', { style: { color: '#ff0080', fontSize: '1.5rem' } }, '✦'),
                    React.createElement('h3', { style: { color: '#ffffff', fontSize: '1.65rem', fontWeight: '700', margin: 0 } }, '1. Introduction & Agreement')
                ),
                React.createElement('p', { style: { color: 'rgba(255,255,255,0.75)', lineHeight: '1.9', fontSize: '1.1rem', fontWeight: '300' } },
                    'By accessing, browsing, or placing orders via Apex Code, you acknowledge and agree to comply fully with these standard Terms and Conditions. If you disagree with any part of these terms, please halt usage of our services immediately. These terms constitute a legally binding agreement between you ("Client," "User," "You") and Apex Code ("Company," "We," "Us," "Our").'
                )
            ),

            // 🛠️ 2. SERVICES WE PROVIDE
            React.createElement('div', { style: sectionStyle },
                React.createElement('div', { style: glowLineStyle('#00f2fe') }),
                React.createElement('div', { style: { display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' } },
                    React.createElement('span', { style: { color: '#00f2fe', fontSize: '1.5rem' } }, '✦'),
                    React.createElement('h3', { style: { color: '#ffffff', fontSize: '1.65rem', fontWeight: '700', margin: 0 } }, '2. Services We Provide')
                ),
                React.createElement('p', { style: { color: 'rgba(255,255,255,0.75)', lineHeight: '1.9', fontSize: '1.1rem', fontWeight: '300' } },
                    'Apex Code offers the following services: Custom Code-Based Website Development using modern frameworks like React, Python/Flask, and other technologies; WordPress Website Development with custom theme configuration and plugin integration; SEO Optimization including on-page optimization, technical SEO audits, keyword strategy, and structured data implementation; Ad Monetization Setup integrating AdSense, Adsterra, Monetag, and other ad networks; Website for Sale including ready-made premium templates and websites; and Job Postings for recruitment and career opportunities.'
                )
            ),

            // 💳 3. PAYMENT TERMS & PROJECT POLICY
            React.createElement('div', { style: sectionStyle },
                React.createElement('div', { style: glowLineStyle('#eab308') }),
                React.createElement('div', { style: { display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' } },
                    React.createElement('span', { style: { color: '#eab308', fontSize: '1.5rem' } }, '✦'),
                    React.createElement('h3', { style: { color: '#ffffff', fontSize: '1.65rem', fontWeight: '700', margin: 0 } }, '3. Payment Terms & Project Policy')
                ),
                React.createElement('p', { style: { color: 'rgba(255,255,255,0.75)', lineHeight: '1.9', fontSize: '1.1rem', fontWeight: '300' } },
                    'We require a 50% advance payment before starting any project. The remaining 50% is due upon project completion and before final delivery. All payments are non-refundable once project work has commenced. We accept payments via Sadapay, Raqami, Jazzcash, HBL Bank, UBL Bank, Meezan Bank, NayaPay, Easypaisa, and corporate bank transfers.'
                ),
                React.createElement('p', { style: { color: 'rgba(255,255,255,0.75)', lineHeight: '1.9', fontSize: '1.1rem', fontWeight: '300', marginTop: '15px' } },
                    'Project completion time varies based on the selected plan and project scope. Basic plans have a quick turnaround, while Standard and Premium plans with database integration or enterprise architecture take longer based on scope.'
                ),
                React.createElement('p', { style: { color: 'rgba(255,255,255,0.75)', lineHeight: '1.9', fontSize: '1.1rem', fontWeight: '300', marginTop: '15px' } },
                    'Important Notice: Apex Code is not responsible for any website crashes, technical failures, data loss, or security breaches that occur 6 months after project completion and final delivery. After this 6-month period, the client assumes full responsibility for website maintenance, security updates, plugin updates, backups, and all technical support. We offer separate maintenance and support packages that can be purchased to extend coverage beyond the 6-month period.'
                )
            ),

            // 🛒 4. WEBSITE FOR SALE PURCHASES
            React.createElement('div', { style: sectionStyle },
                React.createElement('div', { style: glowLineStyle('#ff0080') }),
                React.createElement('div', { style: { display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' } },
                    React.createElement('span', { style: { color: '#ff0080', fontSize: '1.5rem' } }, '✦'),
                    React.createElement('h3', { style: { color: '#ffffff', fontSize: '1.65rem', fontWeight: '700', margin: 0 } }, '4. Website for Sale Purchases')
                ),
                React.createElement('p', { style: { color: 'rgba(255,255,255,0.75)', lineHeight: '1.9', fontSize: '1.1rem', fontWeight: '300' } },
                    'All website-for-sale purchases are final and binding. We highly recommend reviewing live previews and templates thoroughly before making a purchase. Full ownership of the purchased website transfers to you once payment is completed. Reusing or redistributing our proprietary framework themes without authorization is not permitted. Pre-built website-for-sale purchases are final, so we recommend reviewing the live preview carefully before booking.'
                )
            ),

            // 💻 5. CUSTOM DEVELOPMENT PROJECTS
            React.createElement('div', { style: sectionStyle },
                React.createElement('div', { style: glowLineStyle('#00f2fe') }),
                React.createElement('div', { style: { display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' } },
                    React.createElement('span', { style: { color: '#00f2fe', fontSize: '1.5rem' } }, '✦'),
                    React.createElement('h3', { style: { color: '#ffffff', fontSize: '1.65rem', fontWeight: '700', margin: 0 } }, '5. Custom Development Projects')
                ),
                React.createElement('p', { style: { color: 'rgba(255,255,255,0.75)', lineHeight: '1.9', fontSize: '1.1rem', fontWeight: '300' } },
                    'Custom development revisions follow the written scope agreed upon at project start. Any changes to the scope after project commencement may incur additional charges. Clients must provide all necessary content, images, and information in a timely manner. Delays caused by client non-responsiveness may affect project timelines. Clients are responsible for reviewing and approving deliverables at each stage. Limited revisions are included as per the agreed scope, and additional revisions beyond the scope may be billed separately.'
                )
            ),

            // 🔒 6. INTELLECTUAL PROPERTY
            React.createElement('div', { style: sectionStyle },
                React.createElement('div', { style: glowLineStyle('#ff0080') }),
                React.createElement('div', { style: { display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' } },
                    React.createElement('span', { style: { color: '#ff0080', fontSize: '1.5rem' } }, '✦'),
                    React.createElement('h3', { style: { color: '#ffffff', fontSize: '1.65rem', fontWeight: '700', margin: 0 } }, '6. Intellectual Property')
                ),
                React.createElement('p', { style: { color: 'rgba(255,255,255,0.75)', lineHeight: '1.9', fontSize: '1.1rem', fontWeight: '300' } },
                    'Upon full payment, all intellectual property rights for the custom-developed website transfer to the client. For website-for-sale purchases, full ownership transfers upon completion of payment. Replicating, pirating, or redistributing our specific framework themes without explicit authorization is strictly prohibited. You may not resell or redistribute any proprietary code or templates provided by Apex Code without written consent. Any third-party assets (plugins, images, libraries) used in your project remain the property of their respective owners and are subject to their licensing terms.'
                )
            ),

            // 🔄 7. REFUND POLICY
            React.createElement('div', { style: sectionStyle },
                React.createElement('div', { style: glowLineStyle('#eab308') }),
                React.createElement('div', { style: { display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' } },
                    React.createElement('span', { style: { color: '#eab308', fontSize: '1.5rem' } }, '✦'),
                    React.createElement('h3', { style: { color: '#ffffff', fontSize: '1.65rem', fontWeight: '700', margin: 0 } }, '7. Refund Policy')
                ),
                React.createElement('p', { style: { color: 'rgba(255,255,255,0.75)', lineHeight: '1.9', fontSize: '1.1rem', fontWeight: '300' } },
                    'Due to the operational nature of digital coding and domain transfers, all website-for-sale purchases are binding and non-refundable. For custom development projects, payments are non-refundable once work has commenced. If a project is canceled before work begins, the 50% advance payment may be refundable, minus any administrative fees. Any disputes regarding our services will be handled through direct communication. If a resolution cannot be reached, the matter may be escalated to formal dispute resolution.'
                )
            ),

            // 🛡️ 8. LIMITATION OF LIABILITY
            React.createElement('div', { style: sectionStyle },
                React.createElement('div', { style: glowLineStyle('#ff0080') }),
                React.createElement('div', { style: { display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' } },
                    React.createElement('span', { style: { color: '#ff0080', fontSize: '1.5rem' } }, '✦'),
                    React.createElement('h3', { style: { color: '#ffffff', fontSize: '1.65rem', fontWeight: '700', margin: 0 } }, '8. Limitation of Liability')
                ),
                React.createElement('p', { style: { color: 'rgba(255,255,255,0.75)', lineHeight: '1.9', fontSize: '1.1rem', fontWeight: '300' } },
                    'Apex Code stands as a dedicated service provider and will not be held liable for sudden shifts in external ad network configurations, domain host downtime, hosting modifications caused by third-party configurations post-handover, or acts of God, natural disasters, or events beyond our reasonable control. To the maximum extent permitted by law, our total liability to you for any claims arising out of or relating to these terms or our services shall not exceed the total amount paid by you to us for the specific service in question. In no event shall Apex Code be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to lost profits, lost data, or business interruption.'
                )
            ),

            // 👤 9. USER RESPONSIBILITIES & CONDUCT
            React.createElement('div', { style: sectionStyle },
                React.createElement('div', { style: glowLineStyle('#00f2fe') }),
                React.createElement('div', { style: { display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' } },
                    React.createElement('span', { style: { color: '#00f2fe', fontSize: '1.5rem' } }, '✦'),
                    React.createElement('h3', { style: { color: '#ffffff', fontSize: '1.65rem', fontWeight: '700', margin: 0 } }, '9. User Responsibilities & Conduct')
                ),
                React.createElement('p', { style: { color: 'rgba(255,255,255,0.75)', lineHeight: '1.9', fontSize: '1.1rem', fontWeight: '300' } },
                    'You agree to provide accurate, complete, and current information when using our services, including contact details, project requirements, and payment information. You agree not to use our services for any illegal or unauthorized purpose, violate any applicable laws or regulations, attempt to gain unauthorized access to our systems, interfere with or disrupt our services or servers, or use our services to harass, abuse, or harm others. You represent that you own or have the necessary rights to all content you provide to us for your project.'
                )
            ),

            // 🔐 10. PRIVACY & DATA PROTECTION
            React.createElement('div', { style: sectionStyle },
                React.createElement('div', { style: glowLineStyle('#ff0080') }),
                React.createElement('div', { style: { display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' } },
                    React.createElement('span', { style: { color: '#ff0080', fontSize: '1.5rem' } }, '✦'),
                    React.createElement('h3', { style: { color: '#ffffff', fontSize: '1.65rem', fontWeight: '700', margin: 0 } }, '10. Privacy & Data Protection')
                ),
                React.createElement('p', { style: { color: 'rgba(255,255,255,0.75)', lineHeight: '1.9', fontSize: '1.1rem', fontWeight: '300' } },
                    'Our Privacy Policy, which is incorporated by reference into these Terms and Conditions, governs how we collect, use, and protect your personal information. We implement reasonable security measures to protect your data. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.'
                )
            ),

            // ⚡ 11. TERMINATION
            React.createElement('div', { style: sectionStyle },
                React.createElement('div', { style: glowLineStyle('#00f2fe') }),
                React.createElement('div', { style: { display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' } },
                    React.createElement('span', { style: { color: '#00f2fe', fontSize: '1.5rem' } }, '✦'),
                    React.createElement('h3', { style: { color: '#ffffff', fontSize: '1.65rem', fontWeight: '700', margin: 0 } }, '11. Termination')
                ),
                React.createElement('p', { style: { color: 'rgba(255,255,255,0.75)', lineHeight: '1.9', fontSize: '1.1rem', fontWeight: '300' } },
                    'You may terminate your use of our services at any time. However, payments made are non-refundable as outlined in Section 7. We reserve the right to terminate or suspend your access to our services at any time, without notice, for conduct that we believe violates these terms or is harmful to other users, us, or third parties.'
                )
            ),

            // 📝 12. CHANGES TO TERMS
            React.createElement('div', { style: sectionStyle },
                React.createElement('div', { style: glowLineStyle('#ff0080') }),
                React.createElement('div', { style: { display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' } },
                    React.createElement('span', { style: { color: '#ff0080', fontSize: '1.5rem' } }, '✦'),
                    React.createElement('h3', { style: { color: '#ffffff', fontSize: '1.65rem', fontWeight: '700', margin: 0 } }, '12. Changes to Terms')
                ),
                React.createElement('p', { style: { color: 'rgba(255,255,255,0.75)', lineHeight: '1.9', fontSize: '1.1rem', fontWeight: '300' } },
                    'We reserve the right to update these Terms and Conditions at any time. We will notify you of any changes by posting the new terms on this page with an updated "Last Updated" date. By continuing to use our services after changes are posted, you accept and agree to the updated Terms and Conditions.'
                )
            ),

            // ⚖️ 13. GOVERNING LAW & DISPUTE RESOLUTION
            React.createElement('div', { style: sectionStyle },
                React.createElement('div', { style: glowLineStyle('#eab308') }),
                React.createElement('div', { style: { display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' } },
                    React.createElement('span', { style: { color: '#eab308', fontSize: '1.5rem' } }, '✦'),
                    React.createElement('h3', { style: { color: '#ffffff', fontSize: '1.65rem', fontWeight: '700', margin: 0 } }, '13. Governing Law & Dispute Resolution')
                ),
                React.createElement('p', { style: { color: 'rgba(255,255,255,0.75)', lineHeight: '1.9', fontSize: '1.1rem', fontWeight: '300' } },
                    'These Terms and Conditions shall be governed by and construed in accordance with the laws of Pakistan. In the event of any dispute arising out of or relating to these terms, you agree to first attempt to resolve the dispute informally by contacting us at book.apexcode@gmail.com. If the dispute cannot be resolved informally, it shall be resolved through binding arbitration in accordance with the rules of the relevant arbitration body in Pakistan.'
                )
            ),

            // 📞 14. CONTACT INFORMATION
            React.createElement('div', { style: sectionStyle },
                React.createElement('div', { style: glowLineStyle('#00f2fe') }),
                React.createElement('div', { style: { display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' } },
                    React.createElement('span', { style: { color: '#00f2fe', fontSize: '1.5rem' } }, '✦'),
                    React.createElement('h3', { style: { color: '#ffffff', fontSize: '1.65rem', fontWeight: '700', margin: 0 } }, '14. Contact Information')
                ),
                React.createElement('p', { style: { color: 'rgba(255,255,255,0.9)', lineHeight: '1.9', fontSize: '1.1rem', fontWeight: '500' } },
                    '📧 Email: book.apexcode@gmail.com'
                ),
                React.createElement('p', { style: { color: 'rgba(255,255,255,0.75)', lineHeight: '1.9', fontSize: '1.1rem', fontWeight: '300', marginTop: '15px' } },
                    'If you have any questions, concerns, or requests regarding these Terms and Conditions, please contact us at the email address above.'
                )
            ),

            // 📄 15. ENTIRE AGREEMENT
            React.createElement('div', { style: sectionStyle },
                React.createElement('div', { style: glowLineStyle('#ff0080') }),
                React.createElement('div', { style: { display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' } },
                    React.createElement('span', { style: { color: '#ff0080', fontSize: '1.5rem' } }, '✦'),
                    React.createElement('h3', { style: { color: '#ffffff', fontSize: '1.65rem', fontWeight: '700', margin: 0 } }, '15. Entire Agreement')
                ),
                React.createElement('p', { style: { color: 'rgba(255,255,255,0.75)', lineHeight: '1.9', fontSize: '1.1rem', fontWeight: '300' } },
                    'These Terms and Conditions, together with our Privacy Policy and any other policies referenced herein, constitute the entire agreement between you and Apex Code regarding your use of our services and supersede all prior agreements and understandings.'
                ),
                React.createElement('p', { style: { color: 'rgba(255,255,255,0.75)', lineHeight: '1.9', fontSize: '1.1rem', fontWeight: '300', marginTop: '15px', fontStyle: 'italic' } },
                    'By using our services, you acknowledge that you have read, understood, and agree to these Terms and Conditions and our Privacy Policy.'
                )
            )

        );
    } else if (currentPage === 'home' || currentPage === '') {

        // 🌌 Home Page Premium Glassmorphism UI
        mainElement = React.createElement('main', {
            className: 'home-page',
            style: {
                padding: '60px 20px',
                minHeight: '85vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                overflow: 'hidden',
                background: 'transparent'
            }
        },
            // 🎨 INJECTING PREMIUM ANIMATIONS & HOVER EFFECTS (CSS)
            React.createElement('style', null, `
                @keyframes floatAnimation {
                    0% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(1deg); }
                    100% { transform: translateY(0px) rotate(0deg); }
                }
                @keyframes pulseGlow {
                    0% { transform: translate(-50%, -50%) scale(1); opacity: 0.15; }
                    50% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.25; }
                    100% { transform: translate(-50%, -50%) scale(1); opacity: 0.15; }
                }
                .premium-float-object { animation: floatAnimation 5s ease-in-out infinite; }
                .ambient-pulse-glow { animation: pulseGlow 6s ease-in-out infinite; }
                
                .cta-btn-primary:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 12px 35px rgba(255, 0, 128, 0.5) !important;
                }
                .cta-btn-secondary:hover {
                    background: rgba(255, 255, 255, 0.08) !important;
                    border-color: rgba(255, 255, 255, 0.3) !important;
                    transform: translateY(-3px);
                }

                /* ✨ Beautiful Card Hover Uplift */
                .premium-card { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important; }
                .premium-card:hover { 
                    transform: translateY(-10px) scale(1.02); 
                    border-color: rgba(0, 242, 254, 0.4) !important; 
                    box-shadow: 0 30px 60px rgba(0, 242, 254, 0.12) !important; 
                }

                /* 🚀 Direct Page Navigation Cards */
                .nav-card { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important; cursor: pointer; }
                .nav-card:hover {
                    transform: translateY(-5px);
                    background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02)) !important;
                    border-color: rgba(255, 255, 255, 0.25) !important;
                    box-shadow: 0 15px 30px rgba(0,0,0,0.4) !important;
                }
            `),

            // 🚀 HERO SECTION (Split Layout)
            React.createElement('div', {
                style: {
                    display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                    gap: '50px', marginBottom: '90px', position: 'relative', width: '100%', maxWidth: '1140px', flexWrap: 'wrap'
                }
            },
                // LEFT COLUMN: Typography
                React.createElement('div', { className: 'hero-left-col', style: { flex: '1 1 550px', textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' } },
    React.createElement('div', {
        style: {
            display: 'inline-block',
            padding: '8px 16px', // Mobile screen ke liye padding halki si kam ki taake safe rahe
            marginBottom: '20px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '50px',
            color: '#00f2fe',
            
            // 📱 Mobile responsive dynamic font-size (Har screen par auto-adjust hoga)
            fontSize: 'clamp(0.65rem, 3vw, 0.85rem)', 
            
            // 🛠️ TEXT KO EK LINE MEIN LOCK KARNE KE LIYE
            whiteSpace: 'nowrap', 
            
            fontWeight: '600',
            fontFamily: "'Bruno Ace SC', sans-serif",
            letterSpacing: '1px',
            backdropFilter: 'blur(10px)',
            maxWidth: '100%', // Div ko screen se bahar nikalne se roke ga
            boxSizing: 'border-box'
        }
    }, '✨ HELLO WELCOME TO APEX CODE'), // 'âœ¨' ko clean '✨' emoji se replace kiya hai

                    React.createElement('h1', {
                        style: {
                            fontSize: '3rem',
                            fontWeight: '600',
                            fontFamily: "'Bruno Ace SC', sans-serif",
                            letterSpacing: '1px',
                            margin: '0 0 20px 0',
                            lineHeight: '1.15',
                            background: 'linear-gradient(90deg, #ffffff 0%, #b0c6ff 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }
                    }, 'Software Engineering & Web Development ',
                        React.createElement('span', { style: { background: 'linear-gradient(90deg, #00f2fe 0%, #ff0080 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 4px 12px rgba(0, 242, 254, 0.3))' } }, 'A Global Remote Company')
                    ),
                    React.createElement('p', {
                        style: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '1.15rem',
                            maxWidth: '580px',
                            margin: '0 0 35px 0',
                            lineHeight: '1.7',
                            minHeight: '60px' // Ek single line ke liye min-height adjust ki hai taake layout disturb na ho
                        }
                    },
                        React.createElement(TypewriterText, {
                            texts: [
                                'Apex Code delivers high-performance development.',
                                'Advanced SEO architecture, and strategic ad monetization.',
                                'Scale your business with code that converts.'
                            ],
                            speed: 40,   // Typing ki raftar
                            delay: 2500  // Har line poori hone ke baad kitni der (milliseconds) ruki rahe
                        })
                    ),
                    React.createElement('div', { style: { display: 'flex', gap: '15px', flexWrap: 'wrap' } },
                        React.createElement('button', { onClick: toServices, className: 'cta-btn-primary', style: { padding: '16px 34px', fontSize: '1rem', fontWeight: '700', borderRadius: '50px', background: 'linear-gradient(90deg, #00f2fe, #ff0080)', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 8px 25px rgba(255, 0, 128, 0.25)', transition: 'all 0.3s ease' } }, 'Explore Services'),
                        React.createElement('button', { onClick: toPortfolio, className: 'cta-btn-secondary', style: { padding: '16px 34px', fontSize: '1rem', fontWeight: '700', borderRadius: '50px', background: 'rgba(255, 255, 255, 0.02)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.12)', cursor: 'pointer', backdropFilter: 'blur(10px)', transition: 'all 0.3s ease' } }, 'View Portfolio')
                    )
                ),
                // RIGHT COLUMN: Animated Moving Object
                React.createElement('div', { style: { flex: '1 1 400px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', minHeight: '400px' } },
                    React.createElement('div', { className: 'ambient-pulse-glow', style: { position: 'absolute', top: '50%', left: '50%', width: '380px', height: '380px', background: 'radial-gradient(circle, rgba(0, 242, 254, 0.18) 0%, rgba(255, 0, 128, 0.04) 70%)', filter: 'blur(60px)', borderRadius: '50%', zIndex: '1', pointerEvents: 'none' } }),
                    React.createElement('div', { className: 'premium-float-object', style: { position: 'relative', zIndex: '2', width: '100%', maxWidth: '380px', background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02))', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '20px', boxShadow: '0 30px 60px rgba(0,0,0,0.4)', backdropFilter: 'blur(25px)', padding: '20px' } },
                        React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' } },
                            React.createElement('div', { style: { display: 'flex', gap: '6px' } },
                                React.createElement('span', { style: { width: '11px', height: '11px', borderRadius: '50%', background: '#ff5f56' } }),
                                React.createElement('span', { style: { width: '11px', height: '11px', borderRadius: '50%', background: '#ffbd2e' } }),
                                React.createElement('span', { style: { width: '11px', height: '11px', borderRadius: '50%', background: '#27c93f' } })
                            ),
                            React.createElement('span', { style: { color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontFamily: 'monospace' } }, 'apex-core.js')
                        ),
                        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '12px', fontFamily: 'monospace', fontSize: '0.85rem' } },
                            React.createElement('div', { style: { color: '#ff0080' } }, 'const apexcode = {'),
                            React.createElement('div', { style: { color: '#00f2fe', paddingLeft: '15px' } }, 'speed: "100ms",'),
                            React.createElement('div', { style: { color: '#00f2fe', paddingLeft: '15px' } }, 'seo: "Optimized",'),
                            React.createElement('div', { style: { color: '#00f2fe', paddingLeft: '15px' } }, 'monetization: true'),
                            React.createElement('div', { style: { color: '#ff0080' } }, '};'),
                            React.createElement('div', { style: { marginTop: '10px', padding: '15px', borderRadius: '12px', background: 'linear-gradient(90deg, rgba(0, 242, 254, 0.12), rgba(255, 0, 128, 0.04))', border: '1px solid rgba(0, 242, 254, 0.2)', display: 'flex', flexDirection: 'column', gap: '8px' } },
                                React.createElement('div', { style: { height: '6px', width: '40%', background: '#00f2fe', borderRadius: '4px' } }),
                                React.createElement('div', { style: { height: '6px', width: '85%', background: 'rgba(255,255,255,0.2)', borderRadius: '4px' } })
                            )
                        )
                    )
                )
            ),
            // ✨ ULTRA-PREMIUM ANIMATED STATS BAR (NEXT-GEN CINEMATIC VERSION)
            React.createElement('div', { 
                className: 'premium-stats-container',
                style: { width: '100%', display: 'flex', justifyContent: 'center', overflow: 'hidden', padding: '10px 0' }
            },
                
                // 🎨 CINEMATIC ANIMATIONS & RESPONSIVE GRID INJECTION
                React.createElement('style', { 
                    dangerouslySetInnerHTML: { __html: `
                        /* 🌟 Entrance & Ambient Keyframes */
                        @keyframes statsBarEntrance {
                            0% { opacity: 0; transform: translateY(40px) scale(0.98); }
                            100% { opacity: 1; transform: translateY(0) scale(1); }
                        }
                        
                        @keyframes ambientGlowPulse {
                            0% { 
                                border-color: rgba(255, 255, 255, 0.05); 
                                box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.06); 
                            }
                            50% { 
                                border-color: rgba(255, 255, 255, 0.12); 
                                box-shadow: 0 35px 70px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 242, 254, 0.03), inset 0 1px 0 rgba(255, 255, 255, 0.12); 
                            }
                            100% { 
                                border-color: rgba(255, 255, 255, 0.05); 
                                box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.06); 
                            }
                        }

                        .premium-stats-bar {
                            display: grid;
                            grid-template-columns: repeat(4, 1fr);
                            width: 100%;
                            max-width: 1140px;
                            margin-bottom: 60px;
                            padding: 45px 20px;
                            background: linear-gradient(135deg, rgba(10, 10, 18, 0.8) 0%, rgba(20, 20, 35, 0.5) 100%);
                            border: 1px solid rgba(255, 255, 255, 0.05);
                            border-radius: 32px;
                            backdrop-filter: blur(30px);
                            -webkit-backdrop-filter: blur(30px);
                            
                            /* Animations Applier */
                            animation: statsBarEntrance 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards,
                                      ambientGlowPulse 6s ease-in-out infinite;
                            will-change: transform, opacity, box-shadow;
                        }

                        .stat-box {
                            text-align: center;
                            padding: 15px 25px;
                            position: relative;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                            will-change: transform;
                        }
                        
                        /* Super Smooth Hover Jump */
                        .stat-box:hover {
                            transform: translateY(-8px) scale(1.02);
                        }
                        
                        /* Premium Glass Dividers (Desktop Only) */
                        .stat-box:not(:last-child)::after {
                            content: '';
                            position: absolute;
                            right: 0;
                            top: 10%;
                            height: 80%;
                            width: 1px;
                            background: linear-gradient(to bottom, transparent via rgba(255, 255, 255, 0.12) to transparent);
                            transition: opacity 0.3s ease;
                        }
                        .stat-box:hover::after, .stat-box:hover + .stat-box::after {
                            opacity: 0.3; /* Fade out dividers near active hover */
                        }
                        
                        .stat-number {
                            font-size: 3.6rem; 
                            font-weight: 950; 
                            line-height: 1.05;
                            margin-bottom: 10px;
                            letter-spacing: -1.5px;
                            display: inline-block;
                            transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), filter 0.5s ease;
                            will-change: transform, filter;
                        }
                        
                        /* Dynamic Scaling inside the hovered container */
                        .stat-box:hover .stat-number {
                            transform: scale(1.08);
                        }

                        .stat-label {
                            color: rgba(255, 255, 255, 0.45); 
                            font-size: 0.85rem; 
                            font-weight: 800; 
                            letter-spacing: 2px; 
                            text-transform: uppercase;
                            transition: all 0.4s ease;
                            position: relative;
                        }
                        
                        /* Subtle label slide up/brighten */
                        .stat-box:hover .stat-label {
                            color: #ffffff;
                            letter-spacing: 2.3px;
                        }

                        /* 📱 Tablets Screen Optimization (2 Columns) */
                        @media (max-width: 992px) {
                            .premium-stats-bar {
                                grid-template-columns: repeat(2, 1fr);
                                gap: 40px 0;
                                padding: 40px 20px;
                                border-radius: 26px;
                            }
                            .stat-box:nth-child(2n)::after {
                                display: none !important;
                            }
                            .stat-number {
                                font-size: 3.2rem;
                            }
                        }

                        /* 📱 Mobile Screen Optimization (1 Column Absolute Smooth) */
                        @media (max-width: 520px) {
                            .premium-stats-bar {
                                grid-template-columns: 1fr;
                                gap: 45px 0;
                                padding: 50px 15px;
                                margin-bottom: 40px;
                            }
                            .stat-box {
                                padding: 10px;
                            }
                            .stat-box::after {
                                display: none !important;
                            }
                            .stat-number {
                                font-size: 3rem;
                            }
                            .stat-label {
                                font-size: 0.8rem;
                                letter-spacing: 1.5px;
                            }
                            .stat-box:hover {
                                transform: translateY(-4px) scale(1.01); /* Reduced motion for mobile */
                            }
                        }
                    `} 
                }),

                // 🌐 UI GRID CONTAINER
                React.createElement('div', { className: 'premium-stats-bar' },
                    
                    // Stat 1: Projects Completed
                    React.createElement('div', { className: 'stat-box' },
                        React.createElement('div', { 
                            className: 'stat-number',
                            style: { background: 'linear-gradient(90deg, #00f2fe, #4facfe)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 6px 15px rgba(0, 242, 254, 0.25))' } 
                        },
                            React.createElement(AnimatedCounter, { end: 50, suffix: '+' })
                        ),
                        React.createElement('div', { className: 'stat-label' }, 'Projects Completed')
                    ),

                    // Stat 2: Expert Members
                    React.createElement('div', { className: 'stat-box' },
                        React.createElement('div', { 
                            className: 'stat-number',
                            style: { background: 'linear-gradient(90deg, #ff0080, #ff8c00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 6px 15px rgba(255, 0, 128, 0.25))' } 
                        },
                            React.createElement(AnimatedCounter, { end: 10, suffix: '+' })
                        ),
                        React.createElement('div', { className: 'stat-label' }, 'Expert Members')
                    ),

                    // Stat 3: Satisfied Clients
                    React.createElement('div', { className: 'stat-box' },
                        React.createElement('div', { 
                            className: 'stat-number',
                            style: { background: 'linear-gradient(90deg, #00e28c, #00f2fe)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 6px 15px rgba(0, 224, 140, 0.25))' } 
                        },
                            React.createElement(AnimatedCounter, { end: 20, suffix: '+' })
                        ),
                        React.createElement('div', { className: 'stat-label' }, 'Satisfied Clients')
                    ),

                    // Stat 4: Years Experience
                    React.createElement('div', { className: 'stat-box' },
                        React.createElement('div', { 
                            className: 'stat-number',
                            style: { background: 'linear-gradient(90deg, #ffbd2e, #ff0080)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 6px 15px rgba(255, 189, 46, 0.25))' } 
                        },
                            React.createElement(AnimatedCounter, { end: 2, suffix: '+' })
                        ),
                        React.createElement('div', { className: 'stat-label' }, 'Years Experience')
                    )
                )
            ),

            // 💎 1. KHOOBSURAT HIGHLIGHT CARDS GRID
            React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '25px', justifyContent: 'center', width: '100%', maxWidth: '1140px', marginBottom: '80px' } },
                // Card 1
                React.createElement('div', { className: 'premium-card', style: { flex: '1 1 320px', background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', padding: '40px 30px', textAlign: 'left', backdropFilter: 'blur(20px)' } },
                    React.createElement('div', { style: { width: '55px', height: '55px', borderRadius: '14px', background: 'rgba(0, 242, 254, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', marginBottom: '20px', border: '1px solid rgba(0, 242, 254, 0.2)' } }, '⚡'),
                    React.createElement('h3', { style: { color: '#fff', fontSize: '1.4rem', marginBottom: '12px', fontWeight: '700' } }, 'Clean Architecture'),
                    React.createElement('p', { style: { color: 'rgba(255,255,255,0.55)', fontSize: '0.95rem', lineHeight: '1.6' } }, 'Custom framework deployments designed for blazing fast render speeds, unbreakable security layers, and fluid UX flow.')
                ),
                // Card 2
                React.createElement('div', { className: 'premium-card', style: { flex: '1 1 320px', background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', padding: '40px 30px', textAlign: 'left', backdropFilter: 'blur(20px)' } },
                    React.createElement('div', { style: { width: '55px', height: '55px', borderRadius: '14px', background: 'rgba(255, 0, 128, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', marginBottom: '20px', border: '1px solid rgba(255, 0, 128, 0.2)' } }, '📈'),
                    React.createElement('h3', { style: { color: '#fff', fontSize: '1.4rem', marginBottom: '12px', fontWeight: '700' } }, 'Growth & Ranking'),
                    React.createElement('p', { style: { color: 'rgba(255,255,255,0.55)', fontSize: '0.95rem', lineHeight: '1.6' } }, 'Dominate search visibility with programmatic technical SEO execution. We build layout schemas that search engines love.')
                ),
                // Card 3
                React.createElement('div', { className: 'premium-card', style: { flex: '1 1 320px', background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', padding: '40px 30px', textAlign: 'left', backdropFilter: 'blur(20px)' } },
                    React.createElement('div', { style: { width: '55px', height: '55px', borderRadius: '14px', background: 'rgba(0, 224, 140, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', marginBottom: '20px', border: '1px solid rgba(0, 224, 140, 0.2)' } }, '💸'),
                    React.createElement('h3', { style: { color: '#fff', fontSize: '1.4rem', marginBottom: '12px', fontWeight: '700' } }, 'Smart Monetization'),
                    React.createElement('p', { style: { color: 'rgba(255,255,255,0.55)', fontSize: '0.95rem', lineHeight: '1.6' } }, 'Maximize revenue with surgical ad unit optimization. Native script integrations for AdSense, Adsterra, and Monetag.')
                )
            ),

            // 🖼️ 2. ALTERNATING CONTENT + IMAGE INTERACTIVE BLOCKS
            React.createElement('div', { style: { width: '100%', maxWidth: '1140px', display: 'flex', flexDirection: 'column', gap: '100px', marginBottom: '100px' } },

                // Block A: Text Left, Image/Graphic Right
                React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '40px', flexWrap: 'wrap' } },
                    React.createElement('div', { style: { flex: '1 1 500px', textAlign: 'left' } },
                        React.createElement('h2', { style: { color: '#fff', fontSize: '2.2rem', fontWeight: '800', marginBottom: '15px' } }, 'High-Converting UI Experience'),
                        React.createElement('p', { style: { color: 'rgba(255,255,255,0.6)', fontSize: '1.05rem', lineHeight: '1.7' } }, 'Hum aisi websites design karte hain jo na sirf dikhne mein khoobsurat hain balki unka UX user retention ko barha deta hai. Glassmorphism styling aur ultra-smooth animations ke sath customer loyalty aur business growth dono double ho jati hain.')
                    ),
                    // Glassmorphic Interactive Layout Frame acting as website graphic image
                    React.createElement('div', { style: { flex: '1 1 450px', height: '260px', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.1), rgba(255, 0, 128, 0.05))', border: '1px solid rgba(255,255,255,0.1)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' } },
                        React.createElement('div', { style: { width: '80%', height: '70%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '20px', color: '#00f2fe', fontSize: '1.5rem', fontWeight: 'bold' } }, '🌐 Responsive Layout Mockup',
                            React.createElement('div', { style: { marginTop: '15px', width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' } }),
                            React.createElement('div', { style: { marginTop: '10px', width: '60%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' } })
                        )
                    )
                ),

                // Block B: Image/Graphic Left, Text Right
                React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '40px', flexWrap: 'wrap-reverse' } },
                    // Revenue Graphic Frame
                    React.createElement('div', { style: { flex: '1 1 450px', height: '260px', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(255, 0, 128, 0.1), rgba(0, 224, 140, 0.05))', border: '1px solid rgba(255,255,255,0.1)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' } },
                        React.createElement('div', { style: { width: '80%', height: '70%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' } },
                            React.createElement('span', { style: { color: '#ff0080', fontWeight: 'bold', fontSize: '1.2rem' } }, '📊 Monetization Engine Active'),
                            React.createElement('div', { style: { display: 'flex', gap: '10px', alignItems: 'flex-end', height: '70px', marginTop: '10px' } },
                                React.createElement('div', { style: { width: '20%', height: '40%', background: '#ff0080', borderRadius: '4px' } }),
                                React.createElement('div', { style: { width: '20%', height: '65%', background: '#00f2fe', borderRadius: '4px' } }),
                                React.createElement('div', { style: { width: '20%', height: '50%', background: '#rgba(255,255,255,0.2)', borderRadius: '4px' } }),
                                React.createElement('div', { style: { width: '20%', height: '95%', background: '#00e28c', borderRadius: '4px' } })
                            )
                        )
                    ),
                    React.createElement('div', { style: { flex: '1 1 500px', textAlign: 'left' } },
                        React.createElement('h2', { style: { color: '#fff', fontSize: '2.2rem', fontWeight: '800', marginBottom: '15px' } }, 'Advanced Revenue & Ad Placement'),
                        React.createElement('p', { style: { color: 'rgba(255,255,255,0.6)', fontSize: '1.05rem', lineHeight: '1.7' } }, 'Har impression qeemti hai. Apex Code premium network scripts (AdSense, Adsterra, Monetag) ko is tarah implement karta hai ke aapka CTR aur CPM skyrocket ho jata hai bina user experience ko kharab kiye.')
                    )
                ),

                // Block C: Text Left, Image/Graphic Right
                React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '40px', flexWrap: 'wrap' } },
                    React.createElement('div', { style: { flex: '1 1 500px', textAlign: 'left' } },
                        React.createElement('h2', { style: { color: '#fff', fontSize: '2.2rem', fontWeight: '800', marginBottom: '15px' } }, 'Technical Search Domination'),
                        React.createElement('p', { style: { color: 'rgba(255,255,255,0.6)', fontSize: '1.05rem', lineHeight: '1.7' } }, 'Google core web vitals ko prortize karta hai. Humari SEO architecture clean schemas aur metadata integration ke sath aati hai taake aapki platform search terms par organic top rankings hasil kar sake.')
                    ),
                    // SEO Dashboard Graphic Frame
                    React.createElement('div', { style: { flex: '1 1 450px', height: '260px', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(0, 224, 140, 0.1), rgba(0, 242, 254, 0.05))', border: '1px solid rgba(255,255,255,0.1)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' } },
                        React.createElement('div', { style: { width: '80%', height: '70%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '20px' } },
                            React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', color: '#00e28c', fontWeight: 'bold' } },
                                React.createElement('span', null, '🔍 SEO Core Audit'),
                                React.createElement('span', null, '100% Score')
                            ),
                            React.createElement('div', { style: { marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' } },
                                React.createElement('div', { style: { color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' } }, '✓ Sitemap.xml Indexed'),
                                React.createElement('div', { style: { color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' } }, '✓ Schema Markup Injected'),
                                React.createElement('div', { style: { color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' } }, '✓ Ultra-Low LCP Speed Passed')
                            )
                        )
                    )
                )
            ),

            // 🎯 3. ULTRA-PREMIUM QUICK NAVIGATION CARDS GRID (Bespoke Portal Hub)
            React.createElement('div', {
                style: {
                    width: '100%',
                    maxWidth: '1140px',
                    textAlign: 'left',
                    marginBottom: '35px',
                    position: 'relative'
                }
            },
                // Injecting Individual Card Glow Animations & Micro-Interactions
                React.createElement('style', null, `
                    .premium-portal-card {
                        transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
                        cursor: pointer;
                        position: relative;
                        overflow: hidden;
                    }
                    .premium-portal-card .arrow-shift {
                        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                        display: inline-block;
                    }
                    
                    /* Individual Hover Engine for unique brand glows */
                    .portal-services:hover {
                        transform: translateY(-8px) scale(1.015);
                        border-color: rgba(0, 242, 254, 0.4) !important;
                        box-shadow: 0 25px 50px rgba(0, 242, 254, 0.14), inset 0 1px 15px rgba(0, 242, 254, 0.05) !important;
                        background: linear-gradient(135deg, rgba(0, 242, 254, 0.06), rgba(255,255,255,0.02)) !important;
                    }
                    .portal-portfolio:hover {
                        transform: translateY(-8px) scale(1.015);
                        border-color: rgba(255, 0, 128, 0.4) !important;
                        box-shadow: 0 25px 50px rgba(255, 0, 128, 0.14), inset 0 1px 15px rgba(255, 0, 128, 0.05) !important;
                        background: linear-gradient(135deg, rgba(255, 0, 128, 0.06), rgba(255,255,255,0.02)) !important;
                    }
                    .portal-marketplace:hover {
                        transform: translateY(-8px) scale(1.015);
                        border-color: rgba(0, 224, 140, 0.4) !important;
                        box-shadow: 0 25px 50px rgba(0, 224, 140, 0.14), inset 0 1px 15px rgba(0, 224, 140, 0.05) !important;
                        background: linear-gradient(135deg, rgba(0, 224, 140, 0.06), rgba(255,255,255,0.02)) !important;
                    }
                    .portal-jobs:hover {
                        transform: translateY(-8px) scale(1.015);
                        border-color: rgba(255, 189, 46, 0.4) !important;
                        box-shadow: 0 25px 50px rgba(255, 189, 46, 0.14), inset 0 1px 15px rgba(255, 189, 46, 0.05) !important;
                        background: linear-gradient(135deg, rgba(255, 189, 46, 0.06), rgba(255,255,255,0.02)) !important;
                    }

                    /* Arrow trigger on card hover */
                    .premium-portal-card:hover .arrow-shift {
                        transform: translateX(6px);
                    }
                `),

                // Section Header Details
                React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' } },
                    React.createElement('span', { style: { width: '8px', height: '8px', borderRadius: '50%', background: 'linear-gradient(90deg, #00f2fe, #ff0080)' } }),
                    React.createElement('h2', { style: { color: '#fff', fontSize: '2.2rem', fontWeight: '900', margin: '0', letterSpacing: '-0.5px' } }, 'Quick Portals')
                ),
                React.createElement('p', { style: { color: 'rgba(255,255,255,0.45)', margin: '0 0 35px 0', fontSize: '1.05rem', fontWeight: '400' } }, 'Directly navigate to specific hub segments inside the Apex Code architecture.')
            ),

            React.createElement('div', {
                style: {
                    display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'center',
                    width: '100%', maxWidth: '1140px', marginBottom: '60px'
                }
            },

                // 💎 Card 1: Services (Cyan Glow Theme)
                React.createElement('div', {
                    onClick: toServices,
                    className: 'premium-portal-card portal-services',
                    style: {
                        flex: '1 1 250px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
                        borderRadius: '22px', padding: '35px 28px', backdropFilter: 'blur(15px)',
                        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1)'
                    }
                },
                    // Micro-indicator Bar
                    React.createElement('div', { style: { width: '35px', height: '4px', background: '#00f2fe', borderRadius: '10px', marginBottom: '20px' } }),
                    React.createElement('h4', { style: { color: '#fff', margin: '0 0 10px 0', fontSize: '1.25rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' } },
                        'Explore Services ',
                        React.createElement('span', { className: 'arrow-shift', style: { color: '#00f2fe' } }, '→')
                    ),
                    React.createElement('p', { style: { color: 'rgba(255,255,255,0.5)', margin: '0', fontSize: '0.9rem', lineHeight: '1.6' } }, 'View professional packages for production-grade development, deep technical SEO, and ad scaling workflows.')
                ),

                // 💎 Card 2: Portfolio (Pink Glow Theme)
                React.createElement('div', {
                    onClick: toPortfolio,
                    className: 'premium-portal-card portal-portfolio',
                    style: {
                        flex: '1 1 250px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
                        borderRadius: '22px', padding: '35px 28px', backdropFilter: 'blur(15px)',
                        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1)'
                    }
                },
                    // Micro-indicator Bar
                    React.createElement('div', { style: { width: '35px', height: '4px', background: '#ff0080', borderRadius: '10px', marginBottom: '20px' } }),
                    React.createElement('h4', { style: { color: '#fff', margin: '0 0 10px 0', fontSize: '1.25rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' } },
                        'Our Portfolio ',
                        React.createElement('span', { className: 'arrow-shift', style: { color: '#ff0080' } }, '→')
                    ),
                    React.createElement('p', { style: { color: 'rgba(255,255,255,0.5)', margin: '0', fontSize: '0.9rem', lineHeight: '1.6' } }, 'Inspect our live production systems, case studies, and corporate engineering deployments across global sectors.')
                ),

                // 💎 Card 3: Marketplace (Emerald Glow Theme)
                React.createElement('div', {
                    onClick: toWebsitesForSale,
                    className: 'premium-portal-card portal-marketplace',
                    style: {
                        flex: '1 1 250px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
                        borderRadius: '22px', padding: '35px 28px', backdropFilter: 'blur(15px)',
                        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1)'
                    }
                },
                    // Micro-indicator Bar
                    React.createElement('div', { style: { width: '35px', height: '4px', background: '#00e28c', borderRadius: '10px', marginBottom: '20px' } }),
                    React.createElement('h4', { style: { color: '#fff', margin: '0 0 10px 0', fontSize: '1.25rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' } },
                        'Marketplace ',
                        React.createElement('span', { className: 'arrow-shift', style: { color: '#00e28c' } }, '→')
                    ),
                    React.createElement('p', { style: { color: 'rgba(255,255,255,0.5)', margin: '0', fontSize: '0.9rem', lineHeight: '1.6' } }, 'Acquire ready-to-monetize assets, pre-built premium templates, and fully functional systems instantly.')
                ),

                // 💎 Card 4: Career Hub (Amber Glow Theme)
                React.createElement('div', {
                    onClick: () => setCurrentPage('available-jobs'),
                    className: 'premium-portal-card portal-jobs',
                    style: {
                        flex: '1 1 250px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
                        borderRadius: '22px', padding: '35px 28px', backdropFilter: 'blur(15px)',
                        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1)'
                    }
                },
                    // Micro-indicator Bar
                    React.createElement('div', { style: { width: '35px', height: '4px', background: '#ffbd2e', borderRadius: '10px', marginBottom: '20px' } }),
                    React.createElement('h4', { style: { color: '#fff', margin: '0 0 10px 0', fontSize: '1.25rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' } },
                        'Career Hub ',
                        React.createElement('span', { className: 'arrow-shift', style: { color: '#ffbd2e' } }, '→')
                    ),
                    React.createElement('p', { style: { color: 'rgba(255,255,255,0.5)', margin: '0', fontSize: '0.9rem', lineHeight: '1.6' } }, 'Join Apex Code. Explore production-level developer trajectories, engineering ecosystems, and available roles.')
                ),
                // 🌌 4. EXTRA MOTION-EFFECT DETAIL SECTION (Fully English & Customizable)
                React.createElement('div', {
                    style: {
                        width: '100%',
                        maxWidth: '1140px',
                        marginTop: '80px',
                        padding: '40px 20px',
                        textAlign: 'center',
                        position: 'relative'
                    }
                },
                    // Injecting Dynamic Text & Shape Motion Keyframes
                    React.createElement('style', null, `
                    @keyframes textGradientShift {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }
                    @keyframes waveMotion {
                        0% { transform: translateY(0px) scale(1); }
                        50% { transform: translateY(-8px) scale(1.01); }
                        100% { transform: translateY(0px) scale(1); }
                    }
                    @keyframes gridGlowMove {
                        0% { opacity: 0.3; transform: scale(0.98); }
                        50% { opacity: 0.6; transform: scale(1.02); }
                        100% { opacity: 0.3; transform: scale(0.98); }
                    }
                    
                    /* CSS Classes for Automatic Motion Triggers */
                    .moving-neon-text {
                        background: linear-gradient(90deg, #00f2fe, #ff0080, #ffbd2e, #00f2fe);
                        background-size: 300% 300%;
                        animation: textGradientShift 8s linear infinite;
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                    }
                    .wave-text-block-1 { animation: waveMotion 5s ease-in-out infinite; }
                    .wave-text-block-2 { animation: waveMotion 5s ease-in-out infinite; animation-delay: -2.5s; }
                    
                    .premium-grid-bg {
                        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                        background-image: radial-gradient(rgba(255,255,255,0.015) 1px, transparent 0);
                        background-size: 24px 24px;
                        animation: gridGlowMove 10s ease-in-out infinite;
                        pointer-events: none; z-index: 0;
                    }
                `),

                    // Subtle Background Grid Effect
                    React.createElement('div', { className: 'premium-grid-bg' }),

                    // Moving Animated Core Title
                    React.createElement('h2', {
                        className: 'moving-neon-text',
                        style: {
                            fontSize: '2.5rem',
                            fontWeight: '900',
                            marginBottom: '15px',
                            letterSpacing: '-0.5px'
                        }
                    }, 'Our Philosophy & Engineering Standards'),

                    React.createElement('p', {
                        style: { color: 'rgba(255,255,255,0.4)', maxWidth: '650px', margin: '0 auto 50px auto', fontSize: '1rem', lineHeight: '1.6' }
                    }, 'We refine every line of code to ensure your digital ecosystem operates with maximum scalability, absolute security, and peak performance standards.'),

                    // 2-Column Floating Detail Structure
                    React.createElement('div', {
                        style: {
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '30px',
                            justifyContent: 'center',
                            position: 'relative',
                            zIndex: '1'
                        }
                    },
                        // Left Floating Detail Block
                        React.createElement('div', {
                            className: 'wave-text-block-1',
                            style: {
                                flex: '1 1 450px',
                                background: 'rgba(255, 255, 255, 0.01)',
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                borderRadius: '24px',
                                padding: '35px',
                                textAlign: 'left',
                                backdropFilter: 'blur(5px)'
                            }
                        },
                            React.createElement('span', { style: { fontSize: '0.8rem', color: '#00f2fe', fontWeight: '800', letterSpacing: '2px', display: 'block', marginBottom: '10px' } }, '01 / TECHNICAL INFRASTRUCTURE'),
                            React.createElement('h3', { style: { color: '#fff', fontSize: '1.4rem', margin: '0 0 12px 0', fontWeight: '700' } }, 'Next-Gen Core Optimization'),
                            React.createElement('p', { style: { color: 'rgba(255,255,255,0.55)', fontSize: '0.95rem', lineHeight: '1.7', margin: '0' } }, 'Feel free to modify this text as needed. Apex Code monitors every digital asset based on absolute rendering parameters to keep bounce rates exceptionally low and processing speeds lightning fast.')
                        ),

                        // Right Floating Detail Block (Out of sync delay for natural wave look)
                        React.createElement('div', {
                            className: 'wave-text-block-2',
                            style: {
                                flex: '1 1 450px',
                                background: 'rgba(255, 255, 255, 0.01)',
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                borderRadius: '24px',
                                padding: '35px',
                                textAlign: 'left',
                                backdropFilter: 'blur(5px)'
                            }
                        },
                            React.createElement('span', { style: { fontSize: '0.8rem', color: '#ff0080', fontWeight: '800', letterSpacing: '2px', display: 'block', marginBottom: '10px' } }, '02 / REVENUE STRATEGY'),
                            React.createElement('h3', { style: { color: '#fff', fontSize: '1.4rem', margin: '0 0 12px 0', fontWeight: '700' } }, 'Algorithmic Ad Optimization'),
                            React.createElement('p', { style: { color: 'rgba(255,255,255,0.55)', fontSize: '0.95rem', lineHeight: '1.7', margin: '0' } }, 'Customize this section to match your voice. We build complex script delivery mechanics that maintain high CPM yield triggers and stable ad viewability even under constrained network conditions.')
                        )
                    )
                ),
                // 🎛️ 5. ULTRA-PREMIUM ECOSYSTEM ACTION DIRECTORY (WITH EMBEDDED IMAGE MOCKUPS)
                React.createElement('div', {
                    style: {
                        width: '100%',
                        maxWidth: '1140px',
                        marginTop: '90px',
                        padding: '60px 30px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                        position: 'relative',
                        textAlign: 'left'
                    }
                },
                    // Injecting Hyper-Premium Glassmorphism Glow States & Button Mechanics
                    React.createElement('style', null, `
                    .action-directory-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
                        gap: 25px;
                        width: 100%;
                        margin-top: 40px;
                    }
                    .action-detail-card {
                        background: rgba(255, 255, 255, 0.01);
                        border: 1px solid rgba(255, 255, 255, 0.04);
                        border-radius: 24px;
                        padding: 25px;
                        transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                        position: relative;
                        overflow: hidden;
                        backdrop-filter: blur(20px);
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                    }
                    .action-detail-card:hover {
                        transform: translateY(-6px);
                        background: rgba(255, 255, 255, 0.02);
                    }
                    
                    /* Dynamic Indicator Badges */
                    .badge-glow-cyan { box-shadow: 0 0 15px rgba(0, 242, 254, 0.3); }
                    .badge-glow-pink { box-shadow: 0 0 15px rgba(255, 0, 128, 0.3); }
                    .badge-glow-emerald { box-shadow: 0 0 15px rgba(0, 224, 140, 0.3); }
                    .badge-glow-amber { box-shadow: 0 0 15px rgba(255, 189, 46, 0.3); }

                    /* Inline Core Buttons Micro-interactions */
                    .inline-action-btn {
                        transition: all 0.3s ease;
                        cursor: pointer;
                        margin-top: 15px;
                    }
                    .inline-action-btn:hover {
                        letter-spacing: 0.5px;
                        opacity: 0.9;
                    }
                    
                    /* Premium Visual Mockup (Image Representation Layer) */
                    .card-image-mockup {
                        width: 100%;
                        height: 130px;
                        border-radius: 14px;
                        margin-bottom: 20px;
                        position: relative;
                        overflow: hidden;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border: 1px solid rgba(255, 255, 255, 0.05);
                    }
                `),

                    // Section Header Typography
                    React.createElement('div', { style: { maxWidth: '700px' } },
                        React.createElement('span', { style: { color: '#ff0080', fontSize: '0.85rem', fontWeight: '800', letterSpacing: '2px', display: 'block', marginBottom: '12px' } }, 'SYSTEM ARCHITECTURE MAP'),
                        React.createElement('h2', { style: { color: '#fff', fontSize: '2.4rem', fontWeight: '900', margin: '0 0 15px 0', letterSpacing: '-0.5px' } }, 'Command Center & Navigation Directory'),
                        React.createElement('p', { style: { color: 'rgba(255,255,255,0.45)', fontSize: '1.05rem', lineHeight: '1.6', margin: '0' } }, 'A complete architectural breakdown of the key operational buttons, action parameters, and target systems configured across the Apex Code ecosystem.')
                    ),

                    // 4-Column Interactive Action Grid
                    React.createElement('div', { className: 'action-directory-grid' },

                        // 🗺️ Card 1: Services Button Details
                        React.createElement('div', { className: 'action-detail-card', style: { border: '1px solid rgba(0, 242, 254, 0.1)' } },
                            React.createElement('div', null,
                                // 🖼️ IMAGE MOCKUP: Services Feature Layout
                                React.createElement('div', {
                                    className: 'card-image-mockup',
                                    style: { background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.15), rgba(0,0,0,0.4))' }
                                },
                                    React.createElement('div', { style: { width: '85%', height: '60%', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(0, 242, 254, 0.2)' } },
                                        React.createElement('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap' } },
                                            React.createElement('div', { style: { width: '40%', height: '12px', background: '#00f2fe', borderRadius: '3px' } }),
                                            React.createElement('div', { style: { width: '30%', height: '12px', background: 'rgba(255,255,255,0.2)', borderRadius: '3px' } }),
                                            React.createElement('div', { style: { width: '20%', height: '12px', background: 'rgba(255,255,255,0.2)', borderRadius: '3px' } })
                                        ),
                                        React.createElement('div', { style: { width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', marginTop: '12px', borderRadius: '2px' } }),
                                        React.createElement('div', { style: { width: '70%', height: '4px', background: 'rgba(255,255,255,0.1)', marginTop: '6px', borderRadius: '2px' } })
                                    )
                                ),
                                React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' } },
                                    React.createElement('span', { style: { color: '#00f2fe', fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: '700' } }, 'PRIMARY CTA // 01'),
                                    React.createElement('div', { className: 'badge-glow-cyan', style: { width: '10px', height: '10px', borderRadius: '50%', background: '#00f2fe' } })
                                ),
                                React.createElement('h3', { style: { color: '#fff', fontSize: '1.25rem', fontWeight: '700', margin: '0 0 10px 0' } }, 'Explore Services'),
                                React.createElement('p', { style: { color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem', lineHeight: '1.6', margin: '0' } }, 'Triggers the main services array. Routes users to premium development architectures, automated layout indexing packages, and custom script configuration models.')
                            ),
                            React.createElement('div', {
                                onClick: toServices, className: 'inline-action-btn',
                                style: { color: '#00f2fe', fontSize: '0.85rem', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '6px' }
                            }, 'Execute Pathway toServices() →')
                        ),

                        // 🗺️ Card 2: Portfolio Button Details
                        React.createElement('div', { className: 'action-detail-card', style: { border: '1px solid rgba(255, 0, 128, 0.1)' } },
                            React.createElement('div', null,
                                // 🖼️ IMAGE MOCKUP: Portfolio Production Cases Grid
                                React.createElement('div', {
                                    className: 'card-image-mockup',
                                    style: { background: 'linear-gradient(135deg, rgba(255, 0, 128, 0.15), rgba(0,0,0,0.4))' }
                                },
                                    React.createElement('div', { style: { display: 'flex', gap: '8px', width: '85%' } },
                                        React.createElement('div', { style: { flex: '1', height: '55px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255, 0, 128, 0.2)', padding: '6px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' } },
                                            React.createElement('div', { style: { width: '100%', height: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' } }),
                                            React.createElement('div', { style: { width: '50%', height: '6px', background: '#ff0080', borderRadius: '2px' } })
                                        ),
                                        React.createElement('div', { style: { flex: '1', height: '55px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)', padding: '6px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' } },
                                            React.createElement('div', { style: { width: '100%', height: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' } }),
                                            React.createElement('div', { style: { width: '50%', height: '6px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px' } })
                                        )
                                    )
                                ),
                                React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' } },
                                    React.createElement('span', { style: { color: '#ff0080', fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: '700' } }, 'SECONDARY CTA // 02'),
                                    React.createElement('div', { className: 'badge-glow-pink', style: { width: '10px', height: '10px', borderRadius: '50%', background: '#ff0080' } })
                                ),
                                React.createElement('h3', { style: { color: '#fff', fontSize: '1.25rem', fontWeight: '700', margin: '0 0 10px 0' } }, 'View Portfolio'),
                                React.createElement('p', { style: { color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem', lineHeight: '1.6', margin: '0' } }, 'Initializes the live builds matrix. Grants stakeholders immediate analytical access to production case studies, interface configurations, and engineering systems.')
                            ),
                            React.createElement('div', {
                                onClick: toPortfolio, className: 'inline-action-btn',
                                style: { color: '#ff0080', fontSize: '0.85rem', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '6px' }
                            }, 'Execute Pathway toPortfolio() →')
                        ),

                        // 🗺️ Card 3: Marketplace Button Details
                        React.createElement('div', { className: 'action-detail-card', style: { border: '1px solid rgba(0, 224, 140, 0.1)' } },
                            React.createElement('div', null,
                                // 🖼️ IMAGE MOCKUP: Marketplace Commercial Cards
                                React.createElement('div', {
                                    className: 'card-image-mockup',
                                    style: { background: 'linear-gradient(135deg, rgba(0, 224, 140, 0.15), rgba(0,0,0,0.4))' }
                                },
                                    React.createElement('div', { style: { width: '85%', height: '60%', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(0, 224, 140, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                                        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '6px', width: '60%' } },
                                            React.createElement('div', { style: { width: '100%', height: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px' } }),
                                            React.createElement('div', { style: { width: '70%', height: '6px', background: '#00e28c', borderRadius: '2px' } })
                                        ),
                                        React.createElement('div', { style: { width: '30px', height: '20px', background: 'rgba(0, 224, 140, 0.2)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: '#00e28c', fontWeight: 'bold' } }, '$')
                                    )
                                ),
                                React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' } },
                                    React.createElement('span', { style: { color: '#00e28c', fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: '700' } }, 'COMMERCE BRIDGE // 03'),
                                    React.createElement('div', { className: 'badge-glow-emerald', style: { width: '10px', height: '10px', borderRadius: '50%', background: '#00e28c' } })
                                ),
                                React.createElement('h3', { style: { color: '#fff', fontSize: '1.25rem', fontWeight: '700', margin: '0 0 10px 0' } }, 'Marketplace Hub'),
                                React.createElement('p', { style: { color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem', lineHeight: '1.6', margin: '0' } }, 'Establishes direct link-state parameters with the active acquisition marketplace. Pulls available responsive templates and monetization assets ready for transfer.')
                            ),
                            React.createElement('div', {
                                onClick: toWebsitesForSale, className: 'inline-action-btn',
                                style: { color: '#00e28c', fontSize: '0.85rem', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '6px' }
                            }, 'Execute Pathway toWebsitesForSale() →')
                        ),

                        // 🗺️ Card 4: Jobs Button Details
                        React.createElement('div', { className: 'action-detail-card', style: { border: '1px solid rgba(255, 189, 46, 0.1)' } },
                            React.createElement('div', null,
                                // 🖼️ IMAGE MOCKUP: Career Pipeline Dashboard
                                React.createElement('div', {
                                    className: 'card-image-mockup',
                                    style: { background: 'linear-gradient(135deg, rgba(255, 189, 46, 0.15), rgba(0,0,0,0.4))' }
                                },
                                    React.createElement('div', { style: { width: '85%', height: '65%', padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255, 189, 46, 0.2)', display: 'flex', flexDirection: 'column', gap: '8px' } },
                                        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                                            React.createElement('div', { style: { width: '50%', height: '8px', background: '#ffbd2e', borderRadius: '2px' } }),
                                            React.createElement('div', { style: { width: '15%', height: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px' } })
                                        ),
                                        React.createElement('div', { style: { width: '100%', height: '2px', background: 'rgba(255,255,255,0.08)' } }),
                                        React.createElement('div', { style: { width: '80%', height: '6px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px' } }),
                                        React.createElement('div', { style: { width: '90%', height: '6px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px' } })
                                    )
                                ),
                                React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' } },
                                    React.createElement('span', { style: { color: '#ffbd2e', fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: '700' } }, 'TALENT CORRIDOR // 04'),
                                    React.createElement('div', { className: 'badge-glow-amber', style: { width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' } })
                                ),
                                React.createElement('h3', { style: { color: '#fff', fontSize: '1.25rem', fontWeight: '700', margin: '0 0 10px 0' } }, 'Career Hub'),
                                React.createElement('p', { style: { color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem', lineHeight: '1.6', margin: '0' } }, 'Modifies the root UI state variables to mount the available job pipelines. Connects engineering candidates and internship applications directly to internal nodes.')
                            ),
                            React.createElement('div', {
                                onClick: () => setCurrentPage('available-jobs'), className: 'inline-action-btn',
                                style: { color: '#ffbd2e', fontSize: '0.85rem', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '6px' }
                            }, 'Execute State modification →')
                        )
                    )
                ),
                // 🏷️ 6. APEX CODE COMPREHENSIVE TIER CATALOG (Ultra-Premium Redesign)
                React.createElement('div', {
                    style: {
                        width: '100%',
                        maxWidth: '1140px',
                        marginTop: '100px',
                        padding: '60px 20px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                        position: 'relative',
                        textAlign: 'left'
                    }
                },
                    // Highly Optimized UI Style Tokens for Grid and Cards
                    React.createElement('style', null, `
                    .catalog-suite-wrapper {
                        margin-bottom: 80px;
                    }
                    .tier-responsive-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                        gap: 28px;
                        margin-top: 30px;
                    }
                    .premium-suite-card {
                        background: linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.005));
                        border: 1px solid rgba(255, 255, 255, 0.05);
                        border-radius: 24px;
                        padding: 40px 30px;
                        backdrop-filter: blur(25px);
                        -webkit-backdrop-filter: blur(25px);
                        transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        position: relative;
                        box-shadow: inset 0 1px 1px rgba(255,255,255,0.05);
                    }
                    
                    /* Dynamic Theme Hover Mechanics with Soft Ambient Shadows */
                    .card-suite-code:hover {
                        transform: translateY(-8px);
                        border-color: rgba(0, 242, 254, 0.4) !important;
                        box-shadow: 0 30px 60px rgba(0, 242, 254, 0.12), inset 0 1px 10px rgba(0, 242, 254, 0.05) !important;
                    }
                    .card-suite-wp:hover {
                        transform: translateY(-8px);
                        border-color: rgba(255, 0, 128, 0.4) !important;
                        box-shadow: 0 30px 60px rgba(255, 0, 128, 0.12), inset 0 1px 10px rgba(255, 0, 128, 0.05) !important;
                    }
                    .card-suite-seo:hover {
                        transform: translateY(-8px);
                        border-color: rgba(0, 224, 140, 0.4) !important;
                        box-shadow: 0 30px 60px rgba(0, 224, 140, 0.12), inset 0 1px 10px rgba(0, 224, 140, 0.05) !important;
                    }
                    .card-suite-ads:hover {
                        transform: translateY(-8px);
                        border-color: rgba(255, 189, 46, 0.4) !important;
                        box-shadow: 0 30px 60px rgba(255, 189, 46, 0.12), inset 0 1px 10px rgba(255, 189, 46, 0.05) !important;
                    }

                    /* Feature List Item Typography */
                    .suite-feature-item {
                        color: rgba(255, 255, 255, 0.55);
                        font-size: 0.92rem;
                        line-height: 1.5;
                        margin-bottom: 12px;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }
                `),

                    // Core Layout Header
                    React.createElement('div', { style: { maxWidth: '750px', marginBottom: '60px' } },
                        React.createElement('span', { style: { color: '#00f2fe', fontSize: '0.85rem', fontWeight: '800', letterSpacing: '2.5px', display: 'block', marginBottom: '12px' } }, 'COMMERCIAL MATRIX'),
                        React.createElement('h2', { style: { color: '#fff', fontSize: '2.6rem', fontWeight: '900', margin: '0 0 15px 0', letterSpacing: '-0.5px' } }, 'Service Tiers & Pricing Specs'),
                        React.createElement('p', { style: { color: 'rgba(255,255,255,0.45)', fontSize: '1.05rem', lineHeight: '1.6', margin: '0' } }, 'Transparent financial models scaled precisely for engineering parameters, optimization audits, and high-performance monetization setups.')
                    ),

                    // ==========================================
                    // 💻 SECTION 1: CUSTOM CODE BASE
                    // ==========================================
                    React.createElement('div', { className: 'catalog-suite-wrapper' },
                        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '15px' } },
                            React.createElement('span', { style: { width: '6px', height: '18px', borderRadius: '2px', background: '#00f2fe' } }),
                            React.createElement('h3', { style: { color: '#fff', fontSize: '1.5rem', fontWeight: '800', margin: '0' } }, 'Custom Code-Base Architectures')
                        ),
                        React.createElement('div', { className: 'tier-responsive-grid' },

                            // Basic Code (50K)
                            React.createElement('div', { className: 'premium-suite-card card-suite-code' },
                                React.createElement('div', null,
                                    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                                        React.createElement('span', { style: { color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '1px' } }, '01 / ESSENTIALS'),
                                        React.createElement('span', { style: { color: '#00f2fe', background: 'rgba(0, 242, 254, 0.08)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700' } }, 'BASIC')
                                    ),
                                    React.createElement('div', { style: { margin: '25px 0 15px 0', display: 'flex', alignItems: 'baseline', gap: '6px' } },
                                        React.createElement('span', { style: { color: '#fff', fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-1px' } }, '50,000'),
                                        React.createElement('span', { style: { color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem', fontWeight: '600' } }, 'PKR')
                                    ),
                                    React.createElement('div', { style: { height: '1px', background: 'rgba(255,255,255,0.06)', margin: '20px 0' } }),
                                    React.createElement('div', { className: 'suite-feature-item' }, React.createElement('span', { style: { color: '#00f2fe' } }, '✦'), 'Core React Core Infrastructure Setup'),
                                    React.createElement('div', { className: 'suite-feature-item' }, React.createElement('span', { style: { color: '#00f2fe' } }, '✦'), 'Fully Responsive UI Layout'),
                                    React.createElement('div', { className: 'suite-feature-item' }, React.createElement('span', { style: { color: '#00f2fe' } }, '✦'), 'Production Repository Deployment')
                                )
                            ),

                            // Standard Code (100K)
                            React.createElement('div', { className: 'premium-suite-card card-suite-code', style: { borderColor: 'rgba(0, 242, 254, 0.15)' } },
                                React.createElement('div', null,
                                    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                                        React.createElement('span', { style: { color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '1px' } }, '02 / SCALED SYSTEM'),
                                        React.createElement('span', { style: { color: '#00f2fe', background: 'rgba(0, 242, 254, 0.15)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700' } }, 'STANDARD')
                                    ),
                                    React.createElement('div', { style: { margin: '25px 0 15px 0', display: 'flex', alignItems: 'baseline', gap: '6px' } },
                                        React.createElement('span', { style: { color: '#fff', fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-1px' } }, '100,000'),
                                        React.createElement('span', { style: { color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem', fontWeight: '600' } }, 'PKR')
                                    ),
                                    React.createElement('div', { style: { height: '1px', background: 'rgba(255,255,255,0.06)', margin: '20px 0' } }),
                                    React.createElement('div', { className: 'suite-feature-item' }, React.createElement('span', { style: { color: '#00f2fe' } }, '✦'), 'Full Next.js SSR Framework Ecosystem'),
                                    React.createElement('div', { className: 'suite-feature-item' }, React.createElement('span', { style: { color: '#00f2fe' } }, '✦'), 'Relational/NoSQL Database Mapping'),
                                    React.createElement('div', { className: 'suite-feature-item' }, React.createElement('span', { style: { color: '#00f2fe' } }, '✦'), 'Centralized API Endpoints Integration')
                                )
                            ),

                            // Premium Code (200K)
                            React.createElement('div', { className: 'premium-suite-card card-suite-code' },
                                React.createElement('div', null,
                                    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                                        React.createElement('span', { style: { color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '1px' } }, '03 / ENTERPRISE MAP'),
                                        React.createElement('span', { style: { color: '#00f2fe', background: 'rgba(0, 242, 254, 0.08)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700' } }, 'PREMIUM')
                                    ),
                                    React.createElement('div', { style: { margin: '25px 0 15px 0', display: 'flex', alignItems: 'baseline', gap: '6px' } },
                                        React.createElement('span', { style: { color: '#fff', fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-1px' } }, '200,000'),
                                        React.createElement('span', { style: { color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem', fontWeight: '600' } }, 'PKR')
                                    ),
                                    React.createElement('div', { style: { height: '1px', background: 'rgba(255,255,255,0.06)', margin: '20px 0' } }),
                                    React.createElement('div', { className: 'suite-feature-item' }, React.createElement('span', { style: { color: '#00f2fe' } }, '✦'), 'Enterprise Serverless Infrastructure'),
                                    React.createElement('div', { className: 'suite-feature-item' }, React.createElement('span', { style: { color: '#00f2fe' } }, '✦'), 'Multi-Node Database Real-Time Sync'),
                                    React.createElement('div', { className: 'suite-feature-item' }, React.createElement('span', { style: { color: '#00f2fe' } }, '✦'), 'Bespoke Custom Logic Rendering Layers')
                                )
                            )
                        )
                    ),

                    // ==========================================
                    // 🌸 SECTION 2: WORDPRESS SYSTEMS
                    // ==========================================
                    React.createElement('div', { className: 'catalog-suite-wrapper' },
                        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '15px' } },
                            React.createElement('span', { style: { width: '6px', height: '18px', borderRadius: '2px', background: '#ff0080' } }),
                            React.createElement('h3', { style: { color: '#fff', fontSize: '1.5rem', fontWeight: '800', margin: '0' } }, 'WordPress Ecosystem Deployments')
                        ),
                        React.createElement('div', { className: 'tier-responsive-grid' },

                            // Basic WordPress (35K)
                            React.createElement('div', { className: 'premium-suite-card card-suite-wp' },
                                React.createElement('div', null,
                                    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                                        React.createElement('span', { style: { color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '1px' } }, '01 / SYSTEM MAPPING'),
                                        React.createElement('span', { style: { color: '#ff0080', background: 'rgba(255, 0, 128, 0.08)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700' } }, 'BASIC')
                                    ),
                                    React.createElement('div', { style: { margin: '25px 0 15px 0', display: 'flex', alignItems: 'baseline', gap: '6px' } },
                                        React.createElement('span', { style: { color: '#fff', fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-1px' } }, '35,000'),
                                        React.createElement('span', { style: { color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem', fontWeight: '600' } }, 'PKR')
                                    ),
                                    React.createElement('div', { style: { height: '1px', background: 'rgba(255,255,255,0.06)', margin: '20px 0' } }),
                                    React.createElement('div', { className: 'suite-feature-item' }, React.createElement('span', { style: { color: '#ff0080' } }, '✦'), 'Bespoke Corporate Layout Mapping'),
                                    React.createElement('div', { className: 'suite-feature-item' }, React.createElement('span', { style: { color: '#ff0080' } }, '✦'), 'Essential Core Theme Configuration'),
                                    React.createElement('div', { className: 'suite-feature-item' }, React.createElement('span', { style: { color: '#ff0080' } }, '✦'), 'Primary Security Plugin Tuning')
                                )
                            ),

                            // Standard WordPress (75K)
                            React.createElement('div', { className: 'premium-suite-card card-suite-wp', style: { borderColor: 'rgba(255, 0, 128, 0.15)' } },
                                React.createElement('div', null,
                                    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                                        React.createElement('span', { style: { color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '1px' } }, '02 / BUSINESS EDGE'),
                                        React.createElement('span', { style: { color: '#ff0080', background: 'rgba(255, 0, 128, 0.15)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700' } }, 'STANDARD')
                                    ),
                                    React.createElement('div', { style: { margin: '25px 0 15px 0', display: 'flex', alignItems: 'baseline', gap: '6px' } },
                                        React.createElement('span', { style: { color: '#fff', fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-1px' } }, '75,000'),
                                        React.createElement('span', { style: { color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem', fontWeight: '600' } }, 'PKR')
                                    ),
                                    React.createElement('div', { style: { height: '1px', background: 'rgba(255,255,255,0.06)', margin: '20px 0' } }),
                                    React.createElement('div', { className: 'suite-feature-item' }, React.createElement('span', { style: { color: '#ff0080' } }, '✦'), 'Complete Commercial Business Portal'),
                                    React.createElement('div', { className: 'suite-feature-item' }, React.createElement('span', { style: { color: '#ff0080' } }, '✦'), 'Advanced Structural Speed-Cache Controls'),
                                    React.createElement('div', { className: 'suite-feature-item' }, React.createElement('span', { style: { color: '#ff0080' } }, '✦'), 'Multi-Tier CRM Contact Routing')
                                )
                            ),

                            // Premium WordPress (150K)
                            React.createElement('div', { className: 'premium-suite-card card-suite-wp' },
                                React.createElement('div', null,
                                    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                                        React.createElement('span', { style: { color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '1px' } }, '03 / HIGH-VOLUME SHOP'),
                                        React.createElement('span', { style: { color: '#ff0080', background: 'rgba(255, 0, 128, 0.08)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700' } }, 'PREMIUM')
                                    ),
                                    React.createElement('div', { style: { margin: '25px 0 15px 0', display: 'flex', alignItems: 'baseline', gap: '6px' } },
                                        React.createElement('span', { style: { color: '#fff', fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-1px' } }, '150,000'),
                                        React.createElement('span', { style: { color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem', fontWeight: '600' } }, 'PKR')
                                    ),
                                    React.createElement('div', { style: { height: '1px', background: 'rgba(255,255,255,0.06)', margin: '20px 0' } }),
                                    React.createElement('div', { className: 'suite-feature-item' }, React.createElement('span', { style: { color: '#ff0080' } }, '✦'), 'Enterprise WooCommerce Integration'),
                                    React.createElement('div', { className: 'suite-feature-item' }, React.createElement('span', { style: { color: '#ff0080' } }, '✦'), 'Headless Content Delivery Tuning'),
                                    React.createElement('div', { className: 'suite-feature-item' }, React.createElement('span', { style: { color: '#ff0080' } }, '✦'), 'Bespoke Block Modifier Optimization')
                                )
                            )
                        )
                    ),

                    // ==========================================
                    // ✳️ SECTION 3: TECHNICAL SEO
                    // ==========================================
                    React.createElement('div', { className: 'catalog-suite-wrapper' },
                        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '15px' } },
                            React.createElement('span', { style: { width: '6px', height: '18px', borderRadius: '2px', background: '#00e28c' } }),
                            React.createElement('h3', { style: { color: '#fff', fontSize: '1.5rem', fontWeight: '800', margin: '0' } }, 'Technical SEO Optimizations')
                        ),
                        React.createElement('div', { className: 'tier-responsive-grid' },

                            // Basic SEO (15K)
                            React.createElement('div', { className: 'premium-suite-card card-suite-seo' },
                                React.createElement('div', null,
                                    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                                        React.createElement('span', { style: { color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '1px' } }, '01 / STRUCTURE'),
                                        React.createElement('span', { style: { color: '#00e28c', background: 'rgba(0, 224, 140, 0.08)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700' } }, 'BASIC')
                                    ),
                                    React.createElement('div', { style: { margin: '25px 0 15px 0', display: 'flex', alignItems: 'baseline', gap: '6px' } },
                                        React.createElement('span', { style: { color: '#fff', fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-1px' } }, '15,000'),
                                        React.createElement('span', { style: { color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem', fontWeight: '600' } }, 'PKR')
                                    ),
                                    React.createElement('div', { style: { height: '1px', background: 'rgba(255,255,255,0.06)', margin: '20px 0' } }),
                                    React.createElement('div', { className: 'suite-feature-item' }, React.createElement('span', { style: { color: '#00e28c' } }, '✦'), 'On-Page HTML Tagging Structure Setup'),
                                    React.createElement('div', { className: 'suite-feature-item' }, React.createElement('span', { style: { color: '#00e28c' } }, '✦'), 'Metadata Optimization & Architecture Audit'),
                                    React.createElement('div', { className: 'suite-feature-item' }, React.createElement('span', { style: { color: '#00e28c' } }, '✦'), 'Search Console & Sitemap Mapping')
                                )
                            ),

                            // Standard SEO (30K)
                            React.createElement('div', { className: 'premium-suite-card card-suite-seo', style: { borderColor: 'rgba(0, 224, 140, 0.15)' } },
                                React.createElement('div', null,
                                    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                                        React.createElement('span', { style: { color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '1px' } }, '02 / RANK ACCELERATION'),
                                        React.createElement('span', { style: { color: '#00e28c', background: 'rgba(0, 224, 140, 0.15)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700' } }, 'STANDARD')
                                    ),
                                    React.createElement('div', { style: { margin: '25px 0 15px 0', display: 'flex', alignItems: 'baseline', gap: '6px' } },
                                        React.createElement('span', { style: { color: '#fff', fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-1px' } }, '30,000'),
                                        React.createElement('span', { style: { color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem', fontWeight: '600' } }, 'PKR')
                                    ),
                                    React.createElement('div', { style: { height: '1px', background: 'rgba(255,255,255,0.06)', margin: '20px 0' } }),
                                    React.createElement('div', { className: 'suite-feature-item' }, React.createElement('span', { style: { color: '#00e28c' } }, '✦'), 'Deep Structural Technical Auditing'),
                                    React.createElement('div', { className: 'suite-feature-item' }, React.createElement('span', { style: { color: '#00e28c' } }, '✦'), 'Competitor Keyword Gap Indexing'),
                                    React.createElement('div', { className: 'suite-feature-item' }, React.createElement('span', { style: { color: '#00e28c' } }, '✦'), 'Core Web Vitals & Speed Repair Arrays')
                                )
                            ),

                            // Premium SEO (50K)
                            React.createElement('div', { className: 'premium-suite-card card-suite-seo' },
                                React.createElement('div', null,
                                    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                                        React.createElement('span', { style: { color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '1px' } }, '03 / DOMINANCE'),
                                        React.createElement('span', { style: { color: '#00e28c', background: 'rgba(0, 224, 140, 0.08)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700' } }, 'PREMIUM')
                                    ),
                                    React.createElement('div', { style: { margin: '25px 0 15px 0', display: 'flex', alignItems: 'baseline', gap: '6px' } },
                                        React.createElement('span', { style: { color: '#fff', fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-1px' } }, '50,000'),
                                        React.createElement('span', { style: { color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem', fontWeight: '600' } }, 'PKR')
                                    ),
                                    React.createElement('div', { style: { height: '1px', background: 'rgba(255,255,255,0.06)', margin: '20px 0' } }),
                                    React.createElement('div', { className: 'suite-feature-item' }, React.createElement('span', { style: { color: '#00e28c' } }, '✦'), 'Programmatic SEO Framework Scaling'),
                                    React.createElement('div', { className: 'suite-feature-item' }, React.createElement('span', { style: { color: '#00e28c' } }, '✦'), 'Systemic Topical Cluster Workflow Mapping'),
                                    React.createElement('div', { className: 'suite-feature-item' }, React.createElement('span', { style: { color: '#00e28c' } }, '✦'), 'Backlink Architecture Validation Engines')
                                )
                            )
                        )
                    ),

                    // ==========================================
                    // 💛 SECTION 4: AD NETWORKS
                    // ==========================================
                    React.createElement('div', { className: 'catalog-suite-wrapper', style: { marginBottom: '0' } },
                        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '15px' } },
                            React.createElement('span', { style: { width: '6px', height: '18px', borderRadius: '2px', background: '#ffbd2e' } }),
                            React.createElement('h3', { style: { color: '#fff', fontSize: '1.5rem', fontWeight: '800', margin: '0' } }, 'Ad Monetization & Yield Scaling')
                        ),
                        React.createElement('div', { className: 'tier-responsive-grid' },

                            // Basic Ads (10K)
                            React.createElement('div', { className: 'premium-suite-card card-suite-ads' },
                                React.createElement('div', null,
                                    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                                        React.createElement('span', { style: { color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '1px' } }, '01 / SLOTS CONFIG'),
                                        React.createElement('span', { style: { color: '#ffbd2e', background: 'rgba(255, 189, 46, 0.08)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700' } }, 'BASIC')
                                    ),
                                    React.createElement('div', { style: { margin: '25px 0 15px 0', display: 'flex', alignItems: 'baseline', gap: '6px' } },
                                        React.createElement('span', { style: { color: '#fff', fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-1px' } }, '10,000'),
                                        React.createElement('span', { style: { color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem', fontWeight: '600' } }, 'PKR')
                                    ),
                                    React.createElement('div', { style: { height: '1px', background: 'rgba(255,255,255,0.06)', margin: '20px 0' } }),
                                    React.createElement('div', { className: 'suite-feature-item' }, React.createElement('span', { style: { color: '#ffbd2e' } }, '✦'), 'Standard Ad Unit Placement Mapping'),
                                    React.createElement('div', { className: 'suite-feature-item' }, React.createElement('span', { style: { color: '#ffbd2e' } }, '✦'), 'Basic Script Tracking Ingestion Layers'),
                                    React.createElement('div', { className: 'suite-feature-item' }, React.createElement('span', { style: { color: '#ffbd2e' } }, '✦'), 'Performance Integration Config Tuning')
                                )
                            ),

                            // Standard Ads (20K)
                            React.createElement('div', { className: 'premium-suite-card card-suite-ads', style: { borderColor: 'rgba(255, 189, 46, 0.15)' } },
                                React.createElement('div', null,
                                    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                                        React.createElement('span', { style: { color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '1px' } }, '02 / YIELD OPTIMIZATION'),
                                        React.createElement('span', { style: { color: '#ffbd2e', background: 'rgba(255, 189, 46, 0.15)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700' } }, 'STANDARD')
                                    ),
                                    React.createElement('div', { style: { margin: '25px 0 15px 0', display: 'flex', alignItems: 'baseline', gap: '6px' } },
                                        React.createElement('span', { style: { color: '#fff', fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-1px' } }, '20,000'),
                                        React.createElement('span', { style: { color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem', fontWeight: '600' } }, 'PKR')
                                    ),
                                    React.createElement('div', { style: { height: '1px', background: 'rgba(255,255,255,0.06)', margin: '20px 0' } }),
                                    React.createElement('div', { className: 'suite-feature-item' }, React.createElement('span', { style: { color: '#ffbd2e' } }, '✦'), 'High-Yield Dynamic Monetization Layouts'),
                                    React.createElement('div', { className: 'suite-feature-item' }, React.createElement('span', { style: { color: '#ffbd2e' } }, '✦'), 'Optimized Script Delivery Infrastructure'),
                                    React.createElement('div', { className: 'suite-feature-item' }, React.createElement('span', { style: { color: '#ffbd2e' } }, '✦'), 'Primary Anti-Block Delivery Hooks Setup')
                                )
                            ),

                            // Premium Ads (35K)
                            React.createElement('div', { className: 'premium-suite-card card-suite-ads' },
                                React.createElement('div', null,
                                    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                                        React.createElement('span', { style: { color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '1px' } }, '03 / REVENUE ALGORITHMS'),
                                        React.createElement('span', { style: { color: '#ffbd2e', background: 'rgba(255, 189, 46, 0.08)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700' } }, 'PREMIUM')
                                    ),
                                    React.createElement('div', { style: { margin: '25px 0 15px 0', display: 'flex', alignItems: 'baseline', gap: '6px' } },
                                        React.createElement('span', { style: { color: '#fff', fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-1px' } }, '35,000'),
                                        React.createElement('span', { style: { color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem', fontWeight: '600' } }, 'PKR')
                                    ),
                                    React.createElement('div', { style: { height: '1px', background: 'rgba(255,255,255,0.06)', margin: '20px 0' } }),
                                    React.createElement('div', { className: 'suite-feature-item' }, React.createElement('span', { style: { color: '#ffbd2e' } }, '✦'), 'Complex Dynamic Multi-Network Scripts Injection'),
                                    React.createElement('div', { className: 'suite-feature-item' }, React.createElement('span', { style: { color: '#ffbd2e' } }, '✦'), 'Real-Time Algorithmic Yield Triggers Setup'),
                                    React.createElement('div', { className: 'suite-feature-item' }, React.createElement('span', { style: { color: '#ffbd2e' } }, '✦'), 'Absolute Code Execution Tuning & Script Audits')
                                )
                            )
                        )
                    )
                ),
                // 🏷️ 7. APEX CODE HYPER-GLOWING STRATEGIC BLUEPRINT MATRIX
                React.createElement('div', {
                    style: {
                        width: '100%',
                        maxWidth: '1140px',
                        marginTop: '60px',
                        padding: '60px 20px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                        position: 'relative',
                        textAlign: 'left'
                    }
                },
                    // Advanced Neon Glow Engine Injected Into CSS Styles
                    React.createElement('style', null, `
                    .blueprint-responsive-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
                        gap: 32px;
                        margin-top: 40px;
                    }
                    .blueprint-detailed-card {
                        background: linear-gradient(180deg, rgba(255,255,255,0.015) 0%, rgba(255,255,255,0.002) 100%);
                        border: 1px solid rgba(255, 255, 255, 0.04);
                        border-radius: 28px;
                        padding: 45px 35px;
                        backdrop-filter: blur(30px);
                        -webkit-backdrop-filter: blur(30px);
                        transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                        position: relative;
                        box-shadow: inset 0 1px 2px rgba(255,255,255,0.02);
                    }
                    
                    /* ⚡ Pure Ambient Glow Transitions */
                    .glow-engineering:hover {
                        transform: translateY(-10px);
                        border-color: rgba(0, 242, 254, 0.5) !important;
                        box-shadow: 0 40px 90px rgba(0, 242, 254, 0.18), inset 0 1px 4px rgba(0, 242, 254, 0.2) !important;
                    }
                    .glow-optimization:hover {
                        transform: translateY(-10px);
                        border-color: rgba(0, 224, 140, 0.5) !important;
                        box-shadow: 0 40px 90px rgba(0, 224, 140, 0.18), inset 0 1px 4px rgba(0, 224, 140, 0.2) !important;
                    }
                    .glow-monetization:hover {
                        transform: translateY(-10px);
                        border-color: rgba(255, 189, 46, 0.5) !important;
                        box-shadow: 0 40px 90px rgba(255, 189, 46, 0.18), inset 0 1px 4px rgba(255, 189, 46, 0.2) !important;
                    }

                    .blueprint-tag {
                        font-family: monospace;
                        font-size: 0.72rem;
                        font-weight: 700;
                        letter-spacing: 2px;
                        text-transform: uppercase;
                        display: block;
                        margin-bottom: 20px;
                    }
                    .blueprint-heading {
                        color: #fff;
                        font-size: 1.45rem;
                        font-weight: 800;
                        margin: 0 0 20px 0;
                        letter-spacing: -0.3px;
                        line-height: 1.3;
                        transition: text-shadow 0.4s ease;
                    }
                    
                    /* Header Text Shadows on Card Hover */
                    .glow-engineering:hover .blueprint-heading { text-shadow: 0 0 20px rgba(0, 242, 254, 0.4); }
                    .glow-optimization:hover .blueprint-heading { text-shadow: 0 0 20px rgba(0, 224, 140, 0.4); }
                    .glow-monetization:hover .blueprint-heading { text-shadow: 0 0 20px rgba(255, 189, 46, 0.4); }

                    .blueprint-body-text {
                        color: rgba(255, 255, 255, 0.45);
                        font-size: 0.95rem;
                        line-height: 1.7;
                        margin-bottom: 25px;
                        text-align: justify;
                    }
                    .blueprint-divider {
                        height: 1px;
                        margin: 25px 0;
                    }
                    .blueprint-bullet-point {
                        font-size: 0.88rem;
                        color: rgba(255, 255, 255, 0.65);
                        margin-bottom: 12px;
                        display: flex;
                        gap: 12px;
                        line-height: 1.5;
                    }
                `),

                    // Section Header Block
                    React.createElement('div', { style: { maxWidth: '800px' } },
                        React.createElement('span', { style: { color: '#00f2fe', fontSize: '0.85rem', fontWeight: '800', letterSpacing: '2.5px', display: 'block', marginBottom: '12px', textShadow: '0 0 10px rgba(0,242,254,0.3)' } }, 'SYSTEM OVERVIEW'),
                        React.createElement('h2', { style: { color: '#fff', fontSize: '2.4rem', fontWeight: '900', margin: '0 0 15px 0', letterSpacing: '-0.5px' } }, 'Our Operational Ecosystem'),
                        React.createElement('p', { style: { color: 'rgba(255,255,255,0.45)', fontSize: '1.05rem', lineHeight: '1.6', margin: '0' } }, 'An in-depth look into the architectural standards, technical search parameters, and complex data models engineered by Apex Code to accelerate your digital workspace.')
                    ),

                    // 3-Column Detailed Long Cards Grid
                    React.createElement('div', { className: 'blueprint-responsive-grid' },

                        // 📘 CARD 1: ARCHITECTURAL ENGINEERING (Cyan Glow Theme)
                        React.createElement('div', { className: 'blueprint-detailed-card glow-engineering' },
                            React.createElement('span', { className: 'blueprint-tag', style: { color: '#00f2fe', textShadow: '0 0 8px rgba(0,242,254,0.3)' } }, '[ NODE-01 // ENGINEERING ]'),
                            React.createElement('h3', { className: 'blueprint-heading' }, 'Next-Gen Structural Frameworks & Full-Stack Core Buildups'),
                            React.createElement('p', { className: 'blueprint-body-text' },
                                'We specialize in building cutting-edge web environments using raw custom architectures like React and highly scalable Next.js servers, alongside traditional rapid-deployment WordPress ecosystems. Every digital pipeline is mapped out to prevent server-side blockages, ensuring that codebase layouts execute flawlessly under high concurrent visitor volumes. By standardizing clean component structures, modular hooks, and atomic code separation, our solutions offer exceptional performance metrics that significantly outpace off-the-shelf templates.'
                            ),
                            React.createElement('div', { className: 'blueprint-divider', style: { background: 'linear-gradient(90deg, rgba(0,242,254,0.2) 0%, rgba(255,255,255,0) 100%)' } }),
                            React.createElement('div', null,
                                React.createElement('div', { className: 'blueprint-bullet-point' },
                                    React.createElement('span', { style: { color: '#00f2fe', textShadow: '0 0 8px #00f2fe' } }, '✓'),
                                    'State-of-the-art rendering cycles via incremental static generation.'
                                ),
                                React.createElement('div', { className: 'blueprint-bullet-point' },
                                    React.createElement('span', { style: { color: '#00f2fe', textShadow: '0 0 8px #00f2fe' } }, '✓'),
                                    'Optimized repository controls linked seamlessly to production branch servers.'
                                ),
                                React.createElement('div', { className: 'blueprint-bullet-point' },
                                    React.createElement('span', { style: { color: '#00f2fe', textShadow: '0 0 8px #00f2fe' } }, '✓'),
                                    'Strict code audits preventing structural regressions and logic loops.'
                                )
                            )
                        ),

                        // 📘 CARD 2: SEARCH ENGINE DOMINANCE (Emerald Glow Theme)
                        React.createElement('div', { className: 'blueprint-detailed-card glow-optimization' },
                            React.createElement('span', { className: 'blueprint-tag', style: { color: '#00e28c', textShadow: '0 0 8px rgba(0,224,140,0.3)' } }, '[ NODE-02 // OPTIMIZATION ]'),
                            React.createElement('h3', { className: 'blueprint-heading' }, 'Programmatic SEO Frameworks & Deep Technical Visibility'),
                            React.createElement('p', { className: 'blueprint-body-text' },
                                'Visibility is a structural science, not a guessing game. Our systems look beyond simple keyword insertion to focus deeply on programmatic layouts, data structures, and the refinement of Core Web Vitals. We construct dense topical clusters and advanced index hierarchies that map directly to search engines’ crawling algorithms. This technical foundation guarantees that every page asset ranks efficiently, loads at rapid speeds, and maintains its search engine authority across volatile market updates.'
                            ),
                            React.createElement('div', { className: 'blueprint-divider', style: { background: 'linear-gradient(90deg, rgba(0,224,140,0.2) 0%, rgba(255,255,255,0) 100%)' } }),
                            React.createElement('div', null,
                                React.createElement('div', { className: 'blueprint-bullet-point' },
                                    React.createElement('span', { style: { color: '#00e28c', textShadow: '0 0 8px #00e28c' } }, '✓'),
                                    'Advanced technical audits mapping exact semantic schema networks.'
                                ),
                                React.createElement('div', { className: 'blueprint-bullet-point' },
                                    React.createElement('span', { style: { color: '#00e28c', textShadow: '0 0 8px #00e28c' } }, '✓'),
                                    'Programmatic content scaling optimized for structural discovery.'
                                ),
                                React.createElement('div', { className: 'blueprint-bullet-point' },
                                    React.createElement('span', { style: { color: '#00e28c', textShadow: '0 0 8px #00e28c' } }, '✓'),
                                    'Comprehensive tracking setups monitoring search visibility spikes.'
                                )
                            )
                        ),

                        // 📘 CARD 3: AD MONETIZATION OPERATIONS (Amber Glow Theme)
                        React.createElement('div', { className: 'blueprint-detailed-card glow-monetization' },
                            React.createElement('span', { className: 'blueprint-tag', style: { color: '#ffbd2e', textShadow: '0 0 8px rgba(255,189,46,0.3)' } }, '[ NODE-03 // MONETIZATION ]'),
                            React.createElement('h3', { className: 'blueprint-heading' }, 'Algorithmic Yield Optimization & Revenue Scaling Architectures'),
                            React.createElement('p', { className: 'blueprint-body-text' },
                                'Maximizing platform revenue requires sophisticated script engineering. We implement advanced ad placement strategies tailored to retain maximum user engagement while generating high CPM returns across active ad networks. By deploying lightweight, non-blocking delivery workflows and asynchronous loading wrappers, we prevent layout displacement. This keeps your web asset running smoothly, bypasses basic ad-blocking tools, and preserves optimal speed metrics.'
                            ),
                            React.createElement('div', { className: 'blueprint-divider', style: { background: 'linear-gradient(90deg, rgba(255,189,46,0.2) 0%, rgba(255,255,255,0) 100%)' } }),
                            React.createElement('div', null,
                                React.createElement('div', { className: 'blueprint-bullet-point' },
                                    React.createElement('span', { style: { color: '#ffbd2e', textShadow: '0 0 8px #ffbd2e' } }, '✓'),
                                    'High-CPM network setup prioritizing native yield generation.'
                                ),
                                React.createElement('div', { className: 'blueprint-bullet-point' },
                                    React.createElement('span', { style: { color: '#ffbd2e', textShadow: '0 0 8px #ffbd2e' } }, '✓'),
                                    'Asynchronous delivery layers engineered for zero rendering delays.'
                                ),
                                React.createElement('div', { className: 'blueprint-bullet-point' },
                                    React.createElement('span', { style: { color: '#ffbd2e', textShadow: '0 0 8px #ffbd2e' } }, '✓'),
                                    'Anti-block network mechanisms safeguarding continuous script revenue.'
                                )
                            )
                        )

                    )
                    
                ),
                React.createElement(TopFAQSection, null),
                
                // 🏷️ 8. APEX CODE ULTRALUXE BORDERLESS GRID CTA (Vercel/Stripe Style)
                React.createElement('div', {
                    style: {
                        width: '100%',
                        maxWidth: '1140px',
                        marginTop: '80px',
                        padding: '20px',
                        position: 'relative',
                        textAlign: 'center'
                    }
                },
                    // Advanced Structural Design Engine - Grid & Cosmic Blurs
                    React.createElement('style', null, `
                    .apex-ultraluxe-section {
                        position: relative;
                        padding: 90px 40px;
                        /* Infinite Technical Grid Matrix */
                        background-image: 
                            linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px);
                        background-size: 50px 50px;
                        background-position: center top;
                        border-radius: 40px;
                        overflow: hidden;
                    }
                    
                    /* Background Fade-Out Mask so the grid blends beautifully */
                    .apex-ultraluxe-section::after {
                        content: '';
                        position: absolute;
                        inset: 0;
                        background: radial-gradient(circle at 50% 50%, transparent 20%, rgba(10, 10, 12, 0.95) 100%);
                        pointer-events: none;
                    }
                    
                    /* 🌌 Floating Dark Core Eclipse Glow */
                    .apex-eclipse-core {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        width: 500px;
                        height: 350px;
                        background: radial-gradient(circle, rgba(0, 242, 254, 0.15) 0%, rgba(79, 172, 254, 0.03) 60%, transparent 100%);
                        filter: blur(80px);
                        pointer-events: none;
                        z-index: 1;
                        animation: shiftGlow 10s infinite ease-in-out;
                    }

                    @keyframes shiftGlow {
                        0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
                        50% { transform: translate(-50%, -45%) scale(1.15); opacity: 1; }
                    }

                    /* High-Contrast Cosmic Headings */
                    .apex-cosmic-heading {
                        font-size: 3rem;
                        font-weight: 900;
                        letter-spacing: -1.8px;
                        line-height: 1.1;
                        margin-bottom: 24px;
                        background: linear-gradient(180deg, #ffffff 30%, rgba(255, 255, 255, 0.45) 100%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        position: relative;
                        z-index: 2;
                    }

                    @media (max-width: 768px) {
                        .apex-cosmic-heading { font-size: 2.2rem; }
                    }

                    /* 💊 Luxury Borderless Capsule Interaction */
                    .apex-capsule-btn {
                        background: rgba(255, 255, 255, 0.03);
                        color: #fff;
                        font-size: 0.95rem;
                        font-weight: 700;
                        padding: 15px 38px;
                        border-radius: 100px;
                        border: 1px solid rgba(255, 255, 255, 0.08);
                        cursor: pointer;
                        position: relative;
                        z-index: 2;
                        overflow: hidden;
                        display: inline-flex;
                        align-items: center;
                        gap: 12px;
                        transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255,255,255,0.05);
                    }

                    /* Micro Solid Glow Fill Layer */
                    .apex-capsule-btn::before {
                        content: '';
                        position: absolute;
                        inset: 0;
                        background: linear-gradient(90deg, #00f2fe, #4facfe);
                        opacity: 0;
                        z-index: -1;
                        transition: opacity 0.4s ease;
                    }

                    .apex-capsule-btn:hover {
                        color: #000;
                        border-color: #00f2fe;
                        box-shadow: 0 0 40px rgba(0, 242, 254, 0.5), 0 15px 30px rgba(0,0,0,0.3);
                        transform: translateY(-3px);
                    }

                    .apex-capsule-btn:hover::before {
                        opacity: 1;
                    }

                    .apex-capsule-btn:hover .apex-arrow {
                        transform: translateX(4px);
                        color: #000;
                    }

                    .apex-luxury-desc {
                        color: rgba(255, 255, 255, 0.45);
                        font-size: 1.05rem;
                        max-width: 620px;
                        line-height: 1.7;
                        margin: 0 auto 40px auto;
                        position: relative;
                        z-index: 2;
                        letter-spacing: -0.1px;
                    }

                    .apex-status-line {
                        font-family: monospace;
                        font-size: 0.7rem;
                        font-weight: 700;
                        color: rgba(255, 255, 255, 0.3);
                        letter-spacing: 4px;
                        text-transform: uppercase;
                        margin-bottom: 24px;
                        position: relative;
                        z-index: 2;
                        display: inline-flex;
                        align-items: center;
                        gap: 8px;
                    }
                    .apex-status-dot {
                        width: 5px;
                        height: 5px;
                        background: #00f2fe;
                        border-radius: 50%;
                        box-shadow: 0 0 8px #00f2fe;
                    }
                `),

                    // Core Infinite Section Matrix
                    React.createElement('div', { className: 'apex-ultraluxe-section' },

                        // Ambient Core Light Engine
                        React.createElement('div', { className: 'apex-eclipse-core' }),

                        // Technical Status Indicator
                        React.createElement('div', { className: 'apex-status-line' },
                            React.createElement('span', { className: 'apex-status-dot' }),
                            'System Connection Ready'
                        ),

                        // Fluid Cosmic Heading
                        React.createElement('h3', { className: 'apex-cosmic-heading' }, 'Let’s Build Something Iconic.'),

                        // High-End Balanced Description
                        React.createElement('p', { className: 'apex-luxury-desc' },
                            'Step into the next phase of digital scale. Partner with Apex Code to turn complex architectural layouts and advanced monetization models into seamless production realities.'
                        ),

                        // Interactive Capsule Button
                        // Interactive Capsule Button
                        React.createElement('button', {
        onClick: toServices,
        className: 'apex-capsule-btn'
    },
    'Explore Services',
    React.createElement('span', { 
        className: 'apex-arrow' 
    }, '➔')
)
                    )
                )
            )
        );
    }


    // 3. Footer Element
    // 3. Footer Element (Premium Style)
    const footerElement = React.createElement(
        'footer',
        { className: 'footer-premium' },

        // Footer Top Section (3 Columns)
        React.createElement('div', { className: 'footer-top' },

            // Column 1: Website Name & Detail
            React.createElement('div', { className: 'footer-brand' },
                React.createElement('h2', { className: 'footer-logo-text' }, 'Apex Code'),
                React.createElement('p', { className: 'footer-desc' },
                    'Empowering the digital world with cutting-edge Software Engineering, Web Development, and innovative tech solutions.'
                )
            ),

            // Column 2: Nav Links
            React.createElement('div', { className: 'footer-nav' },
                React.createElement('h3', { className: 'footer-heading' }, 'Quick Links'),
                React.createElement('ul', { className: 'footer-list' },
                    React.createElement('li', null, React.createElement('a', { href: '#', onClick: toHome }, 'Home')),
                    React.createElement('li', null, React.createElement('a', { href: '#', onClick: toServices }, 'Services')),
                    React.createElement('li', null, React.createElement('a', { href: '#', onClick: toPortfolio }, 'Portfolio')),
                    React.createElement('li', null, React.createElement('a', { href: '#', onClick: toWebsitesForSale }, 'Website for Sale')),
                    React.createElement('li', null, React.createElement('a', { href: '#', onClick: toAvailableJobs }, 'Available Job'))
                )
            ),

            // Column 3: Contact & Legal (UPDATED SECTION)
            React.createElement('div', { className: 'footer-nav' },
                React.createElement('h3', { className: 'footer-heading' }, 'Contact & Legal'),
                React.createElement('ul', { className: 'footer-list' },
                    // Privacy Policy Updated
                    React.createElement('li', null, React.createElement('a', {
                        href: '#',
                        onClick: (e) => { e.preventDefault(); setCurrentPage('privacy-policy'); window.scrollTo(0, 0); }
                    }, 'Privacy Policy')),

                    // Terms & Conditions Updated
                    React.createElement('li', null, React.createElement('a', {
                        href: '#',
                        onClick: (e) => { e.preventDefault(); setCurrentPage('terms-conditions'); window.scrollTo(0, 0); }
                    }, 'Terms & Conditions')),

                    // Contact Us (Pehle se theek tha)
                    React.createElement('li', null, React.createElement('a', { href: '#', onClick: toContactUs }, 'Contact Us')),

                    // About Us Updated
                    React.createElement('li', null, React.createElement('a', {
                        href: '#',
                        onClick: (e) => { e.preventDefault(); setCurrentPage('about-us'); window.scrollTo(0, 0); }
                    }, 'About Us'))
                ),

                // 🛠️ ADMIN CONTROLS SECTION (Ab yeh sirf login ke baad dikhega)
                isAdminLoggedIn ? React.createElement('div', {
                    style: {
                        marginTop: '30px',
                        paddingTop: '20px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                        width: '100%'
                    }
                },
                    // Section Sub-heading
                    React.createElement('h3', {
                        style: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '0.95rem',
                            fontWeight: '600',
                            marginBottom: '16px',
                            letterSpacing: '0.5px',
                            textAlign: 'left',
                            paddingLeft: '4px'
                        }
                    }, '🛠️ Admin Controls'),

                    // 1️⃣ UPLOAD FILES BUTTON
                    React.createElement('button', {
                        onClick: toUploadPage,
                        className: 'card-btn',
                        style: {
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            width: '100%', marginBottom: '14px', padding: '12px', fontSize: '0.9rem', fontWeight: '600',
                            color: '#00f2fe', background: 'linear-gradient(90deg, rgba(0, 242, 254, 0.12), rgba(0, 242, 254, 0.02))',
                            border: '1px solid rgba(0, 242, 254, 0.35)', borderRadius: '14px', cursor: 'pointer',
                            boxShadow: '0 4px 20px rgba(0, 242, 254, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
                        }
                    }, 'Upload Panel 📁'),

                    // 2️⃣ UPDATE PASSWORD BUTTON
                    React.createElement('button', {
                        onClick: toUpdatePassword,
                        className: 'card-btn',
                        style: {
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            width: '100%', marginBottom: '14px', padding: '12px', fontSize: '0.9rem', fontWeight: '600',
                            color: '#ff0080', background: 'linear-gradient(90deg, rgba(255, 0, 128, 0.12), rgba(255, 0, 128, 0.02))',
                            border: '1px solid rgba(255, 0, 128, 0.35)', borderRadius: '14px', cursor: 'pointer',
                            boxShadow: '0 4px 20px rgba(255, 0, 128, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
                        }
                    }, 'Update Password 🔑'),

                    // 3️⃣ LOGOUT BUTTON
                    React.createElement('button', {
                        onClick: handleLogout,
                        className: 'card-btn',
                        style: {
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            width: '100%', padding: '12px', fontSize: '0.9rem', fontWeight: '600',
                            color: '#ff3366', background: 'linear-gradient(90deg, rgba(255, 51, 102, 0.12), rgba(255, 51, 102, 0.02))',
                            border: '1px solid rgba(255, 51, 102, 0.35)', borderRadius: '14px', cursor: 'pointer',
                            boxShadow: '0 4px 20px rgba(255, 51, 102, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
                        }
                    }, 'Logout 🚪')
                ) : null
            )
        ),

        // Footer Bottom Section: Animated Copyright
        // Footer Bottom Section: Premium Social Media Icons & Animated Copyright
        React.createElement('div', { 
            className: 'footer-bottom', 
            style: { 
                position: 'relative', 
                zIndex: '10',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%'
            } 
        },
            
            // 🎨 CSS For Premium Minimalistic Responsive Buttons
            React.createElement('style', { 
                dangerouslySetInnerHTML: { __html: `
                    .premium-social-container {
                        display: flex; 
                        justify-content: center; 
                        gap: 20px; 
                        margin-bottom: 25px; 
                        flex-wrap: wrap;
                        width: 100%;
                    }
                    .social-btn {
                        display: flex; 
                        align-items: center; 
                        justify-content: center;
                        width: 48px; 
                        height: 48px; 
                        border-radius: 50%;
                        background: rgba(255, 255, 255, 0.05); 
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        color: rgba(255, 255, 255, 0.8); 
                        text-decoration: none;
                        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                        backdrop-filter: blur(10px);
                        -webkit-backdrop-filter: blur(10px);
                    }
                    .social-btn svg {
                        width: 20px; 
                        height: 20px; 
                        fill: currentColor;
                        transition: transform 0.3s ease;
                    }
                    
                    /* Premium Hover Effects (No text glow, only solid button transitions) */
                    .social-btn:hover { 
                        color: #ffffff; 
                        transform: translateY(-5px); 
                        border-color: transparent;
                    }
                    .social-btn:hover svg {
                        transform: scale(1.1);
                    }
                    
                    .social-btn.fb:hover { background: #1877F2; }
                    .social-btn.ig:hover { background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%); }
                    .social-btn.th:hover { background: #000000; border: 1px solid rgba(255, 255, 255, 0.2); }
                    .social-btn.li:hover { background: #0A66C2; }

                    /* Mobile Optimization */
                    @media (max-width: 600px) {
                        .premium-social-container { 
                            gap: 14px; 
                            margin-bottom: 20px; 
                        }
                        .social-btn { 
                            width: 42px; 
                            height: 42px; 
                        }
                        .social-btn svg { 
                            width: 18px; 
                            height: 18px; 
                        }
                    }
                `} 
            }),

            // 🌐 PREMIUM SOCIAL MEDIA ICONS SECTION
            React.createElement('div', { className: 'premium-social-container' },
                
                // Facebook
                React.createElement('a', { 
                    href: 'https://www.facebook.com/share/1SdJG6FCo5/', // <-- Apna Link Dalein
                    target: '_blank', rel: 'noopener noreferrer',
                    className: 'social-btn fb', 'aria-label': 'Facebook'
                }, 
                    React.createElement('svg', { viewBox: '0 0 24 24' },
                        React.createElement('path', { d: 'M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z' })
                    )
                ),

                // Instagram
                React.createElement('a', { 
                    href: 'https://www.instagram.com/apex.code_?igsh=MWk2ZjdqaXpkaG5wNg==', // <-- Apna Link Dalein
                    target: '_blank', rel: 'noopener noreferrer',
                    className: 'social-btn ig', 'aria-label': 'Instagram'
                }, 
                    React.createElement('svg', { viewBox: '0 0 24 24' },
                        React.createElement('path', { d: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' })
                    )
                ),

                // Threads
                React.createElement('a', { 
                    href: 'https://www.threads.com/@apex.code_', // <-- Apna Link Yahan Dalein
                    target: '_blank', rel: 'noopener noreferrer',
                    className: 'social-btn th', 'aria-label': 'Threads'
                }, 
                    React.createElement('svg', { viewBox: '0 0 24 24' },
                        React.createElement('path', { d: 'M18.32 12.7c-.12 3.32-1.74 5.38-4.59 5.38-1.57 0-2.85-.71-3.32-1.85-.14-.35-.22-.73-.22-1.12V10.1c0-.4.08-.77.22-1.12.47-1.14 1.75-1.85 3.32-1.85 2.86 0 4.47 2.06 4.59 5.38zM24 12c0-6.63-5.37-12-12-12S0 5.37 0 12s5.37 12 12 12c3.06 0 5.86-1.14 8-3.03l-1.58-1.47C16.81 21.04 14.53 21.8 12 21.8c-5.41 0-9.8-4.39-9.8-9.8S6.59 2.2 12 2.2s9.8 4.39 9.8 9.8c0 1.95-.53 3.49-1.57 4.5-.83.81-1.97 1.25-3.23 1.25-1.57 0-2.73-.77-3.13-2.07l-.02-.05c1.43-.8 2.37-2.31 2.37-4.13v-1.1c0-2.92-2.13-5.06-5.22-5.06-3.1 0-5.22 2.14-5.22 5.06v5.02c0 2.92 2.13 5.06 5.22 5.06 1.7 0 3.16-.65 4.14-1.82 1.5 1.29 3.48 1.96 5.66 1.96 1.83 0 3.51-.61 4.79-1.75C23.23 16.71 24 14.61 24 12z' })
                    )
                ),

                // LinkedIn
                React.createElement('a', { 
                    href: 'https://linkedin.com/in/your-profile-link', // <-- Apna Link Yahan Dalein
                    target: '_blank', rel: 'noopener noreferrer',
                    className: 'social-btn li', 'aria-label': 'LinkedIn'
                }, 
                    React.createElement('svg', { viewBox: '0 0 24 24' },
                        React.createElement('path', { d: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z' })
                    )
                )
            ),

            // Copyright Text
            React.createElement('p', { className: 'copyright-animated' },
                `Copyright © ${currentYear} Apex Code. All rights reserved.`
            )
        )
    );
    // 🏠 ✨ HYPER-GLOWING NEON "BACK TO HOME" BUTTON (Home Page Chor Kar Sab Per Ayega)
    // Condition: Agar currentPage 'home' NAHI hai, toh hi button dikhao, warna null (kuch mat dikhao)
    const backToHomeBtn = currentPage !== 'home' ? React.createElement('div', {
        style: {
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            margin: '35px 0 55px 0', // Main content aur footer ke beech ka balanced gap
        }
    },
        React.createElement('button', {
            onClick: () => setCurrentPage('home'), // Home page par redirect karega
            className: 'card-btn',
            style: {
                padding: '14px 36px',           // Premium capsule size breathing space
                borderRadius: '50px',           // Sleek Pill/Capsule Shape
                fontSize: '0.88rem',
                fontWeight: '800',              // Bold cinematic weight
                letterSpacing: '1.5px',         // Premium tracking
                textTransform: 'uppercase',     // Clean modern look
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxSizing: 'border-box',

                // 🎆 Fluid Glassmorphic Base
                background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.06) 0%, rgba(255, 0, 128, 0.02) 100%)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',

                // ⚡ High-Intensity Cyan Neon Border
                border: '1px solid rgba(0, 242, 254, 0.55)',
                color: '#00f2fe',               // Electric cyan text

                // 🔮 MULTI-LAYERED NEON AURA EMISSION (Jo real neon look dega)
                boxShadow: '0 0 15px rgba(0, 242, 254, 0.35), 0 0 35px rgba(0, 242, 254, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.25)',
                filter: 'drop-shadow(0 4px 10px rgba(0, 242, 254, 0.4)) drop-shadow(0 12px 30px rgba(255, 0, 128, 0.25))'
            },
            onClick: () => setCurrentPage('home')
        },
            React.createElement('span', { style: { filter: 'drop-shadow(0 0 4px #00f2fe)' } }, 'Back to Home')

        )
    ) : null; // ✨ FIX: Agar home page hai to khali (null) rahega

    // Wrapper container jo saare elements return karega (Updated Order)
    return React.createElement(
        'div',
        { className: 'container' },
        headerElement,
        mainElement,
        backToHomeBtn,  // 🔥 Glowing button footer se bilkul pehle load ho raha hai
        footerElement
    );
    // Wrapper container jo saare elements return karega
    return React.createElement(
        'div',
        { className: 'container' },
        headerElement,
        mainElement,
        footerElement
    );
};

// HTML ke root ko target karke render karna
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(React.createElement(QuickKitApp));