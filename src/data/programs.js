// The eight Digitaleem offerings. Each one renders /programs/<slug>/.
// audiences: which of students | colleges | industry | mentors the offering serves (used by hub filters).
// domains: which of it | engineering | business | healthcare it covers.
// form: the enquiry form key (see assets/js/forms.js) opened by the page's main button.

module.exports = [
  {
    slug: 'training',
    name: 'Training',
    short: 'Structured programs that take a skill from foundations to applied work.',
    title: 'Training that ends in work you can show.',
    intro: 'Digitaleem training programs are built around practice. You learn a skill in live sessions, use it in labs and assignments, and finish with a project that is reviewed and assessed.',
    audiences: ['students', 'colleges', 'industry'],
    domains: ['it', 'engineering', 'business', 'healthcare'],
    form: 'student',
    icon: 'book',
    forWho: {
      students: 'Learn a new skill from the start, or take one you already have to the level employers expect.',
      colleges: 'Run training for a batch or a branch, scheduled around your academic calendar.',
      industry: 'Train your team in technical, digital or professional skills. See workforce training.'
    },
    includes: [
      'Live, instructor-led sessions',
      'Hands-on labs and assignments',
      'A project that applies what you learned',
      'An assessment of your skill level',
      'Feedback from a trainer or mentor',
      'A recommended next step: a project, an internship or interview prep'
    ],
    steps: [
      ['Pick your domain and level', 'Tell us what you want to learn and where you are now. We place you at the right starting point.'],
      ['Learn in live sessions', 'Trainers who work in the field teach each topic and answer questions as you go.'],
      ['Practise in labs', 'Every topic comes with exercises that use real tools.'],
      ['Apply it in a project', 'You build something that uses the skill from start to finish.'],
      ['Get assessed', 'Your project and an assessment show what you can now do.']
    ],
    formats: 'Online at launch. Offline, on-campus and hybrid formats are added as Digitaleem centres open.',
    faqs: [
      ['Do I need prior knowledge?', 'Not for foundation programs. For advanced programs we check your level first, so you start where the material is useful to you.'],
      ['Is training only for IT?', 'No. Training covers IT and digital skills, engineering and industrial skills, business and management skills, and clinical and professional skills for nurses.'],
      ['How much does a program cost?', 'Fees depend on the program and its length. We share them with you on the call after your enquiry. There is no online payment on this site.']
    ]
  },
  {
    slug: 'workshops',
    name: 'Workshops',
    short: 'Focused, hands-on sessions for colleges and companies.',
    title: 'Workshops for colleges and for industry.',
    intro: 'A workshop is one focused session on one subject, built around doing rather than listening. It is shorter than a training program and works well as a first step or as part of a larger plan.',
    audiences: ['colleges', 'industry', 'students'],
    domains: ['it', 'engineering', 'business'],
    form: 'college',
    icon: 'spark',
    forWho: {
      colleges: 'Bring a practitioner into your department for a hands-on session on a technology, a practice or a career path.',
      industry: 'Give your team a focused session on a tool, a process or a change you are making.',
      students: 'Join an open workshop to try a field before you commit to a longer program.'
    },
    groups: [
      ['College workshops', ['Current technologies and tools', 'Engineering practices', 'How industry works day to day', 'Professional and business skills', 'Career awareness', 'Emerging fields', 'Hands-on technical activities']],
      ['Industry workshops', ['Workforce development', 'Digital transformation', 'AI and automation', 'Management', 'Technical skills', 'Professional skills', 'Topics specific to your organisation']]
    ],
    steps: [
      ['Tell us the audience and goal', 'Who will attend, how many, and what they should be able to do afterwards.'],
      ['We propose a session', 'A topic outline, the expert who will lead it, and the format.'],
      ['The workshop runs', 'Participants work on real tasks, not slides.'],
      ['You get a summary', 'What was covered, how participants did, and what could come next.']
    ],
    formats: 'Online at launch. On-campus and on-site workshops are added as Digitaleem grows.',
    faqs: [
      ['How is a workshop different from training?', 'A workshop is a single focused intervention. Training is a structured program over a longer period, with assessment and a project.'],
      ['Can you design a workshop for our syllabus?', 'Yes. Tell us the subject, the semester and the outcome you want, and we build the session around it.']
    ]
  },
  {
    slug: 'projects',
    name: 'Projects',
    short: 'Apply what you know to a real problem, with a mentor and an evaluation.',
    title: 'Projects that prove what you can do.',
    intro: 'A certificate says you attended. A project shows what you can do. Digitaleem projects start from a real problem, often defined by a company, and end with work that has been reviewed and evaluated.',
    audiences: ['students', 'colleges', 'industry', 'mentors'],
    domains: ['it', 'engineering', 'business'],
    form: 'student',
    icon: 'layers',
    forWho: {
      students: 'Work on a practice, portfolio, capstone or live industry project, alone or in a team.',
      colleges: 'Give final-year and capstone projects a real problem statement and an industry evaluator.',
      industry: 'Share a problem your business has. Students work on it with a mentor, and you see the results.',
      mentors: 'Supervise a project team or evaluate finished work in your field.'
    },
    types: ['Practice projects', 'Portfolio projects', 'College projects', 'Capstone projects', 'Industry-defined projects', 'Live projects', 'Business problem statements', 'Technical problem statements', 'Team projects', 'Individual projects'],
    examples: [
      ['it', 'Build software for an organisation'],
      ['it', 'Analyse operational data'],
      ['it', 'Design an IoT system'],
      ['it', 'Automate an internal process'],
      ['engineering', 'Prepare engineering designs'],
      ['engineering', 'Perform quantity calculations'],
      ['engineering', 'Study a manufacturing process'],
      ['engineering', 'Analyse a production problem'],
      ['business', 'Develop a marketing plan'],
      ['business', 'Conduct market research'],
      ['business', 'Create business recommendations'],
      ['it', 'Conduct technical research']
    ],
    steps: [
      ['Problem definition', 'A company, a college or Digitaleem defines a real problem worth solving.'],
      ['Project brief', 'The problem becomes a brief with scope, deliverables and a timeline.'],
      ['Student work', 'You, or your team, do the work.'],
      ['Mentorship', 'A mentor from the field guides you when you are stuck.'],
      ['Review', 'Your work is reviewed and you improve it.'],
      ['Evaluation', 'A professional evaluates the final result against the brief.'],
      ['Completed work', 'You finish with work, an evaluation and feedback you can show an employer.']
    ],
    formats: 'Projects run online, with mentor reviews by video call.',
    faqs: [
      ['Can I bring my own project idea?', 'Yes, for practice and portfolio projects. We help you turn it into a brief and find a mentor for it.'],
      ['Who owns the work from an industry project?', 'Ownership is agreed with the company before the project starts and written into the brief.'],
      ['Can a team from my college take part?', 'Yes. Team projects are common, and colleges can enrol whole batches.']
    ]
  },
  {
    slug: 'internships',
    name: 'Internships',
    short: 'Workplace experience with real responsibility, at partner companies.',
    title: 'Internships where you do real work.',
    intro: 'An internship should teach you how work gets done, not just add a line to your resume. Digitaleem connects students with internships at partner companies, prepares them before they start, and stays in touch while they work.',
    audiences: ['students', 'industry', 'colleges'],
    domains: ['it', 'engineering', 'business'],
    form: 'student',
    formPreset: 'internship',
    icon: 'briefcase',
    forWho: {
      students: 'Find an internship that matches your field and level, and get ready for it.',
      industry: 'Host interns who have been prepared for the work. See collaborate with colleges.',
      colleges: 'Arrange internships for your students through our industry relationships.'
    },
    types: ['Technical internships', 'Software internships', 'Engineering internships', 'Marketing internships', 'Business internships', 'Operations internships', 'Industrial internships', 'Research internships'],
    steps: [
      ['Tell us what you are looking for', 'Your field, your skills and when you are available.'],
      ['Get matched', 'We match you with openings that fit, or suggest a project first if that would make you a stronger candidate.'],
      ['Prepare', 'A short readiness check and interview practice before you apply.'],
      ['Intern', 'You work with the company. We check in with you and with them along the way.']
    ],
    formats: 'Internships are online, on-site or hybrid, as set by the host company.',
    faqs: [
      ['Where can I see current internships?', 'Open internships are listed under Opportunities. You can also enquire here and tell us what you want.'],
      ['Are internships paid?', 'That depends on the company. Each listing states whether a stipend is offered.']
    ],
    listing: 'internships'
  },
  {
    slug: 'industrial-training',
    name: 'Industrial training',
    short: 'Time inside plants, factories and engineering sites.',
    title: 'Industrial training inside real workplaces.',
    intro: 'Some things cannot be learned from a screen: how a production line runs, how a plant is maintained, how quality and safety work on the shop floor. Industrial training puts students inside working industrial environments.',
    audiences: ['students', 'colleges', 'industry'],
    domains: ['engineering'],
    form: 'student',
    formPreset: 'industrial-training',
    icon: 'factory',
    forWho: {
      students: 'Spend time in a working plant or site in your branch of engineering.',
      colleges: 'Arrange industrial training and industrial visits for your students.',
      industry: 'Host students at your facility and get to know future technicians and engineers.'
    },
    types: ['Factory exposure', 'Plant exposure', 'Production environments', 'Engineering environments', 'Industrial processes', 'Machinery', 'Technical systems', 'Maintenance operations', 'Quality processes', 'Manufacturing practices', 'Operational procedures', 'Safety practices', 'Workplace processes'],
    steps: [
      ['Tell us your branch and dates', 'Mechanical, electrical, civil, production or another field, and when you are available.'],
      ['Safety and process briefing', 'You learn what to expect on site and the rules that keep everyone safe.'],
      ['Time on site', 'You observe and take part in real processes, guided by people who run them.'],
      ['Report and review', 'You document what you learned, and it is reviewed.']
    ],
    formats: 'Industrial training takes place at partner industry sites. Enquire to register your interest.',
    faqs: [
      ['Is industrial training only for engineering students?', 'Mostly, along with polytechnic and ITI students. Business and operations students can also join visits that focus on how a plant is run.'],
      ['Can a college book it for a whole batch?', 'Yes. Tell us the branch, batch size and preferred dates in the college enquiry form.']
    ]
  },
  {
    slug: 'interview-prep',
    name: 'Interview & career prep',
    short: 'Mock interviews, assessments and resume review, with honest feedback.',
    title: 'Practise the interview before the one that counts.',
    intro: 'Many candidates know their subject but struggle to show it in an interview. Interview prep at Digitaleem is not a list of likely questions. We assess how well you explain what you know and what you have done, then help you do it better.',
    audiences: ['students', 'colleges', 'mentors'],
    domains: ['it', 'engineering', 'business', 'healthcare'],
    form: 'interview',
    icon: 'mic',
    forWho: {
      students: 'Get ready for placements, internships and job interviews in your field.',
      colleges: 'Run placement preparation for a batch before recruiters arrive.',
      mentors: 'Conduct mock technical and HR interviews in your area of expertise.'
    },
    includes: [
      'Resume review',
      'Portfolio review',
      'Aptitude assessment',
      'Technical assessment',
      'Communication assessment',
      'Mock technical interviews',
      'Mock HR interviews',
      'Role-specific preparation',
      'Problem-solving exercises',
      'Practice explaining your projects',
      'Written interview feedback'
    ],
    steps: [
      ['Share your target role', 'And your resume, if you have one.'],
      ['Get assessed', 'Aptitude, technical and communication checks show where you stand.'],
      ['Mock interviews', 'Professionals from your field interview you the way a real panel would.'],
      ['Feedback and practice', 'You get specific feedback, practise again, and see the difference.']
    ],
    formats: 'Online, by video call.',
    faqs: [
      ['I have an interview next week. Can you help?', 'Yes. Say so in the form and we prioritise a mock interview and resume review.'],
      ['Who conducts the mock interviews?', 'Working professionals who interview candidates in that field.']
    ]
  },
  {
    slug: 'mentoring',
    name: 'Mentoring',
    short: 'Regular conversations with people who do the work you want to do.',
    title: 'Mentors who do the work you want to do.',
    intro: 'A good mentor has already made the choices you are facing. Digitaleem mentors are working professionals and subject experts who guide students through skills, projects and career decisions.',
    audiences: ['students', 'mentors'],
    domains: ['it', 'engineering', 'business', 'healthcare'],
    form: 'student',
    formPreset: 'mentoring',
    icon: 'people',
    forWho: {
      students: 'Get guidance on what to learn, which projects to build and how to approach your career.',
      mentors: 'Share what you know with students starting out in your field. See mentors and trainers.'
    },
    includes: [
      'Career conversations',
      'Guidance on skills to build next',
      'Project supervision',
      'Review of your work',
      'Insight into how your industry works',
      'Introductions where they make sense'
    ],
    steps: [
      ['Tell us your goal', 'What you are working towards and where you need help.'],
      ['Meet your mentor', 'We match you with a professional in your field.'],
      ['Meet regularly', 'Short, focused conversations on an agreed schedule.'],
      ['Act on it', 'Each conversation ends with something specific to do next.']
    ],
    formats: 'Online, by video call.',
    faqs: [
      ['How often do mentoring sessions happen?', 'You and your mentor agree a schedule that suits you both.']
    ]
  },
  {
    slug: 'language',
    name: 'Language for work',
    short: 'German for nurses and professionals heading abroad, from A1 to B2.',
    title: 'Learn the language your next job is in.',
    intro: 'A job abroad usually starts with a language exam. Digitaleem teaches German from the first word to the B1 and B2 levels that employers and authorities ask for, with the vocabulary of your profession built in.',
    audiences: ['students', 'industry'],
    domains: ['healthcare', 'engineering', 'it'],
    form: 'language',
    icon: 'globe',
    forWho: {
      students: 'Nurses, engineers and graduates who want to work in Germany and need a recognised language certificate.',
      industry: 'Employers abroad who want the people they hire from India to arrive ready to talk to colleagues and customers.'
    },
    includes: [
      'German from A1 to B1 or B2, in small live batches',
      'Preparation for recognised exams such as Goethe and telc',
      'Professional German for your field, such as medical German for nurses',
      'Speaking practice with feedback in every level',
      'Mock exams before the real one',
      'A plan that fits around your studies or your job'
    ],
    steps: [
      ['Check your level', 'A short placement test shows where you start, even if that is the first word.'],
      ['Learn level by level', 'Live sessions for each level, A1 to B2, with homework and speaking practice.'],
      ['Add your profession', 'Vocabulary and situations from your field, from patient handovers to technical meetings.'],
      ['Sit mock exams', 'Practise the exam format until it feels familiar.'],
      ['Take the certificate exam', 'Book the official exam when your trainer says you are ready.']
    ],
    formats: 'Online, live and in small batches. The official exams are taken at authorised exam centres.',
    faqs: [
      ['Which level do I need?', 'It depends on the job and the country. Nursing in Germany usually needs B1 or B2. We tell you the level your route needs after a short call.'],
      ['How long does it take?', 'Each level takes steady study over several weeks to a few months. We give you a realistic plan based on your starting level and the hours you can give.'],
      ['Is the certificate included?', 'The exam is taken at an authorised centre such as the Goethe-Institut or a telc centre. We prepare you for it and help you book it.']
    ]
  },
  {
    slug: 'college-industry',
    name: 'College-industry programs',
    short: 'Long-term programs that bring industry into the classroom.',
    title: 'Programs that bring colleges and industry together.',
    intro: 'Most students meet industry for the first time at a placement drive. College-industry programs change that. Digitaleem coordinates sessions, projects, visits, internships and evaluations between a college and companies, over a semester or several years.',
    audiences: ['colleges', 'industry'],
    domains: ['it', 'engineering', 'business'],
    form: 'college',
    icon: 'link',
    forWho: {
      colleges: 'Build a long-term relationship with industry that your students feel every semester.',
      industry: 'Work with a college to shape the skills of graduates you may hire.'
    },
    includes: [
      'Industry professionals conducting college sessions',
      'Companies providing project problems',
      'Students visiting industrial facilities',
      'Companies providing internships',
      'Specialised training requested by the college',
      'Industrial training for students',
      'Professionals evaluating student projects',
      'Employers meeting potential candidates',
      'Joint programs developed by colleges and companies'
    ],
    steps: [
      ['Understand the goals', 'What the college wants for its students, and what companies need from graduates.'],
      ['Design the program', 'A plan of sessions, projects, visits and internships across the semester or year.'],
      ['Run it', 'Digitaleem coordinates the people, the schedule and the logistics.'],
      ['Report outcomes', 'Participation, project results and next steps, shared with both sides.']
    ],
    formats: 'Sessions run online at launch. Visits and internships happen at partner sites.',
    faqs: [
      ['Does a program have to run for years?', 'No. Engagements range from a single activity to a semester program to a multi-year partnership.']
    ]
  }
];
