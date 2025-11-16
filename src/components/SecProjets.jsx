import React, { useEffect, useRef } from "react";

let gsap = null;
let ScrollTrigger = null;

export default function SecProjets({ projects, gridBackground }) {
  const container = useRef(null);
  const track = useRef(null);

  useEffect(() => {
    if (!projects || projects.length === 0) return;

    const init = async () => {
      if (!gsap) {
        gsap = (await import("gsap")).default;
        ScrollTrigger = (await import("gsap/ScrollTrigger")).ScrollTrigger;
        gsap.registerPlugin(ScrollTrigger);
      }

      const wrap = track.current;
      if (!wrap) return;

      const scrollWidth = wrap.scrollWidth;
      const viewportWidth = window.innerWidth;
      const distance = scrollWidth - viewportWidth;

      gsap.to(wrap, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: `+=${distance}`,
          scrub: true,
          pin: true,
        },
      });
    };

    init();
  }, [projects]);

  return (
    <section
      ref={container}
      className="w-full h-screen md:h-screen lg:h-screen overflow-x-hidden flex items-center relative bg-cover bg-center"
      style={{
        backgroundImage: `url(${gridBackground})`,
        backgroundRepeat: "repeat-y",
      }}
    >
      <div
        ref={track}
        className="flex gap-4 md:gap-6 lg:gap-8 px-6 md:px-12 lg:px-[20dvw] relative z-20"
      >
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ project }) {
  const stacksArray = Array.isArray(project.stacks)
    ? project.stacks
    : project.stacks?.split(",").map((s) => s.trim()) || [];

  return (
    <div className="min-w-[90vw] md:min-w-[70vw] lg:min-w-[50vw] px-2 md:px-4 lg:px-[5vw] flex items-stretch justify-center shrink-0 h-full max-w-[80dvw] md:max-w-[80dvw] lg:max-w-none">
      <div
        className="w-full max-w-5xl rounded-2xl md:rounded-3xl relative border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.08),inset_-5px_-5px_15px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-[50px] px-4 md:px-8 lg:pr-16 py-6 md:py-8 lg:py-12 flex flex-col min-h-[60dvh]"
        style={{
          background:
            "radial-gradient(circle at center, rgba(25, 32, 45, 0.95) 0%, rgba(25, 32, 45, 0.95) 38%, rgba(15, 20, 30, 0.95) 100%)",
        }}
      >
        <div className="noise absolute inset-0"></div>
        <div className="absolute inset-0 pointer-events-none bg-linear-to-b from-black/40 to-black/60"></div>

        <div className="relative z-20 w-full flex flex-col lg:flex-row gap-4 md:gap-6 lg:gap-10 justify-between items-stretch h-full">
          <div className="flex flex-col md:flex-row lg:flex-col items-center justify-center shrink-0">
            {project.logo && (
              <div className="w-[30vw] md:w-[20vw] lg:w-[40dvh] h-[30vw] md:h-[20vw] lg:h-[40dvh] rounded-xl md:rounded-2xl overflow-hidden flex items-center justify-center backdrop-blur-sm shrink-0">
                <img
                  src={project.logo}
                  alt={project.titre}
                  className="w-full h-full object-contain object-center"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between h-full flex-1 gap-4 md:gap-6">
            <div>
              <h3 className="h3 text-lg md:text-xl lg:text-2xl">
                {project.titre}
              </h3>
              {(() => {
                const hasValidInfo = Array.isArray(project.infoSupp)
                  ? project.infoSupp.some(
                      (info) => info && String(info).trim().length > 0
                    )
                  : project.infoSupp &&
                    String(project.infoSupp).trim().length > 0;

                return hasValidInfo ? (
                  <div className="flex flex-wrap gap-2 mt-2 md:mt-3">
                    {Array.isArray(project.infoSupp) ? (
                      project.infoSupp
                        .filter(
                          (info) => info && String(info).trim().length > 0
                        )
                        .map((info, index) => (
                          <span
                            key={index}
                            className="inline-block px-3 md:px-4 lg:px-6 py-1 md:py-2 text-xs rounded-full bg-primary text-white font-medium whitespace-nowrap"
                          >
                            {info}
                          </span>
                        ))
                    ) : (
                      <span className="inline-block px-3 md:px-4 lg:px-6 py-1 md:py-2 text-xs rounded-full bg-primary text-white font-medium whitespace-nowrap">
                        {project.infoSupp}
                      </span>
                    )}
                  </div>
                ) : null;
              })()}
            </div>

            <div>
              {project.description && (
                <div className="flex flex-col gap-2 md:gap-3 lg:gap-4">
                  <h4 className="h4 text-primary text-sm md:text-base">
                    Description
                  </h4>
                  <p className="text-xs md:text-sm lg:text-base">
                    {project.description}
                  </p>
                </div>
              )}
            </div>

            <div>
              {stacksArray.length > 0 && (
                <div className="flex flex-col gap-2 md:gap-3 lg:gap-4">
                  <h4 className="h4 text-primary text-sm md:text-base">
                    Stack utilisé
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {stacksArray.map((stack, index) => (
                      <span
                        key={index}
                        className="inline-block px-3 md:px-4 lg:px-6 py-1 md:py-2 text-xs rounded-full bg-primary text-white font-medium whitespace-nowrap"
                      >
                        {stack}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 md:mt-6 lg:mt-6 self-end">
              <a
                href={`/projets/${project.slug}`}
                className="btn btn-primary btn-sm gap-2 rounded-full flex items-center text-xs md:text-sm px-3 md:px-4 py-1 md:py-2"
              >
                En savoir plus
                <svg
                  className="w-3 md:w-4 h-3 md:h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
