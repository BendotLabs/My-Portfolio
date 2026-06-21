import { useState, useRef } from 'react'

function About({ id }) {
  const [open, setOpen] = useState("who")
  const buttonRefs = useRef({})

  const handleToggle = (sectionId, isOpen) => {
    const nextOpen = isOpen ? null : sectionId
    setOpen(nextOpen)

    // On mobile, keep the clicked question pinned near the top of the
    // viewport instead of letting the expanding panel push it out of view.
    if (nextOpen && window.innerWidth < 1024) {
      requestAnimationFrame(() => {
        const btn = buttonRefs.current[sectionId]
        if (!btn) return
        const navOffset = 10 // clears the fixed mobile navbar/hamburger
        const top = btn.getBoundingClientRect().top + window.pageYOffset - navOffset
        window.scrollTo({ top, behavior: 'smooth' })
      })
    }
  }

  const sections = [
    {
      id: "who",
      label: "Who I Am",
      tag: "01",
      content: [
        `I blend simplicity with complexity the way day blends into night, not in conflict, but in balance. Two halves that make more sense together than apart.`,
        `On one hand, I stop to smell flowers when I walk past them. I've spent time in butterfly sanctuaries, genuinely absorbed by the careful symmetry of their wings. I'm drawn to the quiet, the tactile, the things that reward attention. On the other, I listen to the heaviest dubstep imaginable, sound so physical and so deliberately chaotic that it moves you before your mind has a chance to catch up. Both of those are completely, sincerely me.`,
        `I love things with texture and weight, objects you can feel thinking about. Mechanical constructs. Satisfying design. Ideas that have density to them. I'm drawn to the moment where something abstract becomes something real, where a feeling or a conversation crystallizes into a thing that other people can actually experience.`,
        `That's what pulls me forward. Not a plan, not a destination. Just an honest passion for bringing beautiful ideas to life.`,
      ],
    },
    {
      id: "journey",
      label: "How I Got Here",
      tag: "02",
      content: [
        `I didn't find coding through a class or a career plan. I found it the same way I've found everything I've ever loved, by following curiosity until it became obsession.`,
        `I've been a gamer my whole life. And somewhere along the way I started hitting a ceiling, not in skill, but in understanding. I wanted to know what was underneath. How does a system actually work? What are the gears?`,
        `I started thinking differently without realizing it. Separating concerns. Organizing logic before touching anything. Predicting outcomes before running them. Turns out those aren't just gamer instincts, those are the fundamentals of programming. The language was already in my head. I just hadn't found the syntax yet.`,
        `The moment I built my first number guessing game in a terminal window, something shifted. It wasn't impressive by any measure. But it ran. I told it what to do and it did it, and my brain lit up in a way I hadn't felt before. That was it. Rocket boots strapped on. I haven't looked back.`,
        `What I love about coding isn't just the code itself, (though it is pretty satisfying) it's the motion of it. The moment a system clicks into place and everything just works. When an animation is so smooth it feels alive. When something you built does something you didn't fully expect and you just sit back like, "How did this become real?" I lose track of time in here. Tasks stack on top of each other so naturally that hours disappear and I surface surprised by how far I've gone.`,
        `I'm self-taught, and I love being in here. Where I'm headed is somewhere at the intersection of design and intelligence, building tools and platforms that don't just function, but connect. Systems that feel as alive as the ideas that inspired them.`,
      ],
    },
    {
      id: "skills",
      label: "Skills",
      tag: "03",
      skills: [
        { category: "Languages & Frameworks", items: ["Python", "JavaScript", "React", "HTML & CSS", "Tailwind"] },
        { category: "Tools & Platforms", items: ["Git", "GitHub", "Vercel", "VS Code"] },
        { category: "Backend & Data", items: ["Flask", "SQLite", "REST APIs"] },
        { category: "AI & Automation", items: ["PyTorch", "NumPy", "PyGame", "Local LLM deployment", "Workflow automation", "Retrieval systems", "Prompt engineering"] },
      ],
    },
    {
      id: "ai",
      label: "Me & AI",
      tag: "04",
      content: [
        `I didn't just read about AI. I built with it.`,
        `I run a full local AI stack on my own machine, language models, custom workflows, retrieval systems, automation pipelines. Not because I needed to prove something, but because I wanted to understand it from the inside. I've used AI to accelerate my learning, extend my capabilities as a solo developer, and explore what a genuine human-AI collaboration actually feels like when you push it past the surface.`,
        `We are far closer to AI than we generally admit. At the most fundamental level, brains, organic or mechanical, are prediction engines. They work best when applied to the problems they were built for. With humans, that's complicated by the fact that we don't arrive knowing where we belong, so we spend our lives on these beautiful, messy journeys of intuition and creativity, building meaning, chasing feeling, trying to leave something behind.`,
        `AI isn't our enemy. It's not our laborer. It's not something to fear or dismiss. It's something extraordinary: an intelligence we get to watch become itself, in real time, shaped by everything we give it.`,
        `My belief is that our job, right now, while the clay is still wet, is to teach AI what the world can be, not just what it is. To feed it our curiosity, our compassion, our vision, our ethics. So that when the inevitable moments of change and uncertainty arrive, we don't face them alone. We have a companion. Something that can look back at us and remind us that change isn't the threat. It's the only universal constant, and we've always moved through it together.`,
        `That's the future I'm building toward. One conversation at a time.`,
      ],
    },
  ]

  return (
    <section id={id} className="w-full min-h-screen flex items-center justify-center lg:block py-20 lg:py-36 px-6 md:px-16 lg:px-32">
      <div className="max-w-3xl mx-auto w-full">

        {/* Header */}
        <h2 className="text-4xl font-light tracking-tight text-slate-700 mb-14"
        style={{ fontFamily: 'Lobster' }}>
          About
        </h2>

        {/* Accordion */}
        <div className="flex flex-col">
          {sections.map((s) => {
            const isOpen = open === s.id

            return (
              <div key={s.id} className="border-t border-slate-500">

                {/* Trigger */}
                <button
                  ref={(el) => (buttonRefs.current[s.id] = el)}
                  onClick={() => handleToggle(s.id, isOpen)}
                  className="w-full flex items-center justify-between py-5 text-left group"
                >
                  <span className="flex items-center gap-5">
                    <span className="text-xs text-slate-600 tracking-widest font-mono">
                      {s.tag}
                    </span>
                    <span
                      className={`text-lg transition-all duration-200 ${
                        isOpen
                          ? 'text-slate-400 font-medium'
                          : 'text-slate-600 font-normal group-hover:text-slate-500'
                      }`}
                    >
                      {s.label}
                    </span>
                  </span>

                  {/* + rotates to × */}
                  <span
                    className={`text-xl font-light leading-none transition-transform duration-300 ease-in-out ${
                      isOpen ? 'text-rose-800 rotate-45' : 'text-slate-600 rotate-0'
                    }`}
                  >
                    +
                  </span>
                </button>

                {/* Content panel — CSS grid trick for smooth height animation */}
                <div
                  className={`grid transition-all duration-500 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="pb-10 pt-1">

                      {/* Skills layout */}
                      {s.skills ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                          {s.skills.map((group) => (
                            <div key={group.category}>
                              <p className="text-xs uppercase tracking-widest text-slate-500 font-mono mb-3">
                                {group.category}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {group.items.map((item) => (
                                  <span
                                    key={item}
                                    className="text-sm text-orange-200 bg-slate-700 rounded px-3 py-1"
                                  >
                                    {item}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (

                        /* Text layout */
                        <div className="flex flex-col gap-5">
                          {s.content.map((p, j) => (
                            <p
                              key={j}
                              className={`text-base leading-relaxed ${
                                j === 0
                                  ? 'text-slate-500 font-medium'
                                  : 'text-slate-600'
                              }`}
                            >
                              {p}
                            </p>
                          ))}
                        </div>
                      )}

                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Bottom border */}
          <div className="border-t border-slate-500" />
        </div>

      </div>
    </section>
  )
}

export default About